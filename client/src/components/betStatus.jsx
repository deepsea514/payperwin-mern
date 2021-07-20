import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class BetStatus extends PureComponent {
    render() {
        return (
            <div className="verification-proof-container shadow">
                <h6>Bet Status</h6>
                <div className="verification-proof-list">
                    <ul>
                        <li>
                            <b>Matched:</b> Your entire bet was matched and you wager is in play.
                        </li>
                        <li>
                            <b>Partially Match:</b> Only a portion of your wager was matched with another user.
                            The unmatched amount is waiting for a match. You can forward the bet to the Sportsbook for an instant match.
                        </li>
                        <li>
                            <b>Settled:</b> The game is over and the winner has been paid.
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
