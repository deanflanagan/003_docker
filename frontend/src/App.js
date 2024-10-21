// App.js

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavBar from './components/AppNavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Result from './pages/Result';
import Report from './pages/Report';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL + '/api/get_csrf_token';

const App = () => {
  useEffect(() => {
    axios
      .get(URL, {
        withCredentials: true
      })
      .then((response) => {
        const csrfToken = response.data.csrfToken;
        Cookies.set('csrftoken', csrfToken);
      });
  });
  return (
    <div className="md:h-screen bg-purple-100">
      <BrowserRouter>
        <ToastContainer />
        <AppNavBar />
        <div className="pt-20">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="register" exact element={<Register />} />
            <Route path="login" exact element={<Login />} />
            <Route path="forgotPassword" exact element={<ForgotPassword />} />
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route path="profile" exact element={<Profile />} />
            <Route path="answer" exact element={<Result />} />
            <Route path="report" exact element={<Report />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
