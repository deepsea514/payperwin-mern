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
            editId: null,
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

    setEditId = (bet) => {
        this.setState({
            editId: bet._id,
            initialValues: {
                user: {
                    value: bet.userId._id,
                    label: bet.userId.username
                },
                budget: bet.budget,
                maxRisk: bet.maxRisk,
                peorid: bet.peorid,
                priority: bet.priority,
                sports: bet.sports.map(sport => ({ value: sport, label: sport })),
                status: bet.status
            }
        })
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

                <td>{this.getStatus(bet.status)}</td>
                <td>{this.getDateFormat(bet.createdAt)}</td>
                <td>
                    <DropdownButton title="Actions">
                        <Dropdown.Item onClick={() => this.setEditId(bet)}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.setState({ deleteId: bet._id })}><i className="fas fa-trash"></i>&nbsp; Delete Autobet</Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        ));
    }

    getStatus = (status) => {
        if (status === AutoBetStatus.active)
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">{status}</span>
        return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">{status}</span>

    }

    onPageChange = (page) => {
        const { getAutoBetsAction, currentPage } = this.props;
        if (page != currentPage)
            getAutoBetsAction(page);
    }

    addAutoBetUser = (values, formik) => {
        const { getAutoBetsAction } = this.props;
        const autobet = {
            ...values,
            userId: values.user.value,
            sports: values.sports.map(sport => sport.value)
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

    editAutoBetUser = (values, formik) => {
        const autobet = {
            ...values,
            sports: values.sports.map(sport => sport.value)
        };
        delete autobet.user;
        
        const { editId: editId } = this.state;
        const { updateAutoBetSuccess } = this.props;
        updateAutoBet(editId, autobet)
            .then(({ data }) => {
                formik.setSubmitting(false);
                updateAutoBetSuccess(editId, data);
                this.setState({ modal: true, editId: null, resMessage: "Successfully changed!", modalvariant: "success" });
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, editId: null, resMessage: "Modification Failed!", modalvariant: "danger" });
            })
    }

    renderStatus = () => {
        return Object.keys(AutoBetStatus).map(function (key, index) {
            return <option key={AutoBetStatus[key]} value={AutoBetStatus[key]}>{AutoBetStatus[key]}</option>
        });
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
        const { perPage, addModal, modal, resMessage, modalvariant, editId: editId,
            initialValues, deleteId } = this.state;
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

                {editId && <AutoBetModal
                    show={editId != null}
                    onHide={() => this.setState({ editId: null })}
                    title="Edit AutoBet User"
                    edit={true}
                    initialValues={initialValues}
                    onSubmit={this.editAutoBetUser}
                />}

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