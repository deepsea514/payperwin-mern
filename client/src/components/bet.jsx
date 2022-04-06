import React, { Component } from 'react';
import sportNameImage from "../helpers/sportNameImage";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { convertOddsFromAmerican } from '../helpers/convertOdds';
import { FormattedMessage, injectIntl } from 'react-intl';

class Bet extends Component {
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
        const { bet, removeBet, oddsFormat, maxBetLimitTier, betSlipOdds } = this.props;
        const {
            name, type, subtype, league, origin,
            odds, pick, sportName, lineId, pickName, index, sportsbook, originOdds,
        } = bet;
        const majorLeagues = ["NBA", "NFL", "MLB", "NHL"]; //  major leagues will use the existing tier bet limit 
        const maxBetLimit = majorLeagues.includes(league) ? maxBetLimitTier : maxBetLimitTier / 2;

        if (origin == 'custom') {
            return (
                <div className="bet-container bet-sportsbook">
                    {win > maxBetLimit && <div className="bet-warn-message">
                        <div><b><FormattedMessage id="COMPONENTS.BET.ABOVEMAXIMUM" /></b></div>
                        <FormattedMessage id="COMPONENTS.BET.INPUTNOTEXCEED" values={{ max_win_limit: maxBetLimit }} />
                    </div>}
                    <div className={`bet ${win > maxBetLimit ? 'bet-warn' : ''}`}>
                        <div>
                            <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                            {` ${name}`}
                            <i className="fal fa-times" onClick={() => removeBet(lineId, type, pick, index, subtype)} />
                        </div>
                        <div className="bet-type-league">{league}</div>
                        <div className="d-flex justify-content-between">
                            <span className="bet-pick">{pickName}</span>
                            <span className="bet-pick-odds">{oddsFormat == 'decimal' ? convertOddsFromAmerican(odds[pick], oddsFormat) : ((odds[pick] > 0 ? '+' : '') + odds[pick])}</span>
                        </div>
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
                        <div className="bet-type-league mt-2"><FormattedMessage id="COMPONENTS.BET.MAXWIN" />: <span className="bet-max-win" onClick={() => this.handleChange({ target: { name: 'win', value: maxBetLimit } })}>CAD {maxBetLimit}</span></div>
                    </div>
                </div>
            )
        }

        let oddsChanged = null;
        if (betSlipOdds && betSlipOdds.length > 0) {
            const latestOdds = betSlipOdds.find(({ lineQuery }) => {
                return lineQuery.lineId == lineId &&
                    lineQuery.type == type &&
                    lineQuery.subtype == subtype &&
                    lineQuery.index == index
            });
            if (latestOdds) {
                if (latestOdds.odds.home != originOdds.home || latestOdds.odds.away != originOdds.away) {
                    oddsChanged = latestOdds.odds;
                }
            }
        }

        return (
            <div className={`bet-container ${sportsbook ? 'bet-sportsbook' : ''}`}>
                {win > maxBetLimit && <div className="bet-warn-message">
                    <div><b><FormattedMessage id="COMPONENTS.BET.ABOVEMAXIMUM" /></b></div>
                    <FormattedMessage id="COMPONENTS.BET.INPUTNOTEXCEED" values={{ max_win_limit: maxBetLimit }} />
                </div>}
                <div className={`bet ${win > maxBetLimit ? 'bet-warn' : ''}`}>
                    <div>
                        <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                        {` ${name}`}
                        <i className="fal fa-times" onClick={() => removeBet(lineId, type, pick, index, subtype)} />
                    </div>
                    <div className="bet-type-league">{type} - {league}</div>
                    <div className="d-flex justify-content-between">
                        <span className="bet-pick">{pickName}</span>
                        <span className="bet-pick-odds">{oddsFormat == 'decimal' ? convertOddsFromAmerican(odds[pick], oddsFormat) : ((odds[pick] > 0 ? '+' : '') + odds[pick])}</span>
                    </div>
                    {oddsChanged && <div className='text-danger'>Odds changed to {oddsChanged[pick]}</div>}
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
                    <div className="bet-type-league mt-2"><FormattedMessage id="COMPONENTS.BET.MAXWIN" />: <span className="bet-max-win" onClick={() => this.handleChange({ target: { name: 'win', value: maxBetLimit } })}>CAD {maxBetLimit}</span></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    maxBetLimitTier: state.frontend.maxBetLimitTier,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(Bet))
