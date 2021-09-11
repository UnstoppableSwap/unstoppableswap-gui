import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <SwapCallsIcon />
      </Toolbar>
    </AppBar>
  );
}
