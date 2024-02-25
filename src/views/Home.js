import React, { useEffect, useState } from 'react';
import { fetchAllVenues , fetchAllV } from '../services/api'; 
import VenueList from '../components/VenueList'; 
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosSearch } from "react-icons/io";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await fetchAllV();
        setVenues(response || []);
        
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenues([]); 
      }
      finally {
      setIsLoading(false); 
    }
    };

    loadVenues();
  }, []);

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (e) => {
    
      setFilter(e.target.value);
    
  };

if (isLoading) {
  return <div className='min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600 '><CircularProgress /></div>;
}

  return (
    <div className='min-h-[83vh]'>


      <div className='flex justify-center'>
    <div className="flex justify-center items-center bg-white w-3/4 mt-4 p-1 border rounded-full ">
            <input
              type="text"
              placeholder="Venues..."
              value={searchTerm} // Changed from filter to searchTerm
          onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[90%] p-2 px-3 outline-none rounded-full "
            />
            <IoIosSearch className="text-2xl" />
          </div>
    </div>
      {/* <h1>Welcome to Holidaze!</h1> */}
      <VenueList venues={filteredVenues} />
    </div>
  );
};

export default Home;
