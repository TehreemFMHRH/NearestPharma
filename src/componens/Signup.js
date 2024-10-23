import {
  Box,
  Avatar,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Button,
  Typography,
  Link,
} from "@mui/material";
import React from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Checkbox from "@mui/material/Checkbox";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormHelperText } from "@mui/material";
// import { useHistory } from 'react-router-dom';
// import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // const history = useHistory();
  const navigate = useNavigate();


  const paperStyle = {
    padding: 20,
    height: "90vh",
    width: 280,
    margin: "0 auto",
  };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#6767d4" };
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    termsAndConditions: false,
  };
  const HandleSubmit = (values, props) => {
    console.log(values);
    console.log(props);
    navigate("/");
    // history.push("/");
    // <Redirect to='/'/>

    setTimeout(() => {
      props.resetForm();
      props.setSubmitting(false);

    }, 2000);
  };
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    password: Yup.string()
      .min(8, "Password minimum length should be 8")
      .required("Required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Required"),
    termsAndConditions: Yup.string().oneOf(
      ["true"],
      "Accept terms & conditions"
    ),
  });
  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign Up</h2>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={HandleSubmit}
        >
          {(props) => (
            <Form>
              <Box my={1}>
                <Field as={TextField}
                  label="First Name"
                  name="firstname"
                  placeholder="Enter your first name"
                  helperText={<ErrorMessage name="firstname" />}
                  fullWidth
                />
              </Box>
              <Box my={1}>
                <Field
                  as={TextField}
                  label="Last Name"
                  name="lastname"
                  placeholder="Enter your last name"
                  helperText={<ErrorMessage name="lastname" />}
                  fullWidth
                />
              </Box>
              <Box my={1}>
                <Field
                  as={TextField}
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  helperText={<ErrorMessage name="email" />}
                  fullWidth
                />
              </Box>
              <Box my={1}>
                <Field
                  as={TextField}
                  label="Password"
                  name="password"
                  placeholder="Enter password"
                  type="password"
                  helperText={<ErrorMessage name="password" />}
                  fullWidth
                />
              </Box>
              <Box my={1}>
                <Field
                  as={TextField}
                  label="Confirm Password"
                  name="confirmpassword"
                  placeholder="Confirm password"
                  type="password"
                  helperText={<ErrorMessage name="confirmpassword" />}
                  fullWidth
                />
              </Box>
              <Grid container alignItems="center" justifyContent="flex-start">
                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="termsAndConditions"
                      color="secondary"
                    />
                  }
                  label="Accept terms and conditions"
                />
                <FormHelperText>
                  <ErrorMessage name="termsAndConditions" />
                </FormHelperText>
              </Grid>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={props.isSubmitting}
              >
                {props.isSubmitting ? "Loading" : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default Signup;
