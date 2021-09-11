import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange, teal } from '@material-ui/core/colors';
import SwapWidget from './SwapWidget';
import SwapStateDialog from './swap-dialog/state/SwapStateDialog';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(4),
  },
}));

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: teal,
    secondary: deepOrange,
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box className={classes.content}>
        <SwapWidget />
        <SwapStateDialog />
      </Box>
    </ThemeProvider>
  );
}
