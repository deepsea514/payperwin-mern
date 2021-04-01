import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import sportNameIcon from '../helpers/sportNameIcon';
import dayjs from 'dayjs';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

export default class OpenBets extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bets: [],
            error: null,
        };
    }

    componentDidMount() {
        const { settledBets } = this.props;
        setTitle({ pageTitle: settledBets ? 'Bet History' : 'Open Bets' });
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
        let url = `${serverUrl}/bets`;
        const { openBets, settledBets } = this.props;
        if (openBets) {
            url += '?openBets=true'
        } else if (settledBets) {
            url += '?settledBets=true'
        }
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }).then(({ data }) => {
            if (data) {
                this.setState({ bets: data })
            }
        }).catch((err) => {
            this.setState({ error: err });
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { bets } = this.state;
        const { openBets, settledBets } = this.props;
        return (
            <div className="col-in">
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
                        // lineType,
                        // sportName,
                        homeScore,
                        awayScore,
                        payableToWin,
                        matchingStatus,
                        lineQuery,
                    } = betObj;
                    const { type, sportName } = lineQuery;
                    // console.log(betObj);
                    const pickObj = pick === 'home' ? teamA : teamB;
                    const { name, odds } = pickObj;
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
                                        {type}
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
                                <div className="open-bets-col">
                                    <strong>Odds</strong>
                                    <div>
                                        {`${pickOdds > 0 ? '+' : ''}${pickOdds}`}
                                    </div>
                                </div>
                                <div className="open-bets-col">
                                    <strong>To win</strong>
                                    <div>
                                        {toWin.toFixed(2)}
                                        {matchingStatus === 'Partial Match' ? ` (${(payableToWin).toFixed(2)} Matched)` : ` (${matchingStatus})`}
                                    </div>
                                </div>
                                <div className="open-bets-col status">
                                    <strong>Status</strong>
                                    <div>
                                        {status ? status : 'Accepted'}
                                    </div>
                                </div>
                            </div>
                            <div className="open-bets-event">
                                <i className={`${sportNameIcon(sportName) || 'fas fa-trophy'}`} />
                                {`${teamA.name} vs ${teamB.name}`}
                                {homeScore && awayScore ? <div>{pickName}</div> : null}
                                <div>Event Date: {dayjs(matchStartDate).format('ddd, MMM DD, YYYY, HH:MM')}</div>
                                {homeScore && awayScore ? (<div><strong>Final Score: {homeScore} - {awayScore}</strong></div>) : null}
                                {credited ? (<div><strong>Credited: ${(credited).toFixed(2)}</strong></div>) : null}
                                {openBets && status != "Matched" && status != 'Partial Match' && <Link to={{ pathname: `/betforward/${_id}` }} className="form-button">Forward To Sportsbook</Link>}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
