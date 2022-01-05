import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { getInputClasses } from "../../helpers/getInputClasses";
import { changePassword } from "../redux/services";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resMsg: null,
            isSuccess: false,
            isError: false,
            initialValues: {
                oldPassword: '',
                changepassword: '',
                password: '',
            },
            schema: Yup.object().shape({
                oldPassword: Yup.string()
                    .required("Password is required"),
                password: Yup.string()
                    .required("Password is required")
                    .min(8, "Password should be longer than 8 characters."),
                changepassword: Yup.string()
                    .required("Please confirm password.")
                    .when("password", {
                        is: (val) => (val && val.length > 0 ? true : false),
                        then: Yup.string().oneOf(
                            [Yup.ref("password")],
                            "Password and Confirm Password didn't match"
                        ),
                    }),
            }),
        }
    }

    onSubmit = (values, formik) => {
        this.setState({ resMsg: null, isSuccess: false, isError: false, });
        changePassword(values)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ isSuccess: true, resMsg: 'Password changed.' });
                } else {
                    this.setState({ isError: true, resMsg: data.error });
                }
                formik.setSubmitting(false);
            })
            .catch((error) => {
                formik.setSubmitting(false);
                this.setState({ isError: true, resMsg: "Can't Change password" });
            });
    }

    render() {
        const { initialValues, schema, resMsg, isSuccess, isError } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <h3 className="card-label">Change Admin Password</h3>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <Formik
                            validationSchema={schema}
                            initialValues={initialValues}
                            onSubmit={this.onSubmit}
                        >
                            {(formik) => {
                                return <form className="col-md-6" onSubmit={formik.handleSubmit}>
                                    {isSuccess && <label className="text-success">{resMsg}</label>}
                                    {isError && <label className="text-danger">{resMsg}</label>}
                                    <div className="form-group">
                                        <label>Old Password<span className="text-danger">*</span></label>
                                        <input name="oldPassword" type="password" placeholder="Enter Old password"
                                            className={`form-control ${getInputClasses(formik, "oldPassword")}`}
                                            {...formik.getFieldProps("oldPassword")}
                                        />
                                        {formik.touched.oldPassword && formik.errors.oldPassword ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.oldPassword}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Password<span className="text-danger">*</span></label>
                                        <input name="password" type="password" placeholder="Enter password"
                                            className={`form-control ${getInputClasses(formik, "password")}`}
                                            {...formik.getFieldProps("password")}
                                        />
                                        {formik.touched.password && formik.errors.password ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.password}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password<span className="text-danger">*</span></label>
                                        <input name="changepassword" type="password" placeholder="Enter password"
                                            className={`form-control ${getInputClasses(formik, "changepassword")}`}
                                            {...formik.getFieldProps("changepassword")}
                                        />
                                        {formik.touched.changepassword && formik.errors.changepassword ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.changepassword}
                                            </div>
                                        ) : null}
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-4" disabled={formik.isSubmitting}>Change Password</button>
                                </form>
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePassword