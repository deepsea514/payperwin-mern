import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import sportNameImage from "../helpers/sportNameImage";
import dayjs from 'dayjs';
import { Popover, OverlayTrigger } from "react-bootstrap";
import QRCode from "react-qr-code";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { connect } from "react-redux";
import TourModal from '../components/tourModal';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class OpenBets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bets: [],
            error: null,
            shareModal: false,
            loadingUrl: false,
            lineUrl: '',
            urlCopied: false,
        };
    }

    componentDidMount() {
        const { settledBets } = this.props;
        const title = settledBets ? 'Bet History' : 'Open Bets';
        setTitle({ pageTitle: title })
        this.getBetHistory();
    }

    componentDidUpdate(prevProps) {
        const { openBets, user } = this.props;
        const { openBets: prevOpenBets, user: prevUser } = prevProps;
        const betPageChanged = openBets !== prevOpenBets;

        if (betPageChanged || (!prevUser && user)) {
            this.setState({ error: null });
            this.getBetHistory();
        }
    }

    getBetHistory() {
        let url1 = `${serverUrl}/bets`;
        const { openBets, settledBets } = this.props;
        if (openBets) {
            url1 += '?openBets=true'
        } else if (settledBets) {
            url1 += '?settledBets=true'
        }
        axios({
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then(({ data }) => {
                if (data) {
                    this.setState({ bets: data })
                }
            }).catch((err) => {
                this.setState({ error: err });
            });

        // let url2 = `${serverUrl}/bets-sportsbook`;
        // if (openBets) {
        //     url2 += '?openBets=true'
        // } else if (settledBets) {
        //     url2 += '?settledBets=true'
        // }
        // axios({
        //     method: 'get',
        //     url: url2,
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     withCredentials: true,
        // })
        //     .then(({ data }) => {
        //         if (data) {
        //             this.setState({ betsSportsBook: data })
        //         }
        //     }).catch((err) => {
        //         this.setState({ error: err });
        //     });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getPinnacleBetType = (type) => {
        switch (type) {
            case 1:
                return 'Moneyline';
            case 2:
                return 'Spread';
            case 3:
            case 4:
            case 5:
                return 'Total';
            default:
                return '';
        }
    }

    checkEventStarted = (matchStartDate) => {
        if ((new Date(matchStartDate)).getTime() < (new Date()).getTime())
            return true;
        return false;
    }

    shareLink = (lineQuery, matchStartDate) => () => {
        const { type, sportName, leagueId, eventId, index } = lineQuery;
        const generatedLineUrl = `${window.location.origin}/sport/${sportName}/league/${leagueId}/event/${eventId}`;
        this.setState({ shareModal: true, urlCopied: false, loadingUrl: true });
        axios.put(
            `${serverUrl}/share-line`,
            { url: generatedLineUrl, eventDate: matchStartDate, type, index },
            { withCredentials: true }
        ).then(({ data }) => {
            const { url, index, type, uniqueId } = data;
            this.setState({ loadingUrl: false, lineUrl: `${url}?type=${type}${isNaN(index) ? '' : `&index=${index}`}&uniqueId=${uniqueId}` });
        }).catch(() => {
            this.setState({ loadingUrl: false, lineUrl: '' });
        })
    }

    copyUrl = () => {
        const { lineUrl } = this.state;
        navigator.clipboard.writeText(lineUrl);
        this.setState({ urlCopied: true });
    }

    getStatusClass = (status, outcome) => {
        switch (status) {
            // p2p
            case 'Pending':
                return 'pending';
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
            // sportsbook
            case 'BETTED':
                return 'pending';
            case 'ACCEPTED':
                return 'matched';
            case 'REJECTED':
                return 'cancelled';
            case 'CANCELLED':
                return 'cancelled';
            case 'ROLLBACKED':
                return 'cancelled';
            case 'UNSETTLED':
                return 'cancelled';
            case 'SETTLED':
                if (outcome == 'WIN') return 'win';
                return 'loss';
        }
    }

    render() {
        const { bets, shareModal, lineUrl, urlCopied, loadingUrl } = this.state;
        const { openBets, settledBets, showedTourTimes, showTour } = this.props;
        return (
            <div className="col-in">
                {openBets && showedTourTimes < 3 && showTour && <TourModal />}
                {shareModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ shareModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                        <div>
                            <b>Share This Link</b>
                            <hr />
                            {loadingUrl && <center>
                                <Preloader use={ThreeDots}
                                    size={100}
                                    strokeWidth={10}
                                    strokeColor="#F0AD4E"
                                    duration={800} />
                            </center>}
                            {!loadingUrl && !lineUrl && <h4>Can't generate URL. </h4>}
                            {!loadingUrl && lineUrl && <>
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
                            </>}
                            <div className="text-right">
                                <button className="form-button ml-2" onClick={() => this.setState({ shareModal: false })}> Close </button>
                            </div>
                        </div>
                    </div>
                </div>}
                <h3>{settledBets ? 'Bet History' : 'Open Bets'}</h3>
                {bets.map(betObj => {
                    const {
                        _id,
                        teamA,
                        teamB,
                        bet,
                        toWin,
                        matchStartDate,
                        pick,
                        pickName,
                        pickOdds,
                        createdAt,
                        status,
                        credited,
                        homeScore,
                        awayScore,
                        payableToWin,
                        matchingStatus,
                        lineQuery,
                        origin,
                    } = betObj;
                    if (origin == "other") {
                        const type = "moneyline";
                        const sportName = "Other";
                        return (
                            <div className="open-bets" key={_id}>
                                <div className="open-bets-flex">
                                    <div className="open-bets-col">
                                        <strong>Bet</strong>
                                        <div>
                                            {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong>Bet Type</strong>
                                        <div>
                                            {this.capitalizeFirstLetter(type)} @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                        <div>
                                            {pickName}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong>Risk</strong>
                                        <div>
                                            {bet.toFixed(2)}
                                        </div>
                                    </div>
                                    {/* <div className="open-bets-col">
                                        <strong>Odds</strong>
                                        <div>
                                            {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                    </div> */}
                                    <div className="open-bets-col">
                                        <strong>To win</strong>
                                        {matchingStatus === 'Partial Match' && <div>
                                            {toWin.toFixed(2)}
                                            <br />
                                            {payableToWin.toFixed(2)} Matched
                                            <br />
                                            {(toWin - payableToWin).toFixed(2)} Pending
                                        </div>}
                                        {matchingStatus !== 'Partial Match' && <div>
                                            {toWin.toFixed(2)} {matchingStatus}
                                        </div>}
                                    </div>
                                    <div className="open-bets-col status">
                                        <strong>Status</strong>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement={'left'}
                                            overlay={
                                                <Popover>
                                                    <Popover.Body>
                                                        <h6>Bet Status</h6>
                                                        <div className="verification-proof-list">
                                                            <ul>
                                                                <li>
                                                                    <b>Waiting for Match:</b> Your bet is waiting for another an opposite wager. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game.
                                                                </li>
                                                                <li>
                                                                    <b>Matched:</b> Your entire bet was matched and you wager is in play.
                                                                </li>
                                                                <li>
                                                                    <b>Partially Match:</b> Only a portion of your wager was matched with another user.
                                                                    The unmatched amount is waiting for a match. You can forward the bet to the Sportsbook for an instant match.
                                                                </li>
                                                                <li>
                                                                    <b>Settled:</b> The game is over and the winner has been paid.
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <button className={this.getStatusClass(status) + ' cursor-pointer'}>
                                                {status ? status : 'Accepted'}
                                            </button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="open-bets-event">
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                    {lineQuery.eventName}
                                    <div>
                                        Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                        {/* <strong className="float-right bg-primary">Peer To Peer</strong> */}
                                    </div>
                                    {settledBets && status == 'Settled - Win' && <div><strong>Credited: ${credited.toFixed(2)}</strong></div>}
                                    {settledBets && status == 'Settled - Lose' && <div><strong>Debited: ${bet.toFixed(2)}</strong></div>}
                                    {settledBets && ['Draw', 'Cancelled'].includes(status) && <div><strong>Credited: ${bet.toFixed(2)}</strong></div>}
                                </div>
                            </div>
                        );
                    }

                    const { type, sportName } = lineQuery;

                    return (
                        <div className="open-bets" key={_id}>
                            <div className="open-bets-flex">
                                <div className="open-bets-col">
                                    <strong>Bet</strong>
                                    <div>
                                        {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Bet Type</strong>
                                    <div>
                                        {this.capitalizeFirstLetter(type)} @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                    </div>
                                    <div>
                                        {pickName}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Risk</strong>
                                    <div>
                                        {bet.toFixed(2)}
                                    </div>
                                </div>
                                {/* <div className="open-bets-col">
                                    <strong>Odds</strong>
                                    <div>
                                        {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                    </div>
                                </div> */}
                                <div className="open-bets-col">
                                    <strong>To win</strong>
                                    {matchingStatus === 'Partial Match' && <div>
                                        {toWin.toFixed(2)}
                                        <br />
                                        {payableToWin.toFixed(2)} Matched
                                        <br />
                                        {(toWin - payableToWin).toFixed(2)} Pending
                                    </div>}
                                    {matchingStatus !== 'Partial Match' && <div>
                                        {toWin.toFixed(2)} {matchingStatus}
                                    </div>}
                                </div>
                                <div className="open-bets-col status">
                                    <strong>Status</strong>
                                    <OverlayTrigger
                                        trigger="click"
                                        placement={'bottom'}
                                        rootClose={true}
                                        overlay={
                                            <Popover>
                                                <div className="m-2" style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px' }}>
                                                    <h6>Bet Status</h6>
                                                    <div className="verification-proof-list">
                                                        <ul>
                                                            <li>
                                                                <b>Waiting for Match:</b> Your bet is waiting for another an opposite wager. We will notify when we find you a match. An unmatched wager will be refunded upon the start of the game.
                                                            </li>
                                                            <li>
                                                                <b>Matched:</b> Your entire bet was matched and you wager is in play.
                                                            </li>
                                                            <li>
                                                                <b>Partially Match:</b> Only a portion of your wager was matched with another user.
                                                                The unmatched amount is waiting for a match. You can forward the bet to the Sportsbook for an instant match.
                                                            </li>
                                                            <li>
                                                                <b>Settled:</b> The game is over and the winner has been paid.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Popover>
                                        }
                                    >
                                        <div className={this.getStatusClass(status) + ' cursor-pointer'}>
                                            {status ? (status == 'Pending' ? 'WAITING FOR MATCH' : status) : 'Accepted'}
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="open-bets-event">
                                {/* <i className={`${sportNameIcon(sportName) || 'fas fa-trophy'}`} /> */}
                                <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                {`${teamA.name} vs ${teamB.name}`}
                                {homeScore && awayScore ? <div>{pickName}</div> : null}
                                <div>
                                    Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                    {/* <strong className="float-right bg-primary">Peer To Peer</strong> */}
                                </div>
                                {homeScore && awayScore ? (<div><strong>Final Score: {homeScore} - {awayScore}</strong></div>) : null}
                                {settledBets && status == 'Settled - Win' && <div><strong>Credited: ${credited.toFixed(2)}</strong></div>}
                                {settledBets && status == 'Settled - Lose' && <div><strong>Debited: ${bet.toFixed(2)}</strong></div>}
                                {settledBets && ['Draw', 'Cancelled'].includes(status) && <div><strong>Credited: ${bet.toFixed(2)}</strong></div>}
                                {/* {openBets && status != "Matched" && <Link to={{ pathname: `/sportsbook` }} className="form-button">Forward To Sportsbook</Link>} */}
                                {openBets && !this.checkEventStarted(matchStartDate) &&
                                    <button className="form-button ml-3" onClick={this.shareLink(lineQuery, matchStartDate)}><i className="fas fa-link" /> Share This Line</button>}
                            </div>
                        </div>
                    );
                })}
                {/* {betsSportsBook.map(betObj => {
                    const {
                        _id,
                        WagerInfo,
                        createdAt,
                        Name
                    } = betObj;

                    return (
                        <div className="open-bets" key={_id}>
                            <div className="open-bets-flex">
                                <div className="open-bets-col">
                                    <strong>Bet</strong>
                                    <div>
                                        {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Bet Type</strong>
                                    <div>
                                        {this.getPinnacleBetType(WagerInfo.BetType)}
                                    </div>
                                    <div>
                                        {WagerInfo.Selection}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Risk</strong>
                                    <div>
                                        {Number(WagerInfo.ToRisk).toFixed(2)}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Odds</strong>
                                    <div>
                                        {WagerInfo.Odds} ({WagerInfo.OddsFormat == 1 ? 'Decimal' : 'American'})
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>To win</strong>
                                    <div>
                                        {Number(WagerInfo.ToWin).toFixed(2)}
                                    </div>
                                </div>
                                <div className="open-bets-col status">
                                    <strong>Status</strong>
                                    <div className={this.getStatusClass(Name, WagerInfo.Outcome)}>
                                        {Name == 'SETTLED' ? `${Name} - ${WagerInfo.Outcome}` : Name}
                                    </div>
                                </div>
                            </div>

                            {!WagerInfo.Legs && <div className="open-bets-event">
                                <i className={`${sportNameIcon(WagerInfo.Sport) || 'fas fa-trophy'}`} />
                                {WagerInfo.LeagueName}
                                <div>{WagerInfo.EventName}</div>
                                <div>
                                    Event Date: {dayjs(WagerInfo.EventDateFm).format('ddd, MMM DD, YYYY, HH:MM')}
                                </div>
                            </div>}

                            {WagerInfo.Legs && WagerInfo.Legs.map((leg, index) => (
                                <div className="open-bets-event">
                                    <i className={`${sportNameIcon(leg.Sport) || 'fas fa-trophy'}`} />
                                    {leg.LeagueName}
                                    <div>{leg.EventName}</div>
                                    <div>
                                        Event Date: {dayjs(leg.EventDateFm).format('ddd, MMM DD, YYYY, HH:MM')}
                                    </div>
                                </div>
                            ))}

                        </div>
                    );
                })} */}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    showedTourTimes: state.frontend.showedTourTimes,
    showTour: state.frontend.showTour,
});

export default connect(mapStateToProps, null)(OpenBets)
