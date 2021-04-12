import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { setTitle } from '../libs/documentTitleBuilder'
import resObjPath from '../libs/resObjPath'
import leaguesData from '../../public/data/leagues.json';
import oddsData from '../../public/data/odds.json';
import fixturesData from '../../public/data/fixtures.json';
import getLinesFromSportData from '../libs/getLinesFromSportData'
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Lines extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Lines' });
        this.getSport();
    }

    componentDidUpdate(prevProps) {
        const { sportName } = this.props;
        const { sportName: prevSportName } = prevProps;
        const sportChanged = sportName !== prevSportName;
        if (sportChanged) {
            this.setState({ error: null });
            this.getSport();
        }
    }

    getSport() {
        const { match } = this.props;
        const { sportName, leagueId, eventId, lineId } = match.params;
        if (sportName) {
            const url = `${serverUrl}/sport?name=${sportName}`;
            axios({
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(({ data }) => {
                if (data) {
                    // Remove moneyline with draw
                    data.leagues.forEach(league => {
                        const { events } = league;
                        events.forEach(event => {
                            const { lines } = event;
                            if (lines) {
                                lines.forEach(line => {
                                    if (line.moneyline && line.moneyline.draw) {
                                        delete line.moneyline;
                                    }
                                });
                            }
                        });
                    });
                    const lineData = getLinesFromSportData(data, leagueId, eventId, lineId);
                    this.setState({ data: lineData })
                }
            }).catch((err) => {
                this.setState({ error: err });
            });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { match, addBet, betSlip, removeBet } = this.props;
        const { sportName, leagueId, eventId, lineId } = match.params;
        const { data, error } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        const { teamA, teamB, startDate, leagueName, lines } = data;
        return (
            <div className="content detailed-lines">
                <center>
                    <div>
                        {dayjs(startDate).format('dddd, MMMM D, YYYY h:mma')}
                    </div>
                    <strong>{teamA} VS {teamB}</strong>
                </center>
                <br />
                <ul>
                    {lines ? lines.map((line, i) => {
                        const { spreads, originId: lineId, moneyline, totals } = line;
                        if (!spreads && !moneyline) {
                            return null;
                        }
                        if (i > 0) {
                            return null;
                        }
                        return (
                            <React.Fragment key={lineId}>
                                {
                                    moneyline ? (
                                        (() => {
                                            const moneylineDifference = Math.abs(Math.abs(moneyline.home) - Math.abs(moneyline.away)) / 2;
                                            const newHome = moneyline.home + moneylineDifference;
                                            const newAway = moneyline.away + moneylineDifference;
                                            // TODO: Refactor this to be simpler
                                            const lineQuery = {
                                                sportName,
                                                leagueId,
                                                eventId,
                                                lineId,
                                                type: 'moneyline',
                                            };
                                            return (
                                                <React.Fragment>
                                                    <div className="line-type-header">Moneyline:</div>
                                                    <li>
                                                        <div className="row">
                                                            <div className="col-md-6 com-sm-12 col-12">
                                                                <span className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                    onClick={betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ?
                                                                        () => removeBet(lineId, 'home')
                                                                        : () => addBet(
                                                                            `${teamA} - ${teamB}`,
                                                                            'moneyline',
                                                                            leagueName,
                                                                            { home: newHome, away: newAway },
                                                                            'home',
                                                                            teamA,
                                                                            teamB,
                                                                            sportName,
                                                                            lineId,
                                                                            lineQuery,
                                                                            `${teamA}`,
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamA}</div>
                                                                        <div className="odds">
                                                                            <div className="old-odds">
                                                                                {`${moneyline.home > 0 ? '+' : ''}${moneyline.home}`}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {`${newHome > 0 ? '+' : ''}${newHome}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-6 com-sm-12 col-12">
                                                                <span className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                    onClick={betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ?
                                                                        () => removeBet(lineId, 'away')
                                                                        : () => addBet(
                                                                            `${teamA} - ${teamB}`,
                                                                            'moneyline',
                                                                            leagueName,
                                                                            { home: newHome, away: newAway },
                                                                            'away',
                                                                            teamA,
                                                                            teamB,
                                                                            sportName,
                                                                            lineId,
                                                                            lineQuery,
                                                                            `${teamB}`,
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamB}</div>
                                                                        <div className="odds">
                                                                            <div className="old-odds">
                                                                                {`${moneyline.away > 0 ? '+' : ''}${moneyline.away}`}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {`${newAway > 0 ? '+' : ''}${newAway}`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </React.Fragment>
                                            );
                                        })()
                                    ) : null
                                }
                                {
                                    spreads ? (
                                        <React.Fragment>
                                            <div className="line-type-header">Spreads</div>
                                            {
                                                spreads.map((spread, i) => {
                                                    const moneylineDifference = Math.abs(Math.abs(spread.home) - Math.abs(spread.away)) / 2;
                                                    const newHome = spread.home + moneylineDifference;
                                                    const newAway = spread.away + moneylineDifference;
                                                    const lineQuery = {
                                                        sportName,
                                                        leagueId,
                                                        eventId,
                                                        lineId,
                                                        type: 'spread',
                                                        index: i,
                                                    };
                                                    if (spread.altLineId) lineQuery.altLineId = spread.altLineId;
                                                    return (
                                                        <li key={i}>
                                                            <div className="row">
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'home', i)
                                                                                : () => addBet(
                                                                                    `${teamA} - ${teamB}`,
                                                                                    'spread',
                                                                                    leagueName,
                                                                                    { home: newHome, away: newAway },
                                                                                    'home',
                                                                                    teamA,
                                                                                    teamB,
                                                                                    sportName,
                                                                                    lineId,
                                                                                    lineQuery,
                                                                                    `${teamA} ${spread.hdp > 0 ? '+' : ''}${spread.hdp}`,
                                                                                    i,
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${spread.hdp > 0 ? '+' : ''}${spread.hdp}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {
                                                                                        `${spread.home > 0 ? '+' : ''}${spread.home}`
                                                                                        // `${spread.hdp > 0 ? '+' : ''}${spread.hdp} ${spread.home > 0 ? '+' : ''}${spread.home}`
                                                                                    }
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {
                                                                                        `${newHome > 0 ? '+' : ''}${newHome}`
                                                                                        // `${spread.hdp > 0 ? '+' : ''}${spread.hdp} ${spread.home > 0 ? '+' : ''}${spread.home}`
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'away', i)
                                                                                : () => addBet(
                                                                                    `${teamA} - ${teamB}`,
                                                                                    'spread',
                                                                                    leagueName,
                                                                                    { home: newHome, away: newAway },
                                                                                    'away',
                                                                                    teamA,
                                                                                    teamB,
                                                                                    sportName,
                                                                                    lineId,
                                                                                    lineQuery,
                                                                                    `${teamB} ${-1 * spread.hdp > 0 ? '+' : ''}${-1 * spread.hdp}`,
                                                                                    i,
                                                                                )}>
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${(-1 * spread.hdp) > 0 ? '+' : ''}${-1 * spread.hdp}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {
                                                                                        `${spread.away > 0 ? '+' : ''}${spread.away}`
                                                                                        // `${spread.hdp < 0 ? '+' : ''}${spread.hdp * -1} ${spread.away > 0 ? '+' : ''}${spread.away}`
                                                                                    }
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {
                                                                                        `${newAway > 0 ? '+' : ''}${newAway}`
                                                                                        // `${spread.hdp < 0 ? '+' : ''}${spread.hdp * -1} ${spread.away > 0 ? '+' : ''}${spread.away}`
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </React.Fragment>
                                    ) : null
                                }

                                {
                                    totals ? (
                                        <React.Fragment>
                                            <div className="line-type-header">Over/Under</div>
                                            {
                                                totals.map((total, i) => {
                                                    const moneylineDifference = Math.abs(Math.abs(total.over) - Math.abs(total.under)) / 2;
                                                    const newHome = total.over + moneylineDifference;
                                                    const newAway = total.under + moneylineDifference;
                                                    const lineQuery = {
                                                        sportName,
                                                        leagueId,
                                                        eventId,
                                                        lineId,
                                                        type: 'total',
                                                        index: i,
                                                    };
                                                    if (total.altLineId) lineQuery.altLineId = total.altLineId;
                                                    return (
                                                        <li key={i}>
                                                            <div className="row">
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'home', i)
                                                                                : () => addBet(
                                                                                    `${teamA} - ${teamB}`,
                                                                                    'total',
                                                                                    leagueName,
                                                                                    { home: newHome, away: newAway },
                                                                                    'home',
                                                                                    teamA,
                                                                                    teamB,
                                                                                    sportName,
                                                                                    lineId,
                                                                                    lineQuery,
                                                                                    `Over ${total.points}`,
                                                                                    i,
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${total.points}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {
                                                                                        `${total.over > 0 ? '+' : ''}${total.over}`
                                                                                        // `${total.hdp > 0 ? '+' : ''}${total.hdp} ${total.over > 0 ? '+' : ''}${total.over}`
                                                                                    }
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {
                                                                                        `${newHome > 0 ? '+' : ''}${newHome}`
                                                                                        // `${total.hdp > 0 ? '+' : ''}${total.hdp} ${total.under > 0 ? '+' : ''}${total.under}`
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-mony-line line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'away', i)
                                                                                : () => addBet(
                                                                                    `${teamA} - ${teamB}`,
                                                                                    'total',
                                                                                    leagueName,
                                                                                    { home: newHome, away: newAway },
                                                                                    'away',
                                                                                    teamA,
                                                                                    teamB,
                                                                                    sportName,
                                                                                    lineId,
                                                                                    lineQuery,
                                                                                    `Under ${total.points}`,
                                                                                    i,
                                                                                )
                                                                        }
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${total.points}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {
                                                                                        `${total.under > 0 ? '+' : ''}${total.under}`
                                                                                        // `${total.hdp < 0 ? '+' : ''}${total.hdp * -1} ${total.under > 0 ? '+' : ''}${total.under}`
                                                                                    }
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {
                                                                                        `${newAway > 0 ? '+' : ''}${newAway}`
                                                                                        // `${total.hdp < 0 ? '+' : ''}${total.hdp * -1} ${total.under > 0 ? '+' : ''}${total.under}`
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </React.Fragment>
                                    ) : null
                                }
                            </React.Fragment>
                        );
                    }) : null}
                </ul>
            </div>
        );
    }
}

export default withRouter(Lines);
