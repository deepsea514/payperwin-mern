import React, { createRef } from "react"
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { createAdmin } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";

class CreateAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues: {
                email: '',
                username: '',
                password: '',
                confirmpassword: '',
                role: '',
            },
            adminSchema: Yup.object().shape({
                email: Yup.string()
                    .email("Email is not correct")
                    .required("Email is required"),
                username: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Name is required."),
                password: Yup.string()
                    .min(3, "Minimum 8 symbols")
                    .required("Password is required."),
                confirmpassword: Yup.string()
                    .required("Please confirm password.")
                    .when("password", {
                        is: (val) => (val && val.length > 0 ? true : false),
                        then: Yup.string().oneOf(
                            [Yup.ref("password")],
                            "Password and Confirm Password didn't match"
                        ),
                    }),
                role: Yup.string()
                    .required("Role is required."),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
    }

    onSubmit = (values, formik) => {
        const { history } = this.props;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        createAdmin(values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    history.push("/");
                }, 2000);
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    render() {
        const { initialValues, adminSchema, isError, isSuccess } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Create a New Admin</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <Formik
                                validationSchema={adminSchema}
                                initialValues={initialValues}
                                onSubmit={this.onSubmit}
                            >
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        {isError && (
                                            <div
                                                className="alert alert-custom alert-light-danger fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-danger">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Can't create admin
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div
                                                className="alert alert-custom alert-light-success fade show mb-10"
                                                role="alert"
                                            >
                                                <div className="alert-icon">
                                                    <span className="svg-icon svg-icon-3x svg-icon-success">
                                                        <SVG
                                                            src={"/media/svg/icons/Code/Info-circle.svg"}
                                                        ></SVG>{" "}
                                                    </span>
                                                </div>
                                                <div className="alert-text font-weight-bold">
                                                    Successfully Created.
                                                </div>
                                                <div className="alert-close" onClick={() => this.setState({ isSuccess: false })}>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">
                                                            <i className="ki ki-close"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Email<span className="text-danger">*</span></label>
                                                <input type="text" name="email"
                                                    className={`form-control ${getInputClasses(formik, "email")}`}
                                                    {...formik.getFieldProps("email")}
                                                    placeholder="Email" />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.email}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Name<span className="text-danger">*</span></label>
                                                <input type="text" name="username"
                                                    className={`form-control ${getInputClasses(formik, "username")}`}
                                                    {...formik.getFieldProps("username")}
                                                    placeholder="Name" />
                                                {formik.touched.username && formik.errors.username ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.username}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col">
                                                <label>Password</label>
                                                <input type="password" name="password"
                                                    className={`form-control ${getInputClasses(formik, "password")}`}
                                                    {...formik.getFieldProps("password")}
                                                    placeholder="Password" />
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.password}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col">
                                                <label>Confirm Password</label>
                                                <input type="password" name="confirmpassword"
                                                    className={`form-control ${getInputClasses(formik, "confirmpassword")}`}
                                                    {...formik.getFieldProps("confirmpassword")}
                                                    placeholder="Confirm Password" />
                                                {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.confirmpassword}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row form-group">
                                            <div className="col-6">
                                                <label>Role</label>
                                                <select type="text" name="role"
                                                    className={`form-control ${getInputClasses(formik, "role")}`}
                                                    {...formik.getFieldProps("role")}>
                                                    <option value="">Please select a role</option>
                                                    <option value="Customer Service">Customer Service</option>
                                                    <option value="Super Admin">Super Admin</option>
                                                </select>
                                                {formik.touched.role && formik.errors.role ? (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.role}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Create Admin</button>
                                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                                        </div>
                                    </form>
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateAdmin;