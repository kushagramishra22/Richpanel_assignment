import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//  import FacebookConnect from './components/FacebookConnect';
import Inbox from './components/Inbox';
import Login from "./pages/Login";
import Register from "./pages/Register";
import FBConnect from "./components/FacebookConnect";

function App() {
  return (
    <div>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/connect" element={<FBConnect />} />
        <Route path="/inbox" element={<Inbox />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
     
    </div>
  );
}

export default App;

