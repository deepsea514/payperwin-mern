import React from "react"
import { Link } from "react-router-dom";
import * as events from "../redux/reducers";
import { connect } from "react-redux";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { cancelEvent, editEvent, settleEvent } from "../redux/services";
import SettleEventModal from '../components/SettleEventModal';
import config from "../../../../../../config.json";
const EventStatus = config.EventStatus;

class Events extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 25,
            cancelId: null,
            approveId: null,
            settleId: null,
            modal: false,
            resMessage: '',
            modalvariant: ''
        };
    }

    componentDidMount() {
        const { getEvents } = this.props;
        getEvents();
    }

    tableBody = () => {
        const { events, loading } = this.props;

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
        if (events.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Events</h3>
                    </td>
                </tr>
            );
        }

        return events.map((event, index) => (
            <tr key={index}>
                <td>{event.name}</td>
                <td>{event.uniqueid}</td>
                <td>{event.user?.email}</td>
                <td>{dateformat(new Date(event.startDate), "ddd, mmm dd, yyyy, h:MM TT")}</td>
                <td>{dateformat(new Date(event.endDate), "ddd, mmm dd, yyyy, h:MM TT")}</td>
                <td>{this.getVisible(event.public)}</td>
                <td>{this.getApproved(event.approved)}</td>
                <td>{this.getStatus(event)}</td>
                <td><Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                        <Dropdown.Item as={Link} to={`/detail/${event._id}`}><i className="fas fa-eye"></i>&nbsp; View Detail</Dropdown.Item>
                        {this.isSettleEnabled(event) && <Dropdown.Item onClick={() => this.setState({ approveId: event._id })}><i className="fas fa-angle-double-right"></i>&nbsp; Approve Event</Dropdown.Item>}
                        {this.isSettleEnabled(event) && <Dropdown.Item onClick={() => this.setState({ settleId: event })}><i className="fas fa-check"></i>&nbsp; Settle Event</Dropdown.Item>}
                        {this.isSettleEnabled(event) && <Dropdown.Item onClick={() => this.setState({ cancelId: event._id })}><i className="fas fa-trash"></i>&nbsp; Cancel Event</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>
                </td>
            </tr>
        ));
    }

    isSettleEnabled(event) {
        // if ((new Date(event.endDate)).getTime() > (new Date()).getTime())
        //     return false;
        if (event.status == EventStatus['settled'].value || event.status == EventStatus['cancelled'].value)
            return false;
        return true;
    }

    getStatus = (event) => {
        if (event.status == EventStatus['settled'].value)
            return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{EventStatus['settled'].label}</span>
        if (event.status == EventStatus['cancelled'].value)
            return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{EventStatus['cancelled'].label}</span>
        if ((new Date(event.startDate)).getTime() > (new Date()).getTime())
            return <span className="label label-lg label-light-primary label-inline font-weight-lighter mr-2">{EventStatus['pending'].label}</span>
        return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">{EventStatus['outdated'].label}</span>
    }

    getVisible = (visiblity) => {
        if (visiblity)
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Publiuc</span>
        return <span className="label label-lg label-primary label-inline font-weight-lighter mr-2">Private</span>
    }

    getApproved = (approved) => {
        if (approved)
            return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Approved</span>
        return <span className="label label-lg label-outline-primary label-inline font-weight-lighter mr-2">Pending</span>
    }

    onFilterChange = (filter) => {
        this.props.filterEventChange(filter);
    }

    renderStatus = () => {
        return Object.keys(EventStatus).map(function (key) {
            return <option key={key} value={key}>{EventStatus[key].label}</option>
        });
    }

    onPageChange = (page) => {
        const { currentPage, getEvents } = this.props;
        if (page != currentPage)
            getEvents(page);
    }

    cancelEvent = () => {
        const { getEvents } = this.props;
        const { cancelId } = this.state;
        cancelEvent(cancelId)
            .then(() => {
                getEvents();
                this.setState({ modal: true, cancelId: null, resMessage: "Successfully cancelled!", modalvariant: "success" });
            })
            .catch(() => {
                this.setState({ modal: true, cancelId: null, resMessage: "Cancel Failed!", modalvariant: "danger" });
            })
    }

    approveEvent = () => {
        const { getEvents } = this.props;
        const { approveId } = this.state;
        editEvent(approveId, { approved: true })
            .then(() => {
                getEvents();
                this.setState({ modal: true, approveId: null, resMessage: "Successfully approved!", modalvariant: "success" });
            })
            .catch(() => {
                this.setState({ modal: true, approveId: null, resMessage: "Cancel Failed!", modalvariant: "danger" });
            })
    }

    onSettleEvent = (values, formik) => {
        const { settleId } = this.state;
        const { getEvents } = this.props;
        settleEvent(settleId._id, values)
            .then(() => {
                getEvents();
                this.setState({ modal: true, settleId: null, resMessage: "Successfully settled!", modalvariant: "success" });
            })
            .catch(() => {
                this.setState({ modal: true, settleId: null, resMessage: "Settle Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, cancelId, approveId, modal, resMessage, modalvariant, settleId } = this.state;
        const { total, currentPage, filter } = this.props;
        let totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Event</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-3 col-md-4">
                                    <select
                                        className="form-control"
                                        value={filter.status}
                                        onChange={e => {
                                            this.onFilterChange({ status: e.target.value });
                                        }} >
                                        <option value="">Choose Status...</option>
                                        {this.renderStatus()}
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Status
                                    </small>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name Of Event</th>
                                            <th scope="col">Unique Id</th>
                                            <th scope="col">Creator</th>
                                            <th scope="col">Start Date/Time</th>
                                            <th scope="col">End Date/Time</th>
                                            <th scope="col">Visiblity</th>
                                            <th scope="col">Approved</th>
                                            <th scope="col">Status</th>
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
                        <Modal show={cancelId != null} onHide={() => this.setState({ cancelId: null })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Do you want to cancel this event?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({ cancelId: null })}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.cancelEvent}>
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={approveId != null} onHide={() => this.setState({ approveId: null })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Do you want to approve this event?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({ approveId: null })}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.approveEvent}>
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
                        {settleId != null && <SettleEventModal event={settleId}
                            show={settleId != null}
                            onHide={() => this.setState({ settleId: null })}
                            onSubmit={this.onSettleEvent} />}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    events: state.events.events,
    loading: state.events.loading,
    total: state.events.total,
    currentPage: state.events.currentPage,
    filter: state.events.filter,
})

export default connect(mapStateToProps, events.actions)(Events)