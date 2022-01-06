import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import sportNameImage from "../helpers/sportNameImage";
import dayjs from 'dayjs';
import { Popover, OverlayTrigger } from "react-bootstrap";
import QRCode from "react-qr-code";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { connect } from "react-redux";
import TourModal from '../components/tourModal';
import { FormGroup, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { FormattedMessage } from 'react-intl';
import { forwardBet, getBets, getLatestOdds, shareLine } from '../redux/services';

const StatusPopOver = (
    <Popover>
        <div className="m-2" style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12px' }}>
            <h6><FormattedMessage id="PAGES.OPENBETS.BETSTATUS" /></h6>
            <div className="verification-proof-list">
                <ul>
                    <li>
                        <b><FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH" />:</b> <FormattedMessage id="COMPONENTS.BETSTATUS.WAITINGFORMATCH_CONTENT" />
                    </li>
                    <li>
                        <b><FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED" />:</b> <FormattedMessage id="COMPONENTS.BETSTATUS.MATCHED_CONTENT" />
                    </li>
                    <li>
                        <b><FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED" />:</b> <FormattedMessage id="COMPONENTS.BETSTATUS.PARTIALMATCHED_CONTENT" />
                    </li>
                    <li>
                        <b><FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED" />:</b> <FormattedMessage id="COMPONENTS.BETSTATUS.SETTLED_CONTENT" />
                    </li>
                </ul>
            </div>
        </div>
    </Popover>
)

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
            daterange: null,
            page: 0,
            loading: false,
            filter: {
                p2p: true,
                sportsbook: true,
                parlay: true,
            },
            showFilter: false,
            noMore: false,
            forwardBet: null,
            forwardResult: null,
            forwardLatestOdd: null,
            loadingOdds: false,
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

    getBetHistory(page = 0, clear = true) {
        const { openBets, settledBets } = this.props;
        const { filter, daterange, bets } = this.state;
        this.setState({ loading: true, noMore: false });
        getBets({ openBets, settledBets, filter, daterange, page })
            .then(({ data }) => {
                if (data) {
                    this.setState({ bets: clear ? data : [...bets, ...data], page: page, noMore: data.length == 0 })
                }
                this.setState({ loading: false })
            }).catch((err) => {
                this.setState({ error: err, loading: false });
            });
    }

    getBetType = (type) => {
        switch (type) {
            case 'moneyline':
                return 'Moneyline';
            case 'total':
            case 'alternative_total':
                return 'Total';
            case 'spread':
            case 'alternative_spread':
                return 'Spread';
            default:
                return null;
        }
    }

    checkEventStarted = (matchStartDate) => {
        if ((new Date(matchStartDate)).getTime() < (new Date()).getTime())
            return true;
        return false;
    }

    shareLink = (lineQuery, matchStartDate) => () => {
        const { type, sportName, leagueId, eventId, index, subtype } = lineQuery;
        const generatedLineUrl = `${window.location.origin}/sport/${sportName.replace(" ", "_")}/league/${leagueId}/event/${eventId}`;
        this.setState({ shareModal: true, urlCopied: false, loadingUrl: true });
        shareLine({ url: generatedLineUrl, eventDate: matchStartDate, type, index, subtype })
            .then(({ data }) => {
                const { url, index, type, uniqueId, subtype } = data;
                this.setState({ loadingUrl: false, lineUrl: `${url}?type=${type}${isNaN(index) ? '' : `&index=${index}`}${subtype ? `&subtype=${subtype}` : ''}&uniqueId=${uniqueId}` });
            })
            .catch(() => {
                this.setState({ loadingUrl: false, lineUrl: '' });
            })
    }

    copyUrl = () => {
        const { lineUrl } = this.state;
        navigator.clipboard.writeText(lineUrl);
        this.setState({ urlCopied: true });
    }

    getStatusClass = (status) => {
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

    getStatusName = (status, sportsbook = false) => {
        switch (status) {
            case 'Pending':
                if (sportsbook) return 'WAITING TO ACCEPT';
                return 'WAITING FOR MATCH';
            case 'Matched':
                return 'Accepted';
            case 'Partial Match':
            case 'Cancelled':
            case 'Settled - Lose':
            case 'Settled - Win':
            case 'Draw':
            case 'Accepted':
            case 'Partial Accepted':
            case 'Win':
            case 'Lose':
            default:
                return status;
        }
    }

    handleChangeDate = async (event, picker) => {
        await this.setState({
            daterange: {
                startDate: picker.startDate._d,
                endDate: picker.endDate._d
            }
        });
        this.getBetHistory();
    }

    changeFilter = async (event) => {
        const { name: field, checked: value } = event.target;
        const { filter } = this.state;
        if (value) {
            await this.setState({ filter: { ...filter, [field]: true } });
        }
        else {
            let nextFilter = { ...filter };
            nextFilter[field] = false;
            let { p2p, sportsbook, parlay } = nextFilter;
            await this.setState({ filter: { p2p, sportsbook, parlay } });
        }
    }

    forwardSportsbook = (bet) => {
        const bodyData = { lineQuery: bet.lineQuery, pick: bet.pick };
        this.setState({ loadingOdds: true });
        getLatestOdds(bodyData)
            .then(({ data }) => {
                this.setState({
                    forwardLatestOdd: data.latestOdds,
                    forwardBet: bet
                });
                this.setState({ loadingOdds: false });
            })
            .catch(() => {
                this.setState({ forwardBet: null, forwardResult: 'Can\'t get latest odd forward.' });
                this.setState({ loadingOdds: false });
            });
    }

    confirmForward = () => {
        const { forwardBet: bet, bets } = this.state;
        forwardBet(bet._id)
            .then(({ data }) => {
                this.setState({
                    bets: bets.map(bet => {
                        if (bet._id == data._id) return data;
                        return bet;
                    }),
                    forwardBet: null,
                    forwardResult: 'Bet forwarded.'
                })
            })
            .catch((data) => {
                this.setState({ forwardBet: null, forwardResult: 'Can\'t forward bet to sportsbook.' });
            })
    }

    render() {
        const { bets, shareModal, lineUrl, urlCopied, loadingUrl, loading,
            daterange, showFilter, filter, page, noMore, forwardBet, forwardResult, forwardLatestOdd, loadingOdds } = this.state;
        const { openBets, settledBets, showedTourTimes, showTour } = this.props;
        return (
            <div className="col-in">
                <div className="main-cnt">
                    {openBets && showedTourTimes < 3 && showTour && <TourModal />}
                    {shareModal && <div className="modal confirmation">
                        <div className="background-closer" onClick={() => this.setState({ shareModal: false })} />
                        <div className="col-in">
                            <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                            <div>
                                <b>Share Bet</b>
                                <hr />
                                {loadingUrl && <center>
                                    <Preloader use={ThreeDots}
                                        size={100}
                                        strokeWidth={10}
                                        strokeColor="#F0AD4E"
                                        duration={800} />
                                </center>}
                                {!loadingUrl && !lineUrl && <h4><FormattedMessage id="PAGES.OPENBETS.CANNOT_GENERATE_URL" /> </h4>}
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
                    {forwardBet != null && <div className="modal confirmation">
                        <div className="background-closer" onClick={() => this.setState({ forwardBet: null, forwardLatestOdd: null })} />
                        <div className="col-in">
                            <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ forwardBet: null, forwardLatestOdd: null })} />
                            <div>
                                <b> <FormattedMessage id="PAGES.FORWARDTO.SPORTSBOOK" /></b>
                                <hr />
                                <p><FormattedMessage id="PAGES.OPENBETS.FORWARD_DES" /></p>
                                <p><FormattedMessage id="PAGES.OPENBETS.P2P_ODDS" />: {Number(forwardBet.pickOdds) > 0 ? '+' : ''}{forwardBet.pickOdds}</p>
                                <p><b><FormattedMessage id="PAGES.OPENBETS.SB_ODDS" />: {Number(forwardLatestOdd) > 0 ? '+' : ''}{forwardLatestOdd}</b></p>
                                <div className="text-right">
                                    <button className="form-button" onClick={this.confirmForward}> Proceed </button>
                                    <button className="form-button ml-2" onClick={() => this.setState({ forwardBet: null, forwardLatestOdd: null })}> Cancel </button>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {forwardResult != null && <div className="modal confirmation">
                        <div className="background-closer" onClick={() => this.setState({ forwardResult: null })} />
                        <div className="col-in">
                            <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ forwardResult: null })} />
                            <div>
                                <b> <FormattedMessage id="PAGES.FORWARDTO.SPORTSBOOK" /></b>
                                <hr />
                                <p>{forwardResult}</p>
                                <div className="text-right">
                                    <button className="form-button ml-2" onClick={() => this.setState({ forwardResult: null })}> Close </button>
                                </div>
                            </div>
                        </div>
                    </div>}

                    <h3>{settledBets ? 'Bet History' : 'Open Bets'}</h3>

                    <ul className="histyr-list d-flex justify-content-space">
                        <li><FormattedMessage id="PAGES.TRANSACTIONHISTORY.FILTEROPTIONS" /></li>
                        <li>
                            <DateRangePicker
                                initialSettings={daterange}
                                onApply={this.handleChangeDate}
                            >
                                <a href="#"><i className="fas fa-calendar-week"></i> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.DATERANGE" /> </a>
                            </DateRangePicker>
                        </li>
                        <li>
                            <a onClick={() => this.setState({ showFilter: true })}> <i className="fas fa-business-time"></i> <FormattedMessage id="PAGES.OPENBETS.FILTER" /> </a>
                            {showFilter &&
                                <>
                                    <div className="background-closer" onClick={() => this.setState({ showFilter: false })} />
                                    <div className="filter-dropdown">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={filter.p2p}
                                                    onChange={this.changeFilter}
                                                    name="p2p" />}
                                                label="Peer to Peer Bets"
                                                className="p-0 mb-0"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={filter.sportsbook}
                                                    onChange={this.changeFilter}
                                                    name="sportsbook" />}
                                                label="Sportsbook Bets"
                                                className="p-0 mb-0"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={filter.parlay}
                                                    onChange={this.changeFilter}
                                                    name="parlay" />}
                                                label="Parlay Bets"
                                                className="p-0 mb-0"
                                            />
                                        </FormGroup>
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            this.getBetHistory();
                                            this.setState({ showFilter: false })
                                        }}>Apply</Button>
                                        <Button variant="outlined" color="secondary" className="ml-2" onClick={() => this.setState({ showFilter: false })}>Cancel</Button>
                                    </div>
                                </>}
                        </li>
                    </ul>
                    {bets.map(betObj => {
                        const {
                            _id, teamA, teamB, bet, toWin, matchStartDate, pickName, pickOdds,
                            createdAt, status, credited, homeScore, awayScore, payableToWin,
                            matchingStatus, lineQuery, origin, sportsbook, isParlay, parlayQuery
                        } = betObj;
                        if (origin == "other") {
                            const type = "moneyline";
                            const sportName = "Other";
                            return (
                                <div className="open-bets" key={_id}>
                                    <div className="open-bets-flex">
                                        <div className="open-bets-col">
                                            <strong><FormattedMessage id="PAGES.OPENBETS.BET" /></strong>
                                            <div>
                                                {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                            </div>
                                        </div>
                                        <div className="open-bets-col">
                                            <strong><FormattedMessage id="PAGES.OPENBETS.BETTYPE" /></strong>
                                            <div>
                                                {this.getBetType(type)} @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                            </div>
                                            <div>
                                                {pickName}
                                            </div>
                                        </div>
                                        <div className="open-bets-col">
                                            <strong><FormattedMessage id="PAGES.OPENBETS.RISK" /></strong>
                                            <div>
                                                {bet.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="open-bets-col">
                                            <strong><FormattedMessage id="PAGES.OPENBETS.TOWIN" /></strong>
                                            {matchingStatus === 'Partial Match' && <div>
                                                {toWin.toFixed(2)}
                                                <br />
                                                {payableToWin.toFixed(2)} Accepted
                                                <br />
                                                {(toWin - payableToWin).toFixed(2)} Pending
                                            </div>}
                                            {matchingStatus !== 'Partial Match' && <div>
                                                {toWin.toFixed(2)} {matchingStatus}
                                            </div>}
                                        </div>
                                        <div className="open-bets-col status">
                                            <strong><FormattedMessage id="PAGES.OPENBETS.STATUS" /></strong>
                                            <OverlayTrigger
                                                trigger="click"
                                                placement={'left'}
                                                overlay={StatusPopOver}
                                            >
                                                <button className={this.getStatusClass(status) + ' cursor-pointer'}>
                                                    {status ? status : 'Accepted'}
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                    <div className="open-bets-event">
                                        <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} className="my-0" />
                                        {lineQuery.eventName}
                                        <div>
                                            <FormattedMessage id="PAGES.OPENBETS.EVENT_DATE" />: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                            <strong className="float-right bg-light-primary px-2 py-1 text-dark"><FormattedMessage id="PAGES.OPENBETS.P2P" /></strong>
                                        </div>
                                        {settledBets && status == 'Settled - Win' && <div><strong><FormattedMessage id="PAGES.OPENBETS.CREDITED" />: ${credited.toFixed(2)}</strong></div>}
                                        {settledBets && status == 'Settled - Lose' && <div><strong><FormattedMessage id="PAGES.OPENBETS.DEBITED" />: ${bet.toFixed(2)}</strong></div>}
                                        {settledBets && ['Draw', 'Cancelled'].includes(status) && <div><strong><FormattedMessage id="PAGES.OPENBETS.CREDITED" />: ${bet.toFixed(2)}</strong></div>}
                                    </div>
                                </div>
                            );
                        }

                        if (isParlay) {
                            return <div className={`open-bets`} key={_id}>
                                <div className="open-bets-flex">
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BET" /></strong>
                                        <div>
                                            {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BETTYPE" /></strong>
                                        <div>
                                            Multiples @{`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.RISK" /></strong>
                                        <div>
                                            {bet.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.TOWIN" /></strong>
                                        {['Partial Match', 'Partial Accepted'].includes(matchingStatus) && <div>
                                            {toWin.toFixed(2)}
                                            <br />
                                            {payableToWin.toFixed(2)} Matched
                                            <br />
                                            {(toWin - payableToWin).toFixed(2)} Pending
                                        </div>}
                                        {['Partial Match', 'Partial Accepted'].includes(matchingStatus) == false && <div>
                                            {toWin.toFixed(2)} {matchingStatus}
                                        </div>}
                                    </div>
                                    <div className="open-bets-col status">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.STATUS" /></strong>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement={'bottom'}
                                            rootClose={true}
                                            overlay={StatusPopOver}
                                        >
                                            <div className={this.getStatusClass(status) + ' cursor-pointer'}>
                                                {this.getStatusName(status)}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                {parlayQuery.map((query, index) => {
                                    const { teamA, teamB, lineQuery, homeScore, awayScore, status, pickName, matchStartDate } = query;
                                    const { sportName } = lineQuery
                                    return (
                                        <div className="open-bets-event" key={index}>
                                            <div className='status text-dark'>
                                                <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} className="my-0" />
                                                {`${teamA.name} vs ${teamB.name}`}
                                                {settledBets && <div className={this.getStatusClass(status) + ' float-right text-white'}>
                                                    {this.getStatusName(status)}
                                                </div>}
                                            </div>
                                            <div>{pickName}</div>
                                            <div>
                                                <FormattedMessage id="PAGES.OPENBETS.EVENT_DATE" />: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                            </div>
                                            {settledBets && status != 'Cancelled' && <div><strong><FormattedMessage id="PAGES.FINALSCORE" />: {homeScore} - {awayScore}</strong></div>}
                                        </div>
                                    );
                                })}
                                {settledBets && <div className="open-bets-event">
                                    {status == 'Settled - Win' && <div><strong><FormattedMessage id="PAGES.CREDITED" />: ${credited.toFixed(2)}</strong></div>}
                                    {status == 'Settled - Lose' && <div><strong><FormattedMessage id="PAGES.OPENBETS.DEBITED" />: ${bet.toFixed(2)}</strong></div>}
                                    {['Draw', 'Cancelled'].includes(status) && <div><strong><FormattedMessage id="PAGES.CREDITED" />: ${bet.toFixed(2)}</strong></div>}
                                </div>}
                            </div>
                        }

                        const { type, sportName } = lineQuery;
                        return (
                            <div className={`open-bets ${sportsbook ? 'open-bets-sportsbook' : ''}`} key={_id}>
                                <div className="open-bets-flex">
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BET" /></strong>
                                        <div>
                                            {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.BETTYPE" /></strong>
                                        <div>
                                            {this.getBetType(type)} @ {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                        </div>
                                        <div>
                                            {pickName}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.RISK" /></strong>
                                        <div>
                                            {bet.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="open-bets-col">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.TOWIN" /></strong>
                                        {['Partial Match', 'Partial Accepted'].includes(matchingStatus) && <div>
                                            {toWin.toFixed(2)}
                                            <br />
                                            {payableToWin.toFixed(2)} {sportsbook ? 'Accepted' : 'Matched'}
                                            <br />
                                            {(toWin - payableToWin).toFixed(2)} Pending
                                        </div>}
                                        {['Partial Match', 'Partial Accepted'].includes(matchingStatus) == false && <div>
                                            {toWin.toFixed(2)} {matchingStatus}
                                        </div>}
                                    </div>
                                    <div className="open-bets-col status">
                                        <strong><FormattedMessage id="PAGES.OPENBETS.STATUS" /></strong>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement={'bottom'}
                                            rootClose={true}
                                            overlay={StatusPopOver}
                                        >
                                            <div className={this.getStatusClass(status) + ' cursor-pointer'}>
                                                {this.getStatusName(status, sportsbook)}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="open-bets-event">
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} className="my-0" />
                                    {`${teamA.name} vs ${teamB.name}`}
                                    <div>
                                        <FormattedMessage id="PAGES.OPENBETS.EVENT_DATE" />: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                        {sportsbook && <strong className="float-right bg-light-info px-2 py-1 text-dark">Sportsbook</strong>}
                                        {!sportsbook && <strong className="float-right bg-light-danger px-2 py-1 text-dark">Peer To Peer</strong>}
                                    </div>
                                    {settledBets && status != 'Cancelled' && <div><strong><FormattedMessage id="PAGES.FINALSCORE" />: {homeScore} - {awayScore}</strong></div>}
                                    {settledBets && status == 'Settled - Win' && <div><strong><FormattedMessage id="PAGES.CREDITED" />: ${credited.toFixed(2)}</strong></div>}
                                    {settledBets && status == 'Settled - Lose' && <div><strong><FormattedMessage id="PAGES.OPENBETS.DEBITED" />: ${bet.toFixed(2)}</strong></div>}
                                    {settledBets && ['Draw', 'Cancelled'].includes(status) && <div><strong><FormattedMessage id="PAGES.CREDITED" />: ${bet.toFixed(2)}</strong></div>}
                                    {openBets && !this.checkEventStarted(matchStartDate) &&
                                        <button className="form-button" onClick={this.shareLink(lineQuery, matchStartDate)}><i className="fas fa-link" /> Share Bet</button>}
                                    {openBets && !this.checkEventStarted(matchStartDate) && status == 'Pending' && !sportsbook &&
                                        <button className={'form-button ml-2' + (loadingOdds ? ' is-loading' : '')}
                                            disabled={loadingOdds}
                                            onClick={() => this.forwardSportsbook(betObj)}><i className="fas fa-link" /> Forward to Sportsbook</button>}
                                </div>
                            </div>
                        );
                    })}

                    {loading && <center>
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </center>}
                    {!loading && !noMore && <div className="load-m text-center mt-3">
                        <a className="load-more"
                            disabled={loading}
                            onClick={() => this.getBetHistory(page + 1, false)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FormattedMessage id="PAGES.OPENBETS.LOADMORE" />
                        </a>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    showedTourTimes: state.frontend.showedTourTimes,
    showTour: state.frontend.showTour,
});

export default connect(mapStateToProps, null)(OpenBets)
