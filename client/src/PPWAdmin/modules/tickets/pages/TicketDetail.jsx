import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { getTicketDetail, replyTicket, archiveTicket } from "../redux/services";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import { Formik } from "formik";
import SVG from "react-inlinesvg";
import { Button, Modal } from "react-bootstrap";
import { getInputClasses } from "../../../../helpers/getInputClasses";

class TicketDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            ticket: null,
            emailSchema: Yup.object().shape({
                title: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Title is required."),
                subject: Yup.string()
                    .min(3, "Minimum 3 symbols")
                    .max(50, "Maximum 50 symbols")
                    .required("Subject is required."),
                content: Yup.string()
                    .required("Content is required."),
            }),
            initialValues: {
                title: '',
                subject: '',
                content: '',
            },
            isSuccess: false,
            isError: false,
            archive: false,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getTicketDetail(id).then(({ data }) => {
            this.setState({ ticket: data, loading: false });
        }).catch(() => {
            this.setState({ loading: false });
        })
    }

    getDate = (date) => {
        if (!date) return '';
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    createMarkup = (description) => {
        return { __html: description };
    }

    archiveTicket = () => {
        const { id } = this.state;
        const { history } = this.props;
        archiveTicket(id)
            .then(() => {
                history.push('/');
            })
            .catch(() => {

            })
    }

    onSubmit = (values, formik) => {
        const { id, ticket } = this.state;
        formik.setSubmitting(true);
        this.setState({ isSuccess: false, isError: false });
        replyTicket(id, values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({
                    ticket: {
                        ...ticket,
                        repliedAt: new Date()
                    },
                    isSuccess: true,
                });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ isError: true });
            })
    }

    render() {
        const { loading, ticket, initialValues, emailSchema, isSuccess, isError, archive } = this.state;
        const config = {
            readonly: false,
            height: 300
        };
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && ticket == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}

                    {!loading && ticket && <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Ticket Detail</h3>
                            </div>
                            <div className="card-toolbar">
                                <button className="btn btn-danger mr-2" onClick={() => this.setState({ archive: true })}>Archive this ticket</button>
                                <Link to="/" className="btn btn-secondary">Cancel</Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>From Email</th>
                                            <td>{ticket.email}</td>
                                            <th>Phone</th>
                                            <td>{ticket.phone}</td>
                                        </tr>
                                        <tr>
                                            <th>Subject</th>
                                            <td>{ticket.subject}</td>
                                            <th>Department</th>
                                            <td>{ticket.department}</td>
                                        </tr>
                                        <tr>
                                            <th>Submitted At</th>
                                            <td>{this.getDate(ticket.createdAt)}</td>
                                            <th>Replied At</th>
                                            <td>{this.getDate(ticket.repliedAt)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3" dangerouslySetInnerHTML={this.createMarkup(ticket.description)} />

                            {ticket.file && <>
                                <h5>Attached Image</h5>
                                <img src={`data:${ticket.file.contentType};base64,${ticket.file.data}`} />
                            </>}

                            {!ticket.repliedAt && <>
                                <hr className="mt-3" />
                                <Formik
                                    validationSchema={emailSchema}
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
                                                        Can't send email. Please try again later
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
                                                        Email sent to customer.
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

                                            <h5>Reply email</h5>
                                            <div className="form-row form-group">
                                                <div className="col">
                                                    <label>Title<span className="text-danger">*</span></label>
                                                    <input type="text" name="title"
                                                        className={`form-control ${getInputClasses(formik, "title")}`}
                                                        {...formik.getFieldProps("title")}
                                                        placeholder="Title" />
                                                    {formik.touched.title && formik.errors.title ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.title}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="col">
                                                    <label>Subject<span className="text-danger">*</span></label>
                                                    <input type="text" name="subject"
                                                        className={`form-control ${getInputClasses(formik, "subject")}`}
                                                        {...formik.getFieldProps("subject")}
                                                        placeholder="Subject" />
                                                    {formik.touched.subject && formik.errors.subject ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.subject}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="form-row form-group">
                                                <div className="col">
                                                    <label>Content<span className="text-danger">*</span></label>
                                                    <JoditEditor
                                                        config={config}
                                                        name="content"
                                                        tabIndex={1} // tabIndex of textarea
                                                        {...formik.getFieldProps("content")}
                                                        {...{
                                                            onChange: (content) => {
                                                                formik.setFieldError("content", false);
                                                                formik.setFieldTouched("content", true);
                                                                formik.setFieldValue("content", content);
                                                            },
                                                            onBlur: (content) => {
                                                                formik.setFieldError("content", false);
                                                                formik.setFieldTouched("content", true);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>Send reply email</button>
                                            </div>
                                        </form>
                                    }}
                                </Formik>
                            </>}

                        </div>
                    </div>}
                    <Modal show={archive} onHide={() => this.setState({ archive: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Do you want to archive this ticket?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ archive: false })}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={this.archiveTicket}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default TicketDetail