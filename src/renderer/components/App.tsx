import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import SwapWidget from './SwapWidget';
import SwapInitDialog from './swap-dialog/state/SwapStateDialog';

const useStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    maxWidth: '1170px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'grid',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gridGap: theme.spacing(2),
  },
}));

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#f4511e',
    },
    secondary: indigo,
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.content}>
        <SwapWidget />
        <SwapInitDialog />
      </Box>
    </ThemeProvider>
  );
}
