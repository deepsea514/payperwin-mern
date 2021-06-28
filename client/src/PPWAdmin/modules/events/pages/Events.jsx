import React from "react"
import { Link } from "react-router-dom";
import * as events from "../redux/reducers";
import { connect } from "react-redux";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import { Dropdown, DropdownButton } from "react-bootstrap";

const config = require("../../../../../../config.json");
const EventStatus = config.EventStatus;

class Events extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 25,
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
                <td>{dateformat(new Date(event.startDate), "default")}</td>
                <td>
                    <p>{event.teamA.name}: {event.teamA.currentOdds}</p>
                    <p>{event.teamB.name}: {event.teamB.currentOdds}</p>
                </td>
                <td></td>
                <td>{this.getStatus(event)}</td>
                <td>
                    <DropdownButton title="Actions">
                        <Dropdown.Item as={Link} to={`/edit/${event._id}`}>
                            <i className="far fa-eye"></i>&nbsp; Edit
                        </Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        ));
    }

    getStatus = (event) => {
        if (event.status == EventStatus['settled'].value)
            return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{EventStatus['settled'].label}</span>
        if (event.status == EventStatus['canceled'].value)
            return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{EventStatus['canceled'].label}</span>
        if ((new Date(event.startDate)).getTime() > (new Date()).getTime())
            return <span className="label label-lg label-light-primary label-inline font-weight-lighter mr-2">{EventStatus['pending'].label}</span>
        return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">{EventStatus['outdated'].label}</span>

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

    render() {
        const { perPage, } = this.state;
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
                            <div className="card-toolbar">
                                <Link to="/add" className="btn btn-success font-weight-bolder font-size-sm">
                                    <i className="fas fa-credit-card"></i>&nbsp; Add New Event
                                </Link>
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
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name Of Event</th>
                                            <th scope="col">Start Date/Time</th>
                                            <th scope="col">Bet Options</th>
                                            <th scope="col">Total Money Bet</th>
                                            <th scope="col">Status</th>
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