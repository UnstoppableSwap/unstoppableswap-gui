import React from 'react';
import CircularProgressWithSubtitle from '../CircularProgressWithSubtitle';
import { useAppSelector } from '../../../../../store/hooks';

export default function InitiatedPage() {
  const description = useAppSelector((s) =>
    s.swap.resume ? 'Resuming swap' : 'Requesting quote from provider'
  );

  return <CircularProgressWithSubtitle description={description} />;
}
