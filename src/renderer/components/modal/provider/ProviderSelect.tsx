import {
  makeStyles,
  ButtonBase,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ExtendedProvider } from 'models/storeModel';
import React, { useState } from 'react';
import ProviderInfo from './ProviderInfo';
import ProviderSelectDialog from './ProviderSelectDialog';
import ProviderSubmitDialog from './ProviderSubmitDialog';

const useStyles = makeStyles({
  inner: {
    textAlign: 'left',
    width: '100%',
    height: '100%',
  },
  providerCard: {
    width: '100%',
  },
  providerCardContent: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default function ProviderSelect({
  provider,
  onProviderSelect,
}: {
  provider: ExtendedProvider;
  onProviderSelect: (provider: ExtendedProvider) => void;
}) {
  const classes = useStyles();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const handleSelectDialogClose = () => {
    setSelectDialogOpen(false);
  };

  const handleSelectDialogOpen = () => {
    setSelectDialogOpen(true);
  };

  const handleSubmitDialogClose = () => {
    setSubmitDialogOpen(false);
  };

  const handleSubmitDialogOpen = () => {
    setSubmitDialogOpen(true);
    setSelectDialogOpen(false);
  };

  return (
    <Box>
      <ProviderSelectDialog
        onProviderSelect={onProviderSelect}
        open={selectDialogOpen}
        onClose={handleSelectDialogClose}
        onSubmitDialogOpen={handleSubmitDialogOpen}
      />
      <ProviderSubmitDialog
        open={submitDialogOpen}
        onClose={handleSubmitDialogClose}
      />

      <ButtonBase className={classes.inner} onClick={handleSelectDialogOpen}>
        <Card variant="outlined" className={classes.providerCard}>
          <CardContent className={classes.providerCardContent}>
            <ProviderInfo provider={provider} />
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
}
