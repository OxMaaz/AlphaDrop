import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home-Component/Home.js";
import Main from "./Main-Component/Main.js";
import Claim from "./Claim-Component/Claim.js";
import './App.css';


function App() {
  return (
    <>
      <div>
        <div className="App ">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/main" element={<Main />} />
              <Route path="/claim" element={<Claim />} />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
