import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";

import calculateNewOdds from '../helpers/calculateNewOdds';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class SportLeague extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            showModal: false,
            timer: null,
        };
    }

    componentDidMount() {
        const title = 'Betting on Sports League';
        setTitle({ pageTitle: title })
        this.getSportLeague();
        this.setState({ timer: setInterval(this.getSportLeague.bind(this), 10 * 60 * 1000) })
    }

    componentWillUnmount() {
        const { timer } = this.state;
        if (timer) clearInterval(timer);
    }

    componentDidUpdate(prevProps) {
        const { league } = this.props;
        const { league: prevLeague } = prevProps;
        const sportChanged = (league !== prevLeague);
        if (sportChanged) {
            this.setState({ error: null });
            this.getSportLeague();
        }
    }

    getSportLeague() {
        const { sportName, league: leagueId } = this.props;
        if (sportName) {
            const url = `${serverUrl}/sport?name=${sportName}&leagueId=${leagueId}`;
            axios({
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(({ data }) => {
                if (data) {
                    // Remove moneyline with draw
                    const { league } = data;
                    league.events.forEach(event => {
                        const { lines, startDate } = event;
                        if ((new Date(startDate)).getTime() > (new Date()).getTime()) {
                            event.started = false;
                        } else {
                            event.started = true;
                        }
                        event.lineCount = 0;
                        if (lines) {
                            lines.forEach((line, i) => {
                                if (i === 0) {
                                    const { moneyline, spreads, totals } = line;
                                    if (moneyline) {
                                        event.lineCount++;
                                    }
                                    if (spreads) {
                                        event.lineCount += spreads.length;
                                        line.spreads = spreads.length ? spreads : null;
                                    }
                                    if (totals) {
                                        event.lineCount += totals.length;
                                        line.totals = totals.length ? totals : null;
                                    }
                                }
                            });
                        }
                    });
                    this.setState({ data })
                } else {
                    this.setState({ error: 'League doesn\'t exist.' });
                }
            }).catch((err) => {
                this.setState({ error: err });
            });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    convertOdds = (odd) => {
        const { oddsFormat } = this.props;
        switch (oddsFormat) {
            case 'decimal':
                if (odd > 0)
                    return Number(1 + odd / 100).toFixed(2);
                return Number(1 - 100 / odd).toFixed(2);
            case 'american':
                if (odd > 0)
                    return '+' + odd;
                return odd;
            default:
                return odd;
        }
    }

    addBet = (name, type, league, odds, originOdds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin, started) => {
        if (started) return;
        if (originOdds.home == originOdds.away || odds[pick] != originOdds[pick]) {
            return this.props.addBet(name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin);
        }
        this.setState({ showModal: true });
    }

    render() {
        const { betSlip, removeBet, sportName, timezone, search, } = this.props;
        const { data, error, showModal } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }
        const { league, origin } = data;
        const emptyBoxLine = (
            <li>
                <span className="box-odds">
                    <div className="vertical-align">
                        <i className="fap fa-do-not-enter" />
                    </div>
                </span>
                <span className="box-odds">
                    <div className="vertical-align">
                        <i className="fap fa-do-not-enter" />
                    </div>
                </span>
            </li>
        );
        return (
            <div className="mt-2">
                <h3>{sportName}: {league.name}</h3>
                {showModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b>BET ON SPORTSBOOK</b>
                            <hr />
                            <p>
                                Forward your bet to the sportsbook below. The odds may vary.
                            </p>
                            <div className="text-right">
                                <Link className="form-button" to="/sportsbook"> Bet on Sportsbook </Link>
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> Cancel </button>
                            </div>
                        </div>
                    </div>
                </div>}
                <div className="table-title">HIGHLIGHTS</div>
                <div className="content">
                    {(() => {
                        const { name: leagueName, originId: leagueId } = league;
                        let events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId, started } = event;
                            if (teamA.toLowerCase().indexOf(search.toLowerCase()) == -1 && teamB.toLowerCase().indexOf(search.toLowerCase()) == -1) {
                                return null;
                            }
                            if (!lines || !lines.length || new Date() > new Date(startDate))
                                return null;

                            const { moneyline, spreads, totals, originId: lineId } = lines[0];

                            if (!moneyline)
                                return null;

                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: `/sport/${sportName}/league/${league.originId}/event/${event.originId}` }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                        </Link>
                                    </li>
                                    <li className="detailed-lines-link mobile">
                                        <Link to={{ pathname: `/sport/${sportName}/league/${league.originId}/event/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                    <React.Fragment key={lineId}>
                                        {moneyline ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(moneyline.home, moneyline.away);
                                                const lineQuery = {
                                                    sportName,
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'moneyline',
                                                };
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type);
                                                return (
                                                    <li>
                                                        <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist ?
                                                                () => removeBet(lineId, 'moneyline', 'home')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'moneyline',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    moneyline,
                                                                    'home',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    teamA,
                                                                    null,
                                                                    origin,
                                                                    started,
                                                                )}>
                                                            {!started && <div className="vertical-align">
                                                                {(moneyline.home != newHome || moneyline.home == newHome && moneyline.home == moneyline.away) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(moneyline.home)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </>}
                                                                {moneyline.home == newHome && moneyline.home != moneyline.away && <div className="origin-odds">
                                                                    {this.convertOdds(newHome)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                        <span className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist ?
                                                                () => removeBet(lineId, 'moneyline', 'away')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'moneyline',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    moneyline,
                                                                    'away',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    `${teamB}`,
                                                                    null,
                                                                    origin,
                                                                    started,
                                                                )}>
                                                            {!started && <div className="vertical-align">
                                                                {(moneyline.away != newAway || moneyline.away == newAway && moneyline.home == moneyline.away) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(moneyline.away)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
                                                                    </div>
                                                                </>}
                                                                {moneyline.away == newAway && moneyline.home != moneyline.away && <div className="origin-odds">
                                                                    {this.convertOdds(newAway)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                        {spreads ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(spreads[0].home, spreads[0].away);
                                                const lineQuery = {
                                                    sportName,
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'spread',
                                                    index: 0,
                                                };
                                                if (spreads[0].altLineId) lineQuery.altLineId = spreads[0].altLineId;
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type);
                                                return (
                                                    <li>
                                                        <span
                                                            className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'spread', 'home')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'spread',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    spreads[0],
                                                                    'home',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    `${teamA} ${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`,
                                                                    0,
                                                                    origin,
                                                                    started,
                                                                )}
                                                        >
                                                            {!started && <div className="vertical-align">
                                                                <div className="points">{`${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`}</div>
                                                                {(spreads[0].home != newHome || spreads[0].home == newHome && spreads[0].home == spreads[0].away) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(spreads[0].home)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </>}
                                                                {spreads[0].home == newHome && spreads[0].home != spreads[0].away && <div className="origin-odds">
                                                                    {this.convertOdds(newHome)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'spread', 'away')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'spread',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    spreads[0],
                                                                    'away',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    `${teamB} ${-1 * spreads[0].hdp > 0 ? '+' : ''}${-1 * spreads[0].hdp}`,
                                                                    0,
                                                                    origin,
                                                                    started,
                                                                )}>
                                                            {!started && <div className="vertical-align">
                                                                <div className="points">{`${(-1 * spreads[0].hdp) > 0 ? '+' : ''}${-1 * spreads[0].hdp}`}</div>
                                                                {(spreads[0].away != newAway || spreads[0].away == newAway && spreads[0].home == spreads[0].away) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(spreads[0].away)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
                                                                    </div>
                                                                </>}
                                                                {spreads[0].away == newAway && spreads[0].home != spreads[0].away && <div className="origin-odds">
                                                                    {this.convertOdds(newAway)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                        {totals ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(totals[0].over, totals[0].under);
                                                const lineQuery = {
                                                    sportName,
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'total',
                                                    index: 0
                                                };
                                                if (totals[0].altLineId) lineQuery.altLineId = totals[0].altLineId;
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type);
                                                return (
                                                    <li>
                                                        <span
                                                            className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'total', 'home')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'total',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    { home: totals[0].over, away: totals[0].under },
                                                                    'home',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    `Over ${totals[0].points}`,
                                                                    0,
                                                                    origin,
                                                                    started,
                                                                )}
                                                        >
                                                            {!started && <div className="vertical-align">
                                                                <div className="points">{`${totals[0].points}`}</div>
                                                                {(totals[0].over != newHome || totals[0].over == newHome && totals[0].over == totals[0].under) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(totals[0].over)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </>}
                                                                {totals[0].over == newHome && totals[0].over != totals[0].under && <div className="origin-odds">
                                                                    {this.convertOdds(newHome)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'total', 'away')
                                                                : () => this.addBet(
                                                                    `${teamA} - ${teamB}`,
                                                                    'total',
                                                                    leagueName,
                                                                    { home: newHome, away: newAway },
                                                                    { home: totals[0].over, away: totals[0].under },
                                                                    'away',
                                                                    teamA,
                                                                    teamB,
                                                                    sportName,
                                                                    lineId,
                                                                    lineQuery,
                                                                    `Under ${totals[0].points}`,
                                                                    0,
                                                                    origin,
                                                                    started,
                                                                )}
                                                        >
                                                            {!started && <div className="vertical-align">
                                                                <div className="points">{`${totals[0].points}`}</div>
                                                                {(totals[0].under != newAway || totals[0].under == newAway && totals[0].over == totals[0].under) && <>
                                                                    <div className="old-odds">
                                                                        {this.convertOdds(totals[0].under)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
                                                                    </div>
                                                                </>}
                                                                {totals[0].under == newAway && totals[0].over != totals[0].under && <div className="origin-odds">
                                                                    {this.convertOdds(newAway)}
                                                                </div>}
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                    </React.Fragment>
                                    <li className="detailed-lines-link not-mobile">
                                        <Link to={{ pathname: `/sport/${sportName}/league/${league.originId}/event/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            );
                        });
                        events = events.filter(event => event);
                        return (
                            events.length ?
                                <div className="tab-content" id="myTabContent" key={leagueName}>
                                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                        <ul className="table-list table-list-top d-flex">
                                            <li>{leagueName}&nbsp;<i className="fas fa-chevron-right" style={{ display: 'initial' }}></i></li>
                                            <li>MONEY LINE</li>
                                            <li>HANDICAP</li>
                                            <li>OVER UNDER</li>
                                        </ul>
                                        {events}
                                    </div>
                                </div>
                                : null
                        );
                    })()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    search: state.frontend.search,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(SportLeague))
