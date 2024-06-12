import { Box, makeStyles, CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation, { drawerWidth } from './navigation/Navigation';
import HistoryPage from './pages/history/HistoryPage';
import SwapPage from './pages/swap/SwapPage';
import WalletPage from './pages/wallet/WalletPage';
import HelpPage from './pages/help/HelpPage';
import GlobalSnackbarProvider from './snackbar/GlobalSnackbarProvider';
import UpdaterDialog from './modal/updater/UpdaterDialog';

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
  transitions: {
    create: () => 'none',
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

function InnerContent() {
  const classes = useStyles();

  return (
    <Box className={classes.innerContent}>
      <Routes>
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/" element={<SwapPage />} />
      </Routes>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalSnackbarProvider>
        <CssBaseline />
        <UpdaterDialog />
        <Router>
          <Navigation />
          <InnerContent />
        </Router>
      </GlobalSnackbarProvider>
    </ThemeProvider>
  );
}
