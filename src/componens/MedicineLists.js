import React, { useState, useEffect } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import "./MedicineLists.css";
import { apiURL } from "./temp";
import toast from "react-hot-toast";

const MedicineLists = () => {
  const [medicineName, setMedicineName] = useState("");
  const [medicineSelected, setMedicineSelected] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState("");
  const [medicinePrice, setMedicinePrice] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [existingMedicines, setExistingMedicines] = useState([]);
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const navigate = useNavigate();
  let debounceTimer;

  const handleAddMedicine = async () => {
    try {
      const response = await fetch(`${apiURL}/medicine/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExistingMedicines([...existingMedicines, data]);
        toast.success("Medicine added successfully!")
        resetMedicineFields();
      } else {
        const { message } = await response.json();
        toast.error(message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add medicine");
    }
  };

  const handleRegisterMedicine = async () => {
    try {
      if (!medicineQuantity || !medicineSelected || !medicinePrice) {
        toast.error("All fields are required!")
        return;
      }

      const response = await fetch(`${apiURL}/pharmacy/registerMedicine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pharmacyId: userInfo._id,
          medicineId: medicineSelected,
          medicineQuantity: parseInt(medicineQuantity),
          price: parseInt(medicinePrice),
        }),
      });

      if (response.ok) {
        toast.success("Medicine registered successfully!")
        localStorage.setItem('pharmacyId', "65f8c6aa05dbd4129a257f10");
        localStorage.setItem('medicineId', "65f98fde5b41e43553f9d987");
        navigate("/updatedmedicinelist");
      } else {
        const { message } = await response.json();
        toast.error(`Failed to register medicine: ${message}`)
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to register medicine")
    }
  };

  const handleCreateNewMedicine = () => {
    setShowNewMedicineForm(true);
  };

  const resetMedicineFields = () => {
    setMedicineName("");
    setMedicineQuantity("");
    setMedicinePrice("");
    setShowNewMedicineForm(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = () => {
    navigate("/updatedmedicinelist");
  };

  const fetchMedicines = async (name) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL}/medicine/get/search?name=${name}`);
        if (response.ok) {
          const { data } = await response.json();
          setOptions(data);
        } else if (response.status === 404) {
          setOptions([]);
        } else if (response.status === 400) {
          setOptions([]);
        } else {
          toast.error("Failed to fetch medicines");
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Error fetching medicines");
      }
      setLoading(false);
    }, 500); // Adjust the debounce delay as needed
  };

  // const fetchMedicines = async (name) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${apiURL}/medicine/get/search?name=${name}`);
  //     if (response.ok) {
  //       const { data } = await response.json();
  //       setOptions(data);
  //     } else if (response.status === 404) {
  //       setOptions([]);
  //     } else {
  //       toast.error("Failed to fetch medicines");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching medicines:", error);
  //     toast.error("Error fetching medicines");
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="app-container">
      <header className="header">MediStore Manager</header>
      <div className="view-medicine-container">
        <Button
          className="view-medicine-button"
          onClick={handleSubmit}
          style={{ backgroundColor: "#4caf50", color: "white" }}
        >
          View List
        </Button>
      </div>
      <div className="logout-container">
        <Button
          className="logout-button"
          onClick={handleLogout}
          style={{ color: "red" }}
        >
          Logout
        </Button>
      </div>
      <div className="form-container">
        <div className="input-field">
          <label htmlFor="medicineName">Medicine Name:</label>
          <Autocomplete
            id="medicineName"
            options={options}
            getOptionLabel={(option) => option.medicineName}
            onInputChange={(event, value) => fetchMedicines(value)}
            onChange={(event, newValue) => setMedicineSelected(newValue?._id || "")}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
        <div className="form-group">
          <label htmlFor="medicineQuantity">Quantity:</label>
          <input
            type="number"
            id="medicineQuantity"
            min={0}
            value={medicineQuantity}
            onChange={(e) => setMedicineQuantity(e.target.value)}
            className="input-field"
            variant="outlined"
            required
            fullWidth
            style={{ width: "540px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="medicinePrice">Price:</label>
          <input
            type="number"
            id="medicinePrice"
            min={0}
            value={medicinePrice}
            onChange={(e) => setMedicinePrice(e.target.value)}
            className="input-field"
            variant="outlined"
            required
            fullWidth
            style={{ width: "540px" }}
          />
        </div>
        <div className="form-buttons">
          <Button
            className="add-button"
            onClick={handleRegisterMedicine}
            style={{ backgroundColor: "#4caf50", color: "white", margin: "3px" }}
          >
            Add Medicine
          </Button>
          <Button
            className="add-button"
            onClick={handleCreateNewMedicine}
            style={{ backgroundColor: "#4caf50", color: "white", margin: "3px" }}
          >
            Create New Medicine
          </Button>
        </div>
      </div>
      {showNewMedicineForm && (
        <div className="form-container">
          <h3>Create New Medicine</h3>
          <div className="form-group">
            <label htmlFor="newMedicineName">Medicine Name:</label>
            <input
              type="text"
              id="newMedicineName"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="input-field"
              required
              fullWidth
              style={{ width: "540px" }}
            />
          </div>
          <div className="form-buttons">
            <Button
              className="add-button"
              onClick={handleAddMedicine}
              style={{ backgroundColor: "#4caf50", color: "white", margin: "3px" }}
            >
              Save
            </Button>
            <Button
              className="add-button"
              onClick={() => setShowNewMedicineForm(false)}
              style={{ backgroundColor: "#4caf50", color: "white", margin: "3px" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {updateMessage && (
        <div className="update-message-box">
          <div className="update-message">{updateMessage}</div>
        </div>
      )}
    </div>
  );
};

export default MedicineLists;
