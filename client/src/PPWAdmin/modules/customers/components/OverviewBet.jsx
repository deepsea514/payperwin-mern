/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { Tabs, Tab } from "react-bootstrap";

class OverviewBet extends React.Component {
    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };
    tablePPWBody = () => {
        const { lastbets, currency } = this.props;
        return lastbets.map((bet, index) => {
            return (
                <div className="d-flex mb-5" key={index}>
                    <div className="d-flex flex-column flex-grow-1 font-weight-bold text-left">
                        <a
                            href="#"
                            className="text-dark text-hover-primary mb-1 font-size-lg"
                        >
                            {bet.origin == 'other' && bet.lineQuery.eventName}
                            {bet.teamA ? bet.teamA.name : null} vs {bet.teamB ? bet.teamB.name : null} ({bet.lineQuery.sportName})
                        </a>
                        <span className="text-muted">{this.getDate(bet.createdAt)}</span>
                    </div>
                    <span className="label label-lg label-light-primary label-inline">
                        ${bet.bet.toFixed(2)}&nbsp;{currency}
                    </span>
                </div>
            )
        })
    }

    tableSportsBookBody = () => {
        const { lastsportsbookbets, currency } = this.props;
        return lastsportsbookbets.map((bet, index) => {
            return (
                <div className="d-flex mb-5" key={index}>
                    <div className="d-flex flex-column flex-grow-1 font-weight-bold text-left">
                        <a
                            href="#"
                            className="text-dark text-hover-primary mb-1 font-size-lg"
                        >
                            {bet.WagerInfo.EventName} ({bet.WagerInfo.Sport})
                        </a>
                        <span className="text-muted">{this.getDate(bet.createdAt)}</span>
                    </div>
                    <span className="label label-lg label-light-primary label-inline">
                        ${Number(bet.WagerInfo.ToRisk).toFixed(2)}&nbsp;{currency}
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
                        <Tabs>
                            <Tab eventKey="ppwbets" title="PPW Bets" className="border-0">
                                {this.tablePPWBody()}
                            </Tab>
                            <Tab eventKey="sportsbook" title="SportsBook" className="border-0">
                                {this.tableSportsBookBody()}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </>
        );
    }
}

export default OverviewBet;