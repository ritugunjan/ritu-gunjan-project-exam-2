import React from 'react';
import VenueCard from './VenueCard';

const VenueList = ({ venues }) => {
  
  return (
    <div className='grid grid-cols-2 gap-6 lg:grid-cols-6 w-[90%] mx-auto py-4 '>
      {venues.map((venue , index) => {

        
        return <VenueCard key={index} venue={venue} />
})}
    </div>
  );
};

export default VenueList;
