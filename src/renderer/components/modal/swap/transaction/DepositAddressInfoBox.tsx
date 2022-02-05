import { ReactNode } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import InfoBox from './InfoBox';
import ClipboardIconButton from '../ClipbiardIconButton';

type Props = {
  title: string;
  address: string;
  additionalContent: ReactNode;
  icon: ReactNode;
};

const useStyles = makeStyles((theme) => ({
  additionalContentOuter: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
}));

export default function DepositAddressInfoBox({
  title,
  address,
  additionalContent,
  icon,
}: Props) {
  const classes = useStyles();

  return (
    <InfoBox
      title={title}
      mainContent={<Typography variant="h5">{address}</Typography>}
      additionalContent={
        <Box className={classes.additionalContentOuter}>
          <Box>
            <ClipboardIconButton
              text={address}
              endIcon={<FileCopyOutlinedIcon />}
              color="primary"
              variant="contained"
              size="medium"
            />
          </Box>
          <Box>{additionalContent}</Box>
        </Box>
      }
      icon={icon}
      loading={false}
    />
  );
}
