import {
  AppBar,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <SwapCallsIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          UnstoppableSwap
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
