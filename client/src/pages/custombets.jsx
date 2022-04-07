import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from 'dateformat';
import sportNameImage from "../helpers/sportNameImage";
import { getBets, voteEvent } from '../redux/services';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { showErrorToast } from '../libs/toast';
import QRCode from "react-qr-code";
import { Tooltip } from '@material-ui/core';

export default class CustomBets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            bets: [],
            shareModal: false,
            lineUrl: '',
            urlCopied: false,
        };
    }

    componentDidMount() {
        const title = 'Side Bets';
        setTitle({ pageTitle: title });
        this.getCustomBetsHistory();
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if (!prevUser && user) {
            this.setState({ error: null });
            this.getCustomBetsHistory();
        }
    }

    getCustomBetsHistory = () => {
        this.setState({ loading: true });
        getBets({ custom: true })
            .then(({ data }) => {
                if (data) {
                    this.setState({ bets: data, loading: false })
                }
            }).catch((err) => {
                this.setState({ error: err, loading: false });
            });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getStatusClass = (status, outcome) => {
        switch (status) {
            case 'Matched':
                return 'matched';
            case 'Partial Match':
                return 'partialmatched';
            case 'Cancelled':
                return 'cancelled'
            case 'Settled - Lose':
                return 'loss';
            case 'Settled - Win':
                return 'win';
            case 'Draw':
                return 'draw'
            case 'Pending':
                return 'pending';
            case 'Accepted':
                return 'matched';
            case 'Partial Accepted':
                return 'partialmatched';
            case 'Win':
                return 'win';
            case 'Lose':
                return 'loss';
        }
    }

    voteEvent = (bet_id, event_id, pick) => {
        voteEvent(event_id, pick)
            .then(({ data }) => {
                const { success, error, votes } = data;
                if (success) {
                    const { bets } = this.state;
                    this.setState({
                        bets: bets.map(bet => {
                            if (bet._id == bet_id) {
                                return {
                                    ...bet,
                                    event: {
                                        ...bet.event,
                                        votes: votes
                                    }
                                }
                            }
                            return bet;
                        })
                    })
                } else {
                    showErrorToast(error);
                }
            })
            .catch(error => {
                showErrorToast('Cannot vote on this event. Please try again later.');
            })
    }

    checkEventStarted = (matchStartDate) => {
        if ((new Date(matchStartDate)).getTime() < (new Date()).getTime())
            return true;
        return false;
    }

    render() {
        const { loading, error, bets, shareModal, lineUrl, urlCopied } = this.state;
        const { user } = this.props;

        return (
            <div className="col-in px-3">
                <div className="d-flex justify-content-between">
                    <h3>Side Bets</h3>
                    {user && <Link className="form-button"
                        to="/side-bets/create"
                        onClick={() => this.setState({ createModal: true })}>
                        <i className="fas fa-plus-square" /> Create a Bet
                    </Link>}
                </div>
                <br />
                <div className='text-white'>
                    Create and Share with friends to bet with or against you publicly or privately.
                    The Bet Creator <Tooltip arrow
                        title={<p className='text-white mb-0 p-1'>The user that creates the bet</p>}>
                        <i className='fas fa-question-circle' />
                    </Tooltip> is the High Staker. <Tooltip arrow
                        title={<p className='text-white mb-0 p-1'>Players put up a stake and are betting against the High Staker. When the players lose, the High Staker takes their stake.</p>}>
                        <i className='fas fa-question-circle' />
                    </Tooltip>&nbsp;
                    Set the maximum risk amount you're willing to payout if you lose.
                    All Side Bets are subject to approval by Payper Win.
                    <br />
                    <br />
                    Custom bet examples.
                    <br />
                    <ul style={{ listStyle: 'inside' }}>
                        <li>“Will there be a fight within the first 10 minutes of the Montreal Canadiens vs Toronto Maple Leafs Hockey game?”</li>
                        <li>“Which of the bridesmaid will catch the bouquet?”</li>
                        <li>“Will bitcoin pump or dump tomorrow?”</li>
                    </ul>
                </div>
                <div>
                    {shareModal && <div className="modal confirmation">
                        <div className="background-closer" onClick={() => this.setState({ shareModal: false })} />
                        <div className="col-in">
                            <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                            <div>
                                <b>Share Bet</b>
                                <hr />
                                <div className="row">
                                    <div className="col input-group mb-3">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Line's URL"
                                            value={lineUrl}
                                            readOnly
                                        />
                                        <div className="input-group-append">
                                            {!urlCopied && <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={this.copyUrl}
                                            >
                                                <i className="fas fa-clipboard" /> Copy
                                            </button>}
                                            {urlCopied && <button
                                                className="btn btn-outline-success"
                                                type="button">
                                                <i className="fas fa-clipboard-check" /> Copied
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                                <center>
                                    <div className="mt-2 bg-white py-3">
                                        <QRCode value={lineUrl} />
                                    </div>
                                </center>
                                <div className="text-right">
                                    <button className="form-button ml-2" onClick={() => this.setState({ shareModal: false })}> Close </button>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {loading && <center><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                    </center>}
                    {error && <p>Error...</p>}
                    {bets.map(betObj => {
                        const {
                            _id,
                            bet,
                            toWin,
                            matchStartDate,
                            pickName,
                            pickOdds,
                            createdAt,
                            status,
                            credited,
                            event,
                            lineQuery,
                        } = betObj;
                        const voted = event && event.votes && event.votes.find(vote => vote && vote.find(voted => voted == user.userId));
                        const sportName = "Side Bet";
                        const gameEnded = event && new Date(event.endDate).getTime() <= new Date().getTime();
                        return (
                            <div className="open-bets" key={_id}>
                                <div className="open-bets-flex">
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BET" /></strong>
                                        <div>
                                            {dateformat(createdAt, 'ddd, mmm dd, yyyy, HH:MM')}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BETTYPE" /></strong>
                                        <div>
                                            Moneyline @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                        <div>
                                            {pickName}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.RISK" /></strong>
                                        <div>{bet.toFixed(2)}</div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.TOWIN" /></strong>
                                        <div>
                                            {toWin.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="open-bets-col status">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.STATUS" /></strong>
                                        <div className={this.getStatusClass(status) + ' cursor-pointer'}>
                                            {status ? status : 'Accepted'}
                                        </div>
                                    </div>
                                </div>
                                <div className="open-bets-event">
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} className="my-0" />
                                    {lineQuery.eventName}
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <FormattedMessage id="PAGES.OPENBETS.EVENT_DATE" />: {dateformat(matchStartDate, 'ddd, mmm dd, yyyy, HH:MM')}
                                        </div>
                                    </div>
                                    {event && gameEnded && <div className='d-flex mt-1'>
                                        {event.options.map((option, index) => ((voted || status != 'Accepted') ?
                                            (
                                                <span key={index}
                                                    className={`label label-lg label-outline-success label-inline ${index && 'ml-2'}`}>
                                                    {option} ({event.votes && event.votes[index] ? event.votes && event.votes[index].length : 0})
                                                </span>
                                            ) :
                                            (
                                                <span key={index}
                                                    onClick={() => this.voteEvent(bet._id, event._id, index)}
                                                    className={`label label-lg label-info label-inline ${index && 'ml-2'} cursor-pointer`}>
                                                    {option} ({event.votes && event.votes[index] ? event.votes && event.votes[index].length : 0})
                                                </span>
                                            )
                                        ))}
                                    </div>}
                                    {status == 'Settled - Win' && <div><strong><FormattedMessage id="PAGES.OPENBETS.CREDITED" />: ${credited.toFixed(2)}</strong></div>}
                                    {status == 'Settled - Lose' && <div><strong><FormattedMessage id="PAGES.OPENBETS.DEBITED" />: ${bet.toFixed(2)}</strong></div>}
                                    {['Draw', 'Cancelled'].includes(status) && <div><strong><FormattedMessage id="PAGES.OPENBETS.CREDITED" />: ${bet.toFixed(2)}</strong></div>}
                                    {event && !this.checkEventStarted(matchStartDate) &&
                                        <button className="form-button" onClick={() => this.setState({
                                            lineUrl: window.location.origin + '/side-bet/' + event.uniqueid,
                                            urlCopied: false,
                                            shareModal: true
                                        })}><i className="fas fa-link" /> Share Bet</button>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
