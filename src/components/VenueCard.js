import React from 'react';
import { Link } from 'react-router-dom';
import Vector  from '../../public/images/defaulthome.png'


const VenueCard = ({ venue }) => {
  const fallbackImageUrl = Vector;  
  const avatarUrl = venue.media.length ? venue.media[0] : fallbackImageUrl;

  return (
    <div className='shadow-lg p-4 rounded-lg'>
    <Link to={`/venues/${venue.id}`} className='hover:no-underline hover:text-gray-900'>
      <div className='flex flex-col w-full'>
        <div className='w-[80%] h-24 mx-auto border border-gray-400 flex items-center justify-center overflow-hidden'>
          <img
            src={avatarUrl}
            alt={venue.name}
            className=' w-24 h-24 object-cover'
          />
        </div>
        <div className='flex-1 flex flex-col justify-between'>
          <p className='font-semibold mt-2 text-wrap truncate'>{venue.name}</p>
          <p className='text-xs text-gray-500 mt-2'>Price: ${venue.price} per night</p>
        </div>
      </div>
    </Link>
    </div>
  );
};

export default VenueCard;
