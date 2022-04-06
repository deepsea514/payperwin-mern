import React, { Component } from 'react';
import calculateNewOdds from '../helpers/calculateNewOdds';
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import { convertOddsFromAmerican } from '../helpers/convertOdds';

export default class LineDetail extends Component {


    getShowPickName = (pick) => {
        const { originOdds, lineQuery, event } = this.props;
        const { teamA, teamB } = event;

        switch (lineQuery.type) {
            case 'moneyline':
                return pick == 'home' ? teamA : teamB;
            case 'spread':
            case 'alternative_spread':
                return pick == 'home' ?
                    `${originOdds.hdp > 0 ? '+' : ''}${originOdds.hdp}` :
                    `${(-1 * originOdds.hdp) > 0 ? '+' : ''}${-1 * originOdds.hdp}`;
            case 'total':
            case 'alternative_total':
            case 'home_total':
            case 'away_total':
                return pick == 'home' ? `O ${originOdds.points}` : `U ${originOdds.points}`;
        }
    }

    getPickName = (pick) => {
        const { originOdds, lineQuery, event, } = this.props;
        const { teamA, teamB } = event;

        let pickName = '';

        switch (lineQuery.subtype) {
            case 'first_half':
                pickName += '1st Half: ';
                break;
            case 'second_half':
                pickName += '2nd Half: ';
                break;
            case 'first_quarter':
                pickName += '1st Quarter: ';
                break;
            case 'second_quarter':
                pickName += '2nd Quarter: ';
                break;
            case 'third_quarter':
                pickName += '3rd Quarter: ';
                break;
            case 'forth_quarter':
                pickName += '4th Quarter: ';
                break;
            case 'fifth_innings':
                pickName += '5th Innings: ';
                break;
            default:
                pickName += 'Pick: ';
                break;
        }

        switch (lineQuery.type) {
            case 'moneyline':
                pickName += pick == 'home' ? teamA : teamB;
                break;
            case 'spread':
            case 'alternative_spread':
                pickName += pick == 'home' ?
                    `${teamA} ${originOdds.hdp > 0 ? '+' : ''}${originOdds.hdp}` :
                    `${teamB} ${(-1 * originOdds.hdp) > 0 ? '+' : ''}${-1 * originOdds.hdp}`;
                break;
            case 'total':
            case 'alternative_total':
                pickName += pick == 'home' ? `Over ${originOdds.points}` : `Under ${originOdds.points}`;
                break;
            case 'home_total':
                pickName += teamA + ' ' + (pick == 'home' ? `Over ${originOdds.points}` : `Under ${originOdds.points}`);
                break;
            case 'away_total':
                pickName += teamB + ' ' + (pick == 'home' ? `Over ${originOdds.points}` : `Under ${originOdds.points}`);
                break;
        }

        return pickName;
    }

