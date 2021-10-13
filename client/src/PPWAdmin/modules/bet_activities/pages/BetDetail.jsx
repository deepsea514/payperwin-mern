import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { getBetDetail } from "../redux/services";
import sportNameImage from '../../../../helpers/sportNameImage';
import calculateNewOdds from '../../../../helpers/calculateNewOdds';
import numberFormat from "../../../../helpers/numberFormat";

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

    getBetDogFav = (bet, pick) => {
        const { teamA, teamB, pickName, lineQuery } = bet;
        if (!teamA) return;
        const oddsA = Number(teamA.odds);
        const oddsB = Number(teamB.odds);

        if (lineQuery.type == 'spread') {
            let spreads = pickName.split(' ');
            spreads = Number(spreads[spreads.length - 1]);
            if (spreads < 0) {
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
            }
        } else {
            if (oddsA == oddsB) {
                if (pick == 'away') {
                    return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
                }
            } else {
                if ((oddsA < oddsB) && pick == 'home' || (oddsA > oddsB) && pick == 'away') {
                    return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
                }
            }
        }
        return <span className="label label-lg label-outline-warning label-inline font-weight-lighter mr-2">Underdog</span>
    }

    getBetType = (bet) => {
        const type = bet.origin == 'other' ? 'moneyline' : bet.lineQuery.type;
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
            case 'alternative_spread':
                const spreads = bet.pickName.split(' ');
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}@{spreads[spreads.length - 1]}</span>
            case "total":
            case 'alternative_total':
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
            default:
                return null;
        }
    }

    getBetStatus = (status) => {
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
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
            case "Draw":
                return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">Draw</span>
            case "Accepted":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Accepted</span>
            case "Partial Accepted":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial Accepted</span>
        }
    }

    getBetMatch = (status) => {
        switch (status) {
            case "Cancelled":
            case "Settled - Lose":
            case "Settled - Win":
            case "Draw":
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Settled</span>
            case "Pending":
            case "Partial Match":
            case "Matched":
            case "Accepted":
            case "Partial Accepted":
            default:
                return <span className="label label-lg label-info label-inline font-weight-lighter mr-2">Open</span>
        }
    }

    render() {
        const { loading, bet } = this.state;
        const { newHome, newAway } = bet ? calculateNewOdds(Number(bet.teamA.odds), Number(bet.teamB.odds)) : {};

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
                                            <th>User</th>
                                            <td>{bet.userId.email}</td>
                                            <th>House</th>
                                            <td>{bet.sportsbook ? 'Sportsbook' : 'Peer to Peer'}</td>
                                        </tr>
                                        <tr>
                                            <th>Amount</th>
                                            <td>${numberFormat(bet.bet.toFixed(2))} {bet.userId.currency} (${numberFormat(bet.toWin.toFixed(2))})</td>
                                            {!bet.sportsbook && <>
                                                <th>Matched Amount</th>
                                                <td>${numberFormat(bet.payableToWin.toFixed(2))} {bet.userId.currency}</td>
                                            </>}
                                            <th>Line</th>
                                            <td style={{ textTransform: "uppercase" }}>{this.getBetType(bet)}</td>
                                        </tr>
                                        <tr>
                                            <th>Pick Name</th>
                                            <td>{bet.pickName} @{Number(bet.pickOdds) > 0 ? '+' + bet.pickOdds : bet.pickOdds} {this.getBetDogFav(bet, bet.pick)}</td>
                                            <th>Sport</th>
                                            <td><img src={sportNameImage(bet.lineQuery.sportName)} width="16" height="16" />&nbsp;{bet.lineQuery.sportName}</td>
                                        </tr>
                                        <tr>
                                            <th>Match Start Date</th>
                                            <td>{this.getDate(bet.matchStartDate)}</td>
                                            <th>Event</th>
                                            <td>{bet.origin == 'other' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                                        </tr>
                                        <tr>
                                            <th>Team A</th>
                                            <td>{bet.teamA.name} {this.getBetDogFav(bet, 'home')}</td>
                                            <th>Odd</th>
                                            <td>
                                                {!bet.sportsbook && <span><del>{bet.teamA.odds}</del> <span>{newHome}</span></span>}
                                                {bet.sportsbook && <span>{bet.teamA.odds}</span>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Team B</th>
                                            <td>{bet.teamB.name} {this.getBetDogFav(bet, 'away')}</td>
                                            <th>Odd</th>
                                            <td>
                                                {!bet.sportsbook && <span><del>{bet.teamB.odds}</del> <span>{newAway}</span></span>}
                                                {bet.sportsbook && <span>{bet.teamB.odds}</span>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td scope="col">{this.getBetStatus(bet.status)}</td>
                                            <th>Match</th>
                                            <td scope="col">{this.getBetMatch(bet.status)}</td>
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

export default BetDetail