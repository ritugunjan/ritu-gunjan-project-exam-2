import React, { useState } from 'react';
import { useNavigate , useLocation } from 'react-router-dom'; 
import { loginUser, setAuthToken } from '../services/api';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity , setSeverity] = useState('')
  const navigate = useNavigate(); 
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  };

  let { from } = location.state ||  "/profile"


  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await loginUser({ email, password });
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('isVenueManager', response.data.venueManager);
    localStorage.setItem('name', response.data.name);
    setAuthToken(response.data.accessToken);

      
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }

      navigate(from ? from : "/profile", { replace: true });
    } catch (error) {
      
      console.error('Login failed:', error.response ? error.response.data : 'Unknown error');
      setError(error.response ? error.response.data.errors.map(err => err.message).join(', ') : 'An unknown error occurred'); 
      setOpenSnackbar(true);
    }

   
  } 



  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false); 
  };

  const handleCreate = ()=>{
        navigate('/register')
  }

  return (
    <form onSubmit={handleSubmit}> 
    <div className='w-5/6 lg:w-2/6 mx-auto min-h-[83vh] flex items-center justify-center'>
      <div className='h-[50vh] w-full flex flex-col justify-around'>
      <h1 className='text-2xl font-bold text-center'>Login Form</h1>
      
      {/* <div className='flex justify-around'>
    <label>
      <input
        type="radio"
        name="venueManager"
        value="false"
        
        onChange={handleChange}
      />
      User
    </label>
    <label>
      <input
        type="radio"
        name="venueManager"
        value="true"
        // checked={formData.venueManager === true}
        onChange={handleChange}
      />
      Venue Manager
    </label>
  </div> */}
      <div >
        <label>Email:</label>
        <input className='block w-full p-2 border-2 border-gray-400' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input className='block w-full p-2 border-2 border-gray-400' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className='flex justify-between'>
      
      <button className='w-2/6  bg-[#0073e6] rounded-full text-white font-semibold p-1 lg:p-2' type="submit">Login</button>
      <button className='w-2/6  border-2 border-gray-400 p-1 lg:p-2' onClick={handleCreate}>Create Account</button>
      </div>
      </div>
    
    </div>
    <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
    {error || 'Unknown error'}
  </Alert>
</Snackbar>

    </form>
    
  );
};

export default LoginForm;
