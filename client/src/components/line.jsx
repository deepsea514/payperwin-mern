import React, { Component } from 'react';
import LineDetail from './linedetail';
import classnames from "classnames";
import { FormattedMessage } from 'react-intl';
import { getSportName } from '../libs/getSportName';
const maximumShows = 3;

const EmptyLine = () => {
    return (
        <li>
            <div className="row mx-0">
                {[1, 2].map(i => (
                    <div className="col-md-6 col-sm-6" key={i}>
                        <span className="box-odds line-full">
                            <div className="vertical-align">
                                <center><i className="fap fa-do-not-enter" style={{ fontSize: '10px' }} /></center>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </li>
    )
}

const DisabledLine = () => {
    return (
        <li>
            <div className="row mx-0">
                {[1, 2].map(i => (
                    <div className="col-md-6 col-sm-6" key={i}>
                        <span className="box-odds line-full">
                            <div className="vertical-align">
                                <center><i className="fas fa-lock" style={{ fontSize: '15px' }} /></center>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </li>
    )
}

const TeamNames = ({ teamA, teamB }) => {
    return (
        <div className="row mx-0 line-type-header-teams">
            <div className="col-md-6 col-6">
                <div className="">
                    {teamA}
                </div>
            </div>
            <div className="col-md-6 col-6">
                <div className="">
                    {teamB}
                </div>
            </div>
        </div>
    )
}

const ShowMoreLess = ({ show, toggleShow }) => {
    return (
        <li className="mb-2">
            <div className="row mx-0">
                <div className="col-12 cursor-pointer text-center" onClick={toggleShow}>
                    <span>{show ? <FormattedMessage id="COMPONENTS.LINE.SEELESS" /> : <FormattedMessage id="COMPONENTS.LINE.SEEMORE" />}</span>&nbsp;
                    <i className={show ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
                </div>
            </div>
        </li>
    )
}

export default class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMoreASpread: false,
            showMoreATotal: false,
        }
    }

    getSubTypeName = (subtype) => {
        switch (subtype) {
            case 'first_half':
                return '- 1st Half';
            case 'second_half':
                return '- 2nd Half';
            case 'first_quarter':
                return '- 1st Quarter';
            case 'second_quarter':
                return '- 2nd Quarter';
            case 'third_quarter':
                return '- 3rd Quarter';
            case 'forth_quarter':
                return '- 4th Quarter';
            case 'fifth_innings':
                return ' - 5th Innings';
            default:
                return '- Pick';
        }
    }

    render() {
        const {
            type, subtype, index, event, line, betSlip, removeBet,
            addBet, shortName, leagueId, oddsFormat, live
        } = this.props;
        const { showMoreASpread, showMoreATotal } = this.state;

        if (!line.line) return null;
        const { moneyline, spreads, totals, alternative_spreads, alternative_totals, home_totals, away_totals } = line.line;
        const { originId: eventId, teamA, teamB } = event;
        const enabled = line.enabled;
        const sportName = getSportName(shortName);

        const lineQueryMoneyLine = {
            sportName,
            leagueId,
            eventId,
            lineId: eventId,
            type: 'moneyline',
            subtype: line.subtype,
            index: null
        };

        return (
            <>
                {(!type || type == 'moneyline' && subtype == line.subtype) && <>
                    <div className={classnames(["line-type-header line-type-header-moneyline", { "mt-3": line.subtype != null }])}><FormattedMessage id="PAGES.LINE.MONEYLINE" /> {this.getSubTypeName(line.subtype)}</div>
                    {moneyline ? (enabled ? <LineDetail
                        originOdds={moneyline}
                        betSlip={betSlip}
                        lineQuery={lineQueryMoneyLine}
                        removeBet={removeBet}
                        addBet={addBet}
                        event={event}
                        oddsFormat={oddsFormat}
                        live={live}
                    /> : <DisabledLine />)
                        : <EmptyLine />}
                </>}

                {(!type || type == 'spread' && subtype == line.subtype) && <>
                    <div className="line-type-header"><FormattedMessage id="PAGES.LINE.SPREADS" /> {this.getSubTypeName(line.subtype)}</div>
                    <TeamNames teamA={teamA} teamB={teamB} />
                    {spreads && spreads.length != 0 ?
                        spreads.map((spread, i) => {
                            if (type && index && index != i) return null;
                            if (!enabled) {
                                return <DisabledLine key={i} />
                            }
                            const lineQuery = {
                                sportName,
                                leagueId,
                                eventId,
                                lineId: eventId,
                                type: 'spread',
                                index: i,
                                subtype: line.subtype
                            };
                            if (spread.altLineId) lineQuery.altLineId = spread.altLineId;
                            return <LineDetail
                                key={i}
                                originOdds={spread}
                                betSlip={betSlip}
                                lineQuery={lineQuery}
                                removeBet={removeBet}
                                addBet={addBet}
                                event={event}
                                oddsFormat={oddsFormat}
                                live={live}
                            />
                        }) : <EmptyLine />}
                </>}

                {(!type || type == 'total' && subtype == line.subtype) && <>
                    <div className="line-type-header"><FormattedMessage id="PAGES.LINE.OVERUNDER" /> {this.getSubTypeName(line.subtype)}</div>
                    <TeamNames teamA="Over" teamB="Under" />
                    {totals && totals.length != 0 ? totals.map((total, i) => {
                        if (type && index && index != i) return null;
                        if (!enabled) {
                            return <DisabledLine key={i} />
                        }
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId: eventId,
                            type: 'total',
                            index: i,
                            subtype: line.subtype
                        };
                        if (total.altLineId) lineQuery.altLineId = total.altLineId;
                        return <LineDetail
                            key={i}
                            originOdds={{ home: total.over, away: total.under, points: total.points }}
                            betSlip={betSlip}
                            lineQuery={lineQuery}
                            removeBet={removeBet}
                            addBet={addBet}
                            event={event}
                            oddsFormat={oddsFormat}
                            live={live}
                        />
                    }) : <EmptyLine />}
                </>}

                {(!type || type == 'alternative_spread' && subtype == line.subtype) &&
                    alternative_spreads && alternative_spreads.length != 0 && <>
                        <div className="line-type-header"><FormattedMessage id="PAGES.LINE.ALTER_SPREAD" /> {this.getSubTypeName(line.subtype)}</div>
                        <TeamNames teamA={teamA} teamB={teamB} />
                        {alternative_spreads.map((spread, i) => {
                            if (type && index && index != i) return null;
                            if (index != i && !showMoreASpread && i >= maximumShows) return null;

                            if (!enabled) {
                                return <DisabledLine key={i} />
                            }

                            const lineQuery = {
                                sportName,
                                leagueId,
                                eventId,
                                lineId: eventId,
                                type: 'alternative_spread',
                                index: i,
                                subtype: line.subtype
                            };
                            if (spread.altLineId) lineQuery.altLineId = spread.altLineId;
                            return <LineDetail
                                key={i}
                                originOdds={spread}
                                betSlip={betSlip}
                                lineQuery={lineQuery}
                                removeBet={removeBet}
                                addBet={addBet}
                                event={event}
                                oddsFormat={oddsFormat}
                                live={live}
                            />
                        })}
                        <ShowMoreLess
                            show={showMoreASpread}
                            toggleShow={() => {
                                this.setState({ showMoreASpread: !showMoreASpread })
                                showMoreASpread && window.scrollTo(0, 0);
                            }}
                        />
                    </>}

                {(!type || type == 'alternative_total' && subtype == line.subtype) &&
                    alternative_totals && alternative_totals.length != 0 && <>
                        <div className="line-type-header"><FormattedMessage id="PAGES.LINE.ALTER_OVERUNDER" /> {this.getSubTypeName(line.subtype)}</div>
                        <TeamNames teamA="Over" teamB="Under" />
                        {alternative_totals.map((total, i) => {
                            if (type && index && index != i) return null;
                            if (index != i && !showMoreATotal && i >= maximumShows) return null;

                            if (!enabled) {
                                return <DisabledLine key={i} />
                            }

                            const lineQuery = {
                                sportName,
                                leagueId,
                                eventId,
                                lineId: eventId,
                                type: 'alternative_total',
                                index: i,
                                subtype: line.subtype
                            };
                            if (total.altLineId) lineQuery.altLineId = total.altLineId;
                            return <LineDetail
                                key={i}
                                originOdds={{ home: total.over, away: total.under, points: total.points }}
                                betSlip={betSlip}
                                lineQuery={lineQuery}
                                removeBet={removeBet}
                                addBet={addBet}
                                event={event}
                                oddsFormat={oddsFormat}
                                live={live}
                            />
                        })}
                        <ShowMoreLess
                            show={showMoreATotal}
                            toggleShow={() => {
                                this.setState({ showMoreATotal: !showMoreATotal });
                                showMoreATotal && window.scrollTo(0, 0);
                            }}
                        />
                    </>}

                {(!type || type == 'home_total' && subtype == line.subtype) &&
                    home_totals && home_totals.length != 0 && <>
                        <div className="line-type-header">{teamA} <FormattedMessage id="PAGES.LINE.OVERUNDER" /> {this.getSubTypeName(line.subtype)}</div>
                        <TeamNames teamA="Over" teamB="Under" />
                        {home_totals.map((home_total, i) => {
                            if (type && index && index != i) return null;
                            if (!enabled) {
                                return <DisabledLine key={i} />
                            }
                            const lineQuery = {
                                sportName,
                                leagueId,
                                eventId,
                                lineId: eventId,
                                type: 'home_total',
                                index: i,
                                subtype: line.subtype
                            };
                            if (home_total.altLineId) lineQuery.altLineId = home_total.altLineId;
                            return <LineDetail
                                key={i}
                                originOdds={{ home: home_total.over, away: home_total.under, points: home_total.points }}
                                betSlip={betSlip}
                                lineQuery={lineQuery}
                                removeBet={removeBet}
                                addBet={addBet}
                                event={event}
                                oddsFormat={oddsFormat}
                                live={live}
                            />
                        })}
                    </>}

                {(!type || type == 'away_total' && subtype == line.subtype) &&
                    away_totals && away_totals.length != 0 && <>
                        <div className="line-type-header">{teamB} <FormattedMessage id="PAGES.LINE.OVERUNDER" /> {this.getSubTypeName(line.subtype)}</div>
                        <TeamNames teamA="Over" teamB="Under" />
                        {away_totals.map((away_total, i) => {
                            if (type && index && index != i) return null;
                            if (!enabled) {
                                return <DisabledLine key={i} />
                            }
                            const lineQuery = {
                                sportName,
                                leagueId,
                                eventId,
                                lineId: eventId,
                                type: 'away_total',
                                index: i,
                                subtype: line.subtype
                            };
                            if (away_total.altLineId) lineQuery.altLineId = away_total.altLineId;
                            return <LineDetail
                                key={i}
                                originOdds={{ home: away_total.over, away: away_total.under, points: away_total.points }}
                                betSlip={betSlip}
                                lineQuery={lineQuery}
                                removeBet={removeBet}
                                addBet={addBet}
                                event={event}
                                oddsFormat={oddsFormat}
                                live={live}
                            />
                        })}
                    </>}
            </>
        );
    }
}