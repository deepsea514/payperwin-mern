import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Bet from "./bet";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import _env from '../env.json';
import BetParlay from './betparlay';
const serverUrl = _env.appUrl;

class BetSlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            submitting: true,
            confirmationOpen: false,
            single: true,
            parlayWin: '',
            parlayStake: '',
        };
    }

    componentDidUpdate(prevProps) {
        const { betSlip } = this.props;
        const { betSlip: prevBetSlip } = prevProps;
        if (JSON.stringify(betSlip) != JSON.stringify(prevBetSlip)) {
            this.setState({ parlayStake: '', parlayWin: '' });
        }
    }

    toggleField = (fieldName, forceState) => {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    placeSingleBets = () => {
        const { updateUser, user, betSlip, removeBet } = this.props;
        this.setState({ errors: [] });

        let totalStake = 0;
        let totalWin = 0;
        for (let i = 0; i < betSlip.length; i++) {
            const b = betSlip[i];
            totalStake += b.stake;
            totalWin += b.win;
            if (b.win > 5000) {
                this.setState({ errors: [`${b.pickName} ${b.odds[b.pick]} wager could not be placed. Exceed maximum win amount.`] });
                return;
            }
        }
        if (user && totalStake > user.balance) {
            this.setState({ errors: [`Insufficient Funds. You do not have sufficient funds to place these bets.`] });
            return;
        }
        this.setState({ submitting: true });
        axios.post(`${serverUrl}/placeBets`, { betSlip }, { withCredentials: true })
            .then(({ data: { balance, errors } }) => {
                const successCount = betSlip.length - (errors ? errors.length : 0);
                const stateChanges = {};
                if (successCount) {
                    updateUser('balance', balance);
                    removeBet(null, null, null, null, null, true);
                    stateChanges.confirmationOpen = true;
                }
                if (errors && errors.length) stateChanges.errors = errors;
                if (successCount || errors) {
                    this.setState(stateChanges);
                }
            }).catch((err) => {
                if (err.response && err.response.data) {
                    const { error } = err.response.data;
                    this.setState({ formError: error });
                } else {
                    this.setState({ errors: ['Can\'t place bet.'] });
                }
            }).finally(() => {
                this.setState({ submitting: false });
            });
    }

    placeParlayBets = () => {
        const { updateUser, user, betSlip, removeBet } = this.props;
        const { parlayStake, parlayWin } = this.state;
        this.setState({ errors: [] });
        let totalWin = parlayWin ? parlayWin : 0;
        let totalStake = parlayStake ? parlayStake : 0;
        if (user && totalStake > user.balance) {
            this.setState({ errors: [`Insufficient Funds. You do not have sufficient funds to place these bets.`] });
            return;
        }
        if (totalWin > 5000) {
            this.setState({ errors: [`Parlay wager could not be placed. Exceed maximum win amount.`] });
            return;
        }
        this.setState({ submitting: true });
        axios.post(`${serverUrl}/placeParlayBets`, { betSlip, totalStake, totalWin }, { withCredentials: true })
            .then(({ data: { balance, errors } }) => {
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

    placeBets = () => {
        const { single } = this.state;
        single ? this.placeSingleBets() : this.placeParlayBets();
    }

    render() {
        const { errors, confirmationOpen, single, parlayWin, parlayStake, submitting } = this.state;
        const {
            betSlip, openBetSlipMenu, toggleField, removeBet, updateBet, user,
            className, showLoginModalAction
        } = this.props;

        let totalStake = 0;
        let totalWin = 0;
        if (single) {
            betSlip.forEach(b => {
                totalStake += b.stake;
                totalWin += b.win;
            });
        } else {
            totalWin = parlayWin ? parlayWin : 0;
            totalStake = parlayStake ? parlayStake : 0;
        }
        const sportsBetSlip = betSlip.filter(bet => bet.origin != 'other');

        return (
            <div className={`bet-slip-contain ${className} ${openBetSlipMenu ? 'full-fixed' : ''}`}>
                {confirmationOpen && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.toggleField('confirmationOpen')} />
                    <div className="col-in">
                        <i className="fal fa-times" onClick={() => this.toggleField('confirmationOpen')} />
                        <div>
                            <center>
                                Your bet has been submitted.
                                <br />
                                <Link to={{ pathname: '/bets' }} onClick={() => this.toggleField('confirmationOpen')} className="form-button">View open bets</Link> <button className="form-button" onClick={() => this.toggleField('confirmationOpen')}>go back</button>
                            </center>
                        </div>
                    </div>
                </div>}
                <div
                    className={`bet-slip ${betSlip.length > 0 ? '' : 'empty'}`}
                    onClick={() => toggleField('openBetSlipMenu')}>
                    BET SLIP
                    {betSlip.length > 0 ? <span className="bet-slip-count">{betSlip.length}</span> : null}
                    <i className="fas fa-minus" />
                </div>
                <div className="bet-slip-content">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="Singles" role="tabpanel" aria-labelledby="home-tab">
                            <div className="row bet-slip-type-container mx-0 shadow-sm">
                                <div className={`col-6 cursor-pointer bet-slip-type ${single ? 'active' : ''}`}
                                    onClick={() => this.setState({ single: true })}>
                                    Single Bets
                                </div>
                                <div className={`col-6 cursor-pointer bet-slip-type ${!single ? 'active' : ''}`}
                                    onClick={() => this.setState({ single: false })}>
                                    Parlay
                                </div>
                            </div>
                            {single && <div className="bet-slip-list">
                                {user && user.balance < totalStake && <div className="bet p-0">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '10px' }}>
                                        <div><b><i className="fas fa-info-circle" /> Insufficient Funds</b></div>
                                        <div>You do not have sufficient funds to place these bets. Please deposit now to continue betting.</div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            type="button"
                                            className="deposit-btn text-center"
                                            to="/deposit">
                                            Deposit
                                        </Link>
                                    </div>
                                </div>}
                                {betSlip.length > 0 ?
                                    betSlip.map(bet => <Bet
                                        bet={bet}
                                        removeBet={removeBet}
                                        updateBet={updateBet}
                                        key={`${bet.lineId}${bet.pick}${bet.type}${bet.index}${bet.subtype}`} />)
                                    : <div className="no-bets">
                                        <h4>There are no bets on your ticket.</h4>
                                        <small>Click the odds to add a bet</small>
                                    </div>}
                            </div>}
                            {!single && <div className="bet-slip-list">
                                {user && user.balance < totalStake && <div className="bet p-0">
                                    <div className="p-1 bg-light-danger betslip-deposit-message" style={{ fontSize: '10px' }}>
                                        <div><b><i className="fas fa-info-circle" /> Insufficient Funds</b></div>
                                        <div>You do not have sufficient funds to place these bets. Please deposit now to continue betting.</div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            type="button"
                                            className="deposit-btn text-center"
                                            to="/deposit">
                                            Deposit
                                        </Link>
                                    </div>
                                </div>}
                                {sportsBetSlip.length > 1 ?
                                    <BetParlay
                                        betSlip={sportsBetSlip}
                                        stake={parlayStake}
                                        win={parlayWin}
                                        setParlayBet={(data) => this.setState(data)}
                                    /> :
                                    <div className="no-bets">
                                        <h4>To place a Multiples bet you need a minimum of two bets on your Bet Slip. Alternatively, you can place a Singles bet.</h4>
                                        <small>Click the odds to add a bet</small>
                                    </div>}
                            </div>}
                            <div className="total">
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        Total Risk
                                    </div>
                                    <div className="total-st-left text-right">
                                        CAD {totalStake.toFixed(2)}
                                    </div>
                                </div>
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        Total Win
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
                                    className="total-btn"
                                    onClick={user
                                        ? this.placeBets
                                        : () => {
                                            showLoginModalAction(true);
                                            toggleField('openBetSlipMenu');
                                        }
                                    }>
                                    {user ? 'Place All Bets' : 'Log in and Place Bets'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, frontend.actions)(BetSlip);