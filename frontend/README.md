# Frontend - Hệ thống Quản lý Nhân viên

Ứng dụng web React được xây dựng với Vite để quản lý giao diện người dùng cho hệ thống quản lý nhân viên.

## Công nghệ sử dụng

- **React 18** - Thư viện UI
- **Vite** - Build tool và dev server
- **React Router** - Điều hướng trang
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework

## Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

## Cài đặt

1. **Cài đặt dependencies:**

```bash
cd frontend
npm install
```

2. **Tạo file môi trường:**

Tạo file `.env` trong thư mục `frontend`:

```env
VITE_API_URL=http://localhost:8001
```

## Chạy ứng dụng

### Development Mode

```bash
# Chạy dev server
npm run dev

# Hoặc
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### Build Production

```bash
# Build cho production
npm run build

# Preview build
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/         # Components tái sử dụng
│   ├── AvatarUploader.jsx
│   ├── ProtectedRoute.jsx
│   └── RequireRole.jsx
├── pages/             # Các trang của ứng dụng
│   ├── auth/          # Đăng nhập, đổi mật khẩu
│   ├── employee/      # Giao diện nhân viên
│   ├── manager/       # Giao diện quản lý
│   ├── root/          # Giao diện admin
│   └── me/            # Thông tin cá nhân
├── services/          # API services
├── utils/             # Tiện ích helper
├── layouts/           # Layout chung
└── routes/            # Cấu hình routing
```