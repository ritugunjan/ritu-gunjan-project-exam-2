import axios from 'axios';

const API_BASE_URL = 'https://api.noroff.dev/api/v1/holidaze';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const setAuthToken = (token) => {
  if (token) {

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (token) {

    return true;

  } else {

    return false;
  }
};


export const isVenueManager = () => {

  return localStorage.getItem('isVenueManager') === 'true';
};



export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const logOutUser = () => {

  const local = localStorage.getItem('token');
  if (local) {

    localStorage.removeItem('token');
    localStorage.removeItem('isVenueManager');
    localStorage.removeItem('name');

  }
};



export const fetchAllBookings = async () => {
  try {
    const name = localStorage.getItem('name');

    const token = localStorage.getItem('token');
    setAuthToken(token)
    const response = await apiClient.get(`/profiles/${name}/bookings`, {
      params: {
        _venue: true
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching profile bookings:', error);
    throw error;
  }
};

// Profile APIs
export const fetchManagedVenues = async () => {
  try {
    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    setAuthToken(token);
    const response = await apiClient.get(`/profiles/${name}/venues`, {
      params: {
        _bookings: true
      }
    }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching profile bookings:', error);
    throw error;
  }

};

export const UpdateProfileUser = async (userProfile) => {
  try {
    const name = localStorage.getItem('name');


    const response = await apiClient.put(`/profiles/${name}`, {
      "venueManager": userProfile

    });

    localStorage.setItem('isVenueManager', userProfile);

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

};

export const UpdateProfileAvatar = async (avatar) => {
  try {
    const name = localStorage.getItem('name');


    const response = await apiClient.put(`/profiles/${name}/media`, {
      "avatar": avatar

    });

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

};



export const fetchUserProfile = async () => {
  try {

    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');

    setAuthToken(token)
    const response = await apiClient.get(`/profiles/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Venue APIs

export const fetchAllVenues = async () => {
  try {
    const response = await apiClient.get(`/venues`);

    return response.data;
  } catch (error) {
    console.error('Error fetching all venues:', error);
    throw error;
  }
};

export const fetchAllV = async () => {
  let allVenues = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await apiClient.get(`/venues`, {
      params: {
        limit: limit,
        offset: offset,
      },
    });


    if (response.data.length === 0) {
      break;
    }


    allVenues = allVenues.concat(response.data);
    offset += limit;
  }

  return allVenues;
};

export const createVenue = async (venueData) => {
  try {
    
    const response = await apiClient.post('/venues', venueData);
    return response?.data;
  } catch (error) {
    console.error('Error creating venue:', error);

    throw error;
  }

};

export const fetchVenueDetails = async (id) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  const response = await apiClient.get(`/venues/${id}`, {
    params: {
      _bookings: true
    }
  });

  return response.data
}

export const updateVenue = (id, venueData) => apiClient.put(`/venues/${id}`, venueData);
export const deleteVenue = (id) => apiClient.delete(`/venues/${id}`);

// Booking APIs
export const fetchBookingDetails = (id) => apiClient.get(`/bookings/${id}`);
export const createBooking = (bookingData) => apiClient.post('/bookings', bookingData);
export const updateBooking = (id, bookingData) => apiClient.put(`/bookings/${id}`, bookingData);
export const deleteBooking = (id) => apiClient.delete(`/bookings/${id}`);

