// import React from "react";

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Chunk Load Error:", error, errorInfo);
//   }

//   handleRetry = () => {
//     this.setState({ hasError: false });
//     window.location.reload();
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ textAlign: "center", padding: "50px" }}>
//           <h2>Something went wrong loading the page.</h2>
//           <button onClick={this.handleRetry}>Try Again</button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;






// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;