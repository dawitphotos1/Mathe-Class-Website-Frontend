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
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;