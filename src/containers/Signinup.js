import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Signin from "../componens/Signin";
// import Signup from "../componens/Signup";
import { Paper } from "@mui/material";
import Registration from "../componens/Registration"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Signinup = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const paperStyle={width:450, margin:"20px auto"}
  return (
    <Paper elevation={20} style={paperStyle}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Sign in" />
            <Tab label="Registration" />
            {/* <Tab label="Signup" /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Signin handleChange={handleChange} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {/* <Signup /> */}
          <Registration />
        </CustomTabPanel>
      </Box>
    </Paper>
  );
};

export default Signinup;
