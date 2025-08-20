
# Hệ thống Quản lý Nhân viên

Dự án full-stack quản lý hệ thống nhân viên, phòng ban và yêu cầu với backend Node.js và frontend React.

## Cấu trúc dự án

```
├── backend/          # API Backend (Node.js + Express + Sequelize)
├── frontend/         # Web Frontend (React + Vite)
├── docker-compose.yml           # Docker development
├── docker-compose.prod.yml      # Docker production
└── README.md
```

## Yêu cầu hệ thống

- Node v22
- Docker
- Docker Compose
- Git

## Tính năng chính

- **Xác thực người dùng** - Đăng nhập, đăng xuất
- **Quản lý nhân viên** - CRUD nhân viên, phân quyền, cấp lại mật khẩu cho nhân viên
- **Quản lý phòng ban** - CRUD phòng ban
- **Check-in/Check-out** - Ghi nhận thời gian làm việc
- **Quản lý yêu cầu** - Tạo và xử lý yêu cầu, gửi email khi đã được đồng ý/từ chối
- **Báo cáo** - Thống kê và báo cáo
- **Quản lý profile** - Thay đổi mật khẩu, thông tin cá nhân

## Chạy dự án

### 1. Development Mode

Chạy toàn bộ dự án với Docker:

```bash
# Clone dự án
git clone <repository-url>

# Vào thư mục
cd <tên dự án>

# Chạy development mode
docker-compose up --build

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Chạy migrate-seed
docker-compose exec backend bash
npm run migrate-seed
```

**Services sẽ chạy tại:**

- Frontend: http://localhost:5173
- Backend: http://localhost:8001
- Database: localhost:5432

### 2. Production Mode

Chạy dự án với cấu hình production:

```bash
# Chạy production mode
docker-compose -f docker-compose.prod.yml up --build

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Dừng services
docker-compose -f docker-compose.prod.yml down

# Chạy migrate-seed
docker-compose  -f docker-compose.prod.yml exec backend bash
npm run migrate-seed-prod #Chỉ tạo mỗi acc root
```

**Services sẽ chạy tại:**

 - http://localhost

## Tài liệu chi tiết

- [Backend README](./backend/README.md) - Hướng dẫn chi tiết backend
- [Frontend README](./frontend/README.md) - Hướng dẫn chi tiết frontend