    render() {
        const { originOdds, lineQuery, betSlip, event, oddsFormat, removeBet, addBet, live } = this.props;
        const { teamA, teamB, leagueName, origin, started } = event;
        const { home, draw, away } = originOdds;
        const { newHome, newAway } = lineQuery.subtype == null ? calculateNewOdds(home, away, lineQuery.type, lineQuery.subtype) : { newHome: home, newAway: away };
        const homeExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index && b.subtype == lineQuery.subtype);
        const awayExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index && b.subtype == lineQuery.subtype);
        const drawExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'draw' && b.type === lineQuery.type && b.index === lineQuery.index && b.subtype == lineQuery.subtype);

        let isDraw = draw || null;
        return (
            <li>
                <div className="row mx-0">
                    <div className={`col-md-${isDraw ? 4 : 6} col-${lineQuery.type == 'moneyline' ? 12 : 6}`}>
                        <span className={`box-odds line-full ${homeExist ? 'orange' : null}`}
                            onClick={homeExist ?
                                () => removeBet(lineQuery.lineId, lineQuery.type, 'home', lineQuery.index, lineQuery.subtype)
                                : () => addBet({
                                    name: `${teamA} vs ${teamB}`,
                                    type: lineQuery.type,
                                    league: leagueName,
                                    odds: { home: newHome, away: newAway },
                                    originOdds: { home: home, away: away },
                                    pick: 'home',
                                    home: teamA,
                                    away: teamB,
                                    sportName: lineQuery.sportName,
                                    lineId: lineQuery.lineId,
                                    lineQuery: lineQuery,
                                    pickName: this.getPickName('home'),
                                    index: lineQuery.index,
                                    origin: origin,
                                    subtype: lineQuery.subtype,
                                    live: live
                                })}>
                            <div className="vertical-align">
                                <div className="points">{this.getShowPickName('home')}</div>
                                {!started && <div className="odds">
                                    {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', lineQuery.type, lineQuery.subtype) &&
                                        <>
                                            <div className="old-odds">
                                                {convertOddsFromAmerican(home, oddsFormat)}
                                            </div>
                                            <div className="new-odds">
                                                {convertOddsFromAmerican(newHome, oddsFormat)}
                                            </div>
                                        </>}
                                    {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', lineQuery.type, lineQuery.subtype) &&
                                        <div className="origin-odds">
                                            {convertOddsFromAmerican(home, oddsFormat)}
                                        </div>}
                                </div>}
                                {started && <div className="odds">
                                    <div className="origin-odds">
                                        <i className="fas fa-lock" />
                                    </div>
                                </div>}
                            </div>
                        </span>
                    </div>
                    {isDraw != null &&
                        <div className={`col-md-${isDraw ? 4 : 6} col-${lineQuery.type == 'moneyline' ? 12 : 6}`}>
                            <span className={`box-odds line-full ${drawExist ? 'orange' : ''}`}
                                onClick={drawExist ?
                                    () => removeBet(lineQuery.lineId, lineQuery.type, 'draw', lineQuery.index, lineQuery.subtype)
                                    : () => addBet({
                                        name: `${teamA} vs ${teamB}`,
                                        type: lineQuery.type,
                                        league: leagueName,
                                        odds: { home: newHome, draw: draw, away: newAway },
                                        originOdds: { home: home, draw: draw, away: away },
                                        pick: 'draw',
                                        home: teamA,
                                        away: teamB,
                                        sportName: lineQuery.sportName,
                                        lineId: lineQuery.lineId,
                                        lineQuery: lineQuery,
                                        pickName: "Pick: Draw",
                                        index: lineQuery.index,
                                        origin: origin,
                                        subtype: lineQuery.subtype
                                    })}>
                                <div className="vertical-align">
                                    <div className="points"> Draw </div>
                                    {!started && <div className="odds">
                                        <div className="origin-odds">
                                            {convertOddsFromAmerican(originOdds.draw, oddsFormat)}
                                        </div>
                                    </div>}
                                    {started && <div className="odds">
                                        <div className="origin-odds">
                                            <i className="fas fa-lock" />
                                        </div>
                                    </div>}
                                </div>
                            </span>
                        </div>
                    }
                    <div className={`col-md-${isDraw ? 4 : 6} col-${lineQuery.type == 'moneyline' ? 12 : 6}`}>
                        <span className={`box-odds line-full ${awayExist ? 'orange' : null}`}
                            onClick={awayExist ?
                                () => removeBet(lineQuery.lineId, lineQuery.type, 'away', lineQuery.index, lineQuery.subtype)
                                : () => addBet({
                                    name: `${teamA} vs ${teamB}`,
                                    type: lineQuery.type,
                                    league: leagueName,
                                    odds: { home: newHome, away: newAway },
                                    originOdds: { home: home, away: away },
                                    pick: 'away',
                                    home: teamA,
                                    away: teamB,
                                    sportName: lineQuery.sportName,
                                    lineId: lineQuery.lineId,
                                    lineQuery: lineQuery,
                                    pickName: this.getPickName('away'),
                                    index: lineQuery.index,
                                    origin: origin,
                                    subtype: lineQuery.subtype,
                                    live: live
                                })}>
                            <div className="vertical-align">
                                <div className="points">{this.getShowPickName('away')}</div>
                                {!started && <div className="odds">
                                    {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', lineQuery.type, lineQuery.subtype) && <>
                                        <div className="old-odds">
                                            {convertOddsFromAmerican(originOdds.away, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOddsFromAmerican(newAway, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', lineQuery.type, lineQuery.subtype) &&
                                        <div className="origin-odds">
                                            {convertOddsFromAmerican(originOdds.away, oddsFormat)}
                                        </div>}
                                </div>}
                                {started && <div className="odds">
                                    <div className="origin-odds">
                                        <i className="fas fa-lock" />
                                    </div>
                                </div>}
                            </div>
                        </span>
                    </div>
                </div>
            </li>
        );
    }
}