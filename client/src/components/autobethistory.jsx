import React, { Component } from 'react';
import dateformat from "dateformat";

class AutobetHistory extends Component {
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getIconColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-primary';
            case 'Matched':
            case 'Partial Match':
                return 'text-info';
            case 'Settled - Win':
                return 'text-success';
            case 'Settled - Lose':
                return 'text-danger';
            case 'Cancelled':
            default:
                return 'text-warning';
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
                            <span className="font-weight-bolder text-dark">Recent Matches</span>
                            <span className="text-muted mt-3 font-weight-bold font-size-sm">
                                {histories.length} Matches
                            </span>
                        </h3>
                    </div>
                    {/* Body */}
                    <div className="card-body pt-4">
                        <div className="timeline timeline-6 mt-3">
                            {histories.map(history => {
                                if (!history.lineQuery.type) {
                                    return null;
                                }
                                return (
                                    <div className="timeline-item align-items-start" key={history._id}>
                                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                            {dateformat(history.createdAt, "mm/dd")}
                                        </div>

                                        <div className="timeline-badge">
                                            <i className={`fa fa-genderless ${this.getIconColor(history.status)} icon-xl`}></i>
                                        </div>

                                        <div className="font-weight-mormal font-size-sm timeline-content text-dark pl-3">
                                            {`$${history.bet.toFixed(2)} @ ${history.pickOdds > 0 ? '+' + history.pickOdds : history.pickOdds} ${this.capitalizeFirstLetter(history.lineQuery.type)}
                                         - ${history.teamA.name} vs ${history.teamB.name}`}
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AutobetHistory;