// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axiosInstance from '../utils/axiosInstance';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [checked, setChecked] = useState(false);

//   // Check authentication status on app start
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setLoading(false);
//         setChecked(true);
//         return;
//       }

//       // Verify token with backend
//       const response = await axiosInstance.get('/auth/me');
      
//       if (response.data.success && response.data.user) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//       } else {
//         // Token is invalid
//         localStorage.removeItem('token');
//         setUser(null);
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('token');
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//       setChecked(true);
//     }
//   };

//   // Login function
//   const login = async (email, password) => {
//     try {
//       console.log('Attempting login with:', { email });
      
//       const response = await axiosInstance.post('/auth/login', {
//         email,
//         password
//       });

//       console.log('Login response:', response.data);

//       if (response.data.success) {
//         const { user, token } = response.data;
        
//         // Store token
//         if (token) {
//           localStorage.setItem('token', token);
//           console.log('Token stored successfully');
//         }
        
//         setUser(user);
//         setIsAuthenticated(true);
        
//         return { 
//           success: true, 
//           user,
//           message: 'Login successful'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.data.error || 'Login failed' 
//         };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message || 
//                           error.message || 
//                           'Login failed';
      
//       return { 
//         success: false, 
//         error: errorMessage
//       };
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       console.log('Attempting registration with:', userData);
      
//       const response = await axiosInstance.post('/auth/register', userData);

//       console.log('Registration response:', response.data);

//       if (response.data.success) {
//         const { user, token, message } = response.data;
        
//         // Store token if provided (for auto-login if approved)
//         if (token) {
//           localStorage.setItem('token', token);
//           setUser(user);
//           setIsAuthenticated(true);
//         }
        
//         return { 
//           success: true, 
//           user: token ? user : null,
//           message: message || 'Registration successful'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.data.error || 'Registration failed' 
//         };
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message || 
//                           error.message || 
//                           'Registration failed';
      
//       return { 
//         success: false, 
//         error: errorMessage
//       };
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await axiosInstance.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   // Update user data
//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
//   };

//   // Context value
//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     checked,
//     login,
//     register,
//     logout,
//     updateUser,
//     checkAuthStatus
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;



// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  // Run once on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /* =============================
     🔍 CHECK AUTH STATUS
  ============================== */
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        setChecked(true);
        return;
      }

      const response = await axiosInstance.get('/auth/me');

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  /* =============================
     🔑 LOGIN
  ============================== */
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
        }

        setUser(user);
        setIsAuthenticated(true);

        return { success: true, user };
      } else {
        return {
          success: false,
          error: response.data.error || 'Login failed'
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Login failed';

      return { success: false, error: errorMessage };
    }
  };

  /* =============================
     📝 REGISTER
  ============================== */
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);

      if (response.data.success) {
        const { user, token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
          setUser(user);
          setIsAuthenticated(true);
        }

        return { success: true, user: token ? user : null };
      } else {
        return {
          success: false,
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Registration failed';

      return { success: false, error: errorMessage };
    }
  };

  /* =============================
     🚪 LOGOUT (RENAMED TO logoutUser)
  ============================== */
  const logoutUser = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /* =============================
     🔄 UPDATE USER
  ============================== */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  /* =============================
     📦 CONTEXT VALUE
  ============================== */
  const value = {
    user,
    isAuthenticated,
    loading,
    checked,
    login,
    register,
    logoutUser,        // <-- now correctly provided
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
