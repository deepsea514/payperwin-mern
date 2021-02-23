import React, { PureComponent } from 'react';
import Sport from './sport';
import sportNameIcon from '../helpers/sportNameIcon';

const sports = [
    'Boxing',
    'Soccer',
    'Mixed Martial Arts',
    'Hockey',
    'Basketball',
    'Table Tennis',
];

export default class Highlights extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sportIndex: 0,
        };
    }

    render() {
        const { sportIndex } = this.state;
        const { addBet, betSlip, removeBet } = this.props;
        return (
            <div className="highlights">
                <div className="bet-slip-header">SPORTS BETTING</div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {
                        sports.map((s, i) => {
                            return (
                                <li
                                    className={`nav-item ${s === sports[sportIndex] ? 'active' : ''}`}
                                    onClick={() => this.setState({ sportIndex: i })}
                                    key={s}
                                >
                                    <i className={`${sportNameIcon(s) || 'fas fa-trophy'}`} />
                                    <span className="nav-link">{s}</span>
                                </li>
                            );
                        })
                    }
                </ul>
                <Sport
                    addBet={addBet}
                    betSlip={betSlip}
                    removeBet={removeBet}
                    sportName={sports[sportIndex]}
                />
            </div>
        );
    }
}
