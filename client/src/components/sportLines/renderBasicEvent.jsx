import React from 'react';
import timeHelper from "../../helpers/timehelper";
import calculateNewOdds from '../../helpers/calculateNewOdds';

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

const RenderBasicEvent = (props) => {
    const {
        betSlip, timezone, addBet, removeBet, event, sportName, leagueId, leagueName
    } = props;

    const { teamA, teamB, startDate, lines, originId: eventId } = event;
    const { moneyline, spreads, totals, originId: lineId } = lines[0];

    return (
        <div className='table-list basic-mode'>
            <ul className="table-list d-flex table-bottom" >
                <li><span className='basic-team-name'>{teamA}</span></li>
                <li>
                    {moneyline && (() => {
                        const { newHome, newAway } = calculateNewOdds(moneyline.home, moneyline.away, 'moneyline');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'moneyline',
                            subtype: null,
                            index: null
                        };
                        const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                onClick={homeExist ?
                                    () => removeBet(lineId, 'moneyline', 'home', null, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'moneyline',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: moneyline,
                                        pick: 'home',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: ${teamA}`,
                                        index: null,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">Win</div>
                                    <div className="new-odds">Outright</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
                <li>
                    {spreads && spreads[0] && (() => {
                        const { newHome, newAway } = calculateNewOdds(spreads[0].home, spreads[0].away, 'spread');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'spread',
                            index: 0,
                            subtype: null,
                        };
                        if (spreads[0].altLineId) lineQuery.altLineId = spreads[0].altLineId;
                        const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                onClick={homeExist
                                    ? () => removeBet(lineId, 'spread', 'home', 0, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'spread',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: spreads[0],
                                        pick: 'home',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: ${teamA} ${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`,
                                        index: 0,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">{`${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`} Pts</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
                <li>
                    {totals && totals[0] && (() => {
                        const { newHome, newAway } = calculateNewOdds(totals[0].over, totals[0].under, 'total');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'total',
                            index: 0,
                            subtype: null
                        };
                        if (totals[0].altLineId) lineQuery.altLineId = totals[0].altLineId;
                        const homeExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'home' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span
                                className={`box-odds ${homeExist ? 'orange' : null}`}
                                onClick={homeExist
                                    ? () => removeBet(lineId, 'total', 'home', 0, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'total',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: { home: totals[0].over, away: totals[0].under },
                                        pick: 'home',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: Over ${totals[0].points}`,
                                        index: 0,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">Over</div>
                                    <div className="new-odds">{`${totals[0].points}`} Pts</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
            </ul>
            <ul className="table-list d-flex table-bottom">
                <li><span className='basic-team-name'>{teamB}</span></li>
                <li>
                    {moneyline && (() => {
                        const { newHome, newAway } = calculateNewOdds(moneyline.home, moneyline.away, 'moneyline');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'moneyline',
                            subtype: null,
                            index: null
                        };
                        const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span className={`box-odds ${awayExist ? 'orange' : null}`}
                                onClick={awayExist ?
                                    () => removeBet(lineId, 'moneyline', 'away', null, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'moneyline',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: moneyline,
                                        pick: 'away',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: ${teamB}`,
                                        index: null,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">Win</div>
                                    <div className="new-odds">Outright</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
                <li>
                    {spreads && spreads[0] && (() => {
                        const { newHome, newAway } = calculateNewOdds(spreads[0].home, spreads[0].away, 'spread');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'spread',
                            index: 0,
                            subtype: null,
                        };
                        if (spreads[0].altLineId) lineQuery.altLineId = spreads[0].altLineId;
                        const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span
                                className={`box-odds ${awayExist ? 'orange' : null}`}
                                onClick={awayExist
                                    ? () => removeBet(lineId, 'spread', 'away', 0, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'spread',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: spreads[0],
                                        pick: 'away',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: ${teamB} ${-1 * spreads[0].hdp > 0 ? '+' : ''}${-1 * spreads[0].hdp}`,
                                        index: 0,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">{`${(-1 * spreads[0].hdp) > 0 ? '+' : ''}${-1 * spreads[0].hdp}`} Pts</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
                <li>
                    {totals && totals[0] && (() => {
                        const { newHome, newAway } = calculateNewOdds(totals[0].over, totals[0].under, 'total');
                        const lineQuery = {
                            sportName,
                            leagueId,
                            eventId,
                            lineId,
                            type: 'total',
                            index: 0,
                            subtype: null
                        };
                        if (totals[0].altLineId) lineQuery.altLineId = totals[0].altLineId;
                        const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                        return (
                            <span
                                className={`box-odds ${awayExist ? 'orange' : null}`}
                                onClick={awayExist
                                    ? () => removeBet(lineId, 'total', 'away', 0, null)
                                    : () => addBet({
                                        name: `${teamA} - ${teamB}`,
                                        type: 'total',
                                        league: leagueName,
                                        odds: { home: newHome, away: newAway },
                                        originOdds: { home: totals[0].over, away: totals[0].under },
                                        pick: 'away',
                                        home: teamA,
                                        away: teamB,
                                        sportName,
                                        lineId: lineId,
                                        lineQuery: lineQuery,
                                        pickName: `Pick: Under ${totals[0].points}`,
                                        index: 0,
                                        origin: origin,
                                        subtype: null
                                    })}>
                                <div className="vertical-align">
                                    <div className="new-odds">Under</div>
                                    <div className="new-odds">{`${totals[0].points}`} Pts</div>
                                </div>
                            </span>
                        );
                    })()}
                </li>
            </ul>
            <ul className="table-list d-flex table-bottom">
                <li><span className='basic-event-date'>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}</span></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}

export default RenderBasicEvent;