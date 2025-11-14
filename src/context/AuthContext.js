// // src/context/AuthContext.jsx

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [checked, setChecked] = useState(false);

//   /* ============================================================
//      📝 Register User - OPTIMISTIC (FAST RESPONSE)
//   ============================================================ */
//   const registerUser = async (userData) => {
//     return new Promise(async (resolve, reject) => {
//       // ⬅️ IMMEDIATE optimistic success
//       const optimisticResponse = {
//         success: true,
//         message: "Registration submitted successfully!",
//         optimistic: true,
//         user: {
//           email: userData.email,
//           name: userData.name,
//           role: userData.role,
//           status: "processing",
//         },
//       };

//       // ⬅️ Resolve immediately for fast UX
//       resolve(optimisticResponse);

//       // ⬅️ BACKGROUND processing (don't block user)
//       try {
//         console.log("🔄 Background registration for:", userData.email);

//         // Use longer timeout for background process
//         const backgroundAxios = axiosInstance;
//         backgroundAxios.defaults.timeout = 120000;

//         const response = await backgroundAxios.post("/auth/register", userData);

//         console.log("✅ Background registration completed:", response.data);

//         // Update with real data if successful
//         if (response.data.token) {
//           const { user, token } = response.data;
//           setUser(user);
//           localStorage.setItem("user", JSON.stringify(user));
//           localStorage.setItem("token", token);

//           // Show subtle success notification
//           setTimeout(() => {
//             if (window.location.pathname.includes("/login")) {
//               // User is on login page, show notification
//               const event = new CustomEvent("registrationCompleted", {
//                 detail: { email: userData.email },
//               });
//               window.dispatchEvent(event);
//             }
//           }, 1000);
//         }
//       } catch (error) {
//         console.error("❌ Background registration failed:", error);

//         // Log error but don't show to user (they already got success message)
//         if (
//           error.response?.status === 400 &&
//           error.response.data?.error?.includes("already exists")
//         ) {
//           console.log(
//             "✅ User was actually created (duplicate error means success)"
//           );
//         }
//       }
//     });
//   };

//   /* ============================================================
//      🔐 Login User - COMPLETE ERROR HANDLING
//   ============================================================ */
//   const loginUser = async ({ email, password }) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", {
//         email,
//         password,
//       });
//       const { user, token } = response.data;
//       setUser(user);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("token", token);
//       return user;
//     } catch (error) {
//       console.error("❌ Login error details:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//       });

//       // ⬅️ COMPREHENSIVE ERROR HANDLING
//       if (error.response?.status === 401) {
//         throw new Error("Invalid email or password.");
//       } else if (error.response?.status === 403) {
//         const errorMsg =
//           error.response.data?.error || error.response.data?.message;
//         if (errorMsg?.includes("pending") || errorMsg?.includes("approval")) {
//           throw new Error(
//             "Your account is pending admin approval. You will be notified when approved."
//           );
//         } else if (errorMsg?.includes("rejected")) {
//           throw new Error(
//             "Your account has been rejected. Please contact support."
//           );
//         }
//         throw new Error(
//           "Access denied: " + (errorMsg || "Account not approved")
//         );
//       } else if (error.code === "ECONNABORTED") {
//         throw new Error("Login timeout. Please try again.");
//       } else if (error.response?.status === 500) {
//         throw new Error("Server error. Please try again later.");
//       } else {
//         // Show the actual backend error message if available
//         const backendError =
//           error.response?.data?.error || error.response?.data?.message;
//         if (backendError) {
//           throw new Error(backendError);
//         }
//         throw new Error(
//           "Login failed. Please check your credentials and try again."
//         );
//       }
//     }
//   };

//   /* ============================================================
//      🚪 Logout User
//   ============================================================ */
//   const logoutUser = async () => {
//     try {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       await axiosInstance.post("/auth/logout");
//     } catch (err) {
//       console.error("Logout API error:", err);
//     } finally {
//       window.location.href = "/login";
//     }
//   };

//   /* ============================================================
//      👤 Get Current User
//   ============================================================ */
//   const getCurrentUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         setChecked(true);
//         return null;
//       }

//       const response = await axiosInstance.get("/auth/me");
//       setUser(response.data.user);
//       return response.data.user;
//     } catch (error) {
//       console.error("❌ Get current user error:", error);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//       setChecked(true);
//     }
//   };

//   /* ============================================================
//      🔍 Check Auth on App Load
//   ============================================================ */
//   useEffect(() => {
//     const checkAuth = async () => {
//       const savedUser = localStorage.getItem("user");
//       const token = localStorage.getItem("token");

//       if (savedUser && token) {
//         try {
//           await getCurrentUser();
//         } catch (error) {
//           console.error("Auth check failed:", error);
//         }
//       } else {
//         setLoading(false);
//         setChecked(true);
//       }
//     };

//     checkAuth();
//   }, []);

//   /* ============================================================
//      📦 Context Value
//   ============================================================ */
//   const value = {
//     user,
//     loading,
//     checked,
//     registerUser,
//     loginUser,
//     logoutUser,
//     getCurrentUser,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };



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

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setChecked(true);
        return;
      }

      // Verify token with backend
      const response = await axiosInstance.get('/auth/me');
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid
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

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store token
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token stored successfully');
        }
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { 
          success: true, 
          user,
          message: 'Login successful'
        };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      
      const response = await axiosInstance.post('/auth/register', userData);

      console.log('Registration response:', response.data);

      if (response.data.success) {
        const { user, token, message } = response.data;
        
        // Store token if provided (for auto-login if approved)
        if (token) {
          localStorage.setItem('token', token);
          setUser(user);
          setIsAuthenticated(true);
        }
        
        return { 
          success: true, 
          user: token ? user : null,
          message: message || 'Registration successful'
        };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Registration failed';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Logout function
  const logout = async () => {
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

  // Update user data
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    checked,
    login,
    register,
    logout,
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