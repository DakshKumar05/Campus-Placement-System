import { Component } from 'react';

/* Error boundaries have no hook equivalent, so this is the one class
   component in the app. It stops a render error in any panel from blanking
   the whole dashboard. */

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Dashboard render failed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-screen">
          <h2>Something went wrong.</h2>
          <p>{String(this.state.error.message || this.state.error)}</p>
          <button className="btn" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
