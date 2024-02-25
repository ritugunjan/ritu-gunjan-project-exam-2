import React from 'react';
import { useNavigate } from 'react-router-dom';

const VenueListManager = ({ venues }) => {
  const navigate = useNavigate();
  

  return (
    <div className='min-h-[83vh] '>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 m-4'>
      {venues.length > 0 ? (
        venues.map((booking, index) => (
          <div key={booking.id} className=' border border-gray-400 p-4 rounded-lg shadow-lg cursor-pointer'>
            <h4 className='text-xl font-medium'>Booking <span className='text-gray-500'>{index + 1}</span></h4>
            <p>Date From: <span className='text-gray-500'>{new Date(booking.dateFrom).toLocaleDateString()}</span></p>
            <p>Date To: <span className='text-gray-500'>{new Date(booking.dateTo).toLocaleDateString()}</span></p>
            <p>Guests: <span className='text-gray-500'>{booking.guests}</span></p>
            {/* Render any additional booking details as needed */}
          </div>
        ))
      ) : (
        <p>No bookings available.</p> 
      )}
    </div>
    </div>
  );
};

export default VenueListManager;
