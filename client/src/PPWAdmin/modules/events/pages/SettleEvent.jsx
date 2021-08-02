import React from "react"
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import { settleEvent, getEvent } from "../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class SettleEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isError: false,
            isSuccess: false,
            event: null,
            initialValues: null,
            loading: false,
            scoreSchema: Yup.object().shape({
                teamAScore: Yup.number().required("Team A Score is required."),
                teamBScore: Yup.number().required("Team B Score is required."),
            }),
        };
    }

    componentDidMount() {
        const { match: { params: { id } } } = this.props;
        this.setState({ initialValues: null, loading: true });
        getEvent(id)
            .then(({ data }) => {
                const initialValues = {
                    teamAScore: 0,
                    teamBScore: 0,
                }
                this.setState({ initialValues: initialValues, loading: false, event: data });
            })
            .catch(() => {
                this.setState({ initialValues: null, loading: true, event: null });
            });
    }

    onSubmit = (values, formik) => {
        const { history, match: { params: { id } } } = this.props;
        settleEvent(id, values).then(() => {
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
        const { initialValues, scoreSchema, isError, isSuccess, loading, event } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}
                    {initialValues && !loading && <Formik
                        validationSchema={scoreSchema}
                        initialValues={initialValues}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => {
                            const { values, errors, touched, isSubmitting, setFieldValue, getFieldProps, setFieldTouched } = formik;
                            return <Form>
                                <div className="card card-custom gutter-b">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <h3 className="card-label">Settle Event ({event.name})</h3>
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
                                                    Can't save changes
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
                                                    Successfully Saved.
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
                                                <label>Team A Score <span className="text-danger">*</span></label>
                                                <input name="teamAScore" placeholder="Team A Score"
                                                    className={`form-control ${getInputClasses(formik, "teamAScore")}`}
                                                    {...getFieldProps("teamAScore")}
                                                />
                                                {errors &&
                                                    errors &&
                                                    errors.teamAScore &&
                                                    touched &&
                                                    touched.teamAScore && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamAScore}
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label>Team B Score <span className="text-danger">*</span></label>
                                                <input name="teamBScore" placeholder="Team B Score"
                                                    className={`form-control ${getInputClasses(formik, "teamBScore")}`}
                                                    {...getFieldProps("teamBScore")}
                                                />
                                                {errors &&
                                                    errors &&
                                                    errors.teamBScore &&
                                                    touched &&
                                                    touched.teamBScore && (
                                                        <div className="invalid-feedback">
                                                            {errors.teamBScore}
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
                    </Formik>}
                </div>
            </div>
        );
    }
}