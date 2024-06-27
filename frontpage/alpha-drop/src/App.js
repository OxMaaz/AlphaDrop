import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main-Component/Main.js";
import Claim from "./Claim-Component/Claim.js";



function App() {
  return (
    <>
      <div>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/claim" element={<Claim />} />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
