import {
  makeStyles,
  ButtonBase,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useState } from 'react';
import ProviderInfo from './ProviderInfo';
import ProviderListDialog from './ProviderListDialog';
import { useAppSelector } from '../../../../store/hooks';

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

export default function ProviderSelect() {
  const classes = useStyles();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider
  );

  if (!selectedProvider) return <>No provider selected</>;

  function handleSelectDialogClose() {
    setSelectDialogOpen(false);
  }

  function handleSelectDialogOpen() {
    setSelectDialogOpen(true);
  }

  return (
    <Box>
      <ProviderListDialog
        open={selectDialogOpen}
        onClose={handleSelectDialogClose}
      />
      <ButtonBase className={classes.inner} onClick={handleSelectDialogOpen}>
        <Card variant="outlined" className={classes.providerCard}>
          <CardContent className={classes.providerCardContent}>
            <ProviderInfo provider={selectedProvider} />
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
}
