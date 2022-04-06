import React from 'react';
import { Link } from 'react-router-dom';
import timeHelper from "../../helpers/timehelper";
import calculateNewOdds from '../../helpers/calculateNewOdds';
import { convertOddsFromAmerican } from '../../helpers/convertOdds';
import checkOddsAvailable from '../../helpers/checkOddsAvailable';
import { FormattedMessage } from 'react-intl';
import getLineCount from '../../helpers/getLineCount';

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

const RenderProEvent = (props) => {
    const {
        betSlip, timezone, addBet, removeBet, event, leagueId, shortName, oddsFormat, leagueName,
        sportName, origin
    } = props;

    const { teamA, logo_teamA, teamB, logo_teamB, startDate, lines, originId: eventId } = event;
    const { moneyline, spreads, totals, originId: lineId } = lines[0];

    const lineCount = getLineCount(lines[0]);
    const pathname = `/sport/${shortName}/league/${leagueId}/event/${eventId}`;
    return (
        <ul className="table-list d-flex table-bottom">
            <li>
                <Link to={{ pathname: pathname }} className="widh-adf">
                    <strong><img src={`https://assets.b365api.com/images/team/m/${logo_teamA ? logo_teamA : 0}.png`} className='pro-team-logo' />&nbsp;&nbsp;{teamA} </strong>
                    <strong className='mt-2'><img src={`https://assets.b365api.com/images/team/m/${logo_teamB ? logo_teamB : 0}.png`} className='pro-team-logo' />&nbsp;&nbsp;{teamB} </strong>
                </Link>
                <Link to={{ pathname: pathname }} className="widh-adf mt-3">
                    {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                    <strong className='lineCount'>{lineCount}+ <FormattedMessage id="COMPONENTS.SPORT.ADDITIONAL" /> <i className="fas fa-angle-right" /></strong>
                </Link>
            </li>
            {moneyline ? (
                (() => {
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
                    const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                    return (
                        <li>
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
                                    {checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'home', 'moneyline', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(moneyline.home, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newHome, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'home', 'moneyline', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(moneyline.home, oddsFormat)}
                                    </div>}
                                </div>
                            </span>
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
                                    {checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'away', 'moneyline', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(moneyline.away, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newAway, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(moneyline, { home: newHome, away: newAway }, 'away', 'moneyline', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(moneyline.away, oddsFormat)}
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
                    const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                    return (
                        <li>
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
                                    <div className="points">{`${spreads[0].hdp > 0 ? '+' : ''}${spreads[0].hdp}`}</div>
                                    {checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'home', 'spread', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(spreads[0].home, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newHome, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'home', 'spread', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(spreads[0].home, oddsFormat)}
                                    </div>}
                                </div>
                            </span>
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
                                    <div className="points">{`${(-1 * spreads[0].hdp) > 0 ? '+' : ''}${-1 * spreads[0].hdp}`}</div>
                                    {checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'away', 'spread', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(spreads[0].away, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newAway, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(spreads[0], { home: newHome, away: newAway }, 'away', 'spread', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(spreads[0].away, oddsFormat)}
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
                    const awayExist = betSlip.find((b) => b.lineId === lineId && b.pick === 'away' && b.type === lineQuery.type && b.subtype == null);
                    return (
                        <li>
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
                                    <div className="points">O {`${totals[0].points}`}</div>
                                    {checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'home', 'total', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(totals[0].over, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newHome, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'home', 'total', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(totals[0].over, oddsFormat)}
                                    </div>}
                                </div>
                            </span>
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
                                    <div className="points">U {`${totals[0].points}`}</div>
                                    {checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'away', 'total', null) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(totals[0].under, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newAway, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable({ home: totals[0].over, away: totals[0].under }, { home: newHome, away: newAway }, 'away', 'total', null) && <div className="origin-odds">
                                        {convertOddsFromAmerican(totals[0].under, oddsFormat)}
                                    </div>}
                                </div>
                            </span>
                        </li>
                    );
                })()
            ) : emptyBoxLine}
            <li className="detailed-lines-link not-mobile">
                <Link to={{ pathname: pathname }}>
                    +{lineCount}<i className="fas fa-angle-right" />
                </Link>
            </li>
        </ul>
    );
}

export default RenderProEvent;