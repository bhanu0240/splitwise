import './App.css';
import ErrorBoundary from './components/error-boundary/error-boundary.component';
import Header from "./components/header/header.component"
import HomePage from "./components/homepage/homepage.component"

function App() {
  const name = "Test-User";

  const renderFallbackUI = () => {
    return (<div>
      Something Went wrong
    </div>
    )
  }
  return (
    <ErrorBoundary
      fallback={renderFallbackUI}
    >
      <div className="App">
        <Header name={name} />
        <HomePage />
      </div>
    </ErrorBoundary>
  );
}

export default App;
