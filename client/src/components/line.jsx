import React, { Component } from 'react';
import LineDetail from './linedetail';
import classnames from "classnames";

class EmptyLine extends Component {
    render() {
        return (
            <li>
                <div className="row mx-0">
                    <div className="col-md-6 com-sm-12 col-12">
                        <span className="box-odds line-full">
                            <div className="vertical-align">
                                <center><i className="fap fa-do-not-enter" /></center>
                            </div>
                        </span>
                    </div>
                    <div className="col-md-6 com-sm-12 col-12">
                        <span className="box-odds line-full">
                            <div className="vertical-align">
                                <center><i className="fap fa-do-not-enter" /></center>
                            </div>
                        </span>
                    </div>
                </div>
            </li>
        )
    }
}

export default class Line extends Component {
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
            default:
                return '- Game';
        }
    }

    render() {
        const {
            type, subtype, index, event, line, betSlip, removeBet,
            addBet, sportName, leagueId, oddsFormat,
        } = this.props;
        if (!line.line) return null;
        const { moneyline, spreads, totals } = line.line;
        const { originId: eventId } = event;

        const lineQueryMoneyLine = {
            sportName: sportName.replace("_", " "),
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
                    <div className={classnames(["line-type-header line-type-header-moneyline", { "mt-3": line.subtype != null }])}>Moneyline {this.getSubTypeName(line.subtype)}</div>
                    {moneyline ? <LineDetail
                        originOdds={moneyline}
                        betSlip={betSlip}
                        lineQuery={lineQueryMoneyLine}
                        removeBet={removeBet}
                        addBet={addBet}
                        event={event}
                        oddsFormat={oddsFormat} />
                        : <EmptyLine />}
                </>}

                {(!type || type == 'spread' && subtype == line.subtype) && <>
                    <div className="line-type-header">Spreads {this.getSubTypeName(line.subtype)}</div>
                    {spreads && spreads.length != 0 ?
                        spreads.map((spread, i) => {
                            if (type && index && index != i) return null;
                            const lineQuery = {
                                sportName: sportName.replace("_", " "),
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
                                oddsFormat={oddsFormat} />
                        }) : <EmptyLine />}
                </>}

                {(!type || type == 'total' && subtype == line.subtype) && <>
                    <div className="line-type-header">Over/Under {this.getSubTypeName(line.subtype)}</div>
                    {totals && totals.length != 0 ? totals.map((total, i) => {
                        if (type && index && index != i) return null;
                        const lineQuery = {
                            sportName: sportName.replace("_", " "),
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
                            oddsFormat={oddsFormat} />
                    }) : <EmptyLine />}
                </>}
            </>
        );
    }
}