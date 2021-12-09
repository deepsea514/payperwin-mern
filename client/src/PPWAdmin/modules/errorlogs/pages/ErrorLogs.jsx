import React, { createRef } from "react";
import * as errorlogs from "../redux/reducers";
import { connect } from "react-redux";
import dateformat from "dateformat";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import "react-datepicker/dist/react-datepicker.css";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { deleteErrorLog } from "../redux/services";

class ErrorLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            modal: false,
            modalvariant: "success",
            resMessage: "",
            deleteId: null
        };
    }

    componentDidMount() {
        const { getErrorLogs } = this.props;
        getErrorLogs();
    }

    tableBody = () => {
        const { errorlogs, loading } = this.props;
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
        if (errorlogs.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Records</h3>
                    </td>
                </tr>
            );
        }

        return errorlogs.map((record, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{dateformat(new Date(record.createdAt), "yyyy-mm-dd HH:MM")}</td>
                    <td>{record.name}</td>
                    <td>{record.stack}</td>
                    <td>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: record.id })}><i className="fas fa-trash"></i>&nbsp; Delete Log</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            )
        })
    }

    onPageChange = (page) => {
        const { getErrorLogs } = this.props;
        getErrorLogs(page);
    }

    deleteLog = () => {
        const { deleteId } = this.state;
        const { getErrorLogs } = this.props;
        deleteErrorLog(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getErrorLogs();
            }).catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, deleteId, modal, modalvariant, resMessage } = this.state;
        const { total, currentPage, name, onErrorLogNameChange } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 col-xxl-12 order-12 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Error Logs</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-lg-3 col-md-4">
                                        <select
                                            value={name}
                                            className="form-control"
                                            onChange={(e) => {
                                                onErrorLogNameChange(e.target.value);
                                            }}
                                        >
                                            <option value=''>...Select Error Type</option>
                                            <option>Bet365 Error</option>
                                            <option>Send Grid Error</option>
                                            <option>Twilio Error</option>
                                            <option>Triple-A Error</option>
                                            <option>PremierPay Error</option>
                                        </select>
                                        <small className="form-text text-muted">
                                            Errors <b>Type</b>
                                        </small>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Time</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Stack</th>
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
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    errorlogs: state.errorlogs.errorlogs,
    loading: state.errorlogs.loading,
    total: state.errorlogs.total,
    currentPage: state.errorlogs.currentPage,
    name: state.errorlogs.name
})

export default connect(mapStateToProps, errorlogs.actions)(ErrorLogs)