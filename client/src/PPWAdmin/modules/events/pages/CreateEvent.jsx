import React from "react"
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import _ from "lodash";
import { addEvent } from "../redux/services";
import { getInputClasses, getInputClassesInObject } from "../../../../helpers/getInputClasses";
import CustomDatePicker from "../../../../components/customDatePicker";


export default class CreateEvents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isError: false,
            isSuccess: false,
            initialValues: {
                name: "",
                startDate: "",
                teamA: { name: '', odds: 0 },
                teamB: { name: '', odds: 0 },
            },
            eventSchema: Yup.object().shape({
                name: Yup.string()
                    .required("Event Name is required."),
                startDate: Yup.string()
                    .required("Start Date is required."),
                teamA: Yup.object()
                    .shape({
                        name: Yup.string().required("TeamA Name is required."),
                        odds: Yup.number().required("Odds is required."),
                    }),
                teamB: Yup.object()
                    .shape({
                        name: Yup.string().required("TeamB Name is required."),
                        odds: Yup.number().required("Odds is required."),
                    }),
            }),
        };
    }




    onSubmit = (values, formik) => {
        const { history } = this.props;
        addEvent(values).then(() => {
            formik.setSubmitting(false);
            this.setState({ isSuccess: true });
            setTimeout(() => {
                history.push("/");
            }, 2000);
        }).catch(() => {
            formik.setSubmitting(false);
            this.setState({ isError: true });
        })
    }

    render() {
        const { initialValues, eventSchema, isError, isSuccess } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <Formik
                        validationSchema={eventSchema}
                        initialValues={initialValues}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => {
                            const { values, errors, touched, isSubmitting, setFieldValue, getFieldProps, setFieldTouched } = formik;
                            return <Form>
                                <div className="card card-custom gutter-b">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h3 className="card-label">Add a Event</h3>
                                        </div>
                                    </div>
                                    <div className="card-body">
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
                                                    Addition Failed
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
                                                    Successfully Added.
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
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>Event Name <span className="text-danger">*</span></label>
                                                <input name="name" placeholder="Event Name"
                                                    className={`form-control ${getInputClasses(formik, "name")}`}
                                                    {...getFieldProps("name")}
                                                />
                                                {touched.name && errors.name ? (
                                                    <div className="invalid-feedback">
                                                        {errors.name}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Start Date <span className="text-danger">*</span></label>
                                                <CustomDatePicker
                                                    name="startDate"
                                                    className={`form-control ${getInputClasses(formik, "startDate")}`}
                                                    showTimeSelect
                                                    wrapperClassName="input-group"
                                                    selected={values.startDate}
                                                    onChange={(val) => {
                                                        setFieldTouched("startDate", true);
                                                        setFieldValue("startDate", val);
                                                    }}
                                                    placeholder="Enter Birthday"
                                                    required
                                                    dateFormat="MM/dd/yyyy h:mm aa"
                                                />
                                                {touched.startDate && errors.startDate ? (
                                                    <div className="invalid-feedback">
                                                        {errors.startDate}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>TeamA Name <span className="text-danger">*</span></label>
                                                <input name="teamA.name" placeholder="TeamA Name"
                                                    className={`form-control ${getInputClassesInObject(formik, "teamA", "name")}`}
                                                    {...getFieldProps("teamA.name")}
                                                />
                                                {errors &&
                                                    errors.teamA &&
                                                    errors.teamA.name &&
                                                    touched &&
                                                    touched.teamA &&
                                                    touched.teamA.name && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamA.name}
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label>Odds <span className="text-danger">*</span></label>
                                                <input name="teamA.odds" placeholder="TeamA Odds"
                                                    className={`form-control ${getInputClassesInObject(formik, "teamA", "odds")}`}
                                                    {...getFieldProps("teamA.odds")}
                                                />
                                                {errors &&
                                                    errors.teamA &&
                                                    errors.teamA.odds &&
                                                    touched &&
                                                    touched.teamA &&
                                                    touched.teamA.odds && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamA.odds}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label>TeamB Name <span className="text-danger">*</span></label>
                                                <input name="teamB.name" placeholder="TeamB Name"
                                                    className={`form-control ${getInputClassesInObject(formik, "teamB", "name")}`}
                                                    {...getFieldProps("teamB.name")}
                                                />
                                                {errors &&
                                                    errors.teamB &&
                                                    errors.teamB.name &&
                                                    touched &&
                                                    touched.teamB &&
                                                    touched.teamB.name && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamB.name}
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label>Odds <span className="text-danger">*</span></label>
                                                <input name="teamB.odds" placeholder="TeamB Odds"
                                                    className={`form-control ${getInputClassesInObject(formik, "teamB", "odds")}`}
                                                    {...getFieldProps("teamB.odds")}
                                                />
                                                {errors &&
                                                    errors.teamB &&
                                                    errors.teamB.odds &&
                                                    touched &&
                                                    touched.teamB &&
                                                    touched.teamB.odds && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamB.odds}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>Submit</button>
                                        <Link to="/" className="btn btn-secondary">Cancel</Link>
                                    </div>
                                </div>
                            </Form>
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}