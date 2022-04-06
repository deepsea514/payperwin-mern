import React, { Component } from 'react';
import sportNameImage from "../helpers/sportNameImage";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import { convertOddsFromAmerican } from '../helpers/convertOdds';
import { FormattedMessage, injectIntl } from 'react-intl';

class BetParlay extends Component {
    constructor(props) {
        super(props);
    }

    getParlayOdds = () => {
        const { betSlip } = this.props;
        let parlayDdds = 1;
        for (const bet of betSlip) {
            const { originOdds, pick } = bet;
            parlayDdds *= Number(convertOddsFromAmerican(originOdds[pick], 'decimal'));
        }
        if (parlayDdds >= 2) {
            parlayDdds = parseInt((parlayDdds - 1) * 100);
        } else {
            parlayDdds = parseInt(-100 / (parlayDdds - 1));
        }
        return parlayDdds;
    }

    handleChange = (e) => {
        const { setParlayBet } = this.props;
        const { target: { name, value } } = e;
        const stateChange = {};
        if (name === 'stake') {
            const stake = Math.abs(Number(Number(value).toFixed(2)));
            stateChange.parlayStake = stake;
            const americanOdds = this.getParlayOdds();
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
            const calculateWin = stake * decimalOdds;
            const roundToPennies = Number((calculateWin).toFixed(2));
            const win = roundToPennies;
            stateChange.parlayWin = win;
        } else if (name === 'win') {
            const win = Math.abs(Number(Number(value).toFixed(2)), 20);
            stateChange.parlayWin = win;
            const americanOdds = this.getParlayOdds();
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : - (100 / americanOdds);
            const calculateStake = (win / 1) / decimalOdds;
            const roundToPennies = Number((calculateStake).toFixed(2));
            const stake = roundToPennies;
            stateChange.parlayStake = stake;
        }
        setParlayBet(stateChange);
    }

    checkCorrelated = () => {
        const { betSlip } = this.props;
        for (const bet of betSlip) {
            const { pickName, lineQuery } = bet;
            const correlated = betSlip.find(bet => bet.lineQuery.eventId == lineQuery.eventId && bet.pickName != pickName);
            if (correlated) return true;
        }
        return false;
    }

    render() {
        const { betSlip, oddsFormat, stake, win, maxBetLimitTier, betSlipOdds } = this.props;
        const odds = this.getParlayOdds();
        const correlated = this.checkCorrelated();

        return (
            <>
                {win > maxBetLimitTier && <div className="bet-parlay-warn-message">
                    <div><b><FormattedMessage id="COMPONENTS.BET.ABOVEMAXIMUM" /></b></div>
                    <FormattedMessage id="COMPONENTS.BET.INPUTNOTEXCEED" values={{ max_win_limit: maxBetLimitTier }} />
                </div>}

                {correlated && <div className="bet-parlay-error-message">
                    <div><i className="fas fa-info-circle" /> <b><FormattedMessage id="COMPONENTS.COREELATED_BET_MSG" /></b></div>
                </div>}

                <div className={`bet-parlay-container ${correlated ? 'bet-error' : (win > maxBetLimitTier ? 'bet-warn' : '')}`}>
                    <div className="d-flex justify-content-between">
                        <span className="bet-pick">1's x {betSlip.length}</span>
                        <span className="bet-pick-odds">{oddsFormat == 'decimal' ? convertOddsFromAmerican(odds, oddsFormat) : ((odds > 0 ? '+' : '') + odds)}</span>
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
                    <div className="bet-type-league mt-2"><FormattedMessage id="COMPONENTS.BET.MAXWIN" />: <span className="bet-max-win" onClick={() => this.handleChange({ target: { name: 'win', value: maxBetLimitTier } })}>CAD {maxBetLimitTier}</span></div>
                    <div className="bet-type-league mt-2 text-warning"><FormattedMessage id="COMPONENTS.PPW_USE_HIGHSTAKER" /></div>
                    <div className='bet-divider' />
                    {betSlip.map((bet, betIdx) => {
                        const { name, type, subtype, index, league, sportName, pickName, lineQuery, lineId, originOdds, pick } = bet;
                        const correlated = betSlip.find(bet => bet.lineQuery.eventId == lineQuery.eventId && bet.pickName != pickName);

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
                            <div key={betIdx} className="bet-parlay">
                                <div>
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                    <span className={correlated ? "text-danger" : ""}>{name}</span>
                                </div>
                                <div className="bet-type-league">{type} - {league}</div>
                                <span className="bet-pick">{pickName}</span>
                                {oddsChanged && <div className='text-danger'>Odds changed to {oddsChanged[pick]}</div>}
                            </div>
                        )
                    })}
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

export default connect(mapStateToProps, frontend.actions)(injectIntl(BetParlay))
