import React, { Component } from 'react';
import sportNameImage from "../helpers/sportNameImage";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { convertOddsFromAmerican } from '../helpers/convertOdds';
import { FormattedMessage, injectIntl } from 'react-intl';
import getTeaserOdds from '../helpers/getTeaserOdds';

class BetTeaser extends Component {
    constructor(props) {
        super(props);
    }

    getTeaserOdds = () => {
        const { teaserBetSlip } = this.props;
        const valid = this.checkTeaserValid();
        if (!valid) return 100;
        const { type: { sportName, teaserPoint }, betSlip } = teaserBetSlip;
        const count = betSlip.length;
        return getTeaserOdds(sportName, teaserPoint, count);
    }

    handleChange = (e) => {
        const { setTeaserBet } = this.props;
        const { target: { name, value } } = e;
        const stateChange = {};
        const americanOdds = this.getTeaserOdds();
        if (name === 'stake') {
            const stake = Math.abs(Number(Number(value).toFixed(2)));
            stateChange.teaserStake = stake;
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
            const calculateWin = stake * decimalOdds;
            const roundToPennies = Number((calculateWin).toFixed(2));
            const win = roundToPennies;
            stateChange.teaserWin = win;
        } else if (name === 'win') {
            const win = Math.abs(Number(Number(value).toFixed(2)), 20);
            stateChange.teaserWin = win;
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : - (100 / americanOdds);
            const calculateStake = (win / 1) / decimalOdds;
            const roundToPennies = Number((calculateStake).toFixed(2));
            const stake = roundToPennies;
            stateChange.teaserStake = stake;
        }
        setTeaserBet(stateChange);
    }

    checkTeaserValid = () => {
        const { teaserBetSlip } = this.props;
        let allValid = true;
        if (teaserBetSlip.betSlip.length < 2) return false;
        teaserBetSlip.betSlip.map(bet => {
            const { sportName, teaserPoint } = bet;
            const valid = teaserBetSlip.type.sportName == sportName && teaserBetSlip.type.teaserPoint == teaserPoint;
            allValid = allValid && valid;
        });
        return allValid;
    }

    render() {
        const { teaserBetSlip, oddsFormat, stake, win, maxBetLimitTier, removeBet } = this.props;
        const odds = this.getTeaserOdds();
        const valid = this.checkTeaserValid();
        return (
            <>
                {win > maxBetLimitTier && <div className="bet-parlay-warn-message">
                    <div><b><FormattedMessage id="COMPONENTS.BET.ABOVEMAXIMUM" /></b></div>
                    <FormattedMessage id="COMPONENTS.BET.INPUTNOTEXCEED" values={{ max_win_limit: maxBetLimitTier }} />
                </div>}
                <div className={`bet-parlay-container ${win > maxBetLimitTier ? 'bet-warn' : ''}`}>
                    <div className="d-flex justify-content-between">
                        <span className="bet-pick">{teaserBetSlip.type.sportName} {teaserBetSlip.type.teaserPoint} Points Teaser</span>
                        {valid && <span className="bet-pick-odds">{oddsFormat == 'decimal' ? convertOddsFromAmerican(odds, oddsFormat) : ((odds > 0 ? '+' : '') + odds)}</span>}
                    </div>
                    {valid && <>
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
                        <div className="bet-type-league mt-2">
                            <FormattedMessage id="COMPONENTS.BET.MAXWIN" />: <span className="bet-max-win" onClick={() => this.handleChange({ target: { name: 'win', value: maxBetLimitTier } })}>CAD {maxBetLimitTier}</span>
                        </div>
                    </>}
                    <div className='bet-divider' />
                    {teaserBetSlip.betSlip.map((bet, index) => {
                        const { name, type, league, sportName, pickName, lineId, pick, teaserPoint } = bet;
                        const valid = teaserBetSlip.type.sportName == sportName && teaserBetSlip.type.teaserPoint == teaserPoint
                        return (
                            <div key={index} className={`bet-teaser ${valid ? '' : 'bet-error'}`}>
                                <div className={`${valid ? '' : 'text-danger'}`}>
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                    {name}
                                    <i className="fal fa-times" onClick={() => removeBet(lineId, type, pick)} />
                                </div>
                                <div className={`bet-type-league ${valid ? '' : 'text-danger'}`} >{type} - {league}</div>
                                <span className={`bet-pick ${valid ? '' : 'text-danger'}`}>{pickName}</span>
                            </div>
                        )
                    })}
                    {teaserBetSlip.betSlip.length < 2 && <div className="bet-type-league py-2">
                        <p><FormattedMessage id="COMPONENTS.TEASER_MINUMUM_SHORT" /></p>
                    </div>}
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    maxBetLimitTier: state.frontend.maxBetLimitTier,
});

export default connect(mapStateToProps, frontend.actions)(injectIntl(BetTeaser))
