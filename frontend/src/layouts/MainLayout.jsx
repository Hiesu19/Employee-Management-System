import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    ExitToApp as LogoutIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandMore as ExpandMoreIcon,
    RequestPage as RequestPageIcon,
    Assessment as ReportIcon,
} from "@mui/icons-material";
import { getUser, logout } from "../services/authService";

const drawerWidth = 260;

const menuConfig = {
    root: [
        { text: "Trang chủ", icon: HomeIcon, path: "/" },
        { text: "Quản lý nhân viên", icon: DashboardIcon, path: "/root/employees" },
        { text: "Quản lý phòng ban", icon: SettingsIcon, path: "/root/department" },
        { text: "Quản lý yêu cầu", icon: RequestPageIcon, path: "/root/request" },
        { text: "Báo cáo", icon: ReportIcon, path: "/root/report" },
    ],
    manager: [
        { text: "Trang chủ", icon: HomeIcon, path: "/" },
        { text: "Chấm công", icon: DashboardIcon, path: "/me/checkinout" },
        { text: "Yêu cầu của tôi", icon: RequestPageIcon, path: "/me/request" },
        { text: "Quản lý phòng ban", icon: DashboardIcon, path: "/manager/department" },
        { text: "Quản lý yêu cầu", icon: RequestPageIcon, path: "/manager/request" },
        { text: "Báo cáo", icon: ReportIcon, path: "/manager/report" },
    ],
    employee: [
        { text: "Trang chủ", icon: HomeIcon, path: "/" },
        { text: "Chấm công", icon: DashboardIcon, path: "/me/checkinout" },
        { text: "Yêu cầu", icon: RequestPageIcon, path: "/me/request" },
    ],
};


function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const role = user?.role
    const menuItems = menuConfig[role] || [];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            localStorage.clear();
            navigate("/login", { replace: true });
            window.location.reload();
        }
        handleMenuClose();
    };

    const handleChangeProfile = () => {
        navigate("/me/profile");
        handleMenuClose();
    };

    const handleChangePassword = () => {
        navigate("/me/change-password");
        handleMenuClose();
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Hiesu
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Hệ thống quản lý nhân sự
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            <Box sx={{ flex: 1, py: 2 }}>
                <List>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => handleMenuItemClick(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        "&.Mui-selected": {
                                            backgroundColor: "rgba(102, 126, 234, 0.15)",
                                            color: "#667eea",
                                            fontWeight: 600,
                                            "&:hover": {
                                                backgroundColor: "rgba(102, 126, 234, 0.2)",
                                            },
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: location.pathname === item.path ? "#667eea" : "inherit",
                                            minWidth: 40,
                                        }}
                                    >
                                        <IconComponent />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: location.pathname === item.path ? 600 : 500
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider />

            {/* User Info */}
            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.06)",
                        },
                    }}
                    onClick={handleMenuClick}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: "#667eea",
                            fontSize: "1.2rem",
                            fontWeight: 600,
                        }}
                    >
                        {user.avatarURL ? (
                            <img
                                src={user.avatarURL}
                                alt="avatar"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                        ) : (
                            user?.fullName?.charAt(0)?.toUpperCase() || "U"
                        )}
                    </Avatar>


                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" noWrap sx={{ fontWeight: 600 }}>
                            {user?.fullName || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user?.email || "user@example.com"}
                        </Typography>
                    </Box>
                    <ExpandMoreIcon sx={{ fontSize: "20px", opacity: 0.7 }} />
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            minWidth: 200,
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        }
                    }}
                >
                    <MenuItem onClick={handleChangeProfile} sx={{ py: 1.5 }}>
                        <PersonIcon sx={{ mr: 2 }} />
                        <Typography>Thông tin cá nhân</Typography>
                    </MenuItem>

                    <MenuItem onClick={handleChangePassword} sx={{ py: 1.5 }}>
                        <PersonIcon sx={{ mr: 2 }} />
                        <Typography>Đổi mật khẩu</Typography>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
                        <LogoutIcon sx={{ mr: 2 }} />
                        <Typography>Đăng xuất</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            overflow: "hidden"
        }}>
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        position: "fixed",
                        top: 20,
                        left: mobileOpen ? drawerWidth - 20 : 10,
                        zIndex: theme.zIndex.drawer + 2,
                        width: 40,
                        height: 40,
                        backgroundColor: "white",
                        color: "#667eea",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        border: "1px solid rgba(102, 126, 234, 0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            backgroundColor: "#667eea",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        },
                    }}
                >
                    {mobileOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            )}

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth },
                    flexShrink: { md: 0 },
                    height: "100vh"
                }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            borderRight: "none",
                            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                            height: "100vh"
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
                            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.04)",
                            height: "100vh",
                            position: "relative"
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                className="main-content"
                sx={{
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                    width: { md: `calc(100vw - ${drawerWidth}px)` },
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 3 },
                    height: "100%"
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout;
