import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isVenueManager, UpdateProfileUser, UpdateProfileAvatar } from '../services/api'; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaAngleLeft } from "react-icons/fa6";

const EditProfile = () => {
  const [venueManager, setVenueManager] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', 
  });

  useEffect(() => {
    
    const checkVenueManagerStatus =  () => {
      const status =  isVenueManager();
      setVenueManager(status);
    };

    checkVenueManagerStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await UpdateProfileUser(venueManager);
      
      if (avatar) {
       
       const response = await UpdateProfileAvatar(avatar);
      }
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      navigate('/profile'); 
    } catch (err) {
      setSnackbar({ open: true, message: err.response.data.errors[0].message || "Error", severity: 'error' });
      
      console.error(err);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  return (
    <div className='min-h-[83vh] flex justify-center items-center'>
      
      <div className='w-5/6 lg:w-1/2 shadow-lg p-3'>
      <div onClick={()=>navigate(-1)} className="p-2 m-1 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>
      <h2 className='text-2xl font-medium'>Edit Profile</h2>
     
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input type="checkbox" checked={venueManager} onChange={(e) => setVenueManager(e.target.checked)} className='my-4' />
            Update as Venue Manager 
          </label>
        </div>
        <div className='w-full'>
          <label className='w-full'>
            Avatar URL:
            <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar Image URL" className='p-2 w-full outline-none border border-gray-500 rounded-lg my-1' />
          </label>
        </div>
        <button type="submit" className='bg-[#0073e6] p-2 text-white rounded-lg'>Update Profile</button>
      </form>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
    </div>
  );
};

export default EditProfile;
