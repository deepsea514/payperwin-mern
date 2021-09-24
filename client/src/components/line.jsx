import React, { Component } from 'react';
import calculateNewOdds from '../helpers/calculateNewOdds';
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import convertOdds from '../helpers/convertOdds';

export default class Line extends Component {
    render() {
        const { originOdds, lineQuery, betSlip, event, oddsFormat, removeBet, addBet } = this.props;
        const { teamA, teamB, leagueName, origin, started } = event;
        const { home, away } = originOdds;
        const { newHome, newAway } = calculateNewOdds(home, away);
        const homeExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'home' && b.type === lineQuery.type);
        const awayExist = betSlip.find((b) => b.lineId === lineQuery.lineId && b.pick === 'away' && b.type === lineQuery.type);
        return (
            <>
                <div className="line-type-header line-type-header-moneyline">Moneyline - Game</div>
                <li>
                    <div className="row mx-0">
                        <div className="col-md-6 com-sm-12 col-12">
                            <span className={`box-odds box-moneyline line-full ${homeExist ? 'orange' : null}`}
                                onClick={homeExist ?
                                    () => removeBet(lineQuery.lineId, 'moneyline', 'home')
                                    : () => addBet(
                                        `${teamA} - ${teamB}`,
                                        'moneyline',
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
                                        {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', 'moneyline') && <>
                                            <div className="old-odds">
                                                {convertOdds(home, oddsFormat)}
                                            </div>
                                            <div className="new-odds">
                                                {convertOdds(newHome, oddsFormat)}
                                            </div>
                                        </>}
                                        {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'home', 'moneyline') && <div className="origin-odds">
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
                            <span className={`box-odds box-moneyline line-full ${awayExist ? 'orange' : null}`}
                                onClick={awayExist ?
                                    () => removeBet(lineQuery.lineId, 'moneyline', 'away')
                                    : () => addBet(
                                        `${teamA} - ${teamB}`,
                                        'moneyline',
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
                                        {checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', 'moneyline') && <>
                                            <div className="old-odds">
                                                {convertOdds(originOdds.away, oddsFormat)}
                                            </div>
                                            <div className="new-odds">
                                                {convertOdds(newAway, oddsFormat)}
                                            </div>
                                        </>}
                                        {!checkOddsAvailable(originOdds, { home: newHome, away: newAway }, 'away', 'moneyline') && <div className="origin-odds">
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