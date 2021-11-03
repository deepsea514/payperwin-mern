import React, { Component } from 'react';
import dateformat from "dateformat";
import { FormattedMessage, injectIntl } from 'react-intl';

class AutobetHistory extends Component {
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getIconColor = (status) => {
        switch (status) {
            case 'Draw':
                return 'text-primary';
            case 'Settled - Win':
                return 'text-success';
            case 'Settled - Lose':
                return 'text-danger';
            case 'Cancelled':
                return 'text-warning';
            default:
                return 'text-dark';
        }
    }

    getBetStatus = (status) => {
        switch (status) {
            case 'Draw':
                return <b>DRAW</b>;
            case 'Settled - Win':
                return <b>WIN</b>;
            case 'Settled - Lose':
                return <b>LOSS</b>;
            case 'Cancelled':
                return <b>CANCELLED</b>;
            default:
                return null;
        }
    }

    render() {
        const { histories } = this.props;
        return (
            <>
                <div className="card card-custom">
                    {/* Header */}
                    <div className="card-header align-items-center border-0 mt-4">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark"><FormattedMessage id="COMPONENTS.AUTOBET.RECENTMATCHES" /></span>
                            <span className="text-muted mt-3 font-weight-bold font-size-sm">
                                {histories.length} <FormattedMessage id="COMPONENTS.AUTOBET.MATCHES" />
                            </span>
                        </h3>
                    </div>
                    {/* Body */}
                    <div className="card-body pt-4">
                        <div className="timeline timeline-6 mt-3">
                            {histories.map(history => {
                                if (history.isParlay) {
                                    return (
                                        <div className="timeline-item align-items-start" key={history._id}>
                                            <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                                {dateformat(history.updatedAt, "mm/dd")}
                                            </div>

                                            <div className="timeline-badge">
                                                <i className={`fa fa-genderless ${this.getIconColor(history.status)} icon-xl`}></i>
                                            </div>

                                            <div className="font-weight-mormal font-size-sm timeline-content text-dark pl-3">
                                                {this.getBetStatus(history.status)}{` $${(history.status == 'Settled - Win' ? history.payableToWin : history.bet).toFixed(2)} @ ${history.pickOdds > 0 ? '+' + history.pickOdds : history.pickOdds} - Parlay Bets`}
                                            </div>
                                        </div>
                                    )
                                }
                                if (!history.lineQuery.type) {
                                    return null;
                                }
                                return (
                                    <div className="timeline-item align-items-start" key={history._id}>
                                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                            {dateformat(history.updatedAt, "mm/dd")}
                                        </div>

                                        <div className="timeline-badge">
                                            <i className={`fa fa-genderless ${this.getIconColor(history.status)} icon-xl`}></i>
                                        </div>

                                        <div className="font-weight-mormal font-size-sm timeline-content text-dark pl-3">
                                            {this.getBetStatus(history.status)}{` $${(history.status == 'Settled - Win' ? history.payableToWin : history.bet).toFixed(2)} @ ${history.pickOdds > 0 ? '+' + history.pickOdds : history.pickOdds} ${this.capitalizeFirstLetter(history.lineQuery.type)}
                                         - ${history.teamA.name} vs ${history.teamB.name}`}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default injectIntl(AutobetHistory);