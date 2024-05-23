import { useState } from 'react';
import { Box, IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

export function ExpandableSearchBox({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" alignItems="center" gap="0.5rem">
        {expanded ? (
          <>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              size="small"
            />
            <IconButton
              onClick={() => {
                setExpanded(false);
                setQuery('');
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setExpanded(true)} size="small">
            <SearchIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
