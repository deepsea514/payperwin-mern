import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { getEventDetail } from "../redux/services";
import config from "../../../../../../config.json";
import { convertOddsToAmerican } from "../../../../helpers/convertOdds";
const EventStatus = config.EventStatus;

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            event: null,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getEventDetail(id).then(({ data }) => {
            this.setState({ event: data, loading: false });
        }).catch(() => {
            this.setState({ loading: false });
        })
    }

    getDate = (date) => {
        return dateformat(new Date(date), "ddd mmm dd yyyy HH:MM");
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

    render() {
        const { loading, event } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && event == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}

                    {!loading && event && <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Event Detail</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>User</th>
                                            <td>{event.user.email}</td>
                                            <th>Name</th>
                                            <td>{event.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Start Date</th>
                                            <td>{this.getDate(event.startDate)}</td>
                                            <th>End Date</th>
                                            <td>{this.getDate(event.endDate)}</td>
                                        </tr>
                                        <tr>
                                            <th>Maximum Risk</th>
                                            <td>${event.maximumRisk} CAD</td>
                                            <th>Visiblity</th>
                                            <td>{this.getVisible(event.public)}</td>
                                        </tr>
                                        <tr>
                                            <th>Approved</th>
                                            <td>{this.getApproved(event.approved)}</td>
                                            <th>Status</th>
                                            <td>{this.getStatus(event.status)}</td>
                                        </tr>
                                        <tr>
                                            <th>Created At</th>
                                            <td>{this.getDate(event.createdAt)}</td>
                                            <th>Options</th>
                                            <td>
                                                <ul style={{ listStyle: 'initial' }}>
                                                    {event.options.map((option, index) => (
                                                        <li key={index}>{option.value}@ {convertOddsToAmerican(option.odds, event.odds_type)}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default EventDetail