import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Initialize user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // If data is corrupted, clear it
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Logout function that properly clears everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}