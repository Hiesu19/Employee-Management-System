const genRequestHTML = (user, request) => {
    const html = `
    <h1>Bạn có 1 yêu cầu mới</h1>
    <p>Họ tên: ${user.fullName}</p>
    <p>Email: ${user.email}</p>
    <p>Vị trí: ${user.role === "manager" ? "Quản lý" : "Nhân viên"}</p>
    <p>Ngày: ${request.fromDate} - ${request.toDate}</p>
    <p>Lý do: ${request.reason}</p>
    <p> Vui lòng truy cập hệ thống để duyệt và xem chi tiết yêu cầu.</p>
    `;
    return html;
}

module.exports = { genRequestHTML };