import React from "react";
import { PulseLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = ({ show }) => {
  return (
    show && (
      <Box>
        <PulseLoader color="green" size={25} margin="3px" />
      </Box>
    )
  );
};

export default Loader;
