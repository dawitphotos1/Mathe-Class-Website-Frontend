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






import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log to your error reporting service
    if (process.env.NODE_ENV === "production") {
      // You can send this to your error tracking service
      console.error("Application Error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleContinue = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <h2 style={{ color: "#d32f2f" }}>⚠️ Something went wrong</h2>
          <p>This might be caused by a browser extension. You can try:</p>
          <div style={{ margin: "20px 0" }}>
            <button
              onClick={this.handleRetry}
              style={{
                background: "#1976d2",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
            <button
              onClick={this.handleContinue}
              style={{
                background: "transparent",
                color: "#1976d2",
                border: "1px solid #1976d2",
                padding: "10px 20px",
                borderRadius: "4px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              Continue Anyway
            </button>
          </div>
          <details style={{ textAlign: "left", marginTop: "20px" }}>
            <summary>Error Details (for support)</summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "12px",
              }}
            >
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;