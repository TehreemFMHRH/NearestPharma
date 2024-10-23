import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik, Field, ErrorMessage } from "formik";
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
import LockIcon from "@mui/icons-material/Lock";
import Checkbox from "@mui/material/Checkbox";
import { apiURL } from "./temp";
import toast from "react-hot-toast";

const Signin = () => {
  const paperStyle = {
    padding: 30,
    width: 400,
    margin: "0 auto",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  };
  const avatarStyle = { backgroundColor: "#45a049" };
  const initialValues = {
    Username: "",
    password: "",
    remember: false,
  };
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values, props) => {
    try {
      const response = await fetch(`${apiURL}/pharmacy/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.Username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(`${data.message}`);
        // You can throw an error here if you want to prevent further execution
        // throw new Error(data.message);
      } else {
        const data = await response.json();
        localStorage.setItem("user-info", JSON.stringify(data.data));
        localStorage.setItem("token", JSON.stringify(data.token));
        toast.success('Successfully Login!')
        navigate("/updatedmedicinelist");
        setTimeout(() => {
          props.resetForm();
          props.setSubmitting(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing your request.")
      // setErrorMessage("An error occurred while processing your request.");
    }
  };


  const handleChange = () => {
    navigate("/Registration");
  };

  const validationSchema = Yup.object().shape({
    Username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh", background: "#f0f0f0" }}>
      <Paper style={paperStyle}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Avatar style={{ ...avatarStyle, marginBottom: 20 }}>
            <LockIcon />
          </Avatar>
          <Typography variant="h5" style={{ marginBottom: 20 }}>Sign In</Typography>
          {errorMessage && (
            <Typography color="error" align="center" style={{ marginBottom: 20 }}>
              {errorMessage}
            </Typography>
          )}
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form style={{ width: "100%" }}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Field
                      as={TextField}
                      label="Username"
                      name="Username"
                      placeholder="Enter username"
                      type="username"
                      fullWidth
                      required
                    />
                    <ErrorMessage name="Username" render={(msg) => <Typography color="error">{msg}</Typography>} />
                  </Grid>
                  <Grid item>
                    <Field
                      as={TextField}
                      label="Password"
                      name="password"
                      placeholder="Enter password"
                      type="password"
                      fullWidth
                      required
                    />
                    <ErrorMessage name="password" render={(msg) => <Typography color="error">{msg}</Typography>} />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={props.isSubmitting}
                      fullWidth
                      style={{
                        textTransform: "none", background: "#4CAF50" 
                      }}
                    >
                      {props.isSubmitting ? "Loading" : "Sign In"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          {/* <Grid item>
            <Typography>
              <Link href="#">Forgot password ?</Link>
            </Typography>
          </Grid> */}
          <Grid item>
            <Typography>
              Don't have an account ?{" "}
              <Link href="#" onClick={handleChange}>
                Register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Signin;
