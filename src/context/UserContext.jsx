import React, { createContext, useState, useEffect, useContext } from "react";

// Create UserContext
const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Set user from localStorage or API call
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);

// Export the context itself for direct access if needed
export default UserContext;
