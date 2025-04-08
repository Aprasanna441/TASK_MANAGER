import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './authentication/signup';
import Login from './authentication/login';
import Home from './task_management/home'
import NoPage from './404'
import "./App.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={localStorage.getItem("token")?<Home/>:<Signup/>} /> 
        <Route path="/login" element={localStorage.getItem("token")?<Home/>:<Login/>} />
        <Route path="/home" element={localStorage.getItem("token")?<Home/>:<Signup/>} />
        <Route path='/*' element={<NoPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
