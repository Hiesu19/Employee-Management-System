import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  getAllEmployees,
  resetPassword,
  deleteEmployee,
  searchEmployeeByEmailOrNameOrPhone,
} from "../../../services/employeeService";

const getRoleColor = (role) => {
  switch (role) {
    case "root":
      return "error";
    case "manager":
      return "warning";
    case "employee":
      return "primary";
    default:
      return "default";
  }
};

const getRoleLabel = (role) => {
  switch (role) {
    case "root":
      return "Quản trị viên";
    case "manager":
      return "Quản lý";
    case "employee":
      return "Nhân viên";
    default:
      return role;
  }
};

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchEmployees = async (pageNumber = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllEmployees(pageNumber, limit);

      if (response.success === "success") {
        const employeesData = response.data.employees || [];
        setEmployees(employeesData);
        setTotalEmployees(response.data.totalEmployees || 0);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Không thể tải danh sách nhân viên");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchEmployees(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchEmployees(1, newRowsPerPage);
  };

  const handleResetPasswordForSelectedEmployees = async () => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn đặt lại mật khẩu cho nhân viên đã chọn?"
    );
    if (!confirm) return;

    const listUserID = selectedEmployees;
    const response = await resetPassword(listUserID);
    if (response.success === "success") {
      setSelectedEmployees([]);
      setSuccessMessage("Đặt lại mật khẩu thành công!");
      setIsSuccess(true);
      setAnchorEl(null);
      fetchEmployees(1, rowsPerPage);
    } else {
      setError("Không thể đặt lại mật khẩu");
    }
  };

  const handleResetPasswordForAllEmployees = async () => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn đặt lại mật khẩu cho tất cả nhân viên?"
    );
    if (!confirm) return;

    const allEmployees = await getAllEmployees(null, null);
    const listUserID = allEmployees.data.employees.map(
      (employee) => employee.userID
    );
    const response = await resetPassword(listUserID);
    if (response.success === "success") {
      setSuccessMessage("Đặt lại mật khẩu tất cả nhân viên thành công!");
      setIsSuccess(true);
      setAnchorEl(null);
      fetchEmployees(1, rowsPerPage);
    } else {
      setError("Không thể đặt lại mật khẩu");
    }
  };

  const handleDeleteEmployee = async (employeeID, employeeName) => {
    const confirm = window.confirm(
      `Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`
    );
    if (!confirm) return;

    try {
      const response = await deleteEmployee(employeeID);
      if (response.success === "success") {
        setSuccessMessage(`Đã xóa nhân viên "${employeeName}" thành công!`);
        setIsSuccess(true);
        setSelectedEmployees(
          selectedEmployees.filter((id) => id !== employeeID)
        );
        fetchEmployees(page + 1, rowsPerPage);
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Không thể xóa nhân viên này");
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setIsSuccess(false);
    setSuccessMessage("");
  };

  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      fetchEmployees(1, rowsPerPage);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const response = await searchEmployeeByEmailOrNameOrPhone(searchValue);

      if (response.success === "success") {
        const searchResults = response.data.employees || [];
        setEmployees(searchResults);
        setTotalEmployees(searchResults.length);
        setPage(0);
      } else {
        setError("Không thể tìm kiếm nhân viên");
        setEmployees([]);
        setTotalEmployees(0);
      }
    } catch (err) {
      console.error("Error searching employees:", err);
      setError("Không thể tìm kiếm nhân viên");
      setEmployees([]);
      setTotalEmployees(0);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search để tránh gọi API quá nhiều
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        handleSearch(searchTerm);
      } else {
        // Khi searchTerm trống, trả về danh sách gốc
        fetchEmployees(1, rowsPerPage);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, rowsPerPage]);

  useEffect(() => {
    fetchEmployees(1, rowsPerPage);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Quản lý nhân viên
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mb: 3, gap: 2 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/root/employees/add")}
          >
            Thêm nhân viên
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Tùy chọn
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              disabled={selectedEmployees.length === 0}
              onClick={handleResetPasswordForSelectedEmployees}
            >
              Đặt lại mật khẩu ({selectedEmployees.length})
            </MenuItem>
            <MenuItem onClick={handleResetPasswordForAllEmployees}>
              Đặt lại mật khẩu tất cả
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm nhân viên theo tên, email, số điện thoại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {(loading || searchLoading) && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      )}

      {/*Table */}
      {!loading && !searchLoading && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "70vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Nhân viên
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Điện thoại
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Vai trò
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Phòng ban
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Thao tác
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                    Chọn
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm
                          ? "Không tìm thấy nhân viên nào phù hợp với từ khóa tìm kiếm"
                          : "Chưa có nhân viên nào"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.userID} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#667eea",
                            }}
                          >
                            {employee.fullName?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {employee.fullName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(employee.role)}
                          color={getRoleColor(employee.role)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {employee.Department?.departmentName}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Chỉnh sửa"
                            onClick={() =>
                              navigate(
                                `/root/employees/edit/${employee.userID}`
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            title="Xóa"
                            onClick={() =>
                              handleDeleteEmployee(
                                employee.userID,
                                employee.fullName
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={selectedEmployees.includes(employee.userID)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmployees([
                                ...selectedEmployees,
                                employee.userID,
                              ]);
                            } else {
                              setSelectedEmployees(
                                selectedEmployees.filter(
                                  (id) => id !== employee.userID
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalEmployees}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{
              borderTop: "1px solid rgba(224, 224, 224, 1)",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  mb: 0,
                },
            }}
          />
        </Paper>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={isSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccessSnackbar}
        message={successMessage || "Thao tác thành công!"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#4caf50",
            color: "white",
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
}
