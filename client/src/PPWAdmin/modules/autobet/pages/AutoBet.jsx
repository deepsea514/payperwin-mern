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
import numberFormat from "../../../../helpers/numberFormat";
import config from "../../../../../../config.json";
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
                    label: `${bet.userId.email} (${bet.userId.firstname} ${bet.userId.lastname})`
                },
                budget: bet.budget,
                sportsbookBudget: bet.sportsbookBudget ? bet.sportsbookBudget : 0,
                maxRisk: bet.maxRisk,
                priority: bet.priority,
                sports: bet.sports.map(sport => ({ value: sport, label: sport })),
                side: bet.side.map(side => ({ value: side, label: side })),
                betType: bet.betType.map(betType => ({ value: betType, label: betType })),
                status: bet.status,
                referral_code: bet.referral_code ? bet.referral_code : '',
                rollOver: bet.rollOver,
                acceptParlay: bet.acceptParlay ? bet.acceptParlay : false,
                parlayBudget: bet.parlayBudget ? bet.parlayBudget : 0,
                usersExcluded: bet.usersExcluded ? bet.usersExcluded.map(user => ({
                    value: user._id,
                    label: `${user.email} (${user.firstname} ${user.lastname})`
                })) : [],
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
                <td>{bet.userId ? <Link to={`/users/${bet.userId._id}/profile/overview`}>{bet.userId.email}</Link> : null}</td>
                <td>{bet.sports.join(', ')}</td>
                <td>{bet.side.join(', ')}</td>
                <td>{bet.betType.join(', ')}</td>
                <td>{this.getRollOver(bet.rollOver)}</td>
                <td>{bet.priority}</td>
                <td>{numberFormat(bet.maxRisk)}</td>
                <td>{numberFormat(bet.budget)} / {bet.hold}</td>
                <td>{numberFormat(bet.sportsbookBudget ? bet.sportsbookBudget : 0)} / {numberFormat(bet.sbhold ? bet.sbhold : 0)}</td>
                <td>{this.getRollOver(bet.acceptParlay)}</td>
                <td>{numberFormat(bet.parlayBudget ? bet.parlayBudget : 0)} / {numberFormat(bet.parlayhold ? bet.parlayhold : 0)}</td>
                <td>{bet.userId ? numberFormat(bet.userId.balance) : null}</td>
                <td>{bet.referral_code}</td>
                <td>{this.getStatus(bet.status)}</td>
                <td>{this.getDateFormat(bet.createdAt)}</td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item onClick={() => this.setEditId(bet)}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ deleteId: bet._id })}><i className="fas fa-trash"></i>&nbsp; Delete Autobet</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    getStatus = (status) => {
        if (status === AutoBetStatus.active)
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">{status}</span>
        return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">{status}</span>
    }

    getRollOver = (rollOver) => {
        if (rollOver)
            return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Yes</span>
        return <span className="label label-lg label-outline-danger label-inline font-weight-lighter mr-2">No</span>
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
            usersExcluded: values.user.usersExcluded.map(user => user.value),
            sports: values.sports.map(sport => sport.value),
            side: values.side.map(side => side.value),
            betType: values.betType.map(betType => betType.value),
        };
        delete autobet.user;
        createAutoBet(autobet)
            .then(({ data }) => {
                formik.setSubmitting(false);
                if (data.success) {
                    this.setState({ modal: true, addModal: false, resMessage: "Successfully added!", modalvariant: "success" });
                    getAutoBetsAction();
                } else {
                    this.setState({ modal: true, addModal: false, resMessage: data.message, modalvariant: "danger" });
                }
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            })
    }

    editAutoBetUser = (values, formik) => {
        const autobet = {
            ...values,
            sports: values.sports.map(sport => sport.value),
            side: values.side.map(side => side.value),
            betType: values.betType.map(betType => betType.value),
            usersExcluded: values.usersExcluded.map(user => user.value),
        };
        delete autobet.user;

        const { editId: editId } = this.state;
        const { getAutoBetsAction } = this.props;
        updateAutoBet(editId, autobet)
            .then(({ data }) => {
                formik.setSubmitting(false);
                getAutoBetsAction();
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
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Sports</th>
                                            <th scope="col">Side</th>
                                            <th scope="col">Bet Type</th>
                                            <th scope="col">Roll Over</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col">Max.Risk</th>
                                            <th scope="col">P2P&nbsp;Budget / Hold</th>
                                            <th scope="col">SB&nbsp;Budget / Hold</th>
                                            <th scope="col">Accept Parlay</th>
                                            <th scope="col">Parlay&nbsp;Budget / Hold</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">Ref Code</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
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