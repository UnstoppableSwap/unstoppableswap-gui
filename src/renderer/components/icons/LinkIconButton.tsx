import React from 'react';
import { IconButton } from '@material-ui/core';

export default function LinkIconButton({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <IconButton component="span" onClick={() => window.open(url, '_blank')}>
      {children}
    </IconButton>
  );
}
