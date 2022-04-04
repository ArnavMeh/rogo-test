import React, {useState, useEffect} from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import axios from 'axios';

import UserContext from './UserContext';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Tasks from './components/Tasks';
import Home from './components/Home';
import Search from './components/Search';

const App = () => {
  const [userContext, setUserContext] = useState(null);

  useEffect(() => {
    if (!userContext) {
      getUserData()
    }
  })

  const getUserData = async() => {
    const userRes = await axios.get();
    setUserContext(userRes);
  }

  return (
    <UserContext.Provider value={{userContext, setUserContext}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar/><Home/></>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/editor" element={<><Navbar/><Tasks/></>}/>
          <Route path="/search" element={<><Navbar/><Search/></>}/>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
