### How to Create and Use a `venv` on macOS and Windows

#### 1. **Create a Virtual Environment**
   The process of creating a virtual environment is the same on both macOS and Windows.

   **Command**:
   ```bash
   python -m venv venv
   ```

   This will create a folder named `venv` (or whatever you name it) containing the virtual environment files.

#### 2. **Activate the Virtual Environment**

   Once created, you need to activate the environment. The activation command differs slightly between macOS/Linux and Windows.

   **On macOS/Linux**:
   ```bash
   source venv/bin/activate
   ```

   **On Windows (CMD)**:
   ```cmd
   venv\Scripts\activate
   ```

   **On Windows (PowerShell)**:
   ```powershell
   .\venv\Scripts\Activate
   ```

#### 3. **Deactivate the Virtual Environment**
   To deactivate the virtual environment, you can run the following command on either macOS or Windows:
   ```bash
   deactivate
   ```

### NOTE:
   Only temp.ipnyb, has the full up to date functioning without any refactoring.
