import React, { useEffect, useState } from 'react';
import VenueList from '../../components/VenueList';
import { fetchAllVenues } from '../../services/api'; 

const CustomerDashboard = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await fetchAllVenues();
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
        
      }
    };

    loadVenues();
  }, []);

  return (
    <div>
      <h2>Venues</h2>
      <VenueList venues={venues} />
    </div>
  );
};

export default CustomerDashboard;
