import React from 'react';
import "./App.css"
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import ItemsList from './components/ItemsList';
import Item from './components/Item';
import About from "./components/About";
import Contact from "./components/Contact";
import ItemAdd from "./components/ItemAdd";




const App = () => {
  return (
      <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">ItemXchanger</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                      <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item">
                      <Link to="/add-item" className="nav-link">Add Item</Link>
                  </li>
                  <li className="nav-item">
                      <Link to="/about" className="nav-link">About</Link>
                  </li>
                  <li className="nav-item">
                      <Link to="/contact" className="nav-link">Contact</Link>
                  </li>
              </ul>
          </div>
        </nav>

          <Routes>
              <Route path="/" element={<ItemsList/>}/>
              <Route path="/add-item" element={<ItemAdd />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/item/:id" element={<Item />} />
          </Routes>

        <footer className="bg-light text-center py-4 mt-5">
          <p>&copy; 2024 ItemXchanger. All Rights Reserved to AcademiChain.</p>
        </footer>
      </div>
      </Router>
  );
};

export default App;
