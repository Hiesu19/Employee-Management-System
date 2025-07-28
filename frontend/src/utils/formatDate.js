export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
};

export const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN');
};