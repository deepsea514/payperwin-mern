import React from 'react';
import timeHelper from "../../helpers/timehelper";
import calculateNewOdds from '../../helpers/calculateNewOdds';

const RenderTeamNames = (props) => {
    const { teamA, teamB, startDate, timezone } = props;
    return (
        <li>
            <p className='basic-team-name'>{teamA}</p>
            <p className='basic-team-name'>{teamB}</p>
            <p className='basic-event-date'>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}</p>
        </li>
    )
}

const RenderMoneyline = (props) => {
    const {
        moneyline, sportName, leagueId, eventId, lineId, betSlip, teamA, teamB, leagueName, origin,
        logo_teamA, logo_teamB, addBet, removeBet
    } = props;
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
    const moneylineExist = betSlip.find((b) => b.lineId === lineId && b.type === lineQuery.type && b.subtype == null);
    return (
        <span className='basic-box-odds'
            onClick={moneylineExist ? () => removeBet(lineId, 'moneyline', 'home', null, null) :
                () => addBet({
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
            <span className='bet-type moneyline'>
                <span>moneyline</span>
            </span>
            <span className='bet-type-logo moneyline'>
                {logo_teamA && <img src={`https://assets.b365api.com/images/team/m/${logo_teamA}.png`}
                    className='bet-type-team'
                    onLoad={({ target }) => target.style.display = 'block'}
                />}
                <span className='bet-type-logo-title'></span>
                {logo_teamB && <img src={`https://assets.b365api.com/images/team/m/${logo_teamB}.png`}
                    className='bet-type-team'
                    onLoad={({ target }) => target.style.display = 'block'}
                />}
            </span>
            <span className='bet-type-title'>
                <p className='bet-type-subtitle'>Guess</p>
                <p className='bet-type-maintitle moneyline'>WHO WINS</p>
            </span>
        </span>
    );
}

const RenderSpread = (props) => {
    const {
        spread, sportName, leagueId, eventId, lineId, betSlip, teamA, teamB, leagueName, origin,
        logo_teamA, logo_teamB, addBet, removeBet
    } = props;
    const { newHome, newAway } = calculateNewOdds(spread.home, spread.away, 'spread');
    const lineQuery = {
        sportName,
        leagueId,
        eventId,
        lineId,
        type: 'spread',
        index: 0,
        subtype: null,
    };
    if (spread.altLineId) lineQuery.altLineId = spread.altLineId;
    const spreadExist = betSlip.find((b) => b.lineId === lineId && b.type === lineQuery.type && b.subtype == null);
    return (
        <span className='basic-box-odds'
            onClick={spreadExist ? () => removeBet(lineId, 'spread', 'home', null, null) :
                () => addBet({
                    name: `${teamA} - ${teamB}`,
                    type: 'spread',
                    league: leagueName,
                    odds: { home: newHome, away: newAway },
                    originOdds: spread,
                    pick: 'home',
                    home: teamA,
                    away: teamB,
                    sportName,
                    lineId: lineId,
                    lineQuery: lineQuery,
                    pickName: `Pick: ${teamA} ${spread.hdp > 0 ? '+' : ''}${spread.hdp}`,
                    index: 0,
                    origin: origin,
                    subtype: null
                })}>
            <span className='bet-type spread'>
                <span>points spread</span>
            </span>
            <span className='bet-type-logo spread'>
                {logo_teamA && <img src={`https://assets.b365api.com/images/team/m/${logo_teamA}.png`}
                    className='bet-type-team'
                    onLoad={(event) => event.target.style.display = 'block'} />}
                <span className='bet-type-logo-title'></span>
                {logo_teamB && <img src={`https://assets.b365api.com/images/team/m/${logo_teamB}.png`}
                    className='bet-type-team'
                    onLoad={(event) => event.target.style.display = 'block'} />}
            </span>
            <span className='bet-type-title'>
                <p className='bet-type-subtitle'>take the</p>
                <p className='bet-type-maintitle spread'>points</p>
            </span>
        </span>
    );
}

const RenderTotal = (props) => {
    const {
        total, sportName, leagueId, eventId, lineId, betSlip, teamA, teamB, leagueName, origin,
        logo_teamA, logo_teamB, addBet, removeBet
    } = props;
    const { newHome, newAway } = calculateNewOdds(total.over, total.under, 'total');
    const lineQuery = {
        sportName,
        leagueId,
        eventId,
        lineId,
        type: 'total',
        index: 0,
        subtype: null
    };
    if (total.altLineId) lineQuery.altLineId = total.altLineId;
    const totalExist = betSlip.find((b) => b.lineId === lineId && b.type === lineQuery.type && b.subtype == null);
    return (
        <span className='basic-box-odds'
            onClick={totalExist ? () => removeBet(lineId, 'total', 'home', null, null) :
                () => addBet({
                    name: `${teamA} - ${teamB}`,
                    type: 'total',
                    league: leagueName,
                    odds: { home: newHome, away: newAway },
                    originOdds: { home: total.over, away: total.under },
                    pick: 'home',
                    home: teamA,
                    away: teamB,
                    sportName,
                    lineId: lineId,
                    lineQuery: lineQuery,
                    pickName: `Pick: Over ${total.points}`,
                    index: 0,
                    origin: origin,
                    subtype: null
                })}>
            <span className='bet-type total'>
                <span>total score</span>
            </span>
            <span className='bet-type-logo total'>
                {logo_teamA && <img src={`https://assets.b365api.com/images/team/m/${logo_teamA}.png`}
                    className='bet-type-team'
                    onLoad={(event) => event.target.style.display = 'block'} />}
                <span className='bet-type-logo-title'></span>
                {logo_teamB && <img src={`https://assets.b365api.com/images/team/m/${logo_teamB}.png`}
                    className='bet-type-team'
                    onLoad={(event) => event.target.style.display = 'block'} />}
            </span>
            <span className='bet-type-title'>
                <p className='bet-type-subtitle'>guess the</p>
                <p className='bet-type-maintitle total'>total</p>
            </span>
        </span>
    );
}

const RenderBasicEvent = (props) => {
    const {
        betSlip, timezone, addBet, removeBet, event, sportName, leagueId, leagueName
    } = props;

    const { teamA, teamB, startDate, lines, originId: eventId, logo_teamA, logo_teamB } = event;
    const { moneyline, spreads, totals, originId: lineId } = lines[0];

    return (
        <div className='table-list basic-mode'>
            <ul className="table-list d-flex table-bottom not-mobile" >
                <RenderTeamNames teamA={teamA}
                    teamB={teamB}
                    startDate={startDate}
                    timezone={timezone} />
                <li>
                    {moneyline && <RenderMoneyline moneyline={moneyline}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />}
                </li>
                <li>
                    {spreads && spreads[0] && <RenderSpread spread={spreads[0]}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />}
                </li>
                <li>
                    {totals && totals[0] && <RenderTotal total={totals[0]}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />}
                </li>
            </ul>
            {moneyline && <ul className="table-list d-flex d-md-none table-bottom" >
                <RenderTeamNames teamA={teamA}
                    teamB={teamB}
                    startDate={startDate}
                    timezone={timezone} />
                <li>
                    <RenderMoneyline moneyline={moneyline}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />
                </li>
            </ul>}
            {spreads && spreads[0] && <ul className="table-list d-flex d-md-none table-bottom" >
                <RenderTeamNames teamA={teamA}
                    teamB={teamB}
                    startDate={startDate}
                    timezone={timezone} />
                <li>
                    <RenderSpread spread={spreads[0]}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />
                </li>
            </ul>}
            {totals && totals[0] && <ul className="table-list d-flex d-md-none table-bottom" >
                <RenderTeamNames teamA={teamA}
                    teamB={teamB}
                    startDate={startDate}
                    timezone={timezone} />
                <li>
                    <RenderTotal total={totals[0]}
                        sportName={sportName}
                        leagueId={leagueId}
                        eventId={eventId}
                        lineId={lineId}
                        betSlip={betSlip}
                        teamA={teamA}
                        teamB={teamB}
                        leagueName={leagueName}
                        origin={origin}
                        logo_teamA={logo_teamA}
                        logo_teamB={logo_teamB}
                        addBet={addBet}
                        removeBet={removeBet}
                    />
                </li>
            </ul>}
        </div>
    );
}

export default RenderBasicEvent;