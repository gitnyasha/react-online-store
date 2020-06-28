import React from "react";
import { Box, Toast } from "gestalt";

const ToastMessage = ({ show, message }) => {
  return (
    show && (
      <Box>
        <Toast color="red" text={message} />
      </Box>
    )
  );
};

export default ToastMessage;
