import mysql.connector
import ollama

# Connect to your MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="course_sched"
)

cursor = db.cursor()

# Query to get the schema details
query = """
SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    DATA_TYPE, 
    IFNULL(CHARACTER_MAXIMUM_LENGTH, '') AS CHARACTER_MAXIMUM_LENGTH, 
    IS_NULLABLE, 
    COLUMN_KEY, 
    EXTRA 
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = 'course_sched'
ORDER BY 
    TABLE_NAME, ORDINAL_POSITION;
"""

cursor.execute(query)
columns = cursor.fetchall()

# Process the results
current_table = None
create_table_statements = []

for column in columns:
    table_name, column_name, data_type, char_max_len, is_nullable, column_key, extra = column
    
    if table_name != current_table:
        if current_table is not None:
            create_table_statements.append(");")
        
        current_table = table_name
        create_table_statements.append(f"CREATE TABLE {table_name} (")
    
    nullable = "" if is_nullable == "NO" else "NULL"
    key = ""
    if column_key == "PRI":
        key = "PRIMARY KEY"
    elif column_key == "UNI":
        key = "UNIQUE"
    elif column_key == "MUL":
        key = "INDEX"
    
    char_len = f"({char_max_len})" if char_max_len else ""
    extra_info = f"{key} {extra}".strip()
    
    create_table_statements.append(
        f"    {column_name} {data_type.upper()}{char_len} {nullable} {extra_info},".strip()
    )

if current_table is not None:
    create_table_statements[-1] = create_table_statements[-1][:-1]  # Remove the last comma
    create_table_statements.append(");")

# Print the results
create_table_sql = "\n".join(create_table_statements)
# Integrate the result into the chat message
stream = ollama.chat(
    model='duckdb-nsql',
    messages=[{'role': 'user', 'content': f'This is the schema: \n{create_table_sql}\n Give me all the rooms that are scheduled for course name cs101'}],
    stream=True,
)

query = ""
for chunk in stream:
    # print(chunk['message']['content'], end='', flush=True)
    query += chunk['message']['content']
print(query)

cursor.execute(query)
results = cursor.fetchall()
for row in results:
    print(row)

cursor.close()
db.close()
