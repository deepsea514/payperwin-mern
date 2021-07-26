import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setMeta } from '../libs/documentTitleBuilder';
import sportNameImage from "../helpers/sportNameImage";
import sportNameIcon from "../helpers/sportNameIcon";
import dayjs from 'dayjs';
import DocumentMeta from 'react-document-meta';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class OpenBets extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bets: [],
            betsSportsBook: [],
            error: null,
            metaData: null
        };
    }

    componentDidMount() {
        const { settledBets } = this.props;
        const title = settledBets ? 'Bet History' : 'Open Bets';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
        this.getBetHistory();
    }

    componentDidUpdate(prevProps) {
        const { openBets } = this.props;
        const { openBets: prevOpenBets } = prevProps;
        const betPageChanged = openBets !== prevOpenBets;

        if (betPageChanged) {
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

        let url2 = `${serverUrl}/bets-sportsbook`;
        if (openBets) {
            url2 += '?openBets=true'
        } else if (settledBets) {
            url2 += '?settledBets=true'
        }
        axios({
            method: 'get',
            url: url2,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then(({ data }) => {
                if (data) {
                    this.setState({ betsSportsBook: data })
                }
            }).catch((err) => {
                this.setState({ error: err });
            });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const { bets, metaData, betsSportsBook } = this.state;
        const { openBets, settledBets } = this.props;
        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
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
                                        <strong>Accepted</strong>
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
                                        <div>
                                            {status ? status : 'Accepted'}
                                        </div>
                                    </div>
                                </div>
                                <div className="open-bets-event">
                                    <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                    {lineQuery.eventName}
                                    <div>
                                        Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                        <strong className="float-right bg-primary">Peer To Peer</strong>
                                    </div>
                                    {credited ? (<div><strong>Credited: ${(credited).toFixed(2)}</strong></div>) : null}
                                </div>
                            </div>
                        );
                    }

                    const { type, sportName } = lineQuery;
                    return (
                        <div className="open-bets" key={_id}>
                            <div className="open-bets-flex">
                                <div className="open-bets-col">
                                    <strong>Accepted</strong>
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
                                    <div>
                                        {status ? status : 'Accepted'}
                                    </div>
                                </div>
                            </div>
                            <div className="open-bets-event">
                                {/* <i className={`${sportNameIcon(sportName) || 'fas fa-trophy'}`} /> */}
                                <img src={sportNameImage(sportName)} width="14" height="14" style={{ marginRight: '6px' }} />
                                {`${teamA.name} vs ${teamB.name}`}
                                {homeScore && awayScore ? <div>{pickName}</div> : null}
                                <div>
                                    Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:mm')}
                                    <strong className="float-right bg-primary">Peer To Peer</strong>
                                </div>
                                {homeScore && awayScore ? (<div><strong>Final Score: {homeScore} - {awayScore}</strong></div>) : null}
                                {credited ? (<div><strong>Credited: ${(credited).toFixed(2)}</strong></div>) : null}
                                {openBets && status != "Matched" && status != 'Partial Match' && <Link to={{ pathname: `/betforward/${_id}` }} className="form-button">Forward To Sportsbook</Link>}
                            </div>
                        </div>
                    );
                })}
                {betsSportsBook.map(betObj => {
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
                                    <strong>Accepted</strong>
                                    <div>
                                        {dayjs(createdAt).format('YYYY/M/D HH:mm')}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>Bet Type</strong>
                                    <div>
                                        {this.capitalizeFirstLetter(WagerInfo.Type)}
                                    </div>
                                    <div>
                                        {WagerInfo.SelectionType}
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
                                        {WagerInfo.Odds}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>To win</strong>
                                    <div>
                                        {Number(WagerInfo.ToWin).toFixed(2)}
                                    </div>
                                </div>
                                {/* {settledBets && <div className="open-bets-col">
                                    <strong>Profit And Loss</strong>
                                    <div>
                                        {Number(WagerInfo.ProfitAndLoss).toFixed(2)}
                                    </div>
                                </div>} */}
                                <div className="open-bets-col status">
                                    <strong>Status</strong>
                                    <div>
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
                                    <strong className="float-right bg-warning">PAYPER WIN Sportsbook</strong>
                                </div>
                            </div>}

                            {WagerInfo.Legs && WagerInfo.Legs.map((leg, index) => (
                                <div className="open-bets-event">
                                    <i className={`${sportNameIcon(leg.Sport) || 'fas fa-trophy'}`} />
                                    {leg.LeagueName}
                                    <div>{leg.EventName}</div>
                                    <div>
                                        Event Date: {dayjs(leg.EventDateFm).format('ddd, MMM DD, YYYY, HH:MM')}
                                        <strong className="float-right bg-warning">PAYPER WIN Sportsbook</strong>
                                    </div>
                                </div>
                            ))}

                        </div>
                    );
                })}
            </div>
        );
    }
}
