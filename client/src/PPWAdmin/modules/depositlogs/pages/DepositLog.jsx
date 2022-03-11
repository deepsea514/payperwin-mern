import React, { createRef } from "react";
import * as depositlogs from "../redux/reducers";
import { connect } from "react-redux";
import dateformat from "dateformat";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { deleteDeposit, updateDeposit, getDepositLogAsCSV } from "../redux/services";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import { getInputClasses } from "../../../../helpers/getInputClasses";
import CustomDatePicker from "../../../../components/customDatePicker";
import config from "../../../../../../config.json";
const FinancialStatus = config.FinancialStatus;
const PaymentMethod = config.PaymentMethod;

class DepositLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            resMessage: '',
            modalvariant: "success",
            deleteId: null,
            statusSchema: Yup.object().shape({
                status: Yup.string()
                    .required("Status field is required"),
            }),
            initialValues: { status: '' },
            editStatusId: null,
            perPage: 25,
            depositDownloadData: []
        };
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getDepositLog, report, filterDepositChange } = this.props;
        if (report) {
            filterDepositChange({ status: FinancialStatus.success });
        }
        else {
            getDepositLog();
        }
    }

    tableBody = () => {
        const { depositlogs, loading, topHistory } = this.props;

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
        if (depositlogs.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Deposit Logs</h3>
                    </td>
                </tr>
            );
        }

        return depositlogs.map((log, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{log.amount}</td>
                    <td>{log.user ? <a style={{ cursor: 'pointer' }} className="text-primary" onClick={() => topHistory.push(`/users/${log.user._id}/profile/overview`)}>{log.user.email}</a> : null}</td>
                    <td>{log.method}</td>
                    <td>{this.getFinancialStatus(log.status)}</td>
                    <td>{log.reason ? log.reason.title : null}</td>
                    <td>{log.uniqid}</td>
                    <td>{dateformat(new Date(log.createdAt), "mediumDate")}</td>
                    <td>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item onClick={() => this.setState({ editStatusId: log._id, initialValues: { status: log.status } })}><i className="fas fa-check"></i>&nbsp; Change Status</Dropdown.Item>
                                {log.status !== FinancialStatus.success && <Dropdown.Item onClick={() => this.setState({ deleteId: log._id })}><i className="fas fa-trash"></i>&nbsp; Delete Log</Dropdown.Item>}
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            )
        })
    }

    getFinancialStatus = (status) => {
        switch (status) {
            case FinancialStatus.pending:
                return <span className="label label-lg label-light-primary label-inline">{status}</span>
            case FinancialStatus.success:
                return <span className="label label-lg label-light-success label-inline">{status}</span>
            case FinancialStatus.onhold:
                return <span className="label label-lg label-light-warning label-inline">{status}</span>
            case FinancialStatus.approved:
            default:
                return <span className="label label-lg label-light-info label-inline">{status}</span>

        }
    }

    deleteLog = () => {
        const { deleteId } = this.state;
        const { getDepositLog } = this.props;
        deleteDeposit(deleteId).then(() => {
            this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
            getDepositLog();
        }).catch(() => {
            this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
        });
    }

    changeStatus = (values, formik) => {
        const { editStatusId } = this.state;
        const { updateDepositStatusSuccess } = this.props;
        formik.setSubmitting(true);
        updateDeposit(editStatusId, values).then(({ data }) => {
            updateDepositStatusSuccess(editStatusId, data);
            this.setState({ modal: true, editStatusId: null, resMessage: "Successfully changed!", modalvariant: "success" });
        }).catch(() => {
            this.setState({ modal: true, editStatusId: null, resMessage: "Modification Failed!", modalvariant: "danger" });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    renderStatus = () => {
        return Object.keys(FinancialStatus).map(function (key, index) {
            return <option key={FinancialStatus[key]} value={FinancialStatus[key]}>{FinancialStatus[key]}</option>
        });
    }

    onFilterChange = (filter) => {
        this.props.filterDepositChange(filter);
    }

    renderMethods = () => {
        return PaymentMethod.map(method => <option key={method} value={method}>{method}</option>)
    }

    onPageChange = (page) => {
        const { currentPage, getDepositLog } = this.props;
        if (page != currentPage)
            getDepositLog(page);
    }

    downloadCSV = () => {
        const { filter } = this.props;
        getDepositLogAsCSV(filter)
            .then(async ({ data }) => {
                await this.setState({ depositDownloadData: data });
                this.csvRef.current.link.click();
            })
    }

    render() {
        const { modal, resMessage, modalvariant, deleteId, statusSchema, depositDownloadData,
            initialValues, editStatusId, perPage, } = this.state;
        const { total, currentPage, filter, report } = this.props;
        let totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-12 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Deposit Log</h3>
                                </div>
                                <div className="card-toolbar">
                                    <CSVLink
                                        data={depositDownloadData}
                                        filename='deposit-report.csv'
                                        className='hidden'
                                        ref={this.csvRef}
                                        target='_blank'
                                    />
                                    <button className="btn btn-success font-weight-bolder font-size-sm mr-2" onClick={this.downloadCSV}>
                                        <i className="fas fa-download"></i>&nbsp; Download as CSV
                                    </button>
                                    {report != true && <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm">
                                        <i className="fas fa-credit-card"></i>&nbsp; Add New Deposit
                                    </Link>}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-lg-2 col-md-3">
                                        <CustomDatePicker
                                            className="form-control"
                                            placeholderText="Search"
                                            selected={filter.datefrom ? new Date(filter.datefrom) : null}
                                            onChange={date => {
                                                this.onFilterChange({ datefrom: date });
                                            }} />
                                        <small className="form-text text-muted">
                                            <b>Search</b> From
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <CustomDatePicker
                                            className="form-control"
                                            placeholderText="Search"
                                            selected={filter.dateto ? new Date(filter.dateto) : null}
                                            onChange={date => {
                                                this.onFilterChange({ dateto: date });
                                            }} />
                                        <small className="form-text text-muted">
                                            <b>Search</b> To
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <select
                                            className="form-control"
                                            value={filter.status}
                                            onChange={e => {
                                                this.onFilterChange({ status: e.target.value });
                                            }}
                                            disabled={report == true}
                                        >
                                            <option value="">Choose Status...</option>
                                            {this.renderStatus()}
                                        </select>
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Status
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <select
                                            className="form-control"
                                            value={filter.method}
                                            onChange={e => {
                                                this.onFilterChange({ method: e.target.value });
                                            }} >
                                            <option value="">Choose Method...</option>
                                            {this.renderMethods()}
                                        </select>
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Method
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="number"
                                            value={filter.minamount}
                                            className="form-control"
                                            name="searchMaxAmount"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ minamount: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Min Amount
                                        </small>
                                    </div>
                                    <div className="col-lg-2 col-md-3">
                                        <input
                                            type="number"
                                            value={filter.maxamount}
                                            className="form-control"
                                            name="searchMaxAmount"
                                            placeholder="Search"
                                            onChange={(e) => {
                                                this.onFilterChange({ maxamount: e.target.value });
                                            }}
                                        />
                                        <small className="form-text text-muted">
                                            <b>Search</b> by Max Amount
                                        </small>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">User</th>
                                                <th scope="col">Method</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Reason</th>
                                                <th scope="col">Deposit ID</th>
                                                <th scope="col">Date</th>
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
                </div>

                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete this log?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteLog}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={editStatusId != null} onHide={() => this.setState({ editStatusId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Deposit status</Modal.Title>
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
                                                className={`form-control ${getInputClasses(formik, "status")}`}
                                                {...formik.getFieldProps("status")}
                                            >
                                                <option value="">Choose status ...</option>
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
                </Modal>

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
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    depositlogs: state.depositlog.depositlogs,
    loading: state.depositlog.loading,
    total: state.depositlog.total,
    currentPage: state.depositlog.currentPage,
    filter: state.depositlog.filter,
})

export default connect(mapStateToProps, depositlogs.actions)(DepositLog)