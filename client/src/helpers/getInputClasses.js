const getInputClasses = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return "is-invalid";
    }
    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
        return "is-valid";
    }
    return "";
};

const getInputClassesInObject = (formik, fieldname, childfieldname) => {
    if (!formik.touched[fieldname] ||
        !formik.errors[fieldname]) {
        return "";
    }

    if (formik.touched[fieldname][childfieldname] &&
        formik.errors[fieldname][childfieldname]) {
        return "is-invalid";
    }
    if (formik.touched[fieldname][childfieldname] &&
        !formik.errors[fieldname][childfieldname]) {
        return "is-valid";
    }
    return "";
};

module.exports = {
    getInputClasses,
    getInputClassesInObject
};