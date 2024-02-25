import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchVenueDetails,
  deleteVenue,
  updateVenue,
} from "../../services/api";
import { IoIosAddCircleOutline } from "react-icons/io";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const VenueDetailsManager = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [venue, setVenue] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [venueData, setVenueData] = useState({
    name: "",
    description: "",
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("meta.")) {
      const metaKey = name.split(".")[1];
      setVenueData((prevState) => ({
        ...prevState,
        meta: { ...prevState.meta, [metaKey]: checked },
      }));
    } else if (name.startsWith("location.")) {
      const locationKey = name.split(".")[1];
      const parsedValue =
        locationKey === "lat" || locationKey === "lng"
          ? parseFloat(value)
          : value; 
      setVenueData((prevState) => ({
        ...prevState,
        location: { ...prevState.location, [locationKey]: parsedValue },
      }));
    } else if (type === "checkbox") {
      setVenueData({ ...venueData, [name]: checked });
    } else if (type === "number") {
      setVenueData({ ...venueData, [name]: Number(value) });
    } else {
      setVenueData({ ...venueData, [name]: value });
    }
  };

  const handleMediaChange = (index, value) => {
    const updatedMedia = [...venueData.media];
    updatedMedia[index] = value;
    setVenueData({ ...venueData, media: updatedMedia });
  };
 

  const addMediaField = () => {
    setVenueData({ ...venueData, media: [...venueData.media, ""] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await updateVenue(venueData.id, venueData);
      setSnackbar({
        open: true,
        message: "Venue updated successfully!",
        severity: "success",
      });
      history(`/venue-manager/venues/details/${venueData.id}`);
    } catch (err) {
  let errorMessage = "Error, please try after sometime"; // Default error message
  if (err?.response?.data?.errors && err.response.data.errors.length > 0) {
    errorMessage = err.response.data.errors[0].message || errorMessage;
  }

  setSnackbar({
    open: true,
    message: errorMessage,
    severity: "error",
  });
  console.error(err);
}
  };

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const response = await fetchVenueDetails(id);
        setVenue(response);
        setVenueData(response);
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setSnackbar({
          open: true,
          message: "Error fetching venue details",
          severity: "error",
        });
        
      }
    };

    loadVenueDetails();
  }, [id]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (confirmed) {
      try {
        await deleteVenue(id);
        history("/profile");
      } catch (error) {
        console.error("Error deleting venue:", error);
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.errors[0]?.message || "Error deleting venue",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (!venue)
    return (
      <div className="min-h-[83vh] flex justify-center items-center text-2xl font-bold text-gray-600 ">
        <CircularProgress />
      </div>
    );

  return (
    <div className="min-h-[83vh]">
      {/* <h2>Create Venue</h2> */}
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 w-[90%] mx-auto pt-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={venueData.name}
              onChange={handleChange}
              className={
                isEditing
                  ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                  : "block w-[90%] p-2"
              }
              disabled={!isEditing}
              required
              
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={venueData.description}
              onChange={handleChange}
              className={
                isEditing
                  ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                  : "block w-[90%] p-2"
              }
              disabled={!isEditing}
              required
              
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={venueData.price}
              onChange={handleChange}
              className={
                isEditing
                  ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                  : "block w-[90%] p-2"
              }
              disabled={!isEditing}
              required
              min="0"
            />
          </div>

          <div>
            <label>Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={venueData.maxGuests}
              onChange={handleChange}
              className={
                isEditing
                  ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                  : "block w-[90%] p-2"
              }
              disabled={!isEditing}
              required
              min="1"
            />
          </div>

          <div>
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              value={venueData.rating}
              onChange={handleChange}
              className={
                isEditing
                  ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                  : "block w-[90%] p-2"
              }
              disabled={!isEditing}
              required
              min="0"
              max="5"
            />
          </div>

          <fieldset>
            <h2>Meta</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <label>
                <input
                  type="checkbox"
                  name="meta.wifi"
                  checked={venueData.meta.wifi}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={!isEditing}
                />
                Wifi
              </label>
              <label>
                <input
                  type="checkbox"
                  name="meta.parking"
                  checked={venueData.meta.parking}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={!isEditing}
                />
                Parking
              </label>
              <label>
                <input
                  type="checkbox"
                  name="meta.breakfast"
                  checked={venueData.meta.breakfast}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={!isEditing}
                />
                Breakfast
              </label>
              <label>
                <input
                  type="checkbox"
                  name="meta.pets"
                  checked={venueData.meta.pets}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={!isEditing}
                />
                Pets Allowed
              </label>
            </div>
          </fieldset>

          <fieldset className="col-span-2">
            <legend>Location</legend>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="col-span-2">
                <label>Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={venueData.location.address}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  value={venueData.location.city}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label>Zip Code</label>
                <input
                  type="text"
                  name="location.zip"
                  value={venueData.location.zip}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  type="text"
                  name="location.country"
                  value={venueData.location.country}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label>Continent</label>
                <input
                  type="text"
                  name="location.continent"
                  value={venueData.location.continent}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label>Latitude</label>
                <input
                  type="number"
                  name="location.lat"
                  value={venueData.location.lat}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label>Longitude</label>
                <input
                  type="number"
                  name="location.lng"
                  value={venueData.location.lng}
                  onChange={handleChange}
                  className={
                    isEditing
                      ? "block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
                      : "block w-[90%] p-2"
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </fieldset>

          <div className="col-span-2 lg:col-span-1">
            <div className="w-[90%] flex justify-between items-center">
              <label>Media</label>
              {isEditing ? (
                <button type="button" onClick={addMediaField}>
                  <IoIosAddCircleOutline className="text-2xl" />
                </button>
              ) : (
                ""
              )}
            </div>

            {venueData.media.map((url, index) => (
              <input
                key={index}
                type="text"
                value={url}
                onChange={(e) => handleMediaChange(index, e.target.value)}
                placeholder="Media URL"
                className={
                  isEditing
                    ? "block w-[90%] p-1 px-2 border border-gray-400 outline-none rounded-lg mt-2"
                    : "block w-[90%] p-1 px-2 mt-2"
                }
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>
      </form>
      <div className="w-[90%] mx-auto">
        {isEditing ? (
          <div>
            <button
              onClick={handleSubmit}
              className="p-2 bg-[#0073e6] text-white rounded-lg my-3"
            >
              Update Venue
            </button>
            <button
              onClick={() => navigate(-1)}
              className="ml-2 p-2 bg-[#0073e6] text-white rounded-lg my-3"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-[#0073e6] text-white rounded-lg my-3"
              type="button"
            >
              Edit Venue
            </button>
            <button
              onClick={() => handleDelete(venueData.id)}
              className="ml-2 p-2 bg-[#c94b4b] text-white rounded-lg my-3"
            >
              Delete Venue
            </button>
          </div>
        )}
      </div>
      {/* <button onClick={() => navigate('/')}>Home</button> */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VenueDetailsManager;
