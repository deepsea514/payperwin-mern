export const getInputClasses = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return "is-invalid";
    }
    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
        return "is-valid";
    }
    return "";
};

export const getInputClasses2 = (formik, fieldname1, fieldname2) => {
    if (!formik.touched[fieldname1] ||
        !formik.errors[fieldname1]) {
        return "";
    }

    if (formik.touched[fieldname1][fieldname2] &&
        formik.errors[fieldname1][fieldname2]) {
        return "is-invalid";
    }
    if (formik.touched[fieldname1][fieldname2] &&
        !formik.errors[fieldname1][fieldname2]) {
        return "is-valid";
    }
    return "";
};

export const getInputClasses3 = (formik, fieldname1, fieldname2, fieldname3) => {
    if (!formik.touched[fieldname1] ||
        !formik.errors[fieldname1]) {
        return "";
    }

    if (!formik.touched[fieldname1][fieldname2] ||
        !formik.errors[fieldname1][fieldname2]) {
        return "";
    }

    if (formik.touched[fieldname1][fieldname2][fieldname3] &&
        formik.errors[fieldname1][fieldname2][fieldname3]) {
        return "is-invalid";
    }
    if (formik.touched[fieldname1][fieldname2][fieldname3] &&
        !formik.errors[fieldname1][fieldname2][fieldname3]) {
        return "is-valid";
    }
    return "";
};