import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import SwapWidget from './SwapWidget';
import SwapStateDialog from './swap-dialog/state/SwapStateDialog';
import Header from './Header';

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

const theme = createTheme({});

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
