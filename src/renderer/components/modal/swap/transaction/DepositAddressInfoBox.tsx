import { ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import InfoBox from './InfoBox';

type Props = {
  title: string;
  address: string;
  additionalContent: ReactNode;
  icon: ReactNode;
};

export default function DepositAddressInfoBox({
  title,
  address,
  additionalContent,
  icon,
}: Props) {
  return (
    <InfoBox
      title={title}
      mainContent={<Typography variant="h5">{address}</Typography>}
      additionalContent={additionalContent}
      icon={icon}
      loading={false}
    />
  );
}
