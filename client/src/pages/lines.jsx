import React, { PureComponent } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { setMeta } from '../libs/documentTitleBuilder';
import getLinesFromSportData from '../libs/getLinesFromSportData';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";
import DocumentMeta from 'react-document-meta';
import calculateNewOdds from '../helpers/calculateNewOdds';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Lines extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            metaData: null,
            showModal: false,
        };
    }

    componentDidMount() {
        const title = 'Betting on Detailed sports line';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
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

    addBet = (name, type, league, odds, originOdds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin) => {
        if (odds[pick] != originOdds[pick]) {
            return this.props.addBet(name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin);
        }
        this.setState({ showModal: true });
    }

    render() {
        const { match, addBet, betSlip, removeBet, timezone } = this.props;
        const { sportName, leagueId, eventId } = match.params;
        const { data, error, metaData, showModal } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        const { teamA, teamB, startDate, leagueName, lines, origin } = data;
        return (
            <div className="content detailed-lines">
                {metaData && <DocumentMeta {...metaData} />}
                {showModal && <div className="modal confirmation">
                    <div className="background-closer" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b>BET ON SPORTSBOOK</b>
                            <hr />
                            <p>
                                Unfortinately Payper Win is unable to provide better odds, but feel free to place a wager on our sportsbook. Use your Payper Win wallet balance to place bets.
                            </p>
                            <div className="text-right">
                                <Link className="form-button" to="/sportsbook"> Bet on Sportsbook </Link>
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> Cancel </button>
                            </div>
                        </div>
                    </div>
                </div>}
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
                                            const { newHome, newAway } = calculateNewOdds(moneyline.home, moneyline.away)
                                            // TODO: Refactor this to be simpler
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
                                                <React.Fragment>
                                                    <div className="line-type-header line-type-header-moneyline">Moneyline:</div>
                                                    <li>
                                                        <div className="row mx-0">
                                                            <div className="col-md-6 com-sm-12 col-12">
                                                                <span className={`box-odds box-moneyline line-full ${homeExist ? 'orange' : null}`}
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
                                                                            `${teamA}`,
                                                                            null,
                                                                            origin
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamA}</div>
                                                                        <div className="odds">
                                                                            {moneyline.home != newHome && <div className="old-odds">
                                                                                {this.convertOdds(moneyline.home)}
                                                                            </div>}
                                                                            <div className="new-odds">
                                                                                {this.convertOdds(newHome)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-6 com-sm-12 col-12">
                                                                <span className={`box-odds box-moneyline line-full ${awayExist ? 'orange' : null}`}
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
                                                                            origin
                                                                        )}>
                                                                    <div className="vertical-align">
                                                                        <div className="points">{teamB}</div>
                                                                        <div className="odds">
                                                                            {moneyline.away != newAway && <div className="old-odds">
                                                                                {this.convertOdds(moneyline.away)}
                                                                            </div>}
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
                                                    const { newHome, newAway } = calculateNewOdds(spread.home, spread.away)
                                                    const lineQuery = {
                                                        sportName,
                                                        leagueId,
                                                        eventId,
                                                        lineId,
                                                        type: 'spread',
                                                        index: i,
                                                    };
                                                    if (spread.altLineId) lineQuery.altLineId = spread.altLineId;
                                                    const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index);
                                                    const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index);
                                                    return (
                                                        <li key={i}>
                                                            <div className="row mx-0">
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-odds line-full ${homeExist ? 'orange' : null}`}
                                                                        onClick={homeExist
                                                                            ? () => removeBet(lineId, 'spread', 'home', i)
                                                                            : () => this.addBet(
                                                                                `${teamA} - ${teamB}`,
                                                                                'spread',
                                                                                leagueName,
                                                                                { home: newHome, away: newAway },
                                                                                spread,
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
                                                                                {spread.home != newHome && <div className="old-odds">
                                                                                    {this.convertOdds(spread.home)}
                                                                                </div>}
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newHome)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12">
                                                                    <span
                                                                        className={`box-odds line-full ${awayExist ? 'orange' : null}`}
                                                                        onClick={awayExist
                                                                            ? () => removeBet(lineId, 'spread', 'away', i)
                                                                            : () => this.addBet(
                                                                                `${teamA} - ${teamB}`,
                                                                                'spread',
                                                                                leagueName,
                                                                                { home: newHome, away: newAway },
                                                                                spread,
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
                                                                                {spread.away != newAway && <div className="old-odds">
                                                                                    {this.convertOdds(spread.away)}
                                                                                </div>}
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
                                                    const { newHome, newAway } = calculateNewOdds(total.over, total.under)
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
                                                                <div className="col-md-6 com-sm-12 col-12 ">
                                                                    <span
                                                                        className={`box-odds line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'total', 'home', i)
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
                                                                                {total.over != newHome && <div className="old-odds">
                                                                                    {this.convertOdds(total.over)}
                                                                                </div>}
                                                                                <div className="new-odds">
                                                                                    {this.convertOdds(newHome)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-6 com-sm-12 col-12 ">
                                                                    <span
                                                                        className={`box-odds line-full ${betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index) ? 'orange' : null}`}
                                                                        onClick={
                                                                            betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index)
                                                                                ? () => removeBet(lineId, 'total', 'away', i)
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
                                                                                {total.under != newAway && <div className="old-odds">
                                                                                    {this.convertOdds(total.under)}
                                                                                </div>}
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
