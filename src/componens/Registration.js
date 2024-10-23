import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
import { apiURL } from "./temp";

const initialData = {
  branchName: "",
  address: "",
  username: "",
  password: "",
  rating: "",
  mapUrl: "",
  longitude: "",
  latitude: "",
  areaName: "",
};

const Registration = () => {
  const [inputData, setInputData] = useState(initialData);
  const [errorMessage, setErrorMessage] = useState("");
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      branchName,
      address,
      username,
      password,
      rating,
      latitude,
      longitude,
      mapUrl,
      areaName,
    } = inputData;

    if (!branchName || !address || !username || !password || !rating || !latitude || !longitude || !mapUrl || !areaName) {
      setErrorMessage("All fields are mandatory");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = {
        username,
        password,
        branchName,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        rating: parseFloat(rating),
        areaName,
        mapUrl,
        address,
        city: "Karachi",
        country: "Pk",
      };

      console.log("formData", formData);

      const response = await fetch(`${apiURL}/pharmacy/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response:", response);  // Log the response

      if (!response.ok) {
        const data = await response.json();
        console.log("Error data:", data);  // Log the response data
        if (data.code === 404) {
          setErrorMessage("Username Already Exists");
        } else {
          throw new Error("Registration failed");
        }
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setInputData((prevData) => ({
          ...prevData,
          longitude: longitude.toString(),
          latitude: latitude.toString(),
          mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        }));
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container justifyContent="center">
      <Paper elevation={3} sx={{ padding: 4, width: 500, marginTop: 6 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: "#4CAF50" }}>
              <AppRegistrationIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center">
              Pharmacy Registration Form
            </Typography>
          </Grid>
          <Grid item>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {Object.keys(initialData).map((key) => (
                key !== "longitude" && key !== "latitude" && key !== "mapUrl" && (
                  <TextField
                    key={key}
                    name={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    value={inputData[key]}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                    type={key === "rating" ? "number" : key === "password" ? "password" : "text"}
                    inputProps={key === "rating" ? { step: "0.1", min: "1", max: "5" } : {}}
                  />
                )
              ))}
              <Box display="flex" justifyContent="space-between" mb={0}>
                <TextField
                  label="Latitude"
                  value={center.lat}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                  sx={{ marginRight: "5px" }}
                  fullWidth
                />
                <TextField
                  label="Longitude"
                  value={center.lng}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                  sx={{ marginLeft:"5px" }}
                  fullWidth
                />
              </Box>
              
              <Box mb={1} mt={2} width={"50%"} justifyContent={"center"}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
                  onClick={handleGetLocation}
                  fullWidth
                >
                  Get Location
                </Button>
              </Box>
              <TextField
                name="mapUrl"
                label="Map URL"
                value={inputData.mapUrl}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Box mb={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
                  fullWidth
                >
                  Register
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </Grid>
  );
};

export default Registration;
