import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Bet from "./bet";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class BetSlip extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            confirmationOpen: false,
        };
        this.placeBets = this.placeBets.bind(this);
        this.toggleField = this.toggleField.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    toggleField(fieldName, forceState) {
        if (typeof this.state[fieldName] !== 'undefined') {
            this.setState({
                [fieldName]: typeof forceState === 'boolean' ? forceState : !this.state[fieldName]
            });
        }
    }

    placeBets() {
        const { updateUser, betSlip, removeBet } = this.props;
        const url = `${serverUrl}/placeBets`;
        axios({
            method: 'post',
            url,
            data: {
                betSlip,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(({ data: { balance, errors } }) => {
            const successCount = betSlip.length - (errors ? errors.length : 0);
            const stateChanges = {};
            if (successCount) {
                updateUser('balance', balance);
                removeBet(null, null, true);
                stateChanges.confirmationOpen = true;
            }
            if (errors) stateChanges.errors = errors;
            if (successCount || errors) {
                this.setState(stateChanges);
            }
        }).catch((err) => {
            if (err.response && err.response.data) {
                const { error } = err.response.data;
                this.setState({ formError: error });
            }
        });
    }

    render() {
        const { errors, confirmationOpen } = this.state;
        const { betSlip, openBetSlipMenu, toggleField, removeBet, updateBet, user, history } = this.props;
        let totalStake = 0;
        let totalWin = 0;
        betSlip.forEach(b => {
            totalStake += b.stake;
            totalWin += b.win;
        });
        return (
            <div className={`bet-slip-contain ${openBetSlipMenu ? 'full-fixed' : ''}`}>
                {
                    confirmationOpen ? (
                        <div className="modal confirmation">
                            <div className="background-closer" onClick={() => this.toggleField('confirmationOpen')} />
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
                        </div>
                    ) : null
                }
                <div
                    className={`bet-slip ${betSlip.length > 0 ? '' : 'empty'}`}
                    onClick={() => toggleField('openBetSlipMenu')}
                >
                    BET SLIP
                    {betSlip.length > 0 ? <span className="bet-slip-count">{betSlip.length}</span> : null}
                    <i className="fas fa-minus" />
                </div>
                <div className="bet-slip-content">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="Singles" role="tabpanel" aria-labelledby="home-tab">
                            <div className="bet-slip-list">
                                {
                                    betSlip.length > 0 ? (
                                        <React.Fragment>
                                            {betSlip.map(bet => <Bet
                                                bet={bet}
                                                removeBet={removeBet}
                                                updateBet={updateBet}
                                                key={`${bet.lineId}${bet.pick}${bet.type}`}
                                            />)}
                                        </React.Fragment>
                                    ) :
                                        (
                                            <div className="no-bets">
                                                <h4>There are no bets on your ticket.</h4>
                                                <small>Click the odds to add a bet</small>
                                            </div>
                                        )
                                }
                            </div>
                            <div className="total">
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        Total Risk
                                    </div>
                                    <div className="total-st-left text-right">
                                        USD {totalStake.toFixed(2)}
                                    </div>
                                </div>
                                <div className="total-stack d-flex">
                                    <div className="total-st-left">
                                        Total Win
                                    </div>
                                    <div className="total-st-left text-right">
                                        USD {totalWin.toFixed(2)}
                                    </div>
                                </div>
                                <div className="form-error">
                                    {errors.map(e => <div key={e}>{e}</div>)}
                                </div>
                                <button
                                    type="button"
                                    className="total-btn"
                                    onClick={
                                        user
                                            ? this.placeBets
                                            : () => {
                                                history.replace({ pathname: '/login' });
                                                toggleField('openBetSlipMenu');
                                            }
                                    }
                                >
                                    {user ? 'Place All Bets' : 'Log in and Place Bets'}
                                </button>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="Multiples" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="no-bets">
                                <h4>There are no bets on your ticket.</h4>
                                <small>Click the odds to add a bet</small>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="Teasers" role="tabpanel" aria-labelledby="contact-tab">
                            <div className="no-bets">
                                <h4>There are no bets on your ticket.</h4>
                                <small>Click the odds to add a bet</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
