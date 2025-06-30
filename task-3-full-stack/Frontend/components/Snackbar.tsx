'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type CustomSnackbarProps = {
  message: string;
  severity: AlertColor; // MUI's built-in type for severity: 'error' | 'warning' | 'info' | 'success'
  open: boolean;
  handleClose: () => void;
};

export default function CustomSnackbar({ message, severity, open, handleClose }: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      // onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
