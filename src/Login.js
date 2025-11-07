import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './Login.css';

function Login({ onLogin }) {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Environment variables
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;

  // Mock list of emails (in a real app, this would come from your backend)
  const mockEmails = [
    'user1@gmail.com',
    'user2@example.com',
    'user3@example.com'
  ];

  const initializeGoogleSignIn = useCallback(() => {
    // Validate client ID
    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured. Make sure REACT_APP_GOOGLE_CLIENT_ID is set in your .env file');
      setShowEmailPopup(true);
      return;
    }

    // Wait for the button element to be available
    const googleButtonElement = document.getElementById('google-signin-button');
    if (!googleButtonElement) {
      setTimeout(() => initializeGoogleSignIn(), 150);
      return;
    }

    if (!window.google) {
      console.warn('Google SDK not loaded. Check your internet connection and Google client ID.');
      setShowEmailPopup(true);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          try {
            // Decode the JWT token to get user info
            const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
            
            // Create user object with all necessary information
            const userData = {
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              givenName: userInfo.given_name,
              familyName: userInfo.family_name
            };
            
            // Save user to context
            setUser(userData);
            
            // Save user to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(userData));
            
            onLogin?.(userData);
            navigate('/dashboard');
          } catch (error) {
            console.error('Error processing Google Sign-In response:', error);
            setShowEmailPopup(true);
          }
        },
        prompt_parent_id: 'google-signin-container',
        ux_mode: 'popup'
      });

      // Render the button
      window.google.accounts.id.renderButton(
        googleButtonElement,
        { 
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: '400',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left'
        }
      );
      
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setShowEmailPopup(true);
    }
  }, [GOOGLE_CLIENT_ID, navigate, onLogin, setUser]);

  // Load Google Sign-In script
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`)) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleScriptLoaded(true);
    };
    script.onerror = () => {
      setShowEmailPopup(true);
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [GOOGLE_SCRIPT_URL]);

  // Initialize Google Sign-In when script is loaded
  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleScriptLoaded, initializeGoogleSignIn]);

  // Set page ready when script is loaded or fallback fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 2000); // 2 second timeout to ensure page renders

    if (isGoogleScriptLoaded) {
      setIsPageReady(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isGoogleScriptLoaded]);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    
    // Create user object from email
    const userData = {
      email: email,
      name: email.split('@')[0], // Use the part before @ as name
    };
    
    // Save to context and localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    onLogin?.(userData);
    navigate('/dashboard');
  };

  // Show loading state until page is ready
  if (!isPageReady) {
    return (
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-box">
            <h1>Loading...</h1>
            <p className="welcome-text">Please wait while we prepare the login page</p>
          </div>
        </div>
        <div className="login-image-container"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-box">
          <h1>WELCOME BACK</h1>
          <p className="welcome-text">Welcome back! Please enter your details</p>
          
          <form onSubmit={(e) => e.preventDefault()}>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot Password
              </a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>

            <div className="divider">or</div>
            
            <div className="google-signin-container" id="google-signin-container">
              <div id="google-signin-button"></div>
            </div>
          </form>
        </div>
      </div>

      {/* Fallback Email Selection Popup */}
      {showEmailPopup && (
        <div className="email-popup-overlay">
          <div className="email-popup">
            <h3>Choose an account</h3>
            <p>to continue to your app</p>
            <div className="email-list">
              {mockEmails.map((email) => (
                <div 
                  key={email} 
                  className="email-option"
                  onClick={() => handleEmailSelect(email)}
                >
                  <div className="email-avatar">{email.charAt(0).toUpperCase()}</div>
                  <div className="email-address">{email}</div>
                </div>
              ))}
            </div>
            <div className="popup-footer">
              <button 
                className="use-another-account"
                onClick={() => setShowEmailPopup(false)}
              >
                Use another account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="login-image-container"></div>
    </div>
  );
}

export default Login;
