
export const validateFullName = (fullName) => {
    if (!fullName.trim()) {
        return 'Họ và tên là bắt buộc';
    }
    if (fullName.trim().length < 2) {
        return 'Họ và tên phải có ít nhất 2 ký tự';
    }
    return null;
};

export const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Email là bắt buộc';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email không hợp lệ';
    }

    return null;
};

export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return 'Số điện thoại là bắt buộc';
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return 'Số điện thoại phải có 10-11 chữ số';
    }

    return null;
};

export const validateEmployeeForm = (formData) => {
    const errors = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) {
        errors.fullName = fullNameError;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
        errors.email = emailError;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
        errors.phone = phoneError;
    }

    return errors;
};

export const isFormValid = (errors) => {
    return Object.keys(errors).length === 0;
}; 