# Backend API - Hệ thống Quản lý Nhân viên

Backend API được xây dựng bằng Node.js, Express và Sequelize để quản lý hệ thống nhân viên, phòng ban và yêu cầu.

## Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- MySQL Database
- Docker (để chạy k6 test)

## Cài đặt

1. **Clone dự án và cài đặt dependencies:**

```bash
cd backend
npm install
```

2. **Cấu hình database:**

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
MODE="dev"

CLIENT_URL = "http://localhost:5173"

#PORT
PORT=8001

# Database với postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=root
DB_PORT=5432
DB_HOST=localhost

#JWT
JWT_ACCESS_KEY="String"
JWT_REFRESH_KEY="String"

#seeders
ROOT_PASSWORD="123456@"

#AWS
AWS_REGION="xxxxxxx"

# AWS S3
AWS_ACCESS_KEY_ID_S3="xxxxxxx"
AWS_SECRET_ACCESS_KEY_S3="xxxxxxx"
AWS_S3_BUCKET="xxxxxxx"

# AWS SQS
AWS_ACCESS_KEY_ID_SQS="xxxxxxxxx"
AWS_SECRET_ACCESS_KEY_SQS="xxxxxxx"
AWS_SQS_QUEUE_URL="xxxxxxx"
```

3. **Chạy migrations và seeders:**

```bash
# Tạo bảng database
npm run migrate

# Thêm dữ liệu mẫu
npm run seed
```

## Chạy ứng dụng

### Chạy backend chính:

```bash
npm run start
```

Ứng dụng sẽ chạy tại `http://localhost:8001`

### Chạy backend với môi trường test:

Lưu ý: cần có file .env.test có cấu trúc giống file .env

```bash
npm run start:test
```

## Chạy các loại test

### 1. Unit Test

Chạy tất cả unit test:

```bash
npm run "test:unit"
```

### 2. E2E Test

Chạy tất cả end-to-end test:

```bash
npm run "test:e2e"
```

### 3. K6 Load Test

K6 test được sử dụng để kiểm tra hiệu suất API. Để chạy:

```bash
# Chạy test đăng nhập
docker run -v ${PWD}:/scripts loadimpact/k6 run /scripts/load-test-login.js

# Chạy test khác (thay tên file tương ứng)
docker run -v ${PWD}:/scripts loadimpact/k6 run /scripts/<tên_file_k6>
```

## API Documentation

Sau khi chạy ứng dụng, truy cập Swagger UI tại:

```
http://localhost:8001/api-docs
```
