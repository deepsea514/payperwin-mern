import React, { Component } from 'react';
import sportNameImage from "../helpers/sportNameImage";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import convertOdds from '../helpers/convertOdds';
import { FormattedMessage, injectIntl } from 'react-intl';

class BetBasic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stake: '',
            win: '',
        };
    }

    handleChange = (e) => {
        const { target: { name, value } } = e
        const stateChange = {};
        const { bet, updateBet } = this.props
        const { odds, pick, lineQuery } = bet;
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
                lineQuery, pick,
                { win: { $set: win }, stake: { $set: stake } },
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
                lineQuery, pick,
                { win: { $set: win }, stake: { $set: stake } },
            );
        } else {
            stateChange[name] = value;
        }
        this.setState(stateChange);
    }

    render() {
        const { stake, win } = this.state;
        const {
            bet, removeBet, updateBet, maxBetLimitTier, placeBets, user,
            showLoginModalAction, toggleField, errors, submitting
        } = this.props;
        const {
            type, subtype, league, lineQuery, home, away,
            odds, pick, lineId, index, sportsbook,
        } = bet;
        const majorLeagues = ["NBA", "NFL", "MLB", "NHL"]; //  major leagues will use the existing tier bet limit 
        const maxBetLimit = majorLeagues.includes(league) ? maxBetLimitTier : maxBetLimitTier / 2;

        let homePickName = '', awayPickName = '';
        switch (lineQuery.type) {
            case 'moneyline':
                homePickName = `Pick: ${home}`;
                awayPickName = `Pick: ${away}`;
                break;
            case 'spread':
                homePickName = `Pick: ${home} ${lineQuery.points > 0 ? '+' : ''}${lineQuery.points}`;
                awayPickName = `Pick: ${away} ${-1 * lineQuery.points > 0 ? '+' : ''}${-1 * lineQuery.points}`;
                break;
            case 'total':
                homePickName = `Pick: Over ${lineQuery.points}`;
                awayPickName = `Pick: Under ${lineQuery.points}`;

        }

        return (
            <div className={`bet-container ${sportsbook ? 'bet-sportsbook' : ''}`}>
                {win > maxBetLimit && <div className="bet-warn-message">
                    <div><b><FormattedMessage id="COMPONENTS.BET.ABOVEMAXIMUM" /></b></div>
                    <FormattedMessage id="COMPONENTS.BET.INPUTNOTEXCEED" values={{ max_win_limit: maxBetLimit }} />
                </div>}
                <div className={`bet ${win > maxBetLimit ? 'bet-warn' : ''}`}>
                    <div>
                        {lineQuery.type.toUpperCase()}
                        <i className="fal fa-times" onClick={() => removeBet(lineId, type, pick, index, subtype)} />
                    </div>
                    <div className="bet-type-league">
                        {lineQuery.type == 'moneyline' &&
                            'The money line is simply choosing the outright winner, which team will win the the game.'
                        }
                        {lineQuery.type == 'spread' &&
                            'The spread, also referred to as the line, is used to even the odds between two unevenly matched teams.'
                        }
                        {lineQuery.type == 'total' &&
                            'This is a bet on the total number of points scored by both teams.'
                        }
                    </div>
                    <div className='mt-3'>STEP 1: SELECT A TEAM</div>
                    <div className='d-flex justify-content-center'>
                        <span className={`bet-type-pick ${pick == 'home' ? 'selected' : ''}`} onClick={() => updateBet(
                            lineQuery, pick,
                            { pick: { $set: 'home' }, pickName: { $set: homePickName } },
                        )}>
                            {homePickName} @ {odds['home']}
                        </span>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <span className={`bet-type-pick ${pick == 'away' ? 'selected' : ''}`} onClick={() => updateBet(
                            lineQuery, pick,
                            { pick: { $set: 'away' }, pickName: { $set: awayPickName } },
                        )}>
                            {awayPickName} @ {odds['away']}
                        </span>
                    </div>
                    {pick && <>
                        <div className='mt-3'>STEP 2: ENTER A WAGER</div>
                        <div>
                            <input
                                className="bet-stake full-width"
                                placeholder="Risk"
                                name="stake"
                                type="number"
                                value={stake === 0 ? '' : stake}
                                onChange={this.handleChange}
                                min={0}
                                step={20}
                            />
                        </div>
                        <div>
                            <input
                                className="bet-win full-width"
                                placeholder="Win"
                                name="win"
                                type="number"
                                value={win === 0 ? '' : win}
                                onChange={this.handleChange}
                                min={0}
                                step={20}
                            />
                        </div>
                        <div className="bet-type-league mt-2"><FormattedMessage id="COMPONENTS.BET.MAXWIN" />: <span className="bet-max-win" onClick={() => this.handleChange({ target: { name: 'win', value: maxBetLimit } })}>CAD {maxBetLimit}</span></div>
                        <div className="form-error">
                            {errors.map(e => <div key={e}>{e}</div>)}
                        </div>
                        <button
                            disabled={submitting}
                            type="button"
                            className={'total-btn' + (submitting ? ' is-loading' : '')}
                            onClick={user ? placeBets
                                : () => {
                                    showLoginModalAction(true);
                                    toggleField('openBetSlipMenu');
                                }
                            }>
                            {user ? 'PLACE BET' : <FormattedMessage id="COMPONENTS.BETSLIP.LOGIN" />}
                        </button>
                    </>}
                </div>
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    maxBetLimitTier: state.frontend.maxBetLimitTier,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(BetBasic))
