/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { Tabs, Tab } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom';

class Wagers extends React.Component {
    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    tablePPWBody = (lastbets) => {
        const { currency, history } = this.props;
        return lastbets.map((bet, index) => {
            return (
                <div className="d-flex mb-5" key={index}>
                    <div className="d-flex flex-column flex-grow-1 font-weight-bold text-left">
                        <a onClick={null}
                            className="text-dark text-hover-primary mb-1 font-size-lg cursor-pointer">
                            {bet.isParlay ? 'Parlay' :
                                bet.origin == 'custom' ? 'Side Bet - ' : bet.lineQuery.sportName + ' - '}
                            {bet.isParlay ? '' :
                                bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}
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

    render() {
        const { className, lastsportsbookbets, lastbets } = this.props;
        return (
            <>
                <div className={`card card-custom ${className}`}>
                    <div className="card-header border-0">
                        <h4 className="card-title font-weight-bolder text-dark">Lastest Bets</h4>
                    </div>
                    <div className="card-body pt-2">
                        <Tabs>
                            <Tab eventKey="ppwbets" title="P2P Bets" className="border-0 pt-3">
                                {this.tablePPWBody(lastbets)}
                            </Tab>
                            <Tab eventKey="sportsbook" title="SB Bets" className="border-0 pt-3">
                                {this.tablePPWBody(lastsportsbookbets)}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(Wagers);