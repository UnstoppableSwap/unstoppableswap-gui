import React from 'react';
import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Navigation, { drawerWidth } from './Navigation';
import HistoryPage from './pages/history/HistoryPage';
import SwapPage from './pages/swap/SwapPage';
import WalletPage from './pages/wallet/WalletPage';

const useStyles = makeStyles((theme) => ({
  innerContent: {
    padding: theme.spacing(4),
    marginLeft: drawerWidth,
    maxHeight: `100vh`,
    flex: 1,
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

function InnerContent() {
  const classes = useStyles();

  const routes = {
    '/swap': SwapPage,
    '/history': HistoryPage,
    '/wallet': WalletPage,
  };

  return (
    <Box className={classes.innerContent}>
      <Switch>
        {Object.entries(routes).map(([route, page]) => (
          <Route key={route} path={route} component={page} />
        ))}
      </Switch>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <InnerContent />
        <Redirect exact from="/" to="/swap" />
      </Router>
    </ThemeProvider>
  );
}
