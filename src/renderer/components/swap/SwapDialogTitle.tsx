import React from 'react';
import { DialogTitle, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type GuideDialogTitleProps = {
  title: string;
};

export default function SwapDialogTitle({ title }: GuideDialogTitleProps) {
  const classes = useStyles();

  return (
    <DialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{title}</Typography>
    </DialogTitle>
  );
}
