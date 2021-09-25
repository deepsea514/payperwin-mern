import React, { Component } from 'react';
import calculateNewOdds from '../helpers/calculateNewOdds';
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import convertOdds from '../helpers/convertOdds';

export default class LineDetail extends Component {
    getShowPickName = (pick) => {
        const { originOdds, lineQuery, event } = this.props;
        const { teamA, teamB } = event;

        switch (lineQuery.type) {
            case 'moneyline':
                return pick == 'home' ? teamA : teamB;
            case 'spread':
                return pick == 'home' ?
                    `${originOdds.hdp > 0 ? '+' : ''}${originOdds.hdp}` :
                    `${(-1 * originOdds.hdp) > 0 ? '+' : ''}${-1 * originOdds.hdp}`;
            case 'total':
                return pick == 'home' ? `O ${originOdds.points}` : `U ${originOdds.points}`;
        }
    }

    getPickName = (pick) => {
        const { originOdds, lineQuery, event, } = this.props;
        const { teamA, teamB } = event;

        let pickName = '';

        switch (lineQuery.subtype) {
            case null:
                pickName += 'Game: ';
                break;
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
        }

        switch (lineQuery.type) {
            case 'moneyline':
                pickName += pick == 'home' ? teamA : teamB;
                break;
            case 'spread':
                pickName += pick == 'home' ?
                    `${teamA} ${originOdds.hdp > 0 ? '+' : ''}${originOdds.hdp}` :
                    `${teamB} ${(-1 * originOdds.hdp) > 0 ? '+' : ''}${-1 * originOdds.hdp}`;
                break;
            case 'total':
                pickName += pick == 'home' ? `Over ${originOdds.points}` : `Under ${originOdds.points}`;
        }

        return pickName;
    }

    render() {
        const { originOdds, lineQuery, betSlip, event, oddsFormat, removeBet, addBet } = this.props;
        const { teamA, teamB, leagueName, origin, started } = event;
        const { home, away } = originOdds;
        const { newHome, newAway } = calculateNewOdds(home, away);
        const homeExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'home' && b.type === lineQuery.type && b.index === lineQuery.index && b.subtype == lineQuery.subtype);
        const awayExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'away' && b.type === lineQuery.type && b.index === lineQuery.index && b.subtype == lineQuery.subtype);
        return (
            <li>
                <div className="row mx-0">
                    <div className="col-md-6 com-sm-12 col-12">
                        <span className={`box-odds line-full ${homeExist ? 'orange' : null}`}
                            onClick={homeExist ?
                                () => removeBet(lineQuery.lineId, lineQuery.type, 'home', lineQuery.index, lineQuery.subtype)
                                : () => addBet(
                                    `${teamA} vs ${teamB}`,
                                    lineQuery.type,
                                    leagueName,
                                    { home: newHome, away: newAway },
                                    { home: home, away: away },
                                    'home',
                                    teamA,
                                    teamB,
                                    lineQuery.sportName,
                                    lineQuery.lineId,
                                    lineQuery,
                                    this.getPickName('home'),
                                    lineQuery.index,
                                    origin,
                                    lineQuery.subtype
                                )}>
                            <div className="vertical-align">
                                <div className="points">{this.getShowPickName('home')}</div>
                                {!started && <div className="odds">
                                    {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', lineQuery.type) &&
                                        <>
                                            <div className="old-odds">
                                                {convertOdds(home, oddsFormat)}
                                            </div>
                                            <div className="new-odds">
                                                {convertOdds(newHome, oddsFormat)}
                                            </div>
                                        </>}
                                    {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', lineQuery.type) &&
                                        <div className="origin-odds">
                                            {convertOdds(home, oddsFormat)}
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
                    <div className="col-md-6 com-sm-12 col-12">
                        <span className={`box-odds line-full ${awayExist ? 'orange' : null}`}
                            onClick={awayExist ?
                                () => removeBet(lineQuery.lineId, lineQuery.type, 'away', lineQuery.index, lineQuery.subtype)
                                : () => addBet(
                                    `${teamA} vs ${teamB}`,
                                    lineQuery.type,
                                    leagueName,
                                    { home: newHome, away: newAway },
                                    { home: home, away: away },
                                    'away',
                                    teamA,
                                    teamB,
                                    lineQuery.sportName,
                                    lineQuery.lineId,
                                    lineQuery,
                                    this.getPickName('away'),
                                    lineQuery.index,
                                    origin,
                                    lineQuery.subtype
                                )}>
                            <div className="vertical-align">
                                <div className="points">{this.getShowPickName('away')}</div>
                                {!started && <div className="odds">
                                    {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', lineQuery.type) && <>
                                        <div className="old-odds">
                                            {convertOdds(originOdds.away, oddsFormat)}
                                        </div>
                                        <div className="new-odds">
                                            {convertOdds(newAway, oddsFormat)}
                                        </div>
                                    </>}
                                    {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', lineQuery.type) &&
                                        <div className="origin-odds">
                                            {convertOdds(originOdds.away, oddsFormat)}
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