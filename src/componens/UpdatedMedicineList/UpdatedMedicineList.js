import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Button } from "@mui/material";
import Modal from "react-modal"; // Remove duplicate import statement
import { useLocation, useNavigate } from "react-router-dom";
import UpdatedMedicineForm from "../UpdatedMedicineForm";
import "./UpdatedMedicineList.css";
import { apiURL } from "../temp";
import toast from "react-hot-toast";

// Remove Modal.setAppElement("#root");

function UpdatedMedicineList() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const [medicines, setMedicines] = useState(state ? state.medicines || [] : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(1000);

  useEffect(() => {
    if (!userInfo || !userInfo._id) {
      setError("User information not found.");
      return;
    }

    const fetchMedicines = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(`${apiURL}/pharmacy/medicineByPharmacyId/${userInfo._id}?page=${currentPage}&limit=${limit}&search=${searchTerm}`);
        if (response.status === 404) {
          toast.error("Medicines not found");
          setMedicines([]); // Set medicines to empty array if not found
          setTotalPages(1);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          toast.error("Failed to fetch medicines");
          setLoading(false);
          return;
        }
        const allMedicines = await response.json();
        console.log("response", allMedicines);
        console.log("allMedicines", allMedicines.data);

        const pagination = allMedicines.pagination;
        setMedicines(allMedicines.data);
        setTotalPages(pagination.totalPages);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch medicines");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };


    fetchMedicines();
  }, [currentPage, userInfo._id, limit, searchTerm]); // Only re-run the effect if these dependencies change



  const handleDelete = async (id) => {
    try {
      // Optimistically update UI
      const updatedMedicines = medicines.filter((medicine) => medicine._id !== id);
      setMedicines(updatedMedicines);

      // Send DELETE request to server
      const response = await fetch(`${apiURL}/pharmacy/deleteRegisteredMedicine/${id}`, {
        method: "DELETE",
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error("Failed to delete medicine. Please try again later."); // Throw error if request failed
      }

      // Show success message
      toast.success("Medicine deleted successfully");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("Failed to delete medicine. Please try again later.");
    }
  };


  const handleUpdate = (id) => {
    console.log("Update Button Clicked - ID:", id);
    const selected = medicines.find((medicine) => medicine._id === id);
    console.log("Selected Medicine:", selected);
    setSelectedMedicine(selected);
    setShowForm(true);
  };

  const handleSaveChanges = ({ name, quantity, price }) => {
    const updatedMedicines = medicines.map((medicine) =>
      medicine._id === selectedMedicine._id
        ? { ...medicine, medicineName: name, medicineQuantity: quantity, price: price }
        : medicine
    );
    setMedicines(updatedMedicines);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedMedicine(null);
  };

  const handleAddMedicine = () => {
    navigate("/medicinelists");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  // const filteredMedicines = medicines.filter((medicine) => {
  //   const name = medicine.medicineName || ''; // Handle undefined or null by assigning a default value
  //   return name.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  const filteredMedicines = medicines.filter((medicine) => {
    const name = medicine.medicineId.medicineName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });


  return (
    <div className="medicine-list-container">
      <Modal isOpen={showForm} onRequestClose={handleCancelForm} className="modal">
        <UpdatedMedicineForm
          isOpen={showForm}
          onSave={handleSaveChanges}
          onCancel={handleCancelForm}
          selectedMedicine={selectedMedicine} // Pass selectedMedicine as prop to the form
          pharmacyId={userInfo._id}
        />
      </Modal>
      <div className="logout-container">
        <Button className="logout-button" onClick={handleLogout} style={{ color: "red" }}>
          Logout
        </Button>
      </div>
      <div className="medicine-header">
        <h2>Medicine List</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <FaPlus className="plus-sign" onClick={handleAddMedicine} />
      </div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {medicines.length > 0 ? (
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                  {medicines.map((medicine) => (
                  <tr key={medicine._id}>
                    <td>{medicine.medicineId.medicineName}</td>
                    <td>{medicine.medicineQuantity}</td>
                    <td>{medicine.price}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(medicine._id)}>
                        <FaTrash />
                      </button>
                      <button className="update-button" onClick={() => handleUpdate(medicine._id)}>
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          ):(
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <p>No medicines found.</p>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
              {/* {<Button 
                disabled={currentPage === 1} 
                onClick={handlePreviousPage} 
                style={
                  {
                    marginRight: "10px", 
                    color: currentPage === 1 ? '#ccc' : 'green',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
                  }
                }
              >
              Previous
            </Button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <Button 
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                style={{
                  marginLeft: '10px',
                  color: currentPage === totalPages ? '#ccc' : 'green',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
              Next
            </Button>} */}
          </div>
        </>
      )}
    </div>
  );
};


export default UpdatedMedicineList;
