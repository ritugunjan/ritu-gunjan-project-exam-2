import { useNavigate, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchUserProfile, fetchAllBookings, fetchManagedVenues ,  deleteVenue, isVenueManager } from '../services/api';
import Vector from '../../public/images/defaulthome.png';
import Vector1 from '../../public/images/image.png';
import { TbBrandBooking } from "react-icons/tb";
import { TbEdit } from "react-icons/tb"; 
import { MdDeleteOutline } from "react-icons/md";
import CircularProgress from '@mui/material/CircularProgress';
import { FaAngleLeft } from "react-icons/fa6";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profiledata = await fetchUserProfile();
        setProfile(profiledata);
        
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error('Fetching profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);



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

  const loadManagerVenues = async () => {
    try {
      
      const response = await fetchManagedVenues();
      setVenues(response || []);
    } catch (error) {
      console.error("Error fetching manager's venues:", error);
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    

    loadManagerVenues();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this venue?");
    if (confirmed) {
      try {
        await deleteVenue(id);
        loadManagerVenues();
      } catch (error) {
        console.error("Error deleting venue:", error);
       
      }
    }
  };

  function formatDate(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0'); 

    return `${day} ${month} ${year}`;
  }

  if (isLoading) return <div className='min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600'><CircularProgress /></div>;
  if (error) return <div>{error}</div>;

  return (
    <>
     
      {!isVenueManager() && <div onClick={()=>navigate(-1)} className="p-2 m-4 mb-0 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>}
      
      {profile && (

        <div className='min-h-[83vh] lg:flex'>
          <div className=' lg:w-1/3 h-[70vh] flex flex-col justify-evenly lg:border-r-2 border-gray-400'>
            <div className='flex flex-col items-center'><img src={profile.avatar || Vector1} alt="Profile Avatar" className='rounded-full object-cover w-28  h-28' />
              <div>
                <button onClick={() => navigate('/edit-profile')} className='mt-4 p-2 px-3 bg-[#0073e6] text-white font-semibold rounded-full'>Add/Update Avatar</button>
                {/* <button onClick={() => navigate('/edit-profile')}>Edit Profile</button> Navigate to EditProfile view */}
              </div>

            </div>
            <p className='text-center font-semibold text-xl'>Personal Details</p>
            <div className='grid grid-cols-5 w-3/4 mx-auto'>
              <div className='font-medium'>
                <div><p>Name</p></div>
                <div><p>Email</p></div>
              </div>
              <div>
                <div><p>:</p></div>
                <div><p>:</p></div>
              </div>
              <div className='col-span-3'>
                <div><p>{profile.name}</p></div>
                <div><p className='truncate'>{profile.email}</p></div>
              </div>
            </div>

          </div>
          <div className='lg:w-2/3 lg:h-[60vh] '>
            {profile.venueManager ? 
            <div className='w-4/5 h-full mx-auto'>
              <button className='mt-4 p-2 bg-[#0073e6] text-white rounded-lg mb-3' onClick={()=>navigate('/venue-manager/venues/create')}>Create Venue</button>
              <p className='text-2xl font-semibold'>My Venues</p>
              <div className='h-[90%] lg:overflow-y-auto '>
                {profile._count.venues ? 
                <div className='h-[90%] grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3'>
                  {venues.map((venue , index) => (
                    <div key={index} onClick={() => navigate(`/venue-manager/venues/details/${venue.id}`)}
                      className='lg:h-[300px] flex flex-col justify-between border border-gray-400 p-4 rounded-lg shadow-lg cursor-pointer mb-3 lg:mb-0'>
                        <div>
                        <img src={venue.media && venue.media.length>0 ? venue.media[0]: Vector} alt={venue.name} className='w-24 h-24 object-cover' />
                      <h4>Name - <span className='text-gray-500 truncate'>{venue.name}</span></h4>
                      <p>Price - <span className='text-gray-500'>{venue.price}</span></p>
                      <p>Max-guests - <span className='text-gray-500'>{venue.maxGuests}</span></p>
                        </div>
                     
                      <div className='flex justify-between'>
                        <div className='bg-gray-100 rounded-full p-2 shadow-inner' onClick={(e)=>{
                           e.stopPropagation();
                          
                          navigate(`/venue-manager/venues/${venue.id}`)
                        }}>
                        <TbEdit />
                        </div>
                      <div className='bg-gray-100 rounded-full p-2 shadow-inner' onClick={(e)=>{
                         e.stopPropagation();
                        handleDelete(venue.id)}}>
                      <MdDeleteOutline />
                      </div>
                      
                      </div>
                      
                    </div>
                  ))}

                </div> : <div className='h-full flex justify-center items-center'>
                  <p className='text-gray-500'>You have no Venues !</p></div>}
              </div>

            </div> :
              <div className='w-4/5 h-full mx-auto'>
                
                <p className='text-2xl font-semibold mb-2'>My Bookings</p>
                <div className='h-full lg:overflow-y-auto '>
                  {profile._count.bookings ? <div className='h-full grid grid-cols-1 lg:grid-cols-4 gap-3 my-3'>
                    {bookings.map((booking) => (
                        <div key={booking.id} onClick={()=>navigate(`/venues/${booking.venue.id}`)} className='lg:h-[300px] cursor-pointer  border border-gray-400 p-4 rounded-lg shadow-lg'>
      
                          <img src={booking.venue.media && booking.venue.media.length > 0 ? booking.venue.media[0] : Vector} className='w-24 h-24 object-cover' alt={booking.venue.name} />                          <h4 className='text-wrap truncate'> {booking.venue.name}<span className='text-gray-500'>{booking.guests}</span></h4>
                          <h4>Guests - <span className='text-gray-500'>{booking.guests}</span></h4>
                          <p>From - <span className='text-gray-500'>{formatDate(booking.dateFrom)}</span></p>
                          <p>To - <span className='text-gray-500'>{formatDate(booking.dateTo)}</span></p>
                        
                        </div>
                        
                      
                    ))}
                  </div> : <div className='h-full flex justify-center items-center'>
                    <p className='text-gray-500'>You have no upcoming bookings !</p></div>}
                </div>
              </div>
            }

          </div>



          {/* <p>Is Venue Manager: {profile.venueManager ? 'Yes' : 'No'}</p>
          <p>Total Venues: {profile._count.venues}</p>
          <p>Total Bookings: {profile._count.bookings}</p> */}
        </div>
      )}


    </>
  );
};

export default UserProfile;
