import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
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
        }).catch(() => {
            this.setState({ loading: false });
        })
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    getPPWBetDogFav = (bet, pick) => {
        const { teamA, teamB, pick: betPick } = bet;
        if (!pick) pick = betPick;
        if (!teamA) return;
        const oddsA = Number(teamA.odds);
        const oddsB = Number(teamB.odds);

        if (oddsA == oddsB) {
            if (pick == 'away') {
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
            }
        } else {
            if ((oddsA < oddsB) && pick == 'home' || (oddsA > oddsB) && pick == 'away') {
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
            }
        }
        return <span className="label label-lg label-outline-warning label-inline font-weight-lighter mr-2">Underdog</span>
    }

    getPPWBetType = (type) => {
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}</span>
            case "total":
            default:
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
        }
    }

    getPPWBetStatus = (status) => {
        switch (status) {
            case "Pending":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">Pending</span>
            case "Partial Match":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial&nbsp;Match</span>
            case "Matched":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Matched</span>
            case "Cancelled":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">Cancelled</span>
            case "Settled - Lose":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Lose</span>
            case "Settled - Win":
            default:
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
        }
    }

    getPinnacleBetType = (type) => {
        switch (type.toLowerCase()) {
            case "single":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "parlay":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}</span>
            case "teaser":
            default:
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
        }
    }

    getPInnacleBetStatus = (status) => {
        switch (status) {
            case "BETTED":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">BETTED</span>
            case "ACCEPTED":
                return <span className="label label-lg label-light-primary label-inline font-weight-lighter mr-2">ACCEPTED</span>
            case "SETTLED":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">SETTLED</span>
            case "CANCELLED":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">SETTLED</span>
            case "REJECTED":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">REJECTED</span>
            case "ROLLBACKED":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">ROLLBACKED</span>
            case "UNSETTLED":
            default:
                return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">UNSETTLED</span>
        }
    }

    getPPWBetMatch = (status) => {
        switch (status) {
            case "Pending":
            case "Partial Match":
            case "Matched":
                return <span className="label label-lg label-info label-inline font-weight-lighter mr-2">Open</span>
            case "Cancelled":
            case "Settled - Lose":
            case "Settled - Win":
            default:
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Settled</span>
        }
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
                                {bet.house == 'ppw' && <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Amount</th>
                                            <td>{bet.bet} {bet.userId.currency}</td>
                                            <th>User</th>
                                            <td>{bet.userId.username}</td>
                                        </tr>
                                        <tr>
                                            <th>Pick Name</th>
                                            <td>{bet.pickName} {this.getPPWBetDogFav(bet)}</td>
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
                                            <td>{bet.teamA.name} {this.getPPWBetDogFav(bet, 'home')}</td>
                                            <th>Odd</th>
                                            <td>{bet.teamA.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Team B</th>
                                            <td>{bet.teamB.name} {this.getPPWBetDogFav(bet, 'away')}</td>
                                            <th>Odd</th>
                                            <td>{bet.teamB.odds}</td>
                                        </tr>
                                        <tr>
                                            <th>Line</th>
                                            <td scope="col" style={{ textTransform: "uppercase" }}>{this.getPPWBetType(bet.lineQuery.type)}</td>
                                            <th>House</th>
                                            <td scope="col"><span className="label label-lg label-success label-inline font-weight-lighter mr-2">PPW</span></td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td scope="col">{this.getPPWBetStatus(bet.status)}</td>
                                            <th>Match</th>
                                            <td scope="col">{this.getPPWBetMatch(bet.status)}</td>
                                        </tr>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <td scope="col">{bet.transactionID}</td>
                                            <th>Created</th>
                                            <td scope="col">{this.getDate(bet.createdAt)}</td>
                                        </tr>
                                    </tbody>
                                </table>}

                                {bet.house == 'pinnacle' && <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Amount</th>
                                            <td>{bet.WagerInfo.ToRisk} {bet.userId.currency}</td>
                                            <th>User</th>
                                            <td>{bet.userId.username}</td>
                                        </tr>
                                        <tr>
                                            <th>Pick Name</th>
                                            <td>{bet.WagerInfo.SelectionType}</td>
                                            <th>Sport</th>
                                            <td>{bet.WagerInfo.Sport}</td>
                                        </tr>
                                        <tr>
                                            <th>Match Start Date</th>
                                            <td>{this.getDate(bet.WagerInfo.EventDateFm)}</td>
                                            <th>Event</th>
                                            <td>{
                                                bet.WagerInfo.Legs ?
                                                    bet.WagerInfo.Legs.map(leg => {
                                                        return <p key={leg.EventName}>{leg.EventName}</p>
                                                    }) :
                                                    bet.WagerInfo.EventName}</td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td scope="col" style={{ textTransform: "uppercase" }}>{this.getPinnacleBetType(bet.WagerInfo.Type)}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td scope="col">{this.getPInnacleBetStatus(bet.Name)}</td>
                                            <th>House</th>
                                            <td scope="col"><span className="label label-lg label-success label-inline font-weight-lighter mr-2">Pinnacle</span></td>
                                        </tr>
                                        <tr>
                                            <th>Wager ID</th>
                                            <td scope="col">{bet.WagerInfo.WagerId}</td>
                                            <th>Created</th>
                                            <td scope="col">{this.getDate(bet.createdAt)}</td>
                                        </tr>
                                    </tbody>
                                </table>}
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

export default BetDetail