import React, { Component } from 'react';
import calculateNewOdds from '../helpers/calculateNewOdds';
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import convertOdds from '../helpers/convertOdds';

export default class Line extends Component {
    getLineTitle = (type, subtype) => {
        let title = '';
        switch (type) {
            case 'moneyline':
                title = 'Moneyline - ';
                break;
            case 'spread':
                title = 'Spreads - ';
                break;
            case 'total':
                title = 'Over/Under - ';
                break;
            default:
        }

        switch (subtype) {
            case null:
                title += 'Game';
                break;
            case 'first_half':
                title += '1st Half';
                break;
            case 'second_half':
                title += '2nd Half';
                break;
            case 'first_quarter':
                title += '1st Quarter';
                break;
            case 'second_quarter':
                title += '2nd Quarter';
                break;
            case 'third_quarter':
                title += '3rd Quarter';
                break;
            case 'forth_quarter':
                title += '4th Quarter';
                break;
        }

        return title;
    }

    render() {
        const { originOdds, lineQuery, betSlip, event, oddsFormat, removeBet, addBet } = this.props;
        const { teamA, teamB, leagueName, origin, started } = event;
        const { home, away } = originOdds;
        const { newHome, newAway } = calculateNewOdds(home, away);
        const homeExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'home' && b.type === lineQuery.type);
        const awayExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'away' && b.type === lineQuery.type);
        return (
            <>
                <div className="line-type-header ">{this.getLineTitle(lineQuery.type, null)}</div>
                <li>
                    <div className="row mx-0">
                        <div className="col-md-6 com-sm-12 col-12">
                            <span className={`box-odds line-full ${homeExist ? 'orange' : null}`}
                                onClick={homeExist ?
                                    () => removeBet(lineQuery.lineId, lineQuery.type, 'home')
                                    : () => addBet(
                                        `${teamA} - ${teamB}`,
                                        lineQuery.type,
                                        leagueName,
                                        { home: newHome, away: newAway },
                                        originOdds,
                                        'home',
                                        teamA,
                                        teamB,
                                        lineQuery.sportName,
                                        lineQuery.lineId,
                                        lineQuery,
                                        `${teamA}`,
                                        null,
                                        origin
                                    )}>
                                <div className="vertical-align">
                                    <div className="points">{teamA}</div>
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
                                    () => removeBet(lineQuery.lineId, lineQuery.type, 'away')
                                    : () => addBet(
                                        `${teamA} - ${teamB}`,
                                        lineQuery.type,
                                        leagueName,
                                        { home: newHome, away: newAway },
                                        originOdds,
                                        'away',
                                        teamA,
                                        teamB,
                                        lineQuery.sportName,
                                        lineQuery.lineId,
                                        lineQuery,
                                        `${teamB}`,
                                        null,
                                        origin
                                    )}>
                                <div className="vertical-align">
                                    <div className="points">{teamB}</div>
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
            </>
        );
    }
}