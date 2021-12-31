import {
  Drawer,
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  makeStyles,
  Box,
} from '@material-ui/core';
import SwapHorizOutlinedIcon from '@material-ui/icons/SwapHorizOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import GitHubIcon from '@material-ui/icons/GitHub';
import RedditIcon from '@material-ui/icons/Reddit';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinkIconButton from './icons/LinkIconButton';

export const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: theme.spacing(1),
  },
  drawerFooter: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

function RouteListItemIconButton({
  name,
  route,
  children,
}: {
  name: string;
  route: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <ListItem button onClick={() => navigate(route)} key={name}>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  );
}

export default function Navigation() {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Box className={classes.drawerContainer}>
        <Box>
          <List>
            <RouteListItemIconButton name="Swap" route="/swap">
              <SwapHorizOutlinedIcon />
            </RouteListItemIconButton>
            <RouteListItemIconButton name="History" route="/history">
              <HistoryOutlinedIcon />
            </RouteListItemIconButton>
            <RouteListItemIconButton name="Wallet" route="/wallet">
              <AccountBalanceWalletIcon />
            </RouteListItemIconButton>
            <RouteListItemIconButton name="Settings" route="/settings">
              <SettingsOutlinedIcon />
            </RouteListItemIconButton>
          </List>
        </Box>
        <Box className={classes.drawerFooter}>
          <LinkIconButton url="https://reddit.com/r/unstoppableswap">
            <RedditIcon />
          </LinkIconButton>
          <LinkIconButton url="https://github.com/UnstoppableSwap/unstoppableswap-gui">
            <GitHubIcon />
          </LinkIconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
