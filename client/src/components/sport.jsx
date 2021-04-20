import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { setTitle } from '../libs/documentTitleBuilder'
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Sport extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Sports' });
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
        const { sportName } = this.props;
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
                            event.lineCount = 0;
                            if (lines) {
                                lines.forEach((line, i) => {
                                    if (i === 0) {
                                        if (line.moneyline && line.moneyline.draw) {
                                            delete line.moneyline;
                                        } else {
                                            event.lineCount++;
                                        }
                                        if (line.spreads) {
                                            event.lineCount += line.spreads.length;
                                        }
                                        if (line.totals) {
                                            event.lineCount += line.totals.length;
                                        }
                                    }
                                });
                            }
                        });
                    });
                    this.setState({ data })
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
        const { match, addBet, betSlip, removeBet, sportName } = this.props;
        const { data, error } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }
        const { leagues, origin } = data;
        const emptyBoxLine = (
            <li>
                <span className="box-mony-line">
                    <div className="vertical-align">
                        <i className="fap fa-do-not-enter" />
                    </div>
                </span>
                <span className="box-mony-line">
                    <div className="vertical-align">
                        <i className="fap fa-do-not-enter" />
                    </div>
                </span>
            </li>
        );
        return (
            <div className="content">
                {
                    leagues.map(league => {
                        const { name: leagueName, originId: leagueId } = league;
                        const events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId } = event;
                            if (
                                !lines
                                || new Date() > new Date(startDate)
                            ) {
                                return null;
                            }
                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>{dayjs(startDate).format('MM/DD/YYYY h:mma')}
                                        </Link>
                                    </li>
                                    <li className="detailed-lines-link mobile">
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
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
                                                                <li>
                                                                    <span className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                                null,
                                                                                origin
                                                                            )}>
                                                                        <div className="vertical-align">
                                                                            <div className="old-odds">
                                                                                {`${moneyline.home > 0 ? '+' : ''}${moneyline.home}`}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {`${newHome > 0 ? '+' : ''}${newHome}`}
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                    <span className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                                null,
                                                                                origin
                                                                            )}>
                                                                        <div className="vertical-align">
                                                                            <div className="old-odds">
                                                                                {`${moneyline.away > 0 ? '+' : ''}${moneyline.away}`}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {`${newAway > 0 ? '+' : ''}${newAway}`}
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </li>
                                                            );
                                                        })()
                                                    ) : emptyBoxLine
                                                }
                                                {
                                                    spreads ? (
                                                        (() => {
                                                            const moneylineDifference = Math.abs(Math.abs(spreads[0].home) - Math.abs(spreads[0].away)) / 2;
                                                            const newHome = spreads[0].home + moneylineDifference;
                                                            const newAway = spreads[0].away + moneylineDifference;
                                                            const lineQuery = {
                                                                sportName,
                                                                leagueId,
                                                                eventId,
                                                                lineId,
                                                                type: 'spread',
                                                            };
                                                            return (
                                                                <li>
                                                                    <span
                                                                        className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type)
                                                                                ? () => removeBet(lineId, 'home')
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
                                                                                    `${teamA} ${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`,
                                                                                    null,
                                                                                    origin
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`}</div>
                                                                            <div className="old-odds">
                                                                                {
                                                                                    `${spreads[0].home > 0 ? '+' : ''}${spreads[0].home}`
                                                                                    // `${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp} ${spreads[0].home > 0 ? '+' : ''}${spreads[0].home}`
                                                                                }
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {
                                                                                    `${newHome > 0 ? '+' : ''}${newHome}`
                                                                                    // `${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp} ${spreads[0].home > 0 ? '+' : ''}${spreads[0].home}`
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                    <span
                                                                        className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type)
                                                                                ? () => removeBet(lineId, 'away')
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
                                                                                    `${teamB} ${-1 * spreads[0].hdp > 0 ? '+' : ''}${-1 * spreads[0].hdp}`,
                                                                                    null,
                                                                                    origin
                                                                                )}>
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${(-1 * spreads[0].hdp) > 0 ? '+' : ''}${-1 * spreads[0].hdp}`}</div>
                                                                            <div className="old-odds">
                                                                                {
                                                                                    `${spreads[0].away > 0 ? '+' : ''}${spreads[0].away}`
                                                                                    // `${spreads[0].hdp < 0 ? '+' : ''}${spreads[0].hdp * -1} ${spreads[0].away > 0 ? '+' : ''}${spreads[0].away}`
                                                                                }
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {
                                                                                    `${newAway > 0 ? '+' : ''}${newAway}`
                                                                                    // `${spreads[0].hdp < 0 ? '+' : ''}${spreads[0].hdp * -1} ${spreads[0].away > 0 ? '+' : ''}${spreads[0].away}`
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </li>
                                                            );
                                                        })()
                                                    ) : emptyBoxLine
                                                }{
                                                    totals ? (
                                                        (() => {
                                                            const moneylineDifference = Math.abs(Math.abs(totals[0].over) - Math.abs(totals[0].under)) / 2;
                                                            const newHome = totals[0].over + moneylineDifference;
                                                            const newAway = totals[0].under + moneylineDifference;
                                                            const lineQuery = {
                                                                sportName,
                                                                leagueId,
                                                                eventId,
                                                                lineId,
                                                                type: 'total',
                                                            };
                                                            return (
                                                                <li>
                                                                    <span
                                                                        className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type)
                                                                                ? () => removeBet(lineId, 'home')
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
                                                                                    `Over ${totals[0].points}`,
                                                                                    null,
                                                                                    origin
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${totals[0].points}`}</div>
                                                                            <div className="old-odds">
                                                                                {
                                                                                    `${totals[0].over > 0 ? '+' : ''}${totals[0].over}`
                                                                                    // `${totals[0].hdp > 0 ? '+' : ''}${totals[0].hdp} ${totals[0].over > 0 ? '+' : ''}${totals[0].over}`
                                                                                }
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {
                                                                                    `${newHome > 0 ? '+' : ''}${newHome}`
                                                                                    // `${totals[0].hdp > 0 ? '+' : ''}${totals[0].hdp} ${totals[0].under > 0 ? '+' : ''}${totals[0].under}`
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                    <span
                                                                        className={`box-mony-line ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type)
                                                                                ? () => removeBet(lineId, 'away')
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
                                                                                    `Under ${totals[0].points}`,
                                                                                    null,
                                                                                    origin
                                                                                )
                                                                        }
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${totals[0].points}`}</div>
                                                                            <div className="old-odds">
                                                                                {
                                                                                    `${totals[0].under > 0 ? '+' : ''}${totals[0].under}`
                                                                                    // `${totals[0].hdp < 0 ? '+' : ''}${totals[0].hdp * -1} ${totals[0].under > 0 ? '+' : ''}${totals[0].under}`
                                                                                }
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {
                                                                                    `${newAway > 0 ? '+' : ''}${newAway}`
                                                                                    // `${totals[0].hdp < 0 ? '+' : ''}${totals[0].hdp * -1} ${totals[0].under > 0 ? '+' : ''}${totals[0].under}`
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </li>
                                                            );
                                                        })()
                                                    ) : emptyBoxLine
                                                }
                                            </React.Fragment>
                                        );
                                    }) : null}
                                    <li className="detailed-lines-link not-mobile">
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            );
                        });
                        return (
                            <div className="tab-content" id="myTabContent" key={leagueName}>
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                    <ul className="table-list table-list-top d-flex">
                                        <li>{leagueName}</li>
                                        <li>MONEY LINE</li>
                                        <li>HANDICAP</li>
                                        <li>OVER UNDER</li>
                                    </ul>
                                    {events}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default withRouter(Sport);
