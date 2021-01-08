import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import sportNameIcon from '../helpers/sportNameIcon';
import axios from 'axios';

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

  render() {
    const { stake, win } = this.state;
    const { bet, removeBet } = this.props;
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
        <span className="bet-pick-odds">{odds[pick] > 0 ? '+' : ''}{odds[pick]}</span>
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
    const serverUrl = window.apiServer;
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
    }).then(({ data: { balance, errors} }) => {
      const successCount = betSlip.length - (errors ? errors.length : 0);
      const stateChanges = {};
      if (successCount) {
        updateUser('balance', balance);
        removeBet(null, null, true);
        stateChanges.confirmationOpen =  true;
      }
      if (errors) stateChanges.errors = errors;
      if (successCount || errors) {
        this.setState(stateChanges);
      }
    }).catch((err) => {
      console.log(1);
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
          {betSlip.length > 0 ? <span className="bet-slip-count">{betSlip.length}</span> : null }
          <i className="fas fa-minus" />
        </div>
        <div className="bet-slip-content">
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="Singles" role="tabpanel" aria-labelledby="home-tab">
            <div className="bet-slip-list">
              {
                betSlip.length > 0 ? (
                  <React.Fragment>
                    {
                      betSlip.map(bet => <Bet bet={bet} removeBet={removeBet} updateBet={updateBet} key={`${bet.lineId}${bet.pick}${bet.type}`} />)
                    }
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
                  { errors.map(e => <div key={e}>{e}</div>)}
                </div>
                <button
                  type="button"
                  className="total-btn"
                  onClick={
                    user
                    ? this.placeBets
                    : () => history.replace({ pathname: '/login' })
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
