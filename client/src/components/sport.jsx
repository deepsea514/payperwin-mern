import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import calculateNewOdds from '../helpers/calculateNewOdds';
import convertOdds from '../helpers/convertOdds';
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import _env from '../env.json';
import SBModal from './sbmodal';
import SportsBreadcrumb from './sportsbreadcrumb';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';

const serverUrl = _env.appUrl;

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

Date.prototype.addDates = function (d) {
    this.setTime(this.getTime() + (d * 24 * 60 * 60 * 1000));
    return this;
}

class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            liveData: null,
            error: null,
            sportsbookInfo: null,
            timer: null,
            liveTimer: null,
            dateSelected: null,
        };
    }

    componentDidMount() {
        this.getSport();
        this.getLiveSport();
        this.setState({
            timer: setInterval(this.getSport, 60 * 1000),
            liveTimer: setInterval(this.getLiveSport, 10 * 1000),
        })
    }

    componentWillUnmount() {
        const { timer, liveTimer } = this.state;
        if (timer) clearInterval(timer);
        if (liveTimer) clearInterval(liveTimer);
    }

    componentDidUpdate(prevProps) {
        const { sportName, league } = this.props;
        const { sportName: prevSportName, league: prevLeague } = prevProps;
        const sportChanged = (sportName !== prevSportName || league !== prevLeague);
        if (sportChanged) {
            this.setState({ error: null });
            this.getSport();
            this.getLiveSport();
        }
    }

    getLiveSport = () => {
        const { sportName, league: league } = this.props;
        axios.get(`${serverUrl}/livesport`, { params: league ? { name: sportName ? sportName.replace("_", " ") : "", leagueId: league } : { name: sportName ? sportName.replace("_", " ") : "" } })
            .then(({ data }) => {
                if (data) {
                    this.setState({ liveData: data });
                } else {
                    this.setState({ liveData: null })
                }
            })
            .catch((err) => {
            })
    }

    getSport = () => {
        const { sportName, league: league } = this.props;
        if (sportName) {
            axios.get(`${serverUrl}/sport`, { params: league ? { name: sportName ? sportName.replace("_", " ") : "", leagueId: league } : { name: sportName ? sportName.replace("_", " ") : "" } })
                .then(({ data }) => {
                    if (data) {
                        this.setState({ data });
                    } else {
                        this.setState({ data: null })
                    }
                }).catch((err) => {
                    this.setState({ error: err });
                });
        }
    }

    getLineCount = (line, timer) => {
        let lineCount = 0;
        const {
            moneyline, spreads, totals, alternative_spreads, alternative_totals,
            first_half, second_half, fifth_innings,
            first_quarter, second_quarter, third_quarter, forth_quarter
        } = line;
        let lines = [];
        if (timer) {
            if (timer.q < "4") {
                lines.push(forth_quarter);
            }
            if (timer.q < "3") {
                lines.push(third_quarter);
                lines.push(second_half);
            }
            if (timer.q < "2") {
                lines.push(second_quarter);
            }
        } else {
            lines = [
                { moneyline, spreads, totals, alternative_spreads, alternative_totals },
                first_half,
                second_half,
                first_quarter,
                second_quarter,
                third_quarter,
                forth_quarter,
                fifth_innings
            ];
        }
        lines.forEach(line => {
            if (!line) return;
            const { moneyline, spreads, totals, alternative_spreads, alternative_totals } = line;
            if (moneyline) {
                lineCount++;
            }
            if (spreads) {
                lineCount += spreads.length;
            }
            if (totals) {
                lineCount += totals.length;
            }
            if (alternative_spreads) {
                lineCount += alternative_spreads.length;
            }
            if (alternative_totals) {
                lineCount += alternative_totals.length;
            }
        });
        return lineCount;
    }

    addBet = (bet) => {
        const { addBet } = this.props;
        const { type, odds, originOdds, pick, subtype } = bet;
        if (checkOddsAvailable(originOdds, odds, pick, type, subtype)) {
            return addBet(bet);
        }
        this.setState({ sportsbookInfo: bet });
    }

    addSportsbookBet = () => {
        const { sportsbookInfo } = this.state;
        const { addBet } = this.props;
        addBet({ ...sportsbookInfo, odds: sportsbookInfo.originOdds, sportsbook: true });
        this.setState({ sportsbookInfo: null });
    }

    getDateStr = (day) => {
        switch (day) {
            case 0:
                return 'Today';
            case null:
                return 'All';
            default:
                const date = new Date().addDates(day);
                return dateFormat(date, "mmm d");
        }
    }

    render() {
        const {
            betSlip, removeBet, timezone, oddsFormat, team, sportName,
            league: leagueId, hideBreacrumb, user, getUser
        } = this.props;
        const {
            data, error, sportsbookInfo, liveData, dateSelected
        } = this.state;
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (!data) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }

        const { leagues, origin } = data;
        const selectedLeague = leagues.find(league => league.originId == leagueId);
        return (
            <div>
                {!hideBreacrumb && <SportsBreadcrumb sportName={sportName}
                    league={selectedLeague ? {
                        name: selectedLeague.name,
                        leagueId: selectedLeague.originId
                    } : null} user={user} getUser={getUser} team={team} active='matchup' />}
                {sportsbookInfo && <SBModal
                    sportsbookInfo={sportsbookInfo}
                    onClose={() => this.setState({ sportsbookInfo: null })}
                    onAccept={this.addSportsbookBet}
                />}

                {liveData && (() => {
                    const { leagues } = liveData;
                    if (!leagues || !leagues.length) return null;

                    const filteredLeagues = leagues.map(league => {
                        const { name: leagueName, originId: leagueId, events } = league;
                        const filteredEvents = events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, timer } = event;
                            if (!lines || !lines.length)
                                return null;
                            const lineCount = this.getLineCount(lines[0], timer);
                            if (!lineCount) return null;
                            const pathname = `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}/live`;
                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: pathname }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>
                                        </Link>
                                        <Link to={{ pathname: pathname }} className="widh-adf mt-3">
                                            {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                            <strong>{lineCount}+ <FormattedMessage id="COMPONENTS.SPORT.ADDITIONAL" /> <i className="fas fa-angle-right" /></strong>
                                        </Link>
                                    </li>
                                    {[1, 2, 3].map(i => (
                                        <li key={i}>
                                            <span className="box-odds">
                                                <div className="vertical-align">
                                                    <div className="origin-odds">
                                                        <i className="fas fa-lock" />
                                                    </div>
                                                </div>
                                            </span>
                                            <span className="box-odds">
                                                <div className="vertical-align">
                                                    <div className="origin-odds">
                                                        <i className="fas fa-lock" />
                                                    </div>
                                                </div>
                                            </span>
                                        </li>
                                    ))}
                                    <li className="detailed-lines-link not-mobile">
                                        <Link to={{ pathname: pathname }}>
                                            +{lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            )
                        }).filter(event => event);
                        return filteredEvents.length > 0 && (
                            <div className="tab-content" key={leagueName}>
                                <div className="tab-pane fade show active tab-pane-leagues" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                    <ul className="table-list table-list-top d-flex">
                                        <li>{leagueName}&nbsp;<i className="fas fa-chevron-right"></i></li>
                                        <li><FormattedMessage id="COMPONENTS.MONEYLINE" /></li>
                                        <li><FormattedMessage id="COMPONENTS.HANDICAP" /></li>
                                        <li><FormattedMessage id="COMPONENTS.OVERUNDER" /></li>
                                        <li className="detailed-lines-link not-mobile"></li>
                                    </ul>
                                    {filteredEvents}
                                </div>
                            </div>
                        );
                    }).filter(league => league);

                    return filteredLeagues.length > 0 && (
                        <>
                            <div className="table-title">LIVE</div>
                            <div className="content mb-3">
                                {filteredLeagues}
                            </div>
                        </>
                    )
                })()}

                {(() => {
                    let minDate = null;
                    let maxDate = null;
                    switch (dateSelected) {
                        case null:
                            break;
                        default:
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = today.getMonth();
                            const date = today.getDate();
                            const newDate = new Date(year, month, date);
                            minDate = new Date(newDate.addDates(dateSelected));
                            maxDate = new Date(newDate.addDates(1));
                    }
                    const filteredLeagues = leagues.map(league => {
                        const { name: leagueName, originId: leagueId } = league;
                        let events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId } = event;
                            if (!lines || !lines.length || new Date().getTime() > new Date(startDate).getTime())
                                return null;
                            if (minDate && new Date(startDate).getTime() < minDate.getTime() ||
                                maxDate && new Date(startDate).getTime() >= maxDate.getTime()) {
                                return null;
                            }

                            if (team && teamA != team && teamB != team) return;
                            const { moneyline, spreads, totals, originId: lineId } = lines[0];
                            if (!moneyline && !spreads && !totals)
                                return null;
                            const lineCount = this.getLineCount(lines[0]);
                            const pathname = `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}`;
                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: pathname }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>
                                        </Link>
                                        <Link to={{ pathname: pathname }} className="widh-adf mt-3">
                                            {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                            <strong>{lineCount}+ <FormattedMessage id="COMPONENTS.SPORT.ADDITIONAL" /> <i className="fas fa-angle-right" /></strong>
                                        </Link>
                                    </li>
                                    <React.Fragment key={lineId}>
                                        {moneyline ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(moneyline.home, moneyline.away, 'moneyline');
                                                const lineQuery = {
                                                    sportName: sportName.replace("_", " "),
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'moneyline',
                                                    subtype: null,
                                                    index: null
                                                };
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                                                return (
                                                    <li>
                                                        <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist ?
                                                                () => removeBet(lineId, 'moneyline', 'home', null, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'moneyline',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: moneyline,
                                                                    pick: 'home',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: ${teamA}`,
                                                                    index: null,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                {checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'home', 'moneyline', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(moneyline.home, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newHome, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'home', 'moneyline', null) && <div className="origin-odds">
                                                                    {convertOdds(moneyline.home, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                        <span className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist ?
                                                                () => removeBet(lineId, 'moneyline', 'away', null, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'moneyline',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: moneyline,
                                                                    pick: 'away',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: ${teamB}`,
                                                                    index: null,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                {checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'away', 'moneyline', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(moneyline.away, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newAway, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'away', 'moneyline', null) && <div className="origin-odds">
                                                                    {convertOdds(moneyline.away, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                        {spreads && spreads[0] ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(spreads[0].home, spreads[0].away, 'spread');
                                                const lineQuery = {
                                                    sportName: sportName.replace("_", " "),
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'spread',
                                                    index: 0,
                                                    subtype: null,
                                                };
                                                if (spreads[0].altLineId) lineQuery.altLineId = spreads[0].altLineId;
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                                                return (
                                                    <li>
                                                        <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'spread', 'home', 0, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'spread',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: spreads[0],
                                                                    pick: 'home',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: ${teamA} ${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`,
                                                                    index: 0,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="points">{`${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`}</div>
                                                                {checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'home', 'spread', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(spreads[0].home, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newHome, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'home', 'spread', null) && <div className="origin-odds">
                                                                    {convertOdds(spreads[0].home, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'spread', 'away', 0, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'spread',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: spreads[0],
                                                                    pick: 'away',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: ${teamB} ${-1 * spreads[0].hdp > 0 ? '+' : ''}${-1 * spreads[0].hdp}`,
                                                                    index: 0,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="points">{`${(-1 * spreads[0].hdp) > 0 ? '+' : ''}${-1 * spreads[0].hdp}`}</div>
                                                                {checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'away', 'spread', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(spreads[0].away, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newAway, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'away', 'spread', null) && <div className="origin-odds">
                                                                    {convertOdds(spreads[0].away, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                        {totals && totals[0] ? (
                                            (() => {
                                                const { newHome, newAway } = calculateNewOdds(totals[0].over, totals[0].under, 'total');
                                                const lineQuery = {
                                                    sportName: sportName.replace("_", " "),
                                                    leagueId,
                                                    eventId,
                                                    lineId,
                                                    type: 'total',
                                                    index: 0,
                                                    subtype: null
                                                };
                                                if (totals[0].altLineId) lineQuery.altLineId = totals[0].altLineId;
                                                const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                                                const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                                                return (
                                                    <li>
                                                        <span
                                                            className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'total', 'home', 0, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'total',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: { home: totals[0].over, away: totals[0].under },
                                                                    pick: 'home',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: Over ${totals[0].points}`,
                                                                    index: 0,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="points">O {`${totals[0].points}`}</div>
                                                                {checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'home', 'total', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(totals[0].over, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newHome, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'home', 'total', null) && <div className="origin-odds">
                                                                    {convertOdds(totals[0].over, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'total', 'away', 0, null)
                                                                : () => this.addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'total',
                                                                    league: leagueName,
                                                                    odds: { home: newHome, away: newAway },
                                                                    originOdds: { home: totals[0].over, away: totals[0].under },
                                                                    pick: 'away',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName: sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: lineQuery,
                                                                    pickName: `Pick: Under ${totals[0].points}`,
                                                                    index: 0,
                                                                    origin: origin,
                                                                    subtype: null
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="points">U {`${totals[0].points}`}</div>
                                                                {checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'away', 'total', null) && <>
                                                                    <div className="old-odds">
                                                                        {convertOdds(totals[0].under, oddsFormat)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {convertOdds(newAway, oddsFormat)}
                                                                    </div>
                                                                </>}
                                                                {!checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'away', 'total', null) && <div className="origin-odds">
                                                                    {convertOdds(totals[0].under, oddsFormat)}
                                                                </div>}
                                                            </div>
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                    </React.Fragment>
                                    <li className="detailed-lines-link not-mobile">
                                        <Link to={{ pathname: pathname }}>
                                            +{lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            );
                        }).filter(event => event);
                        return (events.length > 0 &&
                            <div className="tab-content" key={leagueName}>
                                <div className="tab-pane fade show active tab-pane-leagues border-0" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                    <div className="table-title">{leagueName}</div>
                                    <ul className="table-list table-list-top d-flex">
                                        <li>{leagueName}&nbsp;<i className="fas fa-chevron-right" style={{ display: 'initial' }}></i></li>
                                        <li><FormattedMessage id="COMPONENTS.MONEYLINE" /></li>
                                        <li><FormattedMessage id="COMPONENTS.HANDICAP" /></li>
                                        <li><FormattedMessage id="COMPONENTS.OVERUNDER" /></li>
                                        <li className="detailed-lines-link not-mobile"></li>
                                    </ul>
                                    {events}
                                </div>
                            </div>
                        );
                    }).filter(league => league);
                    return (
                        <>
                            <div className="dashboard_bottombar date_bottombar_container">
                                <div className="dashboard_bottombar_container date_bottombar">
                                    <div className="dashboard_bottombar_wrapper" style={{ minWidth: '100%' }}>
                                        <div className='dashboard_bottombar_scroller_container'>
                                            <div className="dashboard_bottombar_scroller date_bottombar" style={{
                                                transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                                                transitionDuration: '0ms',
                                                transform: 'translate(0px, 0px) translateZ(0px)'
                                            }}>
                                                {[0, 1, 2, 3, 4, 5, 6, null].map((date, index) => {
                                                    return (
                                                        <a key={index}
                                                            className={dateSelected == date ? "dashboard_bottombar_selected" : ''}
                                                            onClick={() => this.setState({ dateSelected: date })}><span>{this.getDateStr(date)}</span></a>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="content">
                                {filteredLeagues}
                            </div>
                        </>
                    )
                })()}
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(Sport))
