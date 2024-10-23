import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./componens/Signin";
import Registration from "./componens/Registration";
import UpdatedMedicineList from "./componens/UpdatedMedicineList/UpdatedMedicineList";
import UpdatedMedicineForm from "./componens/UpdatedMedicineForm";
import MedicineLists from "./componens/MedicineLists";
import ToastContainer from "./componens/toast/ToastContainer";
function App() {
  return (
    <div>
      <Router>
        <Routes path="/">
          <Route index element={<Signin />} />
          <Route path="Registration" element={<Registration />} />
          <Route path="updatedmedicineform" element={<UpdatedMedicineForm />} />
          <Route path="medicinelists" element={<MedicineLists />} />
          <Route path="updatedmedicinelist" element={<UpdatedMedicineList />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
