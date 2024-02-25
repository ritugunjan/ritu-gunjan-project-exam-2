import React, { useEffect, useState } from 'react';
import { fetchVenueDetails } from '../../services/api';
import { Link, useParams , useNavigate } from "react-router-dom"; 
import VenueListManager from './VenueListManager';
import CircularProgress from '@mui/material/CircularProgress';
import { FaAngleLeft } from "react-icons/fa6";

const VenueManagerDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadManagerVenues = async () => {
      try {
        
        const response = await fetchVenueDetails(id);
        setVenues(response.bookings || []);
      } catch (error) {
        console.error("Error fetching manager's venues:", error);
        setVenues([]); 
      }finally {
      setIsLoading(false); 
    }
    };

    loadManagerVenues();
  }, [id]);

if (isLoading) {
  return <div className='min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600 '><CircularProgress /></div>;
}

if (venues.length === 0) {
  return <div className='h-[83vh] '>
    <div onClick={()=>navigate(-1)} className="p-2 m-4 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>
      <div className='h-[50%] flex justify-center items-center text-2xl font-bold text-gray-600 '>No upcoming bookings.</div>
    </div>;
}

  return (
    <div>
      <div onClick={()=>navigate(-1)} className="p-2 m-4 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>
      <VenueListManager venues={venues} />
    </div>
  );
};

export default VenueManagerDashboard;
