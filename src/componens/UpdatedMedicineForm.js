import React, { useState, useEffect } from "react";
import { Button, TextField, Grid } from "@mui/material";
import "./UpdatedMedicineForm.css"; // Import your CSS file
import { apiURL } from "./temp";
import toast from "react-hot-toast";

const UpdatedMedicineForm = ({ isOpen, onSave, onCancel, selectedMedicine, pharmacyId }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (selectedMedicine) {
      console.log("selectedMedicine", selectedMedicine)
      setFormData({
        name: selectedMedicine.medicineId.medicineName || '',
        quantity: (selectedMedicine.medicineQuantity || '').toString(),
        price: (selectedMedicine.price || '').toString(),
      });
    }
  }, [selectedMedicine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const form = {
        pharmacyId: pharmacyId,
        medicineId: selectedMedicine.medicineId._id,
        medicineQuantity: parseInt(formData.quantity),
        price: parseInt(formData.price),
        medicineName: formData.name,
      };
      console.log("form", form);
      const response = await fetch(`${apiURL}/pharmacy/updateMedicineQuantity/${selectedMedicine._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      console.log("response", response)
      if (!response.ok) {
        // throw new Error("Failed to update medicine quantity");
        toast.error("Medicine updatation failed")
        onCancel();
      }

      // Optionally handle successful response
      console.log("Medicine quantity updated successfully");
      toast.success("Medicine updated successfully")

      // Call onSave to update the form data in the parent component
      onSave(formData);

      // Call onCancel to close the form
      onCancel();

    } catch (error) {
      console.error("Error updating medicine quantity:", error);
      // Optionally handle error
    }
  };

  return (
    <div className={`form-container ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <div className="form-wrapper">
          <h2>Update Medicine</h2>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
              />
            </Grid>
            <Grid item xs={12} className="button-container">
              <Button fullWidth variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button fullWidth variant="contained" color="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default UpdatedMedicineForm;