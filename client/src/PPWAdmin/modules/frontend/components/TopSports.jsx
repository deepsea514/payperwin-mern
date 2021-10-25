import React, { Component } from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import AsyncSelect from 'react-select/async';
import { getFrontendInfo, saveFrontendInfo, searchSports } from '../redux/services';
import { getInputClasses } from "../../../../helpers/getInputClasses";

export default class TopSports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: null,
            loading: false,
            sportsSchema: Yup.object().shape({
                sports: Yup.array().of(Yup.object())
                    .min(1, "Please choose at least a sport"),
            }),
            isError: false,
            isSuccess: false,
            loadingSports: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });

        getFrontendInfo('top_sports')
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    initialValues: data ? {
                        sports: data.value.sports.map(sport => ({
                            label: sport, value: sport
                        }))
                    } : { sports: [] }
                });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null });
            })
    }

    onSubmit = (values, formik) => {
        const submitValue = {
            sports: values.sports.map(sport => sport.value)
        }
        this.setState({ isSuccess: false, isError: false });
        saveFrontendInfo('top_sports', submitValue)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ isSuccess: true });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    getSports = (name, cb) => {
        this.setState({ loadingSports: true });
        searchSports(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingSports: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingSports: false });
        })
    }

    render() {
        const { initialValues, sportsSchema, loading, isError, isSuccess, loadingSports } = this.state;
        return (
            <>
                <h3>Top Sports.</h3>
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                {!loading && !initialValues && <center>
                    <h4>No available Data.</h4>
                </center>}
                {!loading && initialValues && <Formik
                    validationSchema={sportsSchema}
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

                            <div className="form-group">
                                <AsyncSelect
                                    className={`basic-single ${getInputClasses(formik, "sports")}`}
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    isMulti
                                    name="sports"
                                    loadOptions={this.getSports}
                                    noOptionsMessage={() => "No Sports"}
                                    value={formik.values.sports}
                                    isLoading={loadingSports}
                                    {...formik.getFieldProps("sports")}
                                    {...{
                                        onChange: (sports) => {
                                            if (!sports) return;
                                            formik.setFieldValue("sports", sports);
                                            formik.setFieldTouched("sports", true);
                                            formik.setFieldError("sports", false);
                                        },

                                    }}
                                />
                                {formik.touched.sports && formik.errors.sports ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.sports}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-row">
                                <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Save</button>
                            </div>
                        </form>
                    }}
                </Formik>}
            </>
        )
    }
}