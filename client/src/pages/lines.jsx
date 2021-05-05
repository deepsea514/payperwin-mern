import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { setTitle } from '../libs/documentTitleBuilder';
import getLinesFromSportData from '../libs/getLinesFromSportData';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";

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
                                    const { moneyline, spreads, totals } = line;
                                    if (moneyline) {
                                        if ((moneyline.home > 0 && moneyline.away < 0) || (moneyline.home < 0 && moneyline.away > 0)) {
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
                                        line.spreads = filteredSpreads.length ? filteredSpreads : null;
                                    }

                                    if (totals) {
                                        const filteredTotals = totals.filter(total => {
                                            if (total && (total.over > 0 && total.under < 0) || (total.over < 0 && total.under > 0))
                                                return true;
                                            return false;
                                        });
                                        line.totals = filteredTotals.length ? filteredTotals : null;
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

    convertOdds = (odd) => {
        const { oddsFormat } = this.props;
        switch (oddsFormat) {
            case 'decimal':
                if (odd > 0)
                    return Number(1 + odd / 100).toFixed(2);
                return Number(1 - 100 / odd).toFixed(2);
            case 'american':
                if (odd > 0)
                    return '+' + odd.toFixed(2);
                return odd.toFixed(2);
            default:
                return odd;
        }
    }

    render() {
        const { match, addBet, betSlip, removeBet, timezone } = this.props;
        const { sportName, leagueId, eventId, lineId } = match.params;
        const { data, error } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        const { teamA, teamB, startDate, leagueName, lines, origin } = data;
        return (
            <div className="content detailed-lines">
                <center>
                    <div>
                        {timeHelper.convertTimeLineDate(new Date(startDate), timezone)}
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
                                            let bigHome = 1;
                                            if (moneyline.home > 0) {
                                                if (moneyline.away > moneyline.home) bigHome = 1;
                                                else bigHome = -1;
                                            }
                                            if (moneyline.home < 0) {
                                                if (moneyline.away > moneyline.home) bigHome = -1;
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
                                                <React.Fragment>
                                                    <div className="line-type-header">Moneyline:</div>
                                                    <li>
                                                        <div className="row mx-0">
                                                            <div className="col-md-6 com-sm-12 col-12 pl-0">
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
                                                                            null,
                                                                            origin
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamA}</div>
                                                                        <div className="odds">
                                                                            <div className="old-odds">
                                                                                {this.convertOdds(moneyline.home)}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {this.convertOdds(newHome)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-6 com-sm-12 col-12 pr-0">
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
                                                                            null,
                                                                            origin
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamB}</div>
                                                                        <div className="odds">
                                                                            <div className="old-odds">
                                                                                {this.convertOdds(moneyline.away)}
                                                                            </div>
                                                                            <div className="new-odds">
                                                                                {this.convertOdds(newAway)}
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
                                                    const spreadDifference = Math.abs(Math.abs(spread.home) - Math.abs(spread.away)) / 2;
                                                    let bigHome = 1;
                                                    if (spread.home > 0) {
                                                        if (Math.abs(spread.away) > Math.abs(spread.home)) bigHome = 1;
                                                        else bigHome = -1;
                                                    }
                                                    if (spread.home < 0) {
                                                        if (Math.abs(spread.away) > Math.abs(spread.home)) bigHome = -1;
                                                        else bigHome = 1;
                                                    }
                                                    const newHome = spread.home + spreadDifference * bigHome;
                                                    const newAway = spread.away + spreadDifference * bigHome;
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
                                                            <div className="row mx-0">
                                                                <div className="col-md-6 com-sm-12 col-12 pl-0">
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
                                                                                    origin
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${spread.hdp > 0 ? '+' : ''}${spread.hdp}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {this.convertOdds(spread.home)}
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newHome)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12 pr-0">
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
                                                                                    origin
                                                                                )}>
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${(-1 * spread.hdp) > 0 ? '+' : ''}${-1 * spread.hdp}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {this.convertOdds(spread.away)}
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newAway)}
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
                                                    const totalDifference = Math.abs(Math.abs(total.over) - Math.abs(total.under)) / 2;
                                                    let bigHome = 1;
                                                    if (total.over > 0) {
                                                        if (Math.abs(total.under) > Math.abs(total.over)) bigHome = 1;
                                                        else bigHome = -1;
                                                    }
                                                    if (total.over < 0) {
                                                        if (Math.abs(total.under) > Math.abs(total.over)) bigHome = -1;
                                                        else bigHome = 1;
                                                    }
                                                    const newHome = total.over + totalDifference * bigHome;
                                                    const newAway = total.under + totalDifference * bigHome;
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
                                                            <div className="row mx-0">
                                                                <div className="col-md-6 com-sm-12 col-12 pl-0">
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
                                                                                    origin
                                                                                )}
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${total.points}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {this.convertOdds(total.over)}
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newHome)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12 pr-0">
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
                                                                                    origin
                                                                                )
                                                                        }
                                                                    >
                                                                        <div className="vertical-align">
                                                                            <div className="points">{`${total.points}`}</div>
                                                                            <div className="odds">
                                                                                <div className="old-odds">
                                                                                    {this.convertOdds(total.under)}
                                                                                </div>
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newAway)}
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

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(Lines))
