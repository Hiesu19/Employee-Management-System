const { convertToDDMMYYYY_HHMMSS_GMT7 } = require('./convert-time.utils');
const genRequestHTML = (user, request) => {
    const html = `
    <h1>Bạn có 1 yêu cầu mới</h1>
    <p>Họ tên: ${user.fullName}</p>
    <p>Email: ${user.email}</p>
    <p>Vị trí: ${user.role === "manager" ? "Quản lý" : "Nhân viên"}</p>
    <p>Ngày: ${convertToDDMMYYYY_HHMMSS_GMT7(request.fromDate)} - ${convertToDDMMYYYY_HHMMSS_GMT7(request.toDate)}</p>
    <p>Lý do: ${request.reason}</p>
    <p>Vui lòng truy cập hệ thống để duyệt và xem chi tiết yêu cầu.</p>
    `;
    return html;
}

const genRequestHTMLRequestRejected = (formData) => {
    const html = `
    <h1>Hi ${formData.fullName} - ${formData.email}</h1>
    <h1 style="color: red;">Yêu cầu của bạn đã bị từ chối</h1>
    <p>Họ tên: ${formData.fullName}</p>
    <p>ID yêu cầu: ${formData.id}</p>
    <p>Tên yêu cầu: ${formData.type}</p>
    <p>Ngày: ${convertToDDMMYYYY_HHMMSS_GMT7(formData.fromDate)} - ${convertToDDMMYYYY_HHMMSS_GMT7(formData.toDate)}</p>
    <p>Chỉnh sửa bởi: ${formData.checkedByName} - ${formData.checkedByEmail}</p>
    <p>Lý do: ${formData.reasonReject || "Không có lý do"}</p>
    <p>Vui lòng truy cập hệ thống để xem chi tiết yêu cầu.</p>
    `;
    return html;
}

const genRequestHTMLRequestApproved = (formData) => {
    const html = `
    <h1>Hi ${formData.fullName} - ${formData.email}</h1>
    <h1 style="color: green;">Yêu cầu của bạn đã được phê duyệt</h1>
    <p>Họ tên: ${formData.fullName}</p>
    <p>ID yêu cầu: ${formData.id}</p>
    <p>Tên yêu cầu: ${formData.type}</p>
    <p>Ngày: ${convertToDDMMYYYY_HHMMSS_GMT7(formData.fromDate)} - ${convertToDDMMYYYY_HHMMSS_GMT7(formData.toDate)}</p>
    <p>Chỉnh sửa bởi: ${formData.checkedByName} - ${formData.checkedByEmail}</p>
    <p> Vui lòng truy cập hệ thống để xem chi tiết yêu cầu.</p>
    `;
    return html;
}

module.exports = { genRequestHTML, genRequestHTMLRequestRejected, genRequestHTMLRequestApproved };