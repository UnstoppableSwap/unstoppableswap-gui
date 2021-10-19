import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { indigo } from '@material-ui/core/colors';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Header from './Header';
import { store } from '../../store/store';
import SwapStateDialog from './swap/state/SwapStateDialog';
import SwapWidget from './SwapWidget';
import HistoryTable from './history/HistoryTable';

const useStyles = makeStyles((theme) => ({
  innerContent: {
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

function Modals() {
  return (
    <>
      <SwapStateDialog />
    </>
  );
}

function InnerContent() {
  const classes = useStyles();

  return (
    <Box className={classes.innerContent}>
      <Switch>
        <Route path="/swap">
          <SwapWidget />
        </Route>
        <Route path="/history">
          <HistoryTable />
        </Route>
      </Switch>
      <Modals />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <CssBaseline />
          <Header />
          <InnerContent />
          <Redirect exact from="/" to="/swap" />
        </Router>
      </Provider>
    </ThemeProvider>
  );
}
