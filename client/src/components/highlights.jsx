import React, { PureComponent } from 'react';
import Sport from './sport';
import Others from "./others";
// import sportNameIcon from '../helpers/sportNameIcon';
import sportNameImage from "../helpers/sportNameImage";

const sports = [
    'Soccer',
    'NHL',
    'MLB',
    'NBA',
    'WNBA',
    'NFL',
    'Other'
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
                <ul className="nav nav-tabs pt-2" id="myTab" role="tablist">
                    {
                        sports.map((sport, i) => {
                            return (
                                <li
                                    className={`nav-item ${sport === sports[sportIndex] ? 'active' : ''}`}
                                    onClick={() => this.setState({ sportIndex: i })}
                                    key={sport}
                                >
                                    <img src={sportNameImage(sport)} width="18" height="18" />
                                    <span className="nav-link">{sport}</span>
                                </li>
                            );
                        })
                    }
                </ul>
                {sports[sportIndex] == "Other" ?
                    <Others
                        addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                    /> :
                    <Sport
                        addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                        sportName={sports[sportIndex]}
                    />}
            </div>
        );
    }
}
