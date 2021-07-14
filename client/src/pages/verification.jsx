import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setMeta } from '../libs/documentTitleBuilder';
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { Button } from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { withStyles } from "@material-ui/core/styles";
import DocumentMeta from 'react-document-meta';
import { getInputClasses } from "../helpers/getInputClasses";

import config from "../../../config.json";
const serverUrl = config.appUrl;

const useStyles = (theme) => ({
    formContent: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    formbutton: {
        marginTop: theme.spacing(3),
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
});

class Verification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            address: "required",
            identification: "required",
            verifyFormSchema: Yup.object().shape({
                address: Yup.string()
                    .required("Address field is required"),
                address2: Yup.string(),
                city: Yup.string()
                    .required("City field is required"),
                postalcode: Yup.string()
                    .required("Postal Code is required"),
                phone: Yup.string()
                    .required("Phone Number is required."),
            }),
            addressInfo: null,
            submitError: false,
            submitSuccess: false,
            metaData: null,
        }
    }

    componentDidMount() {
        const title = 'Customer Verification';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        axios.get(`${serverUrl}/checkverified`, { withCredentials: true })
            .then(({ data }) => {
                const { verify_submitted } = data;
                const { address, identification } = verify_submitted;
                this.setState({
                    address: address ? "submitted" : "required",
                    identification: identification ? "submitted" : "required",
                });
            });

        axios.get(`${serverUrl}/address`, { withCredentials: true })
            .then(({ data }) => {
                if (data.address && data.address != '')
                    this.setState({ addressInfo: data, submitSuccess: true });
            })
    }

    handleFileUpload = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            return;
        }
        this.setState({ [name]: 'submitting' });

        let data = new FormData();
        data.append(name, file, file.name);

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            withCredentials: true,
        }
        axios.post(`${serverUrl}/verification`, data, config)
            .then(() => {
                this.setState({ [name]: 'submitted' });
            })
            .catch(() => {
                this.setState({ [name]: 'error' });
            });
    }

    clickUpload = (field) => {
        if (this.state[field] == 'submitted' || this.state[field] == 'submitting')
            return;
        this.refs[field].click();
    }

    onSubmit = (values, formik) => {
        this.setState({ submitSuccess: false, submitError: false });
        axios.post(`${serverUrl}/verification`, values, { withCredentials: true })
            .then(() => {
                this.setState({ submitSuccess: true, addressInfo: values });
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ submitError: true });
                formik.setSubmitting(false);
            })
    }

    render() {
        const { user, classes } = this.props;
        const { address, identification, addressInfo, verifyFormSchema, submitSuccess, submitError, metaData } = this.state;
        const initialValues = {
            address: (addressInfo ? addressInfo.address : ''),
            address2: (addressInfo ? addressInfo.address2 : ''),
            city: (addressInfo ? addressInfo.city : ''),
            postalcode: (addressInfo ? addressInfo.postalcode : ''),
            phone: (addressInfo ? addressInfo.phone : ''),
        };
        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
                <h3>Verification</h3>
                {user && user.roles.verified && <p>You already verified your identify.</p>}
                {user && !user.roles.verified && <div className="main-cnt">
                    <p className="text-black">
                        Please follow the instruction and upload copies of the documents we support.
                        The document must be smaller than 5MB.
                        Verifying your account can take up to 72 hours after submission.
                    </p>
                    <div className="bg-color-box pad10">
                        <h4>ADDRESS INFORMATION</h4>
                        {!submitSuccess && <Formik
                            initialValues={initialValues}
                            validationSchema={verifyFormSchema}
                            onSubmit={this.onSubmit}>
                            {
                                (formik) => {
                                    return <form onSubmit={formik.handleSubmit}>
                                        {submitError && <p className="text-danger">Can't submit information. Please try again.</p>}
                                        <Form.Group>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder="Enter Address"
                                                required
                                                className={`form-control ${getInputClasses(formik, "address")}`}
                                                {...formik.getFieldProps("address")}
                                            />
                                            {formik.touched.address && formik.errors.address ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.address}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Address 2 (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address2"
                                                placeholder="Enter 2nd Address"
                                                required
                                                className={`form-control ${getInputClasses(formik, "address2")}`}
                                                {...formik.getFieldProps("address2")}
                                            />
                                            {formik.touched.address2 && formik.errors.address2 ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.address2}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                placeholder="Enter City"
                                                required
                                                className={`form-control ${getInputClasses(formik, "city")}`}
                                                {...formik.getFieldProps("city")}
                                            />
                                            {formik.touched.city && formik.errors.city ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.city}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="postalcode"
                                                placeholder="Enter Postal Code"
                                                required
                                                className={`form-control ${getInputClasses(formik, "postalcode")}`}
                                                {...formik.getFieldProps("postalcode")}
                                            />
                                            {formik.touched.postalcode && formik.errors.postalcode ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.postalcode}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Phone Number</Form.Label>
                                            <PhoneInput
                                                type="text"
                                                name="phone"
                                                placeholder="Enter Phone Number"
                                                containerClass="input-group"
                                                dropdownClass="input-group-append"
                                                inputClass={`form-control ${getInputClasses(formik, "phone")}`}
                                                required
                                                value={formik.values.phone}
                                                {...formik.getFieldProps("phone")}
                                                {...{
                                                    onChange: (phone) => {
                                                        formik.setFieldTouched('phone', true);
                                                        formik.setFieldValue('phone', phone);
                                                    },
                                                    onBlur: () => {
                                                        formik.setFieldTouched('phone', true);
                                                    }
                                                }}
                                            />
                                            {formik.touched.phone && formik.errors.phone ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.phone}
                                                </div>
                                            ) : null}
                                        </Form.Group>
                                        <div className={classes.formbutton}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={formik.isSubmitting}
                                                className={classes.button}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                }
                            }
                        </Formik>}
                        {submitSuccess && <>
                            <p>Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.address}</p>
                            <p>Address&nbsp;2:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.address2}</p>
                            <p>City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.city}</p>
                            <p>Postal&nbsp;Code:&nbsp;&nbsp;{addressInfo.postalcode}</p>
                            <p>Phone:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{addressInfo.phone}</p>

                            <h6>Address Information is already submitted. If you want to submit again, <strong style={{ cursor: "pointer" }} onClick={() => this.setState({ submitSuccess: null })}>Click Here!</strong></h6>
                        </>}

                        <h4 className="mt-3">DOCUMENT STATUS</h4>
                        <br />
                        <p className="verification-items" onClick={() => this.clickUpload('address')}>
                            Address verification
                            &nbsp;{address == 'required' && <span className="badge badge-primary">REQUIRED</span>}
                            &nbsp;{address == 'submitting' && <img src="/images/loading.gif" className="m-0" width="16" height="16" />}
                            &nbsp;{address == 'submitted' && <span className="badge badge-success">SUBMITTED</span>}
                            &nbsp;{address == 'error' && <span className="badge badge-danger">SUBMIT FAILED, PLEASE TRY AGAIN</span>}
                        </p>
                        <input ref="address" name="address" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />

                        <p className="verification-items" onClick={() => this.clickUpload('identification')}>
                            Personal identification verification
                            &nbsp;{identification == 'required' && <span className="badge badge-primary">REQUIRED</span>}
                            &nbsp;{identification == 'submitting' && <img src="/images/loading.gif" className="m-0" width="16" height="16" />}
                            &nbsp;{identification == 'submitted' && <span className="badge badge-success">SUBMITTED</span>}
                            &nbsp;{identification == 'error' && <span className="badge badge-danger">SUBMIT FAILED, PLEASE TRY AGAIN</span>}
                        </p>
                        <input ref="identification" name="identification" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />
                    </div>
                </div>}
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles, { withTheme: true })(Verification));