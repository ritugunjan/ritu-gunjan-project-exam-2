import React, { useEffect, useState, forwardRef } from "react";
import { Link, useParams , useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import { fetchVenueDetails, createBooking } from "../../services/api";
import Vector from "../../../public/images/defaulthome.png";
import { isAuthenticated } from "../../services/api";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import 'react-datepicker/dist/react-datepicker.css';
import { FaAngleLeft } from "react-icons/fa6";


const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="custom-input" onClick={onClick} ref={ref}>
    {value}
    <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
    </svg>
  </button>
));



const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingError, setBookingError] = useState("");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const [date, setDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', 
  });
  

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
      
      const start = new Date(startDate);
      const end = new Date(endDate);

      
      if (end < start) {
        setSnackbar({
          open: true,
          message: 'End date must be after start date.',
          severity: 'error',
        });
        return; 
      }

      const bookingData = {
        dateFrom: start.toISOString(),
        dateTo: end.toISOString(),
        guests: guestCount,
        venueId: id,
      };
      
      await createBooking(bookingData);
      setSnackbar({
        open: true,
        message: 'Booking successful!',
        severity: 'success',
      });
      navigate('/profile')
    } catch (error) {
      console.error("Error creating booking:", error);
      setSnackbar({
        open: true,
        message: 'Failed to create booking. Please try again.',
        severity: 'error',
      });
      
    }
};


  if (!venue) return <div className="min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600 "><CircularProgress /></div>;

  const handleReserve = ()=>{
    if(isAuthenticated()){
      handleBooking();
    }else{
      navigate('/login', { state: { from: location.pathname } })
    }
  }

  const getTotalDays = (start, end) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((end - start) / oneDay));
    return diffDays;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    // Close the snackbar
    setSnackbar({ ...snackbar, open: false });
  };

  
  

  const totalDays = startDate && endDate ? getTotalDays(new Date(startDate), new Date(endDate)) : 0;
  const totalCost = totalDays > 0 ? `$${totalDays * venue.price * guestCount}` : "-";

  return (
    <div className="block w-[90%] lg:w-4/5 mx-auto lg:flex">
      <div onClick={()=>navigate(-1)} className="p-2 m-4 w-11 h-10 flex justify-center items-center shadow-lg rounded-full cursor-pointer bg-gray-200">
      <FaAngleLeft className=""/>
      </div>
      
      <div className=" my-4 lg:w-1/2">
      
        <div className="w-[60%] mx-auto border border-gray-800">
          <img
            src={venue.media[0] || Vector}
            alt={venue.name}
            className=" mx-auto w-52 h-48 object-cover"
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
          <div >
            
          </div>
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
        {/* <div className=" my-4 hidden justify-center lg:flex">
          <Calendar 
         />
        </div> */}
      </div>
      <div className="lg:min-h-[83vh] flex flex-col lg:justify-around lg:w-1/2 lg:mb-0 mb-3">
        <div className="grid grid-cols-3 w-[80%] mx-auto">
          <div className="font-bold">
            <p>Name</p>
            <p>Address</p>
            <p>City</p>
            <p>Zip</p>
            <p>Country</p>
            <p>Continent</p>
            <p>Description</p>
          </div>
          <div>
            
          </div>
          <div className="truncate">
            <p >{venue.name}</p>
            <p>{venue.location.address}</p>
            <p>{venue.location.city}</p>
            <p>{venue.location.zip}</p>
            <p>{venue.location.country}</p>
            <p>{venue.location.continent}</p>
            <p>{venue.description}</p>
          </div>
        </div>
        <div className="lg:w-4/5 mx-auto">
          <div className="text-center my-3">
            <h2 className="font-medium">Price Per Night : $ {venue.price}</h2>
          </div>
          <div className="grid grid-cols-2">
            <div className="border p-2 col-span-2 lg:col-span-1">
              <h2>Check-In</h2>
              <DatePicker
              customInput={<CustomInput />}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                excludeDates={unavailableDates}
                minDate={new Date()}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="w-[90%]"
              />
            </div>
            <div className="border p-2 col-span-2 lg:col-span-1">
              <h2>Check-Out</h2>
              <DatePicker
              customInput={<CustomInput />}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                excludeDates={unavailableDates}
                minDate={startDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                className="w-[90%]"
              />
            </div>
            <div className="border p-2">Guests</div>
            <div className="border p-2">
              {" "}
             <select
                id="guestCount"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              >
                {[...Array(venue.maxGuests).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>

            </div>
            <div className="border p-2">Total</div>
            <div className="border p-2">{totalCost}</div>
          </div>
         <div className="mt-4">
  <button
    className={`w-full text-center p-2 text-white font-medium rounded-full ${!startDate || !endDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0073e6]'}`}
    onClick={handleReserve}
    disabled={!startDate || !endDate}
  >
    Reserve
  </button>
</div>
        </div>
        
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VenueDetails;
