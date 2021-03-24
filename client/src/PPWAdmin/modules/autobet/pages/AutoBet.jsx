import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as autobets from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import CustomPagination from "../../../components/CustomPagination.jsx";
import AutoBetModal from "../components/AutoBetModal";
import { createAutoBet, deleteAutoBet, updateAutoBet } from "../redux/services";
import * as Yup from "yup";
import { Formik } from "formik";
const config = require("../../../../../../config.json");
const AutoBetStatus = config.AutoBetStatus;

class AutoBet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            addModal: false,
            modal: false,
            resMessage: "",
            modalvariant: "success",
            deleteId: null,
            editStatusId: null,
            initialValues: null,
            statusSchema: Yup.object().shape({
                status: Yup.string()
                    .required("Status field is required"),
            }),
        }
    }

    componentDidMount() {
        const { getAutoBetsAction } = this.props;
        getAutoBetsAction();
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { autobets, loading } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (autobets.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Info</h3>
                    </td>
                </tr>
            );
        }

        return autobets.map((bet, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{bet.userId.username}</td>
                <td>{bet.priority}</td>
                <td>{bet.maxRisk}</td>
                <td>{bet.budget}</td>
                <td>{bet.userId.balance}</td>

                {bet.status === AutoBetStatus.active && <td><span className="label label-success label-inline font-weight-lighter mr-2">{bet.status}</span></td>}
                {bet.status === AutoBetStatus.inActive && <td><span className="label label-danger label-inline font-weight-lighter mr-2">{bet.status}</span></td>}

                <td>{this.getDateFormat(bet.createdAt)}</td>
                <td>
                    <DropdownButton title="Actions">
                        <Dropdown.Item onClick={() => this.setState({ editStatusId: bet._id, initialValues: { status: bet.status } })}><i className="fas fa-check"></i>&nbsp; Change Status</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.setState({ deleteId: bet._id })}><i className="fas fa-trash"></i>&nbsp; Delete Autobet</Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        ));
    }

    onPageChange = (page) => {
        const { getAutoBetsAction, currentPage } = this.props;
        if (page != currentPage)
            getAutoBetsAction(page);
    }

    addAutoBetUser = (values, formik) => {
        const { getAutoBetsAction } = this.props;
        if (!values.user) {
            formik.setFieldTouched('user', true);
            formik.setFieldError('user', "You should select user");
            formik.setSubmitting(false);
            return;
        }
        const autobet = {
            ...values,
            userId: values.user.value,
        };
        delete autobet.user;
        createAutoBet(autobet)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Successfully added!", modalvariant: "success" });
                getAutoBetsAction();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            })
    }

    renderStatus = () => {
        return Object.keys(AutoBetStatus).map(function (key, index) {
            return <option key={AutoBetStatus[key]} value={AutoBetStatus[key]}>{AutoBetStatus[key]}</option>
        });
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

    changeStatus = (values, formik) => {
        const { editStatusId } = this.state;
        const { updateAutoBetSuccess } = this.props;
        updateAutoBet(editStatusId, values)
            .then(({ data }) => {
                formik.setSubmitting(false);
                updateAutoBetSuccess(editStatusId, data);
                this.setState({ modal: true, editStatusId: null, resMessage: "Successfully changed!", modalvariant: "success" });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, editStatusId: null, resMessage: "Modification Failed!", modalvariant: "danger" });
            })
    }

    deleteAutoBet = () => {
        const { deleteId } = this.state;
        const { getAutoBetsAction } = this.props;
        deleteAutoBet(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getAutoBetsAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, addModal, modal, resMessage, modalvariant, editStatusId,
            initialValues, statusSchema, deleteId } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Auto Bets</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button className="btn btn-success font-weight-bolder font-size-sm" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-users"></i>&nbsp; Add User
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col">Max.Risk</th>
                                            <th scope="col">Budget</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>

                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={currentPage - 1}
                                    totalPages={totalPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <AutoBetModal
                    show={addModal}
                    onHide={() => this.setState({ addModal: false })}
                    title="Add AutoBet User"
                    onSubmit={this.addAutoBetUser}
                />
                <Modal show={modal} onHide={() => this.setState({ modal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resMessage}</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant={modalvariant} onClick={() => this.setState({ modal: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {editStatusId && <Modal show={editStatusId != null} onHide={() => this.setState({ editStatusId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Autobet status</Modal.Title>
                    </Modal.Header>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={statusSchema}
                        onSubmit={this.changeStatus}>
                        {
                            (formik) => {
                                return <form onSubmit={formik.handleSubmit}>
                                    <Modal.Body>
                                        <div className="form-group">
                                            <label>Status<span className="text-danger">*</span></label>
                                            <select name="status" placeholder="Choose Status"
                                                className={`form-control ${this.getInputClasses(
                                                    formik,
                                                    "status"
                                                )}`}
                                                {...formik.getFieldProps("status")}
                                            >
                                                {this.renderStatus()}
                                            </select>
                                            {formik.touched.status && formik.errors.status ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.status}
                                                </div>
                                            ) : null}
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="light-primary" onClick={() => this.setState({ editStatusId: null })}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                            Save
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            }
                        }
                    </Formik>
                </Modal>}

                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete this log?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteAutoBet}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    autobets: state.autobets.autobets,
    loading: state.autobets.loading,
    total: state.autobets.total,
    currentPage: state.autobets.currentPage,
})

export default connect(mapStateToProps, autobets.actions)(AutoBet)