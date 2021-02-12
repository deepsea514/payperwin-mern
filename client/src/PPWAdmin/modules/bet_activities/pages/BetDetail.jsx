import React from "react";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import * as bet_activities from "../redux/reducers";
import { getBetDetail } from "../redux/services";
import sportNameIcon from '../../../../helpers/sportNameIcon';

class BetDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            bet: null,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getBetDetail(id).then(({ data }) => {
            this.setState({ bet: data, loading: false });
            console.log(data);
        }).catch(() => {
            this.setState({ loading: false });
        })
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    render() {
        const { loading, bet, } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && bet == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}

                    {!loading && bet && <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Bet Detail</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Amount</th>
                                            <td>{bet.bet} {bet.userId.currency}</td>
                                            <th>User</th>
                                            <td>{bet.userId.username}</td>
                                        </tr>
                                        <tr>
                                            <th>Pick Name</th>
                                            <td>{bet.pickName}</td>
                                            <th>Sport</th>
                                            <td><i className={`${sportNameIcon(bet.lineQuery.sportName) || 'fas fa-trophy'}`} />&nbsp;{bet.lineQuery.sportName}</td>
                                        </tr>
                                        <tr>
                                            <th>Match Start Date</th>
                                            <td>{this.getDate(bet.matchStartDate)}</td>
                                            <th>Event</th>
                                            <td>{`${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                                        </tr>
                                        <tr>
                                            <th>Team A</th>
                                            <td>{bet.teamA.name}</td>
                                            <th>Odd</th>
                                            <td>{bet.teamA.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Team B</th>
                                            <td>{bet.teamB.name}</td>
                                            <th>Odd</th>
                                            <td>{bet.teamB.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Line</th>
                                            {bet.lineQuery.type == "moneyline" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-danger label-inline font-weight-lighter mr-2">{bet.lineQuery.type}</span></td>}
                                            {bet.lineQuery.type == "spread" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-info label-inline font-weight-lighter mr-2">{bet.lineQuery.type}</span></td>}
                                            {bet.lineQuery.type == "total" && <td scope="col" style={{ textTransform: "uppercase" }}><span className="label label-success label-inline font-weight-lighter mr-2">{bet.lineQuery.type}</span></td>}
                                            <th>House</th>
                                            <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">PPW</span></td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            {bet.status == "Pending" && <td scope="col"><span className="label label-danger label-inline font-weight-lighter mr-2">Pending</span></td>}
                                            {bet.status == "Partial Match" && <td scope="col"><span className="label label-warning label-inline font-weight-lighter mr-2">Partial&nbsp;Match</span></td>}
                                            {bet.status == "Matched" && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Matched</span></td>}
                                            {bet.status == "Cancelled" && <td scope="col"><span className="label label-info label-inline font-weight-lighter mr-2">Cancelled</span></td>}
                                            {bet.status == "Settled - Lose" && <td scope="col"><span className="label label-danger label-inline font-weight-lighter mr-2">Lose</span></td>}
                                            {bet.status == "Settled - Win" && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Win</span></td>}
                                            <th>Match</th>
                                            {(bet.status == "Matched" || bet.status == "Partial Match" || bet.status == "Pending") && <td scope="col"><span className="label label-info label-inline font-weight-lighter mr-2">Open</span></td>}
                                            {(bet.status == "Settled - Win" || bet.status == "Settled - Lose" || bet.status == "Cancelled") && <td scope="col"><span className="label label-success label-inline font-weight-lighter mr-2">Settled</span></td>}
                                        </tr>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <td scope="col">{bet.transactionID}</td>
                                            <th>Created</th>
                                            <td scope="col">{this.getDate(bet.createdAt)}</td>
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

export default connect(mapStateToProps, bet_activities)(BetDetail)