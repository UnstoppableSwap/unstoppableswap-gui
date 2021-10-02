import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { indigo } from '@material-ui/core/colors';
import SwapWidget from './SwapWidget';
import SwapStateDialog from './swap/state/SwapStateDialog';
import Header from './Header';
import { store } from '../../store/store';

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(4),
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
      <Provider store={store}>
        <CssBaseline />
        <Header />
        <Box className={classes.content}>
          <SwapWidget />
          <SwapStateDialog />
        </Box>
      </Provider>
    </ThemeProvider>
  );
}
