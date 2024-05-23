import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { ReactNode, useRef } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { ExpandableSearchBox } from './ExpandableSearchBox';

export default function ScrollablePaperTextBox({
  children,
  title,
  copyValue,
  searchQuery,
  setSearchQuery,
}: {
  children: ReactNode;
  title: string;
  copyValue: string;
  searchQuery: string | undefined;
  setSearchQuery: (query: string) => void | undefined;
}) {
  const bottomScrollEl = useRef<HTMLDivElement | null>(null);
  const topScrollEl = useRef<HTMLDivElement | null>(null);

  function onCopy() {
    navigator.clipboard.writeText(copyValue);
  }

  function scrollToBottom() {
    bottomScrollEl.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  function scrollToTop() {
    topScrollEl.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  return (
    <Paper
      variant="outlined"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0.5rem',
        width: '100%',
      }}
    >
      <Typography>{title}</Typography>
      <Divider />
      <Box
        style={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          maxHeight: '10rem',
          minHeight: '10rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div ref={topScrollEl} />
        {children}
        <div ref={bottomScrollEl} />
      </Box>
      <Box style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="outlined" onClick={onCopy}>
          Copy
        </Button>
        <IconButton onClick={scrollToBottom} size="small">
          <KeyboardArrowDownIcon />
        </IconButton>
        <IconButton onClick={scrollToTop} size="small">
          <KeyboardArrowUpIcon />
        </IconButton>
        {searchQuery !== undefined && setSearchQuery !== undefined && (
          <ExpandableSearchBox query={searchQuery} setQuery={setSearchQuery} />
        )}
      </Box>
    </Paper>
  );
}
