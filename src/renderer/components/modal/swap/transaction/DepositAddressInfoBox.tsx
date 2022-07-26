import { ReactNode } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import InfoBox from './InfoBox';
import ClipboardIconButton from '../ClipbiardIconButton';
import BitcoinQrCode from './BitcoinQrCode';

type Props = {
  title: string;
  address: string;
  additionalContent: ReactNode;
  icon: ReactNode;
};

const useStyles = makeStyles((theme) => ({
  additionalContentOuter: {
    display: 'flex',
    flexDirection: 'row',
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
            <Box>{additionalContent}</Box>
          </Box>
          <BitcoinQrCode address={address} />
        </Box>
      }
      icon={icon}
      loading={false}
    />
  );
}
