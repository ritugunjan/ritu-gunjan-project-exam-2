import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; 

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false, 
  });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', 
  });
  const navigate = useNavigate(); 


  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio' && name === 'venueManager') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const isValidEmailDomain = (email) => {
    return email.endsWith('@stud.noroff.no');
  };


  const isValidPasswordLength = (password) => {
    return password.length >= 8;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmailDomain(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Registration is only allowed with a @stud.noroff.no email domain.',
        severity: 'error',
      });
      setError('Registration is only allowed with a @stud.noroff.no email domain.');
      return;
    }

    if (!isValidPasswordLength(formData.password)) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 8 characters long.',
        severity: 'error',
      });
      setError('Password must be at least 8 characters long.');
      return;
    }



    try {
      const response = await axios.post('https://api.noroff.dev/api/v1/holidaze/auth/register', formData);
      
    if (response.status === 200 || response.status === 201) {
    
      setFormData({
        name: '',
        email: '',
        password: '',
        venueManager: false,
      });


      if (typeof onRegistrationSuccess === 'function') {
        onRegistrationSuccess(response.data);
      }

      setSnackbar({
        open: true,
        message: 'Registration Succesful',
        severity: 'success',
      });
      
      navigate("/login", { replace: true });

       } else {
      
      setSnackbar({
        open: true,
        message: 'Registration failed. Please try again.',
        severity: 'error',
      });
      setError('Registration failed. Please try again.');
    }
      
    } catch (err) {
      let errorMessage = "Error, please try after sometime"; // Default error message
      if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].message || errorMessage;
      }
    
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
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
    <form onSubmit={handleRegister}>
      <div className='w-5/6  lg:w-3/6 mx-auto min-h-[83vh] flex flex-col justify-evenly'>
      <h1 className='text-2xl font-bold text-center'>Registration Form</h1>
      
      <div>
        <label>Name:</label>
        <input type="text" name="name" className='block w-full p-2 border-2 border-gray-400' value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" className='block w-full p-2 border-2 border-gray-400' value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" className='block w-full p-2 border-2 border-gray-400' value={formData.password} onChange={handleChange} required />
      </div>
      <div className='flex justify-around'>
    <label>
      <input
        type="radio"
        name="venueManager"
        value="false"
        checked={formData.venueManager === false}
        onChange={handleChange}
      />
      User
    </label>
    <label>
      <input
        type="radio"
        name="venueManager"
        value="true"
        checked={formData.venueManager === true}
        onChange={handleChange}
      />
      Venue Manager
    </label>
  </div>
      <button className='w-3/6 mx-auto bg-[#0073e6] rounded-full text-white p-2' type="submit">Register</button>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default RegistrationForm;