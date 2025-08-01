import { useState, useEffect } from "react";
import {
    Box,
    Avatar,
    Button,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Stack,
    Divider
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function AvatarUploader({
    currentAvatar = null,
    userInitial = "U",
    onSave,
    onCancel,
    loading = false,
    size = 120,
    showActions = true,
    showFileInfo = true,
    compact = false
}) {
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(currentAvatar);
    const [error, setError] = useState(null);

    // Thêm useEffect để cập nhật avatarPreview khi currentAvatar thay đổi
    useEffect(() => {
        setAvatarPreview(currentAvatar);
    }, [currentAvatar]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            clearSelection();
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setError('Vui lòng chọn file JPG hoặc PNG');
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            setError('Kích thước file không được vượt quá 3MB');
            return;
        }

        setAvatarFile(file);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const clearSelection = () => {
        setAvatarFile(null);
        setAvatarPreview(currentAvatar);
        setError(null);

        const fileInput = document.getElementById('avatar-upload-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSave = () => {
        if (avatarFile && onSave) {
            onSave(avatarFile);
        }
    };

    const handleCancel = () => {
        clearSelection();
        if (onCancel) {
            onCancel();
        }
    };

    if (compact) {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar
                        src={avatarPreview}
                        sx={{
                            width: size,
                            height: size,
                            fontSize: size / 3,
                            border: '2px solid #e0e0e0'
                        }}
                    >
                        {userInitial}
                    </Avatar>

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload-input"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="avatar-upload-input">
                        <IconButton
                            component="span"
                            sx={{
                                position: 'absolute',
                                bottom: -5,
                                right: -5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }}
                            disabled={loading}
                        >
                            <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                    </label>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {avatarFile && showActions && (
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={clearSelection}
                            disabled={loading}
                            startIcon={<CloseIcon />}
                        >
                            Hủy
                        </Button>
                    </Stack>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Avatar
                src={avatarPreview}
                sx={{
                    width: size,
                    height: size,
                    mx: 'auto',
                    mb: 2,
                    fontSize: size / 3,
                    border: '4px solid #f0f0f0'
                }}
            >
                {userInitial}
            </Avatar>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload-input"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="avatar-upload-input">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        fullWidth
                        disabled={loading}
                    >
                        Chọn ảnh mới
                    </Button>
                </label>

                {avatarFile && showActions && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{ flex: 1 }}
                            onClick={handleSave}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu ảnh'}
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={clearSelection}
                            disabled={loading}
                            startIcon={<DeleteIcon />}
                        >
                            Hủy
                        </Button>
                    </Box>
                )}
            </Stack>

            {showFileInfo && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                        <strong>Định dạng:</strong> JPG, PNG<br />
                        <strong>Kích thước tối đa:</strong> 3MB
                        {avatarFile && (
                            <>
                                <br />
                                <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                                    <strong>Đã chọn:</strong> {avatarFile.name}<br />
                                    <strong>Kích thước:</strong> {(avatarFile.size / 1024 / 1024).toFixed(2)} MB
                                </Box>
                            </>
                        )}
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default AvatarUploader; 