import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import config from "../../../../config.json";
import { getInputClasses } from "../../helpers/getInputClasses";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

class GenerateToken extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qrcode: null,
            errMsg: null,
            initialValues: {
                password: '',
            },
            schema: Yup.object().shape({
                password: Yup.string()
                    .required("Password is required"),
            }),
        }
    }

    onSubmit = (values, formik) => {
        this.setState({ qrcode: null, errMsg: null, });
        axios.post(`${serverUrl}/generateAuthCode`, values, { withCredentials: true })
            .then(({ data }) => {
                if (data.qrcode) {
                    this.setState({ qrcode: data.qrcode });
                } else {
                    this.setState({ errMsg: data.error });
                }
                formik.setSubmitting(false);
            })
            .catch((error) => {
                formik.setSubmitting(false);
                this.setState({ qrcode: null, errMsg: "Can't generate QRCODE" });
            });
    }

    render() {
        const { initialValues, schema, qrcode, errMsg } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <h3 className="card-label">Generate Token</h3>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <Formik
                                validationSchema={schema}
                                initialValues={initialValues}
                                onSubmit={this.onSubmit}
                            >
                                {(formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        {errMsg && <label className="text-danger">{errMsg}</label>}
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
                                            <button type="submit" className="btn btn-primary mt-4" disabled={formik.isSubmitting}>Regenerate</button>
                                        </div>
                                    </form>
                                }}
                            </Formik>
                        </div>
                        <div className="col-md-6">
                            {qrcode && <img src={qrcode} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GenerateToken