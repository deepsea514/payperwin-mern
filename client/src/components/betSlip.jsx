import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Bet from "./bet";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import BetParlay from './betparlay';
import BetTeaser from './betteaser';
import { FormattedMessage, injectIntl } from 'react-intl';
import { placeBets, placeParlayBets, placeTeaserBets } from '../redux/services';
import BetBasic from './bet_basic';
import { showSuccessToast } from '../libs/toast';

class BetSlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            submitting: false,
            confirmationOpen: false,
            parlayWin: '',
            parlayStake: '',
            teaserWin: '',
            teaserStake: '',
        };
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
    }

    componentDidUpdate(prevProps) {
        const { betSlip, teaserBetSlip } = this.props;
        const { betSlip: prevBetSlip, teaserBetSlip: prevTeaserBetSlip } = prevProps;
        if (JSON.stringify(betSlip) != JSON.stringify(prevBetSlip)) {
            this._Mounted && this.setState({ parlayStake: '', parlayWin: '' });
        }
        if (JSON.stringify(teaserBetSlip) != JSON.stringify(prevTeaserBetSlip)) {
            this._Mounted && this.setState({ teaserStake: '', teaserWin: '' });
        }
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    toggleField = (fieldName, forceState) => {
        if (typeof this.state[fieldName] !== 'undefined') {
            this._Mounted && this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    placeSingleBets = () => {
        const { updateUser, user, betSlip, removeBet, maxBetLimitTier, betEnabled } = this.props;

        if (betSlip.length < 1) {
            return this._Mounted && this.setState({ errors: [`Wager could not be placed. No bets in your slip.`] });
        }

        const disabled = betEnabled && !betEnabled.single;
        if (disabled) {
            return this._Mounted && this.setState({ errors: [`Wager could not be placed. Single Bet is temporary unavailable.`] });
        }

        this._Mounted && this.setState({ errors: [] });

        let totalStake = 0;
        let totalWin = 0;
        for (let i = 0; i < betSlip.length; i++) {
            const b = betSlip[i];
            totalStake += b.stake;
            totalWin += b.win;
            if (b.win > maxBetLimitTier) {
                return this._Mounted && this.setState({ errors: [`${b.pickName} ${b.odds[b.pick]} wager could not be placed. Exceed maximum win amount.`] });
            }
        }

        if (totalWin > maxBetLimitTier) {
            return this._Mounted && this.setState({ errors: [`The wager could not be placed. You have exceeded your maximum win amount.`] });
        }

        if (user && totalStake > user.balance) {
            return this._Mounted && this.setState({ errors: [`Insufficient Funds. You do not have sufficient funds to place these bets.`] });
        }

        this.setState({ submitting: true });
        placeBets(betSlip)
            .then(({ data: { balance, newClaims, errors } }) => {
                if(newClaims)
                    showSuccessToast(`${newClaims} loyalty milestone unlocked `);

                const successCount = betSlip.length - (errors ? errors.length : 0);
                const stateChanges = {};
                if (successCount) {
                    updateUser('balance', balance);
                    removeBet(null, null, null, null, null, true);
                    stateChanges.confirmationOpen = true;
                }
                if (errors && errors.length) stateChanges.errors = errors;
                if (successCount || errors) {
                    this._Mounted && this.setState(stateChanges);
                }
            }).catch((err) => {
                if (err.response && err.response.data) {
                    const { error } = err.response.data;
                    this._Mounted && this.setState({ formError: error });
                } else {
                    this._Mounted && this.setState({ errors: ['Can\'t place bet.'] });
                }
            }).finally(() => {
                this._Mounted && this.setState({ submitting: false });
            });
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

    placeParlayBets = () => {
        const { updateUser, user, betSlip, removeBet, maxBetLimitTier, betEnabled } = this.props;

        if (betSlip.length < 2) {
            return this.setState({ errors: [`Wager could not be placed. To place a Multiples bet you need a minimum of two bets on your Bet Slip.`] });
        }

        const correlated = this.checkCorrelated();
        if (correlated) {
            return this.setState({ errors: [`Correlated bets could not be placed.`] });
        }

        const disabled = betEnabled && !betEnabled.parlay;
        if (disabled) {
            return this.setState({ errors: [`Wager could not be placed. Parlay Bet is temporary unavailable.`] });
        }

        const { parlayStake, parlayWin } = this.state;
        this.setState({ errors: [] });
        let totalWin = parlayWin ? parlayWin : 0;
        let totalStake = parlayStake ? parlayStake : 0;
        if (user && totalStake > user.balance) {
            return this.setState({ errors: [`Insufficient Funds. You do not have sufficient funds to place these bets.`] });
        }
        if (totalWin > maxBetLimitTier) {
            return this.setState({ errors: [`Parlay wager could not be placed. Exceed maximum win amount.`] });
        }
        this.setState({ submitting: true });
        placeParlayBets(betSlip, totalStake, totalWin)
            .then(({ data: { balance, newClaims, errors } }) => {
                if(newClaims)
                    showSuccessToast(`${newClaims} loyalty milestone unlocked `);

                if (errors.length == 0) {
                    updateUser('balance', balance);
                    removeBet(null, null, null, null, null, true);
                    this.setState({ confirmationOpen: true });
                } else {
                    this.setState({ errors });
                }
            }).catch((err) => {
                this.setState({ errors: ['Can\'t place bet.'] });
            }).finally(() => {
                this.setState({ submitting: false });
            });
    }

    placeTeaserBets = () => {
        const { updateUser, user, teaserBetSlip, removeTeaserBet, maxBetLimitTier, betEnabled } = this.props;

        if (teaserBetSlip.betSlip.length < 2) {
            return this.setState({ errors: [`Wager could not be placed. To place a teaser bet, add a minimum of two selections to the bet slip from football or basketball matchups.`] });
        }

        const disabled = betEnabled && !betEnabled.teaser;
        if (disabled) {
            return this.setState({ errors: [`Wager could not be placed. Teaser Bet is temporary unavailable.`] });
        }

        const { teaserStake, teaserWin } = this.state;
        this.setState({ errors: [] });
        let totalWin = teaserWin ? teaserWin : 0;
        let totalStake = teaserStake ? teaserStake : 0;
        if (user && totalStake > user.balance) {
            return this.setState({ errors: [`Insufficient Funds. You do not have sufficient funds to place these bets.`] });
        }
        if (totalWin > maxBetLimitTier) {
            return this.setState({ errors: [`Teaser wager could not be placed. Exceed maximum win amount.`] });
        }
        this.setState({ submitting: true });
        placeTeaserBets(teaserBetSlip, totalStake, totalWin)
            .then(({ data: { balance, newClaims, errors } }) => {
                if(newClaims)
                    showSuccessToast(`${newClaims} loyalty milestone unlocked `);
                    
                if (errors.length == 0) {
                    updateUser('balance', balance);
                    removeTeaserBet(null, null, null);
                    this.setState({ confirmationOpen: true });
                } else {
                    this.setState({ errors });
                }
            }).catch((err) => {
                this.setState({ errors: ['Can\'t place bet.'] });
            }).finally(() => {
                this.setState({ submitting: false });
            });
    }

    placeBets = () => {
        const { betSlipType } = this.props;
        switch (betSlipType) {
            case 'single':
                this.placeSingleBets();
                break;
            case 'parlay':
                this.placeParlayBets();
                break;
            case 'teaser':
                this.placeTeaserBets();
                break;
        }
    }

    setBetSlipType = (type) => {
        const { setBetSlipType } = this.props;
        setBetSlipType(type);
        this.setState({ errors: [] });
    }

    render() {
        const {
            errors, confirmationOpen, parlayWin, parlayStake, teaserWin,
            teaserStake, submitting
        } = this.state;
        const {
            betSlip, openBetSlipMenu, toggleField, removeBet, updateBet, user,
            className, showLoginModalAction, betSlipType, teaserBetSlip,
            removeTeaserBet, betEnabled, betSlipOdds, pro_mode
        } = this.props;

        let totalStake = 0;
        let totalWin = 0;
        if (betSlipType == 'single') {
            betSlip.forEach(b => {
                totalStake += b.stake;
                totalWin += b.win;
            });
        } else if (betSlipType == 'parlay') {
            totalWin = parlayWin ? parlayWin : 0;
            totalStake = parlayStake ? parlayStake : 0;
        } else if (betSlipType == 'teaser') {
            totalWin = teaserWin ? teaserWin : 0;
            totalStake = teaserStake ? teaserStake : 0;
        }
        const sportsBetSlip = betSlip.filter(bet => bet.origin != 'custom');

        const singleDisabled = betEnabled && !betEnabled.single;
        const parlayDisabled = betEnabled && !betEnabled.parlay;
        const teaserDisabled = betEnabled && !betEnabled.teaser;

        return (
            <div className={`bet-slip-contain ${className} ${openBetSlipMenu ? 'full-fixed' : ''}`}>
                {confirmationOpen && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.toggleField('confirmationOpen')} />
                    <div className="col-in">
                        <i className="fal fa-times" onClick={() => this.toggleField('confirmationOpen')} />
                        <div>
                            <center>
                                <FormattedMessage id="COMPONENTS.BET.SUBMITTED" />
                                <br />
                                <Link to={{ pathname: '/bets' }} onClick={() => this.toggleField('confirmationOpen')} className="form-button"><FormattedMessage id="COMPONENTS.BET.VIEWOPENBETS" /></Link>
                                <button className="form-button ml-2" onClick={() => this.toggleField('confirmationOpen')}><FormattedMessage id="PAGES.BACK" /></button>
                            </center>
                        </div>
                    </div>
                </div>}
                <div
                    className={`bet-slip ${(betSlip.length > 0 || teaserBetSlip.betSlip.length > 0) ? '' : 'empty'}`}
                    onClick={() => toggleField('openBetSlipMenu')}>
                    <FormattedMessage id="COMPONENTS.BETSLIP" />
                    {betSlip.length > 0 ? <span className="bet-slip-count">{betSlip.length}</span> : (
                        teaserBetSlip.betSlip.length > 0 ? <span className="bet-slip-count">{teaserBetSlip.betSlip.length}</span> : null
                    )}
                    <i className="fas fa-minus" />
                </div>
                <div className="bet-slip-content">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="home-tab">
                            {pro_mode && <div className="row bet-slip-type-container mx-0 shadow-sm">
                                <div className={`col-4 cursor-pointer bet-slip-type ${betSlipType == 'single' ? 'active' : ''}`}
                                    onClick={() => this.setBetSlipType('single')}>
                                    Single
                                </div>
                                <div className={`col-4 cursor-pointer bet-slip-type ${betSlipType == 'parlay' ? 'active' : ''}`}
                                    onClick={() => this.setBetSlipType('parlay')}>
                                    Parlay
                                </div>
                                <div className={`col-4 cursor-pointer bet-slip-type ${betSlipType == 'teaser' ? 'active' : ''}`}
                                    onClick={() => this.setBetSlipType('teaser')}>
                                    Teaser
                                </div>
                            </div>}
                            {betSlipType == 'single' && <div className={`bet-slip-list ${pro_mode ? '' : 'basic-mode'} ${betSlip.length > 0 ? '' : 'empty'}`}>
                                {user && user.balance < totalStake && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '10px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS" /></b></div>
                                        <div><FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS_CONTENT" /></div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            type="button"
                                            className="deposit-btn text-center"
                                            to="/deposit">
                                            <FormattedMessage id="COMPONENTS.DEPOSIT" />
                                        </Link>
                                    </div>
                                </div>}
                                {singleDisabled && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '14px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.SINGLE_BET_UNAVAILABLE" /></b></div>
                                    </div>
                                </div>}
                                {betSlip.length > 0 ?
                                    betSlip.map(bet => (pro_mode ?
                                        (
                                            <Bet
                                                bet={bet}
                                                removeBet={removeBet}
                                                updateBet={updateBet}
                                                betSlipOdds={betSlipOdds}
                                                key={`${bet.lineId}${bet.pick}${bet.type}${bet.index}${bet.subtype}`} />
                                        ) :
                                        (
                                            <BetBasic
                                                bet={bet}
                                                removeBet={removeBet}
                                                updateBet={updateBet}
                                                betSlipOdds={betSlipOdds}
                                                placeBets={this.placeBets}
                                                user={user}
                                                showLoginModalAction={showLoginModalAction}
                                                toggleField={toggleField}
                                                errors={errors}
                                                submitting={submitting}
                                                key={`${bet.lineId}${bet.pick}${bet.type}${bet.index}${bet.subtype}`} />
                                        )
                                    ))
                                    : (
                                        <div className="no-bets">
                                            <div>
                                                <h4><FormattedMessage id="COMPONENTS.NOBET" /></h4>
                                                <small><FormattedMessage id="COMPONENTS.CLICK.ODD" /></small>
                                            </div>
                                        </div>
                                    )}
                            </div>}
                            {!pro_mode && <div className="bet-type-league help"><a href='https://wa.me/message/TICMRPXRFQRCN1' target="_blank" className="bet-max-win"><i className='fab fa-whatsapp' /> Need Help?</a></div>}
                            {betSlipType == 'parlay' && <div className={"bet-slip-list" + (betSlip.length > 0 ? '' : ' empty')}>
                                {user && user.balance < totalStake && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '10px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS" /></b></div>
                                        <div><FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS_CONTENT" /></div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            type="button"
                                            className="deposit-btn text-center"
                                            to="/deposit">
                                            <FormattedMessage id="COMPONENTS.DEPOSIT" />
                                        </Link>
                                    </div>
                                </div>}
                                {parlayDisabled && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '14px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.PARLAY_BET_UNAVAILABLE" /></b></div>
                                    </div>
                                </div>}
                                {sportsBetSlip.length > 1 ?
                                    <BetParlay
                                        betSlip={sportsBetSlip}
                                        stake={parlayStake}
                                        win={parlayWin}
                                        betSlipOdds={betSlipOdds}
                                        setParlayBet={(data) => this.setState(data)}
                                    /> : (
                                        <div className="no-bets">
                                            <h4><FormattedMessage id="COMPONENTS.BETSLIP.NOBET_PARLAY" /></h4>
                                            <small><FormattedMessage id="COMPONENTS.CLICK.ODD" /></small>
                                        </div>
                                    )}
                            </div>}
                            {betSlipType == 'teaser' && <div className={"bet-slip-list" + (betSlip.length > 0 ? '' : ' empty')}>
                                {user && user.balance < totalStake && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '10px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS" /></b></div>
                                        <div><FormattedMessage id="COMPONENTS.BETSLIP.INSUFFICENTFUNDS_CONTENT" /></div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            type="button"
                                            className="deposit-btn text-center"
                                            to="/deposit">
                                            <FormattedMessage id="COMPONENTS.DEPOSIT" />
                                        </Link>
                                    </div>
                                </div>}
                                {teaserDisabled && <div className="bet p-0 m-1">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '14px' }}>
                                        <div><b><i className="fas fa-info-circle" /> <FormattedMessage id="COMPONENTS.TEASER_BET_UNAVAILABLE" /></b></div>
                                    </div>
                                </div>}
                                {teaserBetSlip.betSlip.length > 0 ?
                                    <BetTeaser
                                        teaserBetSlip={teaserBetSlip}
                                        stake={teaserStake}
                                        win={teaserWin}
                                        removeBet={removeTeaserBet}
                                        setTeaserBet={(data) => this.setState(data)}
                                    />
                                    : (
                                        <div className="no-bets teaser">
                                            <h4><FormattedMessage id="COMPONENTS.TEASER_MINUMUM" /></h4>
                                            <ul className="teaser-links">
                                                <li><Link to='/sport/basketball/teaser' onClick={() => toggleField('openBetSlipMenu', false)}><img src='/images/sports/basketball.png' className='teaser-image' /> Basketball Teasers</Link></li>
                                                <li><Link to="/sport/football/teaser" onClick={() => toggleField('openBetSlipMenu', false)}><img src="/images/sports/football.png" className='teaser-image' /> Football Teasers</Link></li>
                                            </ul>
                                        </div>
                                    )}
                            </div>}
                            {pro_mode && betSlip.length > 0 && <div className="total-content">
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        <FormattedMessage id="COMPONENTS.TOTAL.RISK" />
                                    </div>
                                    <div className="total-st-left text-right">
                                        CAD {totalStake.toFixed(2)}
                                    </div>
                                </div>
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        <FormattedMessage id="COMPONENTS.TOTAL.WIN" />
                                    </div>
                                    <div className="total-st-left text-right">
                                        CAD {totalWin.toFixed(2)}
                                    </div>
                                </div>
                                <div className="form-error">
                                    {errors.map(e => <div key={e}>{e}</div>)}
                                </div>
                                <button
                                    disabled={submitting}
                                    type="button"
                                    className={'total-btn' + (submitting ? ' is-loading' : '')}
                                    onClick={user
                                        ? this.placeBets
                                        : () => {
                                            showLoginModalAction(true);
                                            toggleField('openBetSlipMenu', false);
                                        }
                                    }>
                                    {user ? <FormattedMessage id="COMPONENTS.BETSLIP.PLACEALL" /> : <FormattedMessage id="COMPONENTS.BETSLIP.LOGIN" />}
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    maxBetLimitTier: state.frontend.maxBetLimitTier,
    pro_mode: state.frontend.pro_mode,
    betEnabled: state.frontend.betEnabled,
});


export default connect(mapStateToProps, frontend.actions)(injectIntl(BetSlip));