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
import { FormattedMessage } from 'react-intl';
import SportsBreadcrumb from './sportsbreadcrumb';
const serverUrl = _env.appUrl;

class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            sportsbookInfo: null,
            timer: null,
            updateTimer: null
        };
    }

    componentDidMount() {
        this.getSport();
        this.setState({
            timer: setInterval(this.getSport.bind(this), 10 * 60 * 1000),
            updateTimer: setInterval(this.forceUpdate.bind(this), 1000),
        })
    }

    componentWillUnmount() {
        const { timer, updateTimer } = this.state;
        if (timer) clearInterval(timer);
        if (updateTimer) clearInterval(updateTimer);
    }

    componentDidUpdate(prevProps) {
        const { sportName, league } = this.props;
        const { sportName: prevSportName, league: prevLeague } = prevProps;
        const sportChanged = (sportName !== prevSportName || league !== prevLeague);
        if (sportChanged) {
            this.setState({ error: null });
            this.getSport();
        }
    }

    getSport() {
        const { sportName, league: league } = this.props;
        this.setState({ data: null });
        if (sportName) {
            axios.get(`${serverUrl}/sport`, { params: league ? { name: sportName ? sportName.replace("_", " ") : "", leagueId: league } : { name: sportName ? sportName.replace("_", " ") : "" } })
                .then(({ data }) => {
                    if (data) {
                        // Remove moneyline with draw
                        data.leagues.forEach(league => {
                            const { events } = league;
                            events.forEach(event => {
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
                                            const {
                                                moneyline, spreads, totals, alternative_spreads, alternative_totals,
                                                first_half, second_half, fifth_innings,
                                                first_quarter, second_quarter, third_quarter, forth_quarter
                                            } = line;
                                            let mline = [
                                                { moneyline, spreads, totals, alternative_spreads, alternative_totals },
                                                first_half,
                                                second_half,
                                                first_quarter,
                                                second_quarter,
                                                third_quarter,
                                                forth_quarter,
                                                fifth_innings
                                            ];
                                            mline.forEach(line => {
                                                if (!line) return;
                                                const { moneyline, spreads, totals, alternative_spreads, alternative_totals } = line;
                                                if (moneyline) {
                                                    event.lineCount++;
                                                }
                                                if (spreads) {
                                                    event.lineCount += spreads.length;
                                                }
                                                if (totals) {
                                                    event.lineCount += totals.length;
                                                }
                                                if (alternative_spreads) {
                                                    event.lineCount += alternative_spreads.length;
                                                }
                                                if (alternative_totals) {
                                                    event.lineCount += alternative_totals.length;
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        });
                        this.setState({ data });
                    }
                }).catch((err) => {
                    this.setState({ error: err });
                });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
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

    render() {
        const { betSlip, removeBet, timezone, oddsFormat, team, sportName, league: leagueId, hideBreacrumb } = this.props;
        const { data, error, sportsbookInfo } = this.state;
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (!data) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }
        const { leagues, origin } = data;
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
        const selectedLeague = leagues.find(league => league.originId == leagueId);
        return (
            <div>
                {!hideBreacrumb && <SportsBreadcrumb sportName={sportName}
                    league={selectedLeague ? {
                        name: selectedLeague.name,
                        leagueId: selectedLeague.originId
                    } : null} />}
                {sportsbookInfo && <SBModal
                    sportsbookInfo={sportsbookInfo}
                    onClose={() => this.setState({ sportsbookInfo: null })}
                    onAccept={this.addSportsbookBet}
                />}
                <div className="table-title"><FormattedMessage id="COMPONENTS.SPORT.HIGHLIGHTS" /></div>
                <div className="content">
                    {leagues.map(league => {
                        const { name: leagueName, originId: leagueId } = league;
                        let events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId, started } = event;
                            if (!lines || !lines.length || new Date().getTime() > new Date(startDate).getTime())
                                return null;
                            if (team && teamA != team && teamB != team) return;

                            const { moneyline, spreads, totals, originId: lineId } = lines[0];

                            if (!moneyline && !spreads && !totals)
                                return null;

                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}` }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                        </Link>
                                        <Link to={{ pathname: `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}` }} className="widh-adf mt-2 text-right">
                                            <strong><FormattedMessage id="COMPONENTS.SPORT.ADDITIONAL" /></strong>
                                        </Link>
                                    </li>
                                    <li className="detailed-lines-link mobile">
                                        <Link to={{ pathname: `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}>
                                                            {!started && <div className="vertical-align">
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
                                                            </div>}
                                                            {started && <div className="vertical-align">
                                                                <div className="origin-odds">
                                                                    <i className="fas fa-lock" />
                                                                </div>
                                                            </div>}
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}>
                                                            {!started && <div className="vertical-align">
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
                                                        <span
                                                            className={`box-odds ${homeExist ? 'orange' : null}`}
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}
                                                        >
                                                            {!started && <div className="vertical-align">
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}>
                                                            {!started && <div className="vertical-align">
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}
                                                        >
                                                            {!started && <div className="vertical-align">
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
                                                                    started: started,
                                                                    subtype: null
                                                                })}
                                                        >
                                                            {!started && <div className="vertical-align">
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
                                        <Link to={{ pathname: `/sport/${sportName.replace(" ", "_")}/league/${league.originId}/event/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                </ul>
                            );
                        });
                        events = events.filter(event => event);
                        return (events.length ?
                            <div className="tab-content" id="myTabContent" key={leagueName}>
                                <div className="tab-pane fade show active tab-pane-leagues" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                    <ul className="table-list table-list-top d-flex">
                                        <li>{leagueName}&nbsp;<i className="fas fa-chevron-right" style={{ display: 'initial' }}></i></li>
                                        <li className="detailed-lines-link mobile"></li>
                                        <li><FormattedMessage id="COMPONENTS.MONEYLINE" /></li>
                                        <li><FormattedMessage id="COMPONENTS.HANDICAP" /></li>
                                        <li><FormattedMessage id="COMPONENTS.OVERUNDER" /></li>
                                        <li className="detailed-lines-link not-mobile"></li>
                                    </ul>
                                    {events}
                                </div>
                            </div>
                            : null
                        );
                    })}
                </div>
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
