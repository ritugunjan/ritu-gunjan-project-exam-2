import React, { useState , useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate , useNavigate } from 'react-router-dom';
import Home from './views/Home';
import CustomerDashboard from './views/customer/CustomerDashboard';
import VenueDetails from './views/customer/VenueDetails';
import UpcomingBookings from './views/customer/UpcomingBookings';
import VenueManagerDashboard from './views/venueManager/VenueManagerDashboard';
import VenueDetailsManager from './views/venueManager/VenueDetailsManager';
import VenueDetManager from './views/venueManager/VenueDetManager';
import VenueListManager from './views/venueManager/VenueListManager';
import CreateVenue from './views/venueManager/CreateVenue';
import UserProfile from './views/UserProfile';
import EditProfile from './views/EditProfile';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import NavBar from './components/common/NavBar';
import  { isAuthenticated, isVenueManager, setAuthToken } from './services/api';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Footer from './components/common/Footer';


const App = () => {
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);


  

  

  
 

  return (
    <>
      
    

    <NavBar  />

      <Routes>
      <Route exact path="/" element={!isVenueManager() ? <Home  />: < Navigate to="/profile"/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={ <RegistrationForm />} />
        <Route path="/dashboard" element={
          isAuthenticated() && !isVenueManager() ? <CustomerDashboard /> : < Navigate to="/profile"/>}
        />
        <Route path="/venues/:id" element={!isVenueManager() ? <VenueDetails/> : < Navigate to="/profile"/>} />
        <Route path="/bookings" element= { isAuthenticated() && !isVenueManager() ? <UpcomingBookings /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated() ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={isAuthenticated() ? <EditProfile /> : <Navigate to="/" />} />
        <Route path="/venue-manager/bookings/overview/:id" element= {
          isAuthenticated() && isVenueManager() ? <VenueManagerDashboard />: <Navigate to="/login" />}
         />
        <Route path="/venue-manager/venues/:id" element = {
          isAuthenticated() && isVenueManager() ? <VenueDetailsManager /> : <Navigate to="/login" /> }
         />
         <Route path="/venue-manager/venues/details/:id" element = {
          isAuthenticated() && isVenueManager() ? <VenueDetManager /> : <Navigate to="/" /> }
         />
         
        
        <Route path="/venue-manager/venues" element = { isAuthenticated() && isVenueManager() ? <VenueManagerDashboard /> : <Navigate to="/" />} />
        <Route path="/venue-manager/venues/create" element = { isAuthenticated() && isVenueManager() ? <CreateVenue /> : <Navigate to="/" />} />
        
        <Route path="*" element={ <Navigate to="/" />} />
      </Routes>
      <Footer />
      </>
    
  );
};

export default App;

