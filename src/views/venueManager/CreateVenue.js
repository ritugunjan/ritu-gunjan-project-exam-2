import React, { useState } from "react";
import { createVenue } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CreateVenue = () => {
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
          : value; // Parse lat and lng as floats
      setVenueData((prevState) => ({
        ...prevState,
        location: { ...prevState.location, [locationKey]: parsedValue },
      }));
    } else if (name === "price") {
      setVenueData({ ...venueData, [name]: parseInt(value, 10) || 0 });
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
      const response = await createVenue(venueData);
      setSnackbar({
        open: true,
        message: "Venue created successfully!",
        severity: "success",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="min-h-[83vh]">
      {/* <h2>Create Venue</h2> */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 w-[90%] mx-auto pt-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={venueData.name}
              onChange={handleChange}
              className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={venueData.description}
              onChange={handleChange}
              className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
              required
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={((venueData || {}).price || "").toString()}
              onChange={handleChange}
              className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
              required
              min="0"
            />
          </div>

          <div>
            <label>Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={(venueData || {}).maxGuests || ''}
              onChange={handleChange}
              className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
              required
              min="1"
            />
          </div>

          <div>
            <label>Rating</label>
            <input
              type="number"
              name="rating"
              value={(venueData || {}).rating || ''}
              onChange={handleChange}
              className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
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
                  checked={((venueData || {}).meta || {}).wifi}
                  onChange={handleChange}
                  className="mr-2"
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
                  value={((venueData || {}).location || {}).address}
                  onChange={handleChange}
                  className="block w-[90%] p-2 border border-gray-400 outline-none rounded-lg"
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
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
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
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
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
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
                  required
                />
              </div>
              <div>
                <label>Continent</label>
                <input
                  type="text"
                  name="location.continent"
                  value={(venueData || {}).location.continent}
                  onChange={handleChange}
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
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
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
                />
              </div>
              <div>
                <label>Longitude</label>
                <input
                  type="number"
                  name="location.lng"
                  value={venueData.location.lng}
                  onChange={handleChange}
                  className="block w-4/5 p-2 border border-gray-400 outline-none rounded-lg"
                />
              </div>
            </div>
          </fieldset>

          <div className="col-span-2 lg:col-span-1">
            <div className="w-[90%] flex justify-between items-center ">
              <label>Media</label>
              <button type="button" onClick={addMediaField}>
                <IoIosAddCircleOutline className="text-2xl" />
              </button>
            </div>

            {((venueData || []).media || []).map((url, index) => (
              <input
                key={index}
                type="text"
                value={url}
                onChange={(e) => handleMediaChange(index, e.target.value)}
                placeholder="Media URL"
                className="block w-[90%] p-1 px-2 border border-gray-400 outline-none rounded-lg mt-2"
                required
              />
            ))}
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="p-2 bg-[#0073e6] text-white rounded-lg my-3"
            >
              Create Venue
            </button>
            <button
              onClick={() => navigate(-1)}
              className="ml-2 p-2 bg-[#0073e6] text-white rounded-lg my-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      {/* <button onClick={() => navigate('/')}>Home</button> */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={(snackbar || {}).severity}
          sx={{ width: "100%" }}
        >
          {(snackbar || "").message || "ERROR"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateVenue;
