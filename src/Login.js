import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  // Mock list of emails (in a real app, this would come from your backend)
  const mockEmails = [
    'user1@gmail.com',
    'user2@example.com',
    'user3@example.com'
  ];

  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google) {
      console.error('Google script not loaded');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: '500438955881-uatc8v9mh09n5boff6t17m27b1bhos8v.apps.googleusercontent.com',
        callback: (response) => {
          console.log('Google sign-in successful', response);
          // Decode the JWT token to get user info
          const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
          onLogin?.({ 
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture
          });
          navigate('/dashboard');
        },
        prompt_parent_id: 'google-signin-container',
        ux_mode: 'popup'
      });

      // Render the button
window.google.accounts.id.renderButton(
  document.getElementById('google-signin-button'),
  { 
    type: 'standard',
    theme: 'outline',
    size: 'large',
    width: '400',  // Match this with your CSS max-width
    text: 'signin_with',
    shape: 'pill',
    logo_alignment: 'left'
  }
);
      
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setShowEmailPopup(true);
    }
  }, [navigate, onLogin]);

  // Load Google Sign-In script
  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleScriptLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize Google Sign-In when script is loaded
  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleSignIn();
    }
  }, [isGoogleScriptLoaded, initializeGoogleSignIn]);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    onLogin?.({ email });
    navigate('/dashboard');
  };

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