import React from "react"
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Formik, FieldArray, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import { addEvent } from "../redux/services";

const years = _.range(1950, (new Date()).getFullYear() + 1, 1);
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

class Candidate {
    constructor() {
        this.name = "";
        this.odds = 0;
    }
}

export default class CreateEvents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isError: false,
            isSuccess: false,
            initialvalues: {
                name: "",
                startDate: "",
                candidates: [
                    { name: '', odds: 0 },
                    { name: '', odds: 0 }
                ],
            },
            eventSchema: Yup.object().shape({
                name: Yup.string()
                    .required("Event Name is required."),
                startDate: Yup.string()
                    .required("Start Date is required."),
                candidates: Yup.array()
                    .of(
                        Yup.object().shape({
                            name: Yup.string().required("Candidate Name is required."),
                            odds: Yup.number().required("Odds is required."),
                        })
                    )
                    .min(2, "Candidates should be at least 2."),
            }),
        };
    }

    getInputClasses = (formik, fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }
        return "";
    };

    getInputClassesInArray = (formik, fieldname, index, childfieldname) => {
        if (!formik.touched[fieldname] ||
            !formik.touched[fieldname][index] ||
            !formik.errors[fieldname] ||
            !formik.errors[fieldname][index]) {
            return "";
        }

        if (formik.touched[fieldname][index][childfieldname] &&
            formik.errors[fieldname][index][childfieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname][index][childfieldname] &&
            !formik.errors[fieldname][index][childfieldname]) {
            return "is-valid";
        }
        return "";
    };

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
        const { initialvalues, eventSchema, isError, isSuccess } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <Formik
                        validationSchema={eventSchema}
                        initialValues={initialvalues}
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
                                                    className={`form-control ${this.getInputClasses(
                                                        formik,
                                                        "name"
                                                    )}`}
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
                                                <DatePicker
                                                    name="startDate"
                                                    className={`form-control ${this.getInputClasses(
                                                        formik,
                                                        "startDate"
                                                    )}`}
                                                    showTimeSelect
                                                    renderCustomHeader={({
                                                        date,
                                                        changeYear,
                                                        changeMonth,
                                                        decreaseMonth,
                                                        increaseMonth,
                                                        prevMonthButtonDisabled,
                                                        nextMonthButtonDisabled
                                                    }) => (
                                                        <div
                                                            style={{
                                                                margin: 10,
                                                                display: "flex",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                                {"<"}
                                                            </button>
                                                            <select
                                                                value={(new Date(date)).getFullYear()}
                                                                onChange={({ target: { value } }) => changeYear(value)}
                                                            >
                                                                {years.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select
                                                                value={months[(new Date(date)).getMonth()]}
                                                                onChange={({ target: { value } }) =>
                                                                    changeMonth(months.indexOf(value))
                                                                }
                                                            >
                                                                {months.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                                {">"}
                                                            </button>
                                                        </div>
                                                    )}
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
                                        <FieldArray
                                            name="candidates"
                                            render={({ insert, remove, push }) => (
                                                <>
                                                    <div className={`mb-1 ${this.getInputClasses(
                                                        formik,
                                                        "candidates"
                                                    )}`}>
                                                        {values.candidates.length > 0 &&
                                                            values.candidates.map((friend, index) => (
                                                                <div className="form-row" key={index}>
                                                                    <div className="form-group col-md-6">
                                                                        <label>Candidate Name <span className="text-danger">*</span></label>
                                                                        <Field
                                                                            className={`form-control 
                                                                        ${this.getInputClassesInArray(
                                                                                formik,
                                                                                `candidates`, index, `name`
                                                                            )}`}
                                                                            name={`candidates.${index}.name`}
                                                                            placeholder="name"
                                                                            type="text"
                                                                        />
                                                                        {errors &&
                                                                            errors.candidates &&
                                                                            errors.candidates[index] &&
                                                                            errors.candidates[index].name &&
                                                                            touched &&
                                                                            touched.candidates &&
                                                                            touched.candidates[index] &&
                                                                            touched.candidates[index].name && (
                                                                                <div className="invalid-feedback">
                                                                                    {errors.candidates[index].name}
                                                                                </div>
                                                                            )}
                                                                    </div>

                                                                    <div className="form-group col-md-6">
                                                                        <label>Odds <span className="text-danger">*</span></label>
                                                                        <div className={`input-group
                                                                        ${this.getInputClassesInArray(
                                                                            formik,
                                                                            `candidates`, index, `odds`
                                                                        )}`}
                                                                        >
                                                                            <Field
                                                                                className={`form-control ${this.getInputClassesInArray(
                                                                                    formik,
                                                                                    `candidates`, index, `odds`
                                                                                )}`}
                                                                                name={`candidates.${index}.odds`}
                                                                                placeholder="odds"
                                                                            />
                                                                            <div className="input-group-append">
                                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => remove(index)}>
                                                                                    <i className="fa fa-times text-danger"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {errors &&
                                                                            errors.candidates &&
                                                                            errors.candidates[index] &&
                                                                            errors.candidates[index].odds &&
                                                                            touched &&
                                                                            touched.candidates &&
                                                                            touched.candidates[index] &&
                                                                            touched.candidates[index].odds && (
                                                                                <div className="invalid-feedback">
                                                                                    {errors.candidates[index].odds}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        <div className="form-group col-md-12">
                                                            <button className="btn btn-success btn-sm" type="button" onClick={() => push(new Candidate())}>
                                                                Add a Candidate
                                                        </button>
                                                        </div>
                                                    </div>
                                                    {errors &&
                                                        _.isString(errors.candidates) &&
                                                        touched &&
                                                        _.isArray(touched.candidates) && (
                                                            <div className="invalid-feedback">{errors.candidates}</div>
                                                        )}
                                                </>
                                            )}
                                        />
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