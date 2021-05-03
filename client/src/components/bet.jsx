import React, { PureComponent } from 'react';
import sportNameIcon from '../helpers/sportNameIcon';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";

class Bet extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stake: '',
            win: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { target: { name, value } } = e
        const stateChange = {};
        const { bet, updateBet } = this.props
        const { odds, pick, lineId } = bet;
        if (name === 'stake') {
            const stake = Math.abs(Number(Number(value).toFixed(2)));
            stateChange[name] = stake;
            // calc win
            const americanOdds = odds[pick];
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
            const calculateWin = (stake * 1) * decimalOdds;
            const roundToPennies = Number((calculateWin).toFixed(2));
            const win = roundToPennies
            stateChange.win = win;
            updateBet(
                lineId,
                pick,
                {
                    win: { $set: win },
                    stake: { $set: stake },
                },
            );
        } else if (name === 'win') {
            const win = Math.abs(Number(Number(value).toFixed(2)), 20);
            stateChange[name] = win;
            // calc stake
            const americanOdds = odds[pick];
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : - (100 / americanOdds);
            const calculateStake = (win / 1) / decimalOdds;
            const roundToPennies = Number((calculateStake).toFixed(2));
            const stake = roundToPennies;
            stateChange.stake = stake;
            updateBet(
                lineId,
                pick,
                {
                    win: { $set: win },
                    stake: { $set: stake },
                },
            );
        } else {
            stateChange[name] = value;
        }
        this.setState(stateChange);
    }

    convertOdds = (odd) => {
        const { oddsFormat } = this.props;
        switch (oddsFormat) {
            case 'decimal':
                if (odd > 0) {
                    return Number(1 + odd / 100).toFixed(2);
                }
                else {
                    return Number(1 - 100 / odd).toFixed(2);
                }
            case 'american':
            default:
                return odd;
        }
    }

    render() {
        const { stake, win } = this.state;
        const { bet, removeBet, oddsFormat } = this.props;
        console.log(bet)
        const { name, type, league, odds, pick, home, away, sportName, lineId, pickName } = bet;
        return (
            <div className="bet">
                <div>
                    <i className={`${sportNameIcon(sportName) || 'fas fa-trophy'}`} />
                    {` ${name}`}
                    <i className="fal fa-times" onClick={() => removeBet(lineId, pick)} />
                </div>
                <div className="bet-type-league">{type} - {league}</div>
                <span className="bet-pick">{pickName}</span>
                <span className="bet-pick-odds">{oddsFormat == 'decimal' ? this.convertOdds(odds[pick]) : ((odds[pick] > 0 ? '+' : '') + odds[pick])}</span>
                <div>
                    <input
                        className="bet-stake"
                        placeholder="Risk"
                        name="stake"
                        type="number"
                        value={stake === 0 ? '' : stake}
                        onChange={this.handleChange}
                        min={0}
                        step={20}
                    />
                    <input
                        className="bet-win"
                        placeholder="Win"
                        name="win"
                        type="number"
                        value={win === 0 ? '' : win}
                        onChange={this.handleChange}
                        min={0}
                        step={20}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
});

export default connect(mapStateToProps, frontend.actions)(Bet)
