import React from "react";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import * as wager_feeds from "../redux/reducers";
import sportNameIcon from '../../../../helpers/sportNameIcon';

class WagerFeedDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            wager_feed: null,
        }
    }

    componentDidMount() {
        const { id } = this.state;
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    render() {
        const { loading, wager_feed, } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && wager_feed == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}

                    {!loading && wager_feed && <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Wager Feed Detail</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Amount</th>
                                            <td>{wager_feed.wager_feed} {wager_feed.userId.currency}</td>
                                            <th>User</th>
                                            <td>{wager_feed.userId.username}</td>
                                        </tr>
                                        <tr>
                                            <th>Pick Name</th>
                                            <td>{wager_feed.pickName}</td>
                                            <th>Sport</th>
                                            <td><i className={`${sportNameIcon(wager_feed.lineQuery.sportName) || 'fas fa-trophy'}`} />&nbsp;{wager_feed.lineQuery.sportName}</td>
                                        </tr>
                                        <tr>
                                            <th>Match Start Date</th>
                                            <td>{this.getDate(wager_feed.matchStartDate)}</td>
                                            <th>Event</th>
                                            <td>{`${wager_feed.teamA.name} vs ${wager_feed.teamB.name}`}</td>
                                        </tr>
                                        <tr>
                                            <th>Team A</th>
                                            <td>{wager_feed.teamA.name}</td>
                                            <th>Odd</th>
                                            <td>{wager_feed.teamA.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Team B</th>
                                            <td>{wager_feed.teamB.name}</td>
                                            <th>Odd</th>
                                            <td>{wager_feed.teamB.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Line</th>
                                            {wager_feed.lineQuery.type == "moneyline" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-danger label-inline font-weight-lighter mr-2">{wager_feed.lineQuery.type}</span></td>}
                                            {wager_feed.lineQuery.type == "spread" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-info label-inline font-weight-lighter mr-2">{wager_feed.lineQuery.type}</span></td>}
                                            {wager_feed.lineQuery.type == "total" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-success label-inline font-weight-lighter mr-2">{wager_feed.lineQuery.type}</span></td>}
                                            <th>House</th>
                                            <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">PPW</span></td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            {wager_feed.status == "Pending" && <td scope="col"><span className="label label-danger label-inline font-weight-lighter mr-2">Pending</span></td>}
                                            {wager_feed.status == "Partial Match" && <td scope="col"><span className="label label-warning label-inline font-weight-lighter mr-2">Partial&nbsp;Match</span></td>}
                                            {wager_feed.status == "Matched" && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Matched</span></td>}
                                            {wager_feed.status == "Cancelled" && <td scope="col"><span className="label label-info label-inline font-weight-lighter mr-2">Cancelled</span></td>}
                                            {wager_feed.status == "Settled - Lose" && <td scope="col"><span className="label label-danger label-inline font-weight-lighter mr-2">Lose</span></td>}
                                            {wager_feed.status == "Settled - Win" && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Win</span></td>}
                                            <th>Match</th>
                                            {(wager_feed.status == "Matched" || wager_feed.status == "Partial Match" || wager_feed.status == "Pending") && <td scope="col"><span className="label label-info label-inline font-weight-lighter mr-2">Open</span></td>}
                                            {(wager_feed.status == "Settled - Win" || wager_feed.status == "Settled - Lose" || wager_feed.status == "Cancelled") && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Settled</span></td>}
                                        </tr>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <td scope="col">{wager_feed.transactionID}</td>
                                            <th>Created</th>
                                            <td scope="col">{this.getDate(wager_feed.createdAt)}</td>
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

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, wager_feeds)(WagerFeedDetail)