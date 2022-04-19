import React, { createRef } from "react";
import { Link } from "react-router-dom";
import * as withdrawlogs from "../redux/reducers";
import { connect } from "react-redux";
import dateformat from "dateformat";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { deleteWithdraw, getWithdrawLogAsCSV, updateWithdraw } from "../redux/services";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import { getInputClasses } from "../../../../helpers/getInputClasses";
import CustomDatePicker from "../../../../components/customDatePicker";
import config from "../../../../../../config.json";
const FinancialStatus = config.FinancialStatus;
const PaymentMethod = config.PaymentMethod;

class WithdrawLog extends React.Component {
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
                _2fa_code: Yup.string()
                    .required("2FA code field is required")
            }),
            initialValues: { status: '', _2fa_code: '' },
            editStatusId: null,
            perPage: 25,
            withdrawDownloadData: []
        };
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getWithdrawLog, report, filterWithdrawChange } = this.props;
        if (report) {
            filterWithdrawChange({ status: FinancialStatus.success });
        }
        else {
            getWithdrawLog();
        }
    }

    tableBody = () => {
        const { withdrawlogs, loading, topHistory } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="10" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (withdrawlogs.length == 0) {
            return (
                <tr>
                    <td colSpan="10" align="center">
                        <h3>No Withdraw Logs</h3>
                    </td>
                </tr>
            );
        }
        return withdrawlogs.map((log, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{Number(log.amount).toFixed(2)}</td>
                    <td>{log.user ? <a style={{ cursor: 'pointer' }} className="text-primary" onClick={() => topHistory.push(`/users/${log.user._id}/profile/overview`)}>{log.user.email}</a> : null}</td>
                    <td>{log.method}</td>
                    <td>{this.getFinancialStatus(log.status)}</td>
                    <td>{log.uniqid}</td>
                    <td>{log.note}</td>
                    <td>{dateformat(new Date(log.createdAt), "mediumDate")}</td>
                    <td>
                        {log.status !== FinancialStatus.success && <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item onClick={() => this.setState({ editStatusId: log._id, initialValues: { status: log.status, _2fa_code: '' } })}><i className="fas fa-check"></i>&nbsp; Change Status</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: log._id })}><i className="fas fa-trash"></i>&nbsp; Delete Log</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>}
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
        const { getWithdrawLog } = this.props;
        deleteWithdraw(deleteId).then(() => {
            this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
            getWithdrawLog();
        }).catch(() => {
            this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
        });
    }

    changeStatus = (values, formik) => {
        const { editStatusId } = this.state;
        const { getWithdrawLog, currentPage } = this.props;
        formik.setSubmitting(true);
        updateWithdraw(editStatusId, values).then(({ data }) => {
            getWithdrawLog(currentPage);
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

    renderMethods = () => {
        return PaymentMethod.map(method => <option key={method} value={method}>{method}</option>)
    }

    onPageChange = (page) => {
        const { currentPage } = this.props;
        if (page != currentPage)
            this.props.getCustomers(page);
    }

    onFilterChange = (filter) => {
        this.props.filterWithdrawChange(filter);
    }

    downloadCSV = () => {
        const { filter } = this.props;
        getWithdrawLogAsCSV(filter)
            .then(async ({ data }) => {
                await this.setState({ withdrawDownloadData: data });
                this.csvRef.current.link.click();
            })
    }

    render() {
        const { modal, resMessage, modalvariant, deleteId, statusSchema,
            initialValues, editStatusId, perPage, withdrawDownloadData } = this.state;
        const { total, currentPage, filter, report } = this.props;
        let totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Withdraw Log</h3>
                                </div>
                                <div className="card-toolbar">
                                    <CSVLink
                                        data={withdrawDownloadData}
                                        filename='withdraw-report.csv'
                                        className='hidden'
                                        ref={this.csvRef}
                                        target='_blank'
                                    />
                                    <button className="btn btn-success font-weight-bolder font-size-sm mr-2" onClick={this.downloadCSV}>
                                        <i className="fas fa-download"></i>&nbsp; Download as CSV
                                    </button>
                                    {report != true && <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm">
                                        <i className="fas fa-credit-card"></i>&nbsp; Manual Withdraw
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
                                            disabled={report == true}>
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
                                                <th scope="col">Withdraw ID</th>
                                                <th scope="col">Note</th>
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
                        <Modal.Title>Change Withdraw status</Modal.Title>
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
                                        <div className="form-group">
                                            <label>2FA Code<span className="text-danger">*</span></label>
                                            <input name="_2fa_code" placeholder="Enter 2FA Code"
                                                className={`form-control ${getInputClasses(formik, "_2fa_code")}`}
                                                {...formik.getFieldProps("_2fa_code")}
                                            />
                                            {formik.touched._2fa_code && formik.errors._2fa_code ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors._2fa_code}
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
    withdrawlogs: state.withdrawlog.withdrawlogs,
    loading: state.withdrawlog.loading,
    total: state.withdrawlog.total,
    currentPage: state.withdrawlog.currentPage,
    filter: state.withdrawlog.filter,
})

export default connect(mapStateToProps, withdrawlogs.actions)(WithdrawLog)