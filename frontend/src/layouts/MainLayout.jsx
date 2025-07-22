import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { getUser, clearLocalStorage } from "../services/authService";

const drawerWidth = 240;

const menuItems = [
    { text: "Trang chủ", icon: <HomeIcon />, path: "/" },
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Cài đặt", icon: <SettingsIcon />, path: "/settings" },
];

function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        clearLocalStorage();
        navigate("/login", { replace: true });
        handleMenuClose();
    };

    const handleChangePassword = () => {
        navigate("/change-password");
        handleMenuClose();
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box>
            {/* Logo/Brand */}
            <Box
                sx={{
                    p: 2,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                }}
            >
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                    Hiesu
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Hệ thống quản lý
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleMenuItemClick(item.path)}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                                    borderRight: "3px solid #667eea",
                                    "& .MuiListItemIcon-root": {
                                        color: "#667eea",
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: "#667eea",
                                        fontWeight: 600,
                                    },
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(102, 126, 234, 0.05)",
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* User Info */}
            <Box sx={{ p: 2, mt: "auto" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                    }}
                >
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "#667eea" }}>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                            {user?.name || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user?.email || "user@example.com"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    backgroundColor: "white",
                    color: "text.primary",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {/* Title sẽ được set động dựa trên trang hiện tại */}
                    </Typography>

                    {/* User Menu */}
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#667eea" }}>
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleChangePassword}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Đổi mật khẩu</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Đăng xuất</ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
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
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: "100vh",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout; 