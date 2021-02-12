/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";

class OverviewBet extends React.Component {
    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };
    tableBody = () => {
        const { lastbets, currency } = this.props;
        return lastbets.map((bet, index) => {
            return (
                <div className="d-flex mb-5" key={index}>
                    <div className="d-flex flex-column flex-grow-1 font-weight-bold text-left">
                        <a
                            href="#"
                            className="text-dark text-hover-primary mb-1 font-size-lg"
                        >
                            {bet.teamA.name} vs {bet.teamB.name} ({bet.lineQuery.sportName})
                        </a>
                        <span className="text-muted">{this.getDate(bet.createdAt)}</span>
                    </div>
                    <span className="label label-lg label-light-primary label-inline">
                        ${bet.bet}&nbsp;{currency}
                    </span>
                </div>
            )
        })
    }
    render() {
        const { className } = this.props;
        return (
            <>
                <div className={`card card-custom ${className}`}>
                    <div className="card-header border-0">
                        <h3 className="card-title font-weight-bolder text-dark">Lastest Bets</h3>
                    </div>
                    <div className="card-body pt-2">
                        {this.tableBody()}
                    </div>
                </div>
            </>
        );
    }
}

export default OverviewBet;