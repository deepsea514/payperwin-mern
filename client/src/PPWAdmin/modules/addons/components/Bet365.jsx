import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getAddon, setAddon } from "../redux/services";
import SVG from "react-inlinesvg";
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class Bet365 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialValues: null,
            bet365Schema: Yup.object().shape({
                bet365ApiKey: Yup.string()
                    .required("Api Key is required"),
            }),
            isError: false,
            isSuccess: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
        getAddon('bet365')
            .then(({ data }) => {
                if (data) {
                    this.setState({ initialValues: data.value, loading: false });
                } else {
                    this.setState({
                        initialValues: {
                            bet365ApiKey: "",
                        }, loading: false
                    });
                }
            })
            .catch(() => {
                this.setState({ initialValues: null, loading: false });
            })
    }

    onSubmit = (values, formik) => {
        this.setState({ isError: false, isError: false, });
        setAddon('bet365', values)
            .then(() => {
                this.setState({ isSuccess: true })
                formik.setSubmitting(false);
            })
            .catch(() => {
                this.setState({ isError: true })
                formik.setSubmitting(false);
            })
    }

    render() {
        const { loading, initialValues, bet365Schema, isError, isSuccess } = this.state;
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between">
                    <h3>Bet365</h3>
                    <img src="/images/bet365.png" style={{ display: 'block', height: '40px', width: 'auto' }} />
                </div>
                {loading && <center className="mt-5"><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} /></center>}
                {!loading && initialValues == null && <h1>No data available</h1>}
                {!loading && initialValues && <Formik
                    validationSchema={bet365Schema}
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}
                >
                    {(formik) => {
                        return <form onSubmit={formik.handleSubmit} className="p-3">
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
                                        Update Failed
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
                                        Successfully Updated.
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

                            <div className="form-group">
                                <label>Bet365 Api Key<span className="text-danger">*</span></label>
                                <input type="text" name="bet365ApiKey" className={`form-control ${getInputClasses(formik, "bet365ApiKey")}`}
                                    {...formik.getFieldProps("bet365ApiKey")}
                                    placeholder="Bet364 Api Key" />
                                {formik.touched.bet365ApiKey && formik.errors.bet365ApiKey ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.bet365ApiKey}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Submit</button>
                            </div>
                        </form>
                    }}
                </Formik>}
            </div>
        )
    }
}