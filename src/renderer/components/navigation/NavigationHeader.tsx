import { Box, List } from '@material-ui/core';
import SwapHorizOutlinedIcon from '@material-ui/icons/SwapHorizOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import RouteListItemIconButton from './RouteListItemIconButton';

export default function NavigationHeader() {
  return (
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
  );
}