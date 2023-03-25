import { Button, Typography } from '@material-ui/core';
import InfoBox from '../../modal/swap/InfoBox';

const FEEDBACK_URL = 'https://unstoppableswap.aidaform.com/feedback';

export default function FeedbackInfoBox() {
  return (
    <InfoBox
      title="Feedback"
      mainContent={
        <Typography variant="subtitle2">
          The main goal of this project is to make Atomic Swaps easier to use,
          and for that we need genuine users&apos; input. Please leave some
          feedback, it takes just two minutes. I&apos;ll read each and every
          survey response and take your feedback into consideration.
        </Typography>
      }
      additionalContent={
        <Button variant="outlined" onClick={() => window.open(FEEDBACK_URL)}>
          Give feedback
        </Button>
      }
      icon={null}
      loading={false}
    />
  );
}
