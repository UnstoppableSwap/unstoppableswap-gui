import RedditIcon from '@material-ui/icons/Reddit';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Box, makeStyles } from '@material-ui/core';
import LinkIconButton from '../icons/LinkIconButton';
import UnfinishedSwapsAlert from './UnfinishedSwapsAlert';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  linksOuter: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

export default function NavigationFooter() {
  const classes = useStyles();

  return (
    <Box className={classes.outer}>
      <UnfinishedSwapsAlert />
      <Box className={classes.linksOuter}>
        <LinkIconButton url="https://reddit.com/r/unstoppableswap">
          <RedditIcon />
        </LinkIconButton>
        <LinkIconButton url="https://github.com/UnstoppableSwap/unstoppableswap-gui">
          <GitHubIcon />
        </LinkIconButton>
      </Box>
    </Box>
  );
}
