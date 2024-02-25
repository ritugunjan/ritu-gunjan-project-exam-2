import React, { useEffect, useState } from "react";
import { Link, useParams , useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import { fetchVenueDetails, createBooking ,deleteVenue} from "../../services/api";
import Vector from "../../../public/images/defaulthome.png";
import { isAuthenticated } from "../../services/api";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from '@mui/material/CircularProgress';
import { FaAngleLeft } from "react-icons/fa6";


const VenueDetManager = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookingError, setBookingError] = useState("");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const [date, setDate] = useState(new Date());
  

  const navigate = useNavigate();

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const response = await fetchVenueDetails(id);
        setVenue(response);
        
        if (response.bookings && response.bookings.length > 0) {
          const bookedDates = response.bookings
            .map((booking) => {
              const start = new Date(booking.dateFrom);
              const end = new Date(booking.dateTo);
              const dates = [];

              for (
                let dt = new Date(start);
                dt <= end;
                dt.setDate(dt.getDate() + 1)
              ) {
                dates.push(new Date(dt));
              }

              return dates;
            })
            .flat();

          setUnavailableDates(bookedDates);
        } else {
          setUnavailableDates([]);
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
        // Handle errors
      }
    };

    loadVenueDetails();
  }, [id]);

  const handleBooking = async () => {
    try {
      const bookingData = {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        guests: guestCount,
        venueId: id,
      };
      
      await createBooking(bookingData);
      alert("Booking successful!");
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError("Failed to create booking. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this venue?");
    if (confirmed) {
      try {
        await deleteVenue(id);
        navigate('/profile'); 
      } catch (error) {
        console.error("Error deleting venue:", error);
       
      }
    }
  };

  if (!venue) return <div className="min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600 "><CircularProgress /></div>;

  

  


  return (
    <div className="block w-[90%] lg:w-4/5 mx-auto lg:flex">
      <div onClick={()=>navigate(-1)} className="p-2 m-4 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>
      <div className="mt-4 lg:w-1/2">
        <div className="w-[60%] mx-auto border border-gray-800">
          
            <img src={venue.media && venue.media.length > 0 ? venue.media[0] : Vector} 
            alt={venue.name}
            className="w-48 h-48 mx-auto object-cover"
            />
        
        </div>
        <div className="grid grid-cols-3 w-[80%] lg:w-[50%] mx-auto mt-4">
          <div className="font-bold">
            <p>Max Guests</p>
            <p>Rating</p>
            <p>Facilities</p>
            <p>Wifi</p>
            <p>Parking</p>
            <p>Breakfast</p>
            <p>Pets</p>
          </div>
          <div></div>
          <div>
            <p>{venue.maxGuests}</p>
            <p>{venue.rating}</p>

            <p>-</p>
            <p>{venue.meta.wifi ? "Yes" : "No"}</p>
            <p>{venue.meta.parking ? "Yes" : "No"}</p>
            <p>{venue.meta.breakfast ? "Yes" : "No"}</p>
            <p>{venue.meta.pets ? "Yes" : "No"}</p>
          </div>
        </div>
        
      </div>
      <div className="lg:min-h-[83vh] flex flex-col lg:justify-around lg:w-1/2 lg:mb-0 mb-3">
        <div className="grid grid-cols-3 w-[80%] mx-auto">
        <div className="font-bold">
            <p>Name</p>
          </div>
          <div></div>
          <div>
          <p>{venue.name}</p>
          </div>
          <div className="font-bold">
          <p>Address</p>
          </div>
          <div></div>
          <div>
          <p>{venue.location.address}</p>
          </div>
          <div className="font-bold">
          <p>City</p>
          </div>
          <div></div>
          <div>
          <p>{venue.location.city}</p>
          </div>
          <div className="font-bold">
          <p>Zip</p>
          </div>
          <div></div>
          <div>
          <p>{venue.location.zip}</p>
          </div>
          <div className="font-bold">
          <p>Country</p>
          </div>
          <div></div>
          <div>
          <p>{venue.location.country}</p>
          </div>
          <div className="font-bold">
          <p>Continent</p>
          </div>
          <div></div>
          <div>
          <p>{venue.location.continent}</p>
          </div>
          <div className="font-bold">
          <p>Description</p>
          </div>
          <div></div>
          <div className="break-words">
          <p >{venue.description}</p>
          </div>
          <div className="font-bold">
          <p>Price</p>
          </div>
          <div></div>
          <div>
          <p>{venue.price}</p>
          </div>
          <div className="font-bold">
          <p>Venue Bookings</p>
          </div>
          <div></div>
          <div>
          <p>
           <Link
  to={`/venue-manager/bookings/overview/${venue.id}`}
  style={{ 
    textDecoration: 'underline', 
    color: 'blue', 
  }}
>
  Bookings
</Link>
</p>


          </div>
        </div>
        <div className="w-4/5 mx-auto">
          <div className="text-center mb-3">
            <div className='w-[90%] mx-auto'>
                   
          </div> 
           <div><button onClick={() => navigate(`/venue-manager/venues/${venue.id}`)}className='p-2 bg-[#0073e6] text-white rounded-lg my-3' type='button'>Edit Venue</button>


          <button onClick={()=>handleDelete(venue.id)} className='ml-2 p-2 bg-[#c94b4b] text-white rounded-lg my-3'>Delete Venue</button>
        
        </div>
          </div>
          
            
           
            
          
        </div>

         
        
      </div>
    </div>
  );
};

export default VenueDetManager;
