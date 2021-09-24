import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class CashbackNames extends Component {
    render() {
        return (
            <div className="verification-proof-container shadow">
                <h6>FAQ</h6>
                <div className="verification-proof-list">
                    <p>
                        Payper Win offer a tiered based cashback program based on sportsbook bets (not applicable for P2P bets).
                        The program is based on the user’s monthly play on the sportsbook and resets on the first day of the calendar month.
                        The credit back will is calculated based on your loss on sportsbook bets.
                    </p>
                </div>
            </div>
        );
    }
}
