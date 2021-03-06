import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { Search } from "@material-ui/icons";
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
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import axios from "axios";
import { TextField } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#14213d",
    },
  },
});

const useStyles = makeStyles({
  tableContainer: {
    margin: "5%",
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
    marginTop: "30px",
    width: "90%",
    padding: "10px",
  },
  MuiFormControlRoot: {
    backgroundColor: "white",
    width: "90%",
  },
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
  const [text, setText] = useState("");
  const [filterTable, setFilterTable] = useState([]);
  //load data
  useEffect(() => {
    const getRepo = async () => {
      try {
        const response = await axios.get(baseURL);
        setData(response.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    getRepo();
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

  const filterData = (e) => {
    console.log(e.target.value);
    if (e.target.value !== "") {
      setText(e.target.value);
      const filterTable = data.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setFilterTable([...filterTable]);
    } else {
      setText(e.target.value);
      setData([...data]);
    }
  };

  const classes = useStyles();
  return (
    <>
      <Toolbar className={classes.Toolbar} component={Paper}>
        <TextField
          label="Search..."
          className={classes.MuiFormControlRoot}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={text}
          onChange={filterData}
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
            {text.length > 0
              ? stableSort(filterTable, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <a href={row.html_url} target="_blank" rel="noreferrer">
                          {row.name}
                        </a>
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {row.description}
                      </TableCell>
                      <TableCell>{row.owner.login}</TableCell>
                      <TableCell>{row.stargazers_count}</TableCell>
                      <TableCell>{row.forks_count}</TableCell>
                      <TableCell>{row.language}</TableCell>
                    </TableRow>
                  ))
              : stableSort(data, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <a href={row.html_url} target="_blank" rel="noreferrer">
                          {row.name}
                        </a>
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {row.description}
                      </TableCell>
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
