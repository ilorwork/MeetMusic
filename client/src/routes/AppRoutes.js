import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Layout from '../components/layout/Layout';
import LogIn from '../components/LogIn';
import Register from '../components/Register';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LogIn />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Home />}></Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes;