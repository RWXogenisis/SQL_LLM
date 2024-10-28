// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faStar, faBars } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prompt, setPrompt] = useState(''); // State for the input prompt
  const [messages, setMessages] = useState([]); // State to store messages
  const [error, setError] = useState(''); // State to store any errors
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showBoxes, setShowBoxes] = useState(true); // State to toggle square boxes visibility

  // Ref for chat section to enable scrolling
  const chatSectionRef = useRef(null);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    setIsLoading(true); // Start loading
    setShowBoxes(false); // Hide square boxes when form is submitted
  
    // Add user's prompt to messages
    setMessages((prevMessages) => [...prevMessages, { text: prompt, sender: 'user' }]);
    setPrompt(''); // Clear the input
  
    try {
      const res = await fetch('/api/get-reply', { // Using proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('Response from Flask:', data);
        // Add server response to messages
        setMessages((prevMessages) => [...prevMessages, { text: data.response, sender: 'server' }]);
      } else {
        const errorData = await res.json();
        setError(errorData.response || 'Error fetching response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch from the server.');
    } finally {
      setIsLoading(false); // End loading
    }
  };
  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }
  }, [messages]); // Runs every time `messages` updates

  

  return (
    
    <div>
      <nav className="sidebar">
        <a href="#" className="logo">TalkGet.in</a>

        <div className="menu-content">
          <ul className="menu-items">
            <div className="menu-title">Your menu title</div>

            <li className="item">
              <a href="#">Your first link</a>
            </li>

            <li className="item">
              <div className="submenu-item">
                <span>First submenu</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>

              <ul className="menu-items submenu">
                <div className="menu-title">
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Your submenu title
                </div>
                <li className="item">
                  <a href="#">First sublink</a>
                </li>
                <li className="item">
                  <a href="#">First sublink</a>
                </li>
                <li className="item">
                  <a href="#">First sublink</a>
                </li>
              </ul>
            </li>

            <li className="item">
              <div className="submenu-item">
                <span>Second submenu</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>

              <ul className="menu-items submenu">
                <div className="menu-title">
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Your submenu title
                </div>
                <li className="item">
                  <a href="#">Second sublink</a>
                </li>
              </ul>
            </li>

            <li className="item">
              <a href="#">Your second link</a>
            </li>

            <li className="item">
              <a href="#">Your third link</a>
            </li>

            <li>
              <button className="other-button" href="#">TalkGet history</button>
            </li>
          </ul>
        </div>
      </nav>

      <nav className="navbar">
        <FontAwesomeIcon icon={faBars} id="sidebar-close" />
        <div className="navbar-text">Welcome to Our TalkGet</div>
        <div className="profile-pic"></div>
      </nav>

      <p className="hidden center">
      TalkGet.Explore just got a new update. Hurry Up update
      </p>

      <div className="home-container">
        <h1>
          <span>Hey, Akshay</span><br />
          <lightspan>Where would you like to go today?</lightspan>
        </h1>
      </div>

      {showBoxes && (
  <div className="square-boxes center">
    <div className="square-box">
      <div className="star-container">
        <FontAwesomeIcon icon={faStar} />
      </div>
      <p>Calling all query architects! Explore the top 5 revolutionary SQL innovations transforming data management this year.</p>
    </div>
    <div className="square-box">
      <div className="star-container">
        <FontAwesomeIcon icon={faStar} />
      </div>
      <p>Calling all data engineers, I’m writing a blog post about the top 5 SQL practices for efficient data handling in 2024.</p>
    </div>
    <div className="square-box">
      <div className="star-container">
        <FontAwesomeIcon icon={faStar} />
      </div>
      <p>The ALTER TABLE statement in SQL is used to add, delete, or modify columns in an existing table.</p>
    </div>
    <div className="square-box">
      <div className="star-container">
        <FontAwesomeIcon icon={faStar} />
      </div>
      <p>Indexes in SQL databases are used to speed up the retrieval of rows by creating a fast lookup on one or more columns.</p>
    </div>
  </div>
)}


      

      {/* Chat Section */}
      <div className="chat-section" ref={chatSectionRef}>
        {/* Display Messages */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
          </div>
        ))}
      </div>

      {/* Prompt and Response Section */}
      <div className="prompt-section">
        <form onSubmit={handleSubmit} className="prompt-form">
          <input
            type="text"
            placeholder="Enter your prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Update the input value
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {/* Display Error */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );

}


export default App;
