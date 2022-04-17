import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  makeStyles,
  TablePagination,
  TableSortLabel,
  TextField,
  Toolbar,
} from "@material-ui/core";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#14213d",
    },
  },
});

const useStyles = makeStyles({
  tableContainer: {
    margin: "10%",
    borderRadius: 15,
    width: "90%",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  TableSortLabel: {
    "&:hover": {
      color: "#fca311",
    },
  },
  Toolbar: {
    marginTop: '30px',
    width: '90%',
    padding: '10px'
  },
  MuiFormControlRoot: {
    backgroundColor: 'white',
    width: '90%'
  }
});

const baseURL =
  "https://api.github.com/search/repositories?q=language:Javascript&sort=stars&order=desc";

const columnHeaders = [
  { id: "Name", label: "Name", disableSorting: true },
  { id: "Description", label: "Description", disableSorting: true },
  { id: "Owner", label: "Owner", disableSorting: true },
  { id: "Stars", label: "Stars" },
  { id: "Forks", label: "Forks" },
  { id: "Language", label: "Language", disableSorting: true },
];

function RepoList() {
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  //load data
  useEffect(() => {
    axios
      .get(baseURL)
      .then((Response) => {
        setData(Response.data.items);
      })
      .catch(console.error);
  }, []);

  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const classes = useStyles();
  return (
    <>
    <Toolbar 
    className={classes.Toolbar}
    component={Paper}>
    <TextField
    className={classes.MuiFormControlRoot}
    variant="outlined"
    placeholder="search..."
     />
    </Toolbar>
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columnHeaders.map((column) => (
              <TableCell
                key={column.id}
                className={classes.tableHeaderCell}
                sortDirection={orderBy === column.id ? order : false}
              >
                {column.disableSorting ? (
                  column.label
                ) : (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    className={classes.TableSortLabel}
                    onClick={() => {
                      handleSortRequest(column.id);
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(data, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <a href={row.html_url} target="_blank" rel="noreferrer">
                    {row.name}
                  </a>
                </TableCell>
                <TableCell sx={{ width: "100px" }}>{row.description}</TableCell>
                <TableCell>{row.owner.login}</TableCell>
                <TableCell>{row.stargazers_count}</TableCell>
                <TableCell>{row.forks_count}</TableCell>
                <TableCell>{row.language}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Paper>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </TableContainer>
    </>
  );
}

export default RepoList;
