import React, { useEffect, useState } from 'react';
import { fetchAllBookings } from '../../services/api'; 

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserBookings = async () => {
       try {
      const response = await fetchAllBookings();
      setBookings(response || []); 
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      setBookings([]); 
    } finally {
      setIsLoading(false); 
    }
  };

  loadUserBookings();
}, []);
  if (isLoading) {
  return <div>Loading bookings...</div>;
}

if (bookings.length === 0) {
  return <div>No upcoming bookings.</div>;
}

  return (
    <div>
      <h2>Upcoming Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <h3>########</h3>
          <p>Dates: {booking.dateFrom} to {booking.dateTo}</p>
          <p>Guests: {booking.guests}</p>
          {/* Add more booking details as needed */}
        </div>
      ))}
    </div>
  );
};

export default UpcomingBookings;
