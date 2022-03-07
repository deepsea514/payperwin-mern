import React from "react";
import { Modal, Button } from "react-bootstrap";
import dateformat from "dateformat";
import sportNameImage from '../../../../helpers/sportNameImage';
import calculateNewOdds from '../../../../helpers/calculateNewOdds';
import numberFormat from "../../../../helpers/numberFormat";

export default class BetDetailModal extends React.Component {
    getDate = (date) => {
        return dateformat(new Date(date), "ddd mmm dd yyyy HH:MM");
    }

    getBetType = (bet) => {
        if (bet.isParlay) {
            return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">parlay</span>
        }
        const type = bet.origin == 'custom' ? 'moneyline' : bet.lineQuery.type;
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
            case "alternative_spread":
                const spreads = bet.pickName.split(' ');
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}@{spreads[spreads.length - 1]}</span>
            case "total":
            case "alternative_total":
            case "home_total":
            case "away_total":
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
            case "Win":
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
            case "Lose":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Lose</span>
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
        const { bet, show, onHide } = this.props;

        return (
            <Modal show={show} onHide={onHide} size="lg">
                <div className="card card-custom gutter-b text-left">
                    <div className="card-body">
                        <div className="">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>User</th>
                                        <td>{bet.userId.email}</td>
                                        <th>House</th>
                                        <td>{bet.isParlay ? 'Parlay' : bet.sportsbook ? 'HIGH STAKER' : 'Peer to Peer'}</td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td>${numberFormat(bet.bet.toFixed(2))} {bet.userId.currency} (${numberFormat(bet.toWin.toFixed(2))})</td>
                                        <th>Matched Amount</th>
                                        <td>${numberFormat(bet.payableToWin ? bet.payableToWin.toFixed(2) : 0)} {bet.userId.currency}</td>
                                    </tr>
                                    <tr>
                                        <th>Line</th>
                                        <td style={{ textTransform: "uppercase" }}>{this.getBetType(bet)}</td>
                                    </tr>
                                    {(() => {
                                        if (bet.isParlay) {
                                            return <tr>
                                                <th>Detail</th>
                                                <td>
                                                    {bet.parlayQuery.map((query, index) => {
                                                        const { newHome, newAway } = calculateNewOdds(Number(query.teamA.odds), Number(query.teamB.odds), query.lineQuery.type, query.lineQuery.subtype);
                                                        return (
                                                            <ul key={index}>
                                                                <li><b>Line {index + 1}</b></li>
                                                                <li><b>Game: {query.teamA.name} vs {query.teamB.name} </b></li>
                                                                <li>Pick Name: {query.pickName}</li>
                                                                <li>Sport: <img src={sportNameImage(query.lineQuery.sportName)} width="16" height="16" />&nbsp;{query.lineQuery.sportName}</li>
                                                                <li>Match Date: {this.getDate(query.matchStartDate)}</li>
                                                                <li>Team A: {query.teamA.name} @{newHome}</li>
                                                                <li>Team B: {query.teamB.name} @{newAway}</li>
                                                                {query.status && <li>{this.getBetStatus(query.status)}</li>}
                                                            </ul>
                                                        )
                                                    })}
                                                </td>
                                            </tr>
                                        }
                                        if (bet.origin == 'custom') {
                                            return (
                                                <>
                                                    <tr>
                                                        <th>Pick Name</th>
                                                        <td>{bet.pickName}</td>
                                                        <th>Sport</th>
                                                        <td><img src={sportNameImage(bet.lineQuery.sportName)} width="16" height="16" />&nbsp;{bet.lineQuery.sportName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Match Start Date</th>
                                                        <td>{this.getDate(bet.matchStartDate)}</td>
                                                        <th>Event</th>
                                                        <td>{bet.lineQuery.eventName}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                        const { newHome, newAway } = calculateNewOdds(Number(bet.teamA.odds), Number(bet.teamB.odds), bet.lineQuery.type, bet.lineQuery.subtype);
                                        return <>
                                            <tr>
                                                <th>Pick Name</th>
                                                <td>{bet.pickName} @{Number(bet.pickOdds) > 0 ? '+' + bet.pickOdds : bet.pickOdds}</td>
                                                <th>Sport</th>
                                                <td><img src={sportNameImage(bet.lineQuery.sportName)} width="16" height="16" />&nbsp;{bet.lineQuery.sportName}</td>
                                            </tr>
                                            <tr>
                                                <th>Match Start Date</th>
                                                <td>{this.getDate(bet.matchStartDate)}</td>
                                                <th>Event</th>
                                                <td>{bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                                            </tr>
                                            <tr>
                                                <th>Team A</th>
                                                <td>{bet.teamA.name} </td>
                                                <th>Odd</th>
                                                <td>
                                                    {!bet.sportsbook && <span><del>{bet.teamA.odds}</del> <span>{newHome}</span></span>}
                                                    {bet.sportsbook && <span>{bet.teamA.odds}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Team B</th>
                                                <td>{bet.teamB.name} </td>
                                                <th>Odd</th>
                                                <td>
                                                    {!bet.sportsbook && <span><del>{bet.teamB.odds}</del> <span>{newAway}</span></span>}
                                                    {bet.sportsbook && <span>{bet.teamB.odds}</span>}
                                                </td>
                                            </tr>
                                        </>
                                    })()}
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
                    <div className="card-footer py-2">
                        <Button onClick={onHide} className="float-right">Close</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}