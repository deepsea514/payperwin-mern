import React, { useState, useRef, useEffect } from 'react';
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
        logo_teamA, logo_teamB, addBet, removeBet, showHelpAction
    } = props;

    const onClickBetType = (evt) => {
        evt.stopPropagation();
        showHelpAction('moneyline');
    }

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
                    pick: null,
                    home: teamA,
                    away: teamB,
                    sportName,
                    lineId: lineId,
                    lineQuery: lineQuery,
                    pickName: null,
                    index: null,
                    origin: origin,
                    subtype: null
                })}>
            <div className='bet-type-wrapper d-flex justify-content-center'>
                <span className='bet-type moneyline'>
                    <span>moneyline</span>
                </span>
                <i onClick={onClickBetType} className='ml-2 fas fa-question-circle' />
            </div>
            <span className='bet-type-logo moneyline'>
                {logo_teamA != null && <img src={`https://assets.b365api.com/images/team/m/${logo_teamA}.png`}
                    className='bet-type-team'
                    onLoad={({ target }) => target.style.display = 'block'}
                />}
                <span className='bet-type-logo-title'></span>
                {logo_teamB != null && <img src={`https://assets.b365api.com/images/team/m/${logo_teamB}.png`}
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
        logo_teamA, logo_teamB, addBet, removeBet, showHelpAction
    } = props;

    const onClickBetType = (evt) => {
        evt.stopPropagation();
        showHelpAction('spread');
    }

    const { newHome, newAway } = calculateNewOdds(spread.home, spread.away, 'spread');
    const lineQuery = {
        sportName,
        leagueId,
        eventId,
        lineId,
        type: 'spread',
        index: 0,
        subtype: null,
        points: spread.hdp
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
                    pick: null,
                    home: teamA,
                    away: teamB,
                    sportName,
                    lineId: lineId,
                    lineQuery: lineQuery,
                    pickName: null,
                    index: 0,
                    origin: origin,
                    subtype: null
                })}>
            <div className='bet-type-wrapper d-flex justify-content-center'>
                <span className='bet-type spread'>
                    <span>points spread</span>
                </span>
                <i onClick={onClickBetType} className='ml-2 fas fa-question-circle' />
            </div>
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
        logo_teamA, logo_teamB, addBet, removeBet, showHelpAction
    } = props;

    const onClickBetType = (evt) => {
        evt.stopPropagation();
        showHelpAction('total');
    }

    const { newHome, newAway } = calculateNewOdds(total.over, total.under, 'total');
    const lineQuery = {
        sportName,
        leagueId,
        eventId,
        lineId,
        type: 'total',
        index: 0,
        subtype: null,
        points: total.points
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
                    pick: null,
                    home: teamA,
                    away: teamB,
                    sportName,
                    lineId: lineId,
                    lineQuery: lineQuery,
                    pickName: null,
                    index: 0,
                    origin: origin,
                    subtype: null
                })}>
            <div className='bet-type-wrapper d-flex justify-content-center'>
                <span className='bet-type total'>
                    <span>total score</span>
                </span>
                <i onClick={onClickBetType} className='ml-2 fas fa-question-circle' />
            </div>
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
    const [showRight, setShowRight] = useState(false);
    const [listBoxes, setListBoxes] = useState([]);
    const listRef = useRef();

    const {
        betSlip, timezone, addBet, removeBet, event, sportName, leagueId, leagueName,
        showHelpAction, eventIndex, origin
    } = props;

    const { teamA, teamB, startDate, lines, originId: eventId, logo_teamA, logo_teamB } = event;
    const { moneyline, spreads, totals, originId: lineId } = lines[0];

    const onScroll = () => {
        const position = listRef.current?.scrollLeft;
        const offsetWidth = listRef.current?.offsetWidth;
        const scrollWidth = listRef.current?.scrollWidth;
        setShowRight(position < scrollWidth - offsetWidth);
    }

    const scrollRight = () => {
        const position = listRef.current?.scrollLeft + 200;
        const offsetWidth = listRef.current?.offsetWidth;
        const scrollWidth = listRef.current?.scrollWidth;
        const scrollLimit = scrollWidth - offsetWidth;
        const newPos = position > scrollLimit ? scrollLimit : position;
        listRef.current?.scrollTo({ left: position, behavior: 'smooth' })
        setShowRight(newPos < scrollLimit);
    }

    const arrayRotate = (arr, times) => {
        for (let nI = 0; nI < times; nI++)
            arr.unshift(arr.pop());
    }

    useEffect(() => {
        const initialListBox = [];

        moneyline && initialListBox.push(<li key='moneyline'>
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
                showHelpAction={showHelpAction}
            />
        </li>);

        spreads && spreads[0] && initialListBox.push(<li key='spread'>
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
                showHelpAction={showHelpAction}
            />
        </li>)

        totals && totals[0] && initialListBox.push(<li key='total'>
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
                showHelpAction={showHelpAction}
            />
        </li>)
        arrayRotate(initialListBox, (eventIndex - 1) % initialListBox.length);
        setListBoxes(initialListBox);
        onScroll();
    }, [betSlip]);

    return (
        <div className='leagues-content basic-mode'>
            <ul className="table-list d-flex table-bottom basic-mode" onScroll={onScroll}
                ref={listRef}>
                <RenderTeamNames teamA={teamA}
                    teamB={teamB}
                    startDate={startDate}
                    timezone={timezone} />
                {listBoxes}
                {showRight && <span className="d-flex align-items-center bet-scroller"
                    onClick={scrollRight}>
                    <span className='bet-scroller-icon'>
                        <i className='fas fa-chevron-right' />
                    </span>
                </span>}
            </ul>
        </div>
    );
}

export default RenderBasicEvent;