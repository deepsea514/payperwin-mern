import React, { Component } from 'react';
import dateformat from "dateformat";
import { FormattedMessage, injectIntl } from 'react-intl';

const getDateFormat = (date) => {
    return dateformat(date, "mediumDate");
}

const getBetType = (history) => {
    switch (history.lineQuery.type) {
        case 'moneyline':
            return 'Moneyline';
        case 'total':
        case 'alternative_total':
            return 'Total';
        case 'spread':
        case 'alternative_spread':
            return 'Spread';
        case 'home_total':
            return history.teamA.name + ' Total';
        case 'away_total':
            return history.teamB.name + ' Total';
        default:
            return null;
    }
}
const getBetStatus = (status) => {
    switch (status) {
        case "Cancelled":
            return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">Cancelled</span>
        case "Settled - Lose":
            return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Lose</span>
        case "Settled - Win":
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
        case "Draw":
            return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">Draw</span>
        default:
            return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">Pending</span>
    }
}

const AllBets = ({ histories }) => {
    return <div className="table-responsive">
        <table className="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Game</th>
                    <th>Bet</th>
                    <th>Wager</th>
                    <th>Results</th>
                </tr>
            </thead>
            <tbody>
                {histories.map((history, index) => (
                    <tr key={index}>
                        <td>{getDateFormat(history.updatedAt)}</td>
                        <td>{history.isParlay ? 'Parlay Bet' : `${history.teamA.name} vs ${history.teamA.name}`}</td>
                        <td>{history.isParlay ? 'Multiple' : getBetType(history)} @{history.pickOdds}</td>
                        <td>${history.bet.toFixed(2)} (Pays ${history.payableToWin.toFixed(2)})</td>
                        <td>{getBetStatus(history.status)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

const BetFees = ({ histories }) => {
    return <div className="table-responsive">
        <table className="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Game</th>
                    <th>Bet</th>
                    <th>Win</th>
                    <th>Fee</th>
                </tr>
            </thead>
            <tbody>
                {histories.map((history, index) => (
                    <tr key={index}>
                        <td>{getDateFormat(history.updatedAt)}</td>
                        <td>{history.isParlay ? 'Parlay Bet' : `${history.teamA.name} vs ${history.teamA.name}`}</td>
                        <td>{history.isParlay ? 'Multiple' : getBetType(history)} @{history.pickOdds}</td>
                        <td>${history.payableToWin.toFixed(2)}</td>
                        <td>${history.fee.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

const PendingBets = ({ histories }) => {
    return <div className="table-responsive">
        <table className="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Game</th>
                    <th>Bet</th>
                    <th>Pending</th>
                </tr>
            </thead>
            <tbody>
                {histories.map((history, index) => (
                    <tr key={index}>
                        <td>{getDateFormat(history.updatedAt)}</td>
                        <td>{history.isParlay ? 'Parlay Bet' : `${history.teamA.name} vs ${history.teamA.name}`}</td>
                        <td>{history.isParlay ? 'Multiple' : getBetType(history)} @{history.pickOdds}</td>
                        <td>${history.bet.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

class AutobetHistoryTable extends Component {
    render() {
        const { histories, cancel, detail } = this.props;
        return (
            <>
                <div className="card card-custom">
                    <div className="card-header align-items-center border-0 mt-4">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark"><FormattedMessage id="COMPONENTS.AUTOBET.RECENTMATCHES" /></span>
                        </h3>
                        <div className="card-toolbar">
                            <a
                                style={{ cursor: 'pointer', fontSize: 16 }}
                                onClick={cancel}>
                                <strong><i className="fas fa-chevron-left"></i> <FormattedMessage id="PAGES.BACK" /></strong>
                            </a>
                        </div>
                    </div>
                    <div className="card-body pt-4">
                        {detail == 'all' && <AllBets histories={histories} />}
                        {detail == 'win' && <AllBets histories={histories.filter(history => history.status == 'Settled - Win')} />}
                        {detail == 'fee' && <BetFees histories={histories.filter(history => history.status == 'Settled - Win')} />}
                        {detail == 'loss' && <AllBets histories={histories.filter(history => history.status == 'Settled - Lose')} />}
                        {detail == 'pending' && <PendingBets histories={histories.filter(history =>
                            ['Pending', 'Accepted', 'Partial Accepted', 'Matched', 'Partial Matched'].includes(history.status))} />}
                    </div>
                </div>
            </>
        );
    }
}

export default injectIntl(AutobetHistoryTable);