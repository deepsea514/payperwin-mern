import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";


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
                                        const { moneyline, spreads, totals } = line;
                                        if (moneyline) {
                                            if ((moneyline.home > 0 && moneyline.away < 0) || (moneyline.home < 0 && moneyline.away > 0)) {
                                                event.lineCount++;
                                            }
                                            else {
                                                delete line.moneyline;
                                            }
                                        }
                                        if (spreads) {
                                            const filteredSpreads = spreads.filter(spread => {
                                                if (spread && (spread.home > 0 && spread.away < 0) || (spread.home < 0 && spread.away > 0))
                                                    return true;
                                                return false;
                                            });
                                            event.lineCount += filteredSpreads.length;
                                            line.spreads = filteredSpreads.length ? filteredSpreads : null;
                                        }
                                        if (totals) {
                                            const filteredTotals = totals.filter(total => {
                                                if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
                                                    return true;
                                                return false;
                                            });
                                            event.lineCount += filteredTotals.length;
                                            line.totals = filteredTotals.length ? filteredTotals : null;
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

    render() {
        const { match, addBet, betSlip, removeBet, sportName, timezone, search } = this.props;
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
            <div className="content mt-2">
                <div className="table-title">HIGHLIGHTS</div>
                {
                    leagues.map(league => {
                        const { name: leagueName, originId: leagueId } = league;
                        let events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId } = event;
                            if (teamA.toLowerCase().indexOf(search.toLowerCase()) == -1 && teamB.toLowerCase().indexOf(search.toLowerCase()) == -1) {
                                return null;
                            }
                            if (!lines || !lines.length || new Date() > new Date(startDate))
                                return null;

                            const { moneyline, spreads, totals, originId: lineId } = lines[0];

                            if (!moneyline || !spreads || !totals)
                                return null;

                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }} className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                        </Link>
                                    </li>
                                    <li className="detailed-lines-link mobile">
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }}>
                                            +{event.lineCount}<i className="fas fa-angle-right" />
                                        </Link>
                                    </li>
                                    <React.Fragment key={lineId}>
                                        {
                                            moneyline ? (
                                                (() => {
                                                    const moneylineDifference = Math.abs(Math.abs(moneyline.home) - Math.abs(moneyline.away)) / 2;
                                                    let bigHome = 1;
                                                    if (moneyline.home > 0) {
                                                        if (Math.abs(moneyline.away) > Math.abs(moneyline.home)) bigHome = 1;
                                                        else bigHome = -1;
                                                    }
                                                    if (moneyline.home < 0) {
                                                        if (Math.abs(moneyline.away) > Math.abs(moneyline.home)) bigHome = -1;
                                                        else bigHome = 1;
                                                    }
                                                    const newHome = moneyline.home + moneylineDifference * bigHome;
                                                    const newAway = moneyline.away + moneylineDifference * bigHome;
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
                                                            <span className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(moneyline.home)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                            <span className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(moneyline.away)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
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
                                                    const spreadDifference = Math.abs(Math.abs(spreads[0].home) - Math.abs(spreads[0].away)) / 2;
                                                    let bigHome = 1;
                                                    if (spreads[0].home > 0) {
                                                        if (Math.abs(spreads[0].away) > Math.abs(spreads[0].home)) bigHome = 1;
                                                        else bigHome = -1;
                                                    }
                                                    if (spreads[0].home < 0) {
                                                        if (Math.abs(spreads[0].away) > Math.abs(spreads[0].home)) bigHome = -1;
                                                        else bigHome = 1;
                                                    }
                                                    const newHome = spreads[0].home + spreadDifference * bigHome;
                                                    const newAway = spreads[0].away + spreadDifference * bigHome;
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
                                                                className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(spreads[0].home)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                            <span
                                                                className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(spreads[0].away)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
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
                                                    const totalDifference = Math.abs(Math.abs(totals[0].over) - Math.abs(totals[0].under)) / 2;
                                                    let bigHome = 1;
                                                    if (totals[0].over > 0) {
                                                        if (Math.abs(totals[0].under) > Math.abs(totals[0].over)) bigHome = 1;
                                                        else bigHome = -1;
                                                    }
                                                    if (totals[0].over < 0) {
                                                        if (Math.abs(totals[0].under) > Math.abs(totals[0].over)) bigHome = -1;
                                                        else bigHome = 1;
                                                    }
                                                    const newHome = totals[0].over + totalDifference * bigHome;
                                                    const newAway = totals[0].under + totalDifference * bigHome;
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
                                                                className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(totals[0].over)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newHome)}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                            <span
                                                                className={`box-odds ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type) ? 'orange' : null}`}
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
                                                                        {this.convertOdds(totals[0].under)}
                                                                    </div>
                                                                    <div className="new-odds">
                                                                        {this.convertOdds(newAway)}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </li>
                                                    );
                                                })()
                                            ) : emptyBoxLine
                                        }
                                    </React.Fragment>
                                    <li className="detailed-lines-link not-mobile">
                                        <Link to={{ pathname: `/lines/${sportName}/${league.originId}/${event.originId}` }}>
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
                    })
                }
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

export default connect(mapStateToProps, frontend.actions)(withRouter(Sport))
