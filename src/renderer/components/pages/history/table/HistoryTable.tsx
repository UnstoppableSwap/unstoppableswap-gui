import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useAppSelector } from '../../../../../store/hooks';
import HistoryRow from './HistoryRow';

const useStyles = makeStyles((theme) => ({
  outer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function HistoryTable() {
  const classes = useStyles();
  const swaps = useAppSelector((state) => state.rpc.state.swapInfos);

  return (
    <Box className={classes.outer}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>State</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(swaps).map(([id, swap]) => (
              <HistoryRow swap={swap} key={id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
