import { AppBar, Toolbar, Button } from '@material-ui/core';
import React from 'react';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <SwapCallsIcon />
        <Button component={Link} to="/swap">
          Swap
        </Button>
        <Button component={Link} to="/history">
          History
        </Button>
      </Toolbar>
    </AppBar>
  );
}
