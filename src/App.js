import './App.css';
import Header from "./components/header/header.component"
import HomePage from "./components/homepage/homepage.component"
import { title } from "./constants/constants"



function App() {
  const name = "test-user";
  return (
    <div className="App">
      <Header title={title} name={name} />
      <HomePage />
    </div>
  );
}

export default App;
