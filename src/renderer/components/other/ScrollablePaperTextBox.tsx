import { Box, Divider, IconButton, Paper, Typography } from '@material-ui/core';
import { ReactNode, useRef } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { VList, VListHandle } from 'virtua';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { ExpandableSearchBox } from './ExpandableSearchBox';

const MIN_HEIGHT = '10rem';

export default function ScrollablePaperTextBox({
  rows,
  title,
  copyValue,
  searchQuery,
  setSearchQuery,
  minHeight,
}: {
  rows: ReactNode[];
  title: string;
  copyValue: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  minHeight?: string;
}) {
  const virtuaEl = useRef<VListHandle | null>(null);

  function onCopy() {
    navigator.clipboard.writeText(copyValue);
  }

  function scrollToBottom() {
    virtuaEl.current?.scrollToIndex(rows.length - 1);
  }

  function scrollToTop() {
    virtuaEl.current?.scrollToIndex(0);
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
          maxHeight: minHeight,
          minHeight,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <VList ref={virtuaEl} style={{ height: MIN_HEIGHT, width: '100%' }}>
          {rows}
        </VList>
      </Box>
      <Box style={{ display: 'flex', gap: '0.5rem' }}>
        <IconButton onClick={onCopy} size="small">
          <FileCopyOutlinedIcon />
        </IconButton>
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

ScrollablePaperTextBox.defaultProps = {
  searchQuery: undefined,
  setSearchQuery: undefined,
  minHeight: MIN_HEIGHT,
};
