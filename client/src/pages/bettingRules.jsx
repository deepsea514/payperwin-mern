import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class BettingRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMobile: null,
        }
    }
    setVisible = (value) => {
        const { showMobile } = this.state;
        if (showMobile == value)
            this.setState({ showMobile: null });
        else
            this.setState({ showMobile: value });
    }
    render() {
        const { showMobile } = this.state;
        setTitle({ pageTitle: 'Privacy Policy' });
        return (
            <React.Fragment>
                <div className="content-container">
                    <h1 className="title-bar background darkblue">Betting Rules</h1>
                    <div className="block box">
                        <div className="containerless">
                            <article>
                                <div className="gray selection-list row">
                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#General">General Rules</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Teasers">Teasers Rules</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Glossary">Glossary</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#American-Football">American Football</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Athletics">Athletics</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Aussie-Rules">Aussie Rules</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Auto-Racing">Auto Racing</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Badminton">Badminton</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Bandy">Bandy</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Baseball">Baseball</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Basketball">Basketball</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Boxing-MMA">Boxing &amp; MMA</a>
                                        </li>
                                    </ul>

                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#Cricket">Cricket</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Curling">Curling</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Cycling">Cycling</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Darts">Darts</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Esports">Esports</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Golf">Golf</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Handball">Handball</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Hockey">Hockey</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Olympics">Olympics</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Poker">Poker</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Politics">Politics</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Rugby">Rugby</a>
                                        </li>
                                    </ul>

                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#Snooker">Snooker</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Soccer">Soccer</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Sports-Simulations">Sports Simulations</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Squash">Squash</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Table-Tennis">Table Tennis</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Tennis">Tennis</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Volleyball">Volleyball</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Water-Polo">Water Polo</a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Winter-Sports">Winter Sports</a>
                                        </li>
                                    </ul>

                                    <div className="clear-both"></div>
                                </div>
                                <div className="rules gray" id="General">
                                    <h2 className="privacy-policy-section-title desktop" >General Rules</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(1)}>
                                        General Rules
                                        <div className="arrow-up" style={{ display: showMobile == 1 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 1 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 1 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>The posted dates and times of fixtures are purely informational. Pinnacle cannot guarantee accuracy. An incorrectly posted date and/or time is not grounds for voiding bets.</li>
                                            <li>If a fixture isn’t completed within 30 hours of its officially planned starting time, then all bets on that fixture will be void. The exceptions to this rule are:
                                            <ol>
                                                    <li>Fixtures which in their normal course can take longer than 30 hours, such as golf tournaments.</li>
                                                    <li>Sport-specific exceptions laid out in the rules section for each individual sport.</li>
                                                    <li>Bets on the “First Team to Score” have action as soon as there is a score, regardless of whether the fixture is completed.</li>
                                                </ol>
                                            </li>
                                            <li>The result of a fixture will be the final determination by the fixture’s governing body on the date of the fixture’s completion. Pinnacle does not recognise protested or overturned decisions. The result of bets on a fixture suspended after the start of competition will be decided according to the betting rules specified for that sport. If nothing is specified in the sport’s rules, then General Rule #2 applies.</li>
                                            <li>Unless otherwise specified in a particular sport’s rules, all bets on a fixture will be void if the venue is changed.</li>
                                            <li>Bets on a specific period count only the scoring in that period, and are unaffected by what happens in prior or subsequent periods. If for any reason a fixture is not completed within the time specified in our rules, bets on the full fixture will be void. Any periods that have been completed will have action.</li>
                                            <li>If a “Draw” price is offered in a Money Line market, and the draw happens, then bets on each team lose. If a draw is not offered and a draw happens, then bets on both teams are void.</li>
                                            <li>In any fixture involving a forfeit, walkover, or any other event where the fixture is considered complete without having been played, all bets will be void, regardless of how the governing body of its league scores it.</li>
                                            <li>If a market includes exactly one or two names of competitors, then all listed competitors must participate in the fixture for the bet to have action.</li>
                                            <li>Misspellings, typographical errors, and teams changing names are not grounds for bets to be void, as long as it is clear based on the context what the intended fixture was.</li>
                                            <li>If a fixture is offered with an incorrect number of rounds or periods or with a non-standard duration for the sport without it being indicated, all bets on that fixture will be void.</li>
                                            <li>For aggregate Home/Away score markets of a league on a Day (or Week in the case of American football), if all fixtures on that Day/Week are not played to completion all bets on the market are void.</li>
                                            <li>Multi-way betting is "ALL-IN": bets always have action unless a stipulation is added to the market that a certain competitor must start for action. If such a stipulation is included, then all bets on all competitors will be void if the stipulated competitor does not start in that specific event.</li>
                                            <li>All winning bets on Multi-Way markets are paid out at full odds, regardless of the number of winners.</li>
                                            <li>If a market is offered with “The Field” as a betting option, named teams or competitors must beat every other competitor for a bet on that competitor to win. If a listed competitor ties for a win, bets on the tied competitors will be void, and all other bets will be lost.</li>
                                            <li>All settled markets are final after 72 hours and no queries will be entertained after that period of time. Within 72 hours after markets are settled, Pinnacle will only reset or correct the results due to human error, system error or mistakes made by the referring results source.</li>
                                            <li>Pinnacle reserves the right to void any bet at any time if it deems the bet to have been made in a fraudulent manner.</li>
                                            <li>All bets will be accepted or rejected purely at Pinnacle's discretion. In-Play bets may be subject to a short delay before they are accepted and/or they will be kept pending during dangerous situations at Pinnacle’s discretion.</li>
                                            <li>If there is an obvious error in the odds or limit of a market, bets on that market may be void.</li>
                                            <li>In case of any contradictions: Market Rules take precedence over Sport Rules; which take precedence over General Rules.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="American-Football">
                                    <h2 className="privacy-policy-section-title desktop" >American Football</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(2)}>
                                        American Football
                                        <div className="arrow-up" style={{ display: showMobile == 2 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 2 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 2 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a game is suspended with fewer than 55 minutes completed, all bets on the Game-period will be void and bets on completed periods will have action. If a game is suspended after 55 minutes of play and not resumed within six hours of suspension, then regardless of whether the game is completed at a later date, all bets will have action and the score when the game was suspended will be considered final.</li>
                                            <li>If a game is not started within 12 hours of its originally scheduled time all bets will be void.</li>
                                            <li>Bets on the Game and 2nd Half-periods include points scored in overtime.</li>
                                        </ol>
                                        <p ><strong>American Football Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Team to Score Next</strong>: Extra Points and 2-Point Conversions are not considered a score. The “point after try” is considered part of scoring the Touchdown.</li>
                                            <li><strong>Passing Statistics: </strong>Bets are void if a named Quarterback doesn’t attempt at least one pass.</li>
                                            <li><strong>Rushing Statistics Over/Under</strong>: If the named competitor plays but has no rushing attempts, their total and first attempted rushing yardage is considered to be zero.</li>
                                            <li><strong>Receiving Statistics Over/Under</strong>: If a named Receiver plays, but does not have a catch, their total and first attempted receiving yardage is considered to be zero.</li>
                                            <li><strong>Time of Score</strong>: Seconds listed in the market are inclusive, so events that happen on that second of game time are counted.</li>
                                            <li><strong>First 1<sup>st</sup> Down</strong>: 1<sup>st</sup> downs gained on penalties and changes of possession are not counted.</li>
                                            <li><strong>Unanswered Scores: </strong>Extra Points and 2-Point Conversions are counted as part of the Touchdown and not considered consecutive scoring events. Any return by the opposition on an Extra Point or 2-Point Conversion attempt also does not count towards these markets.</li>
                                            <li><strong>Longest Touchdown</strong>: If there are no Touchdowns, these markets will be void.</li>
                                            <li><strong>Team Quarterback Statistics</strong>: Only statistics achieved by competitors listed as Quarterbacks on the team’s roster will be counted. For example, if a Running Back throws a Touchdown pass, that would not be counted as an attempt, completion or Touchdown pass for that team’s Quarterbacks.</li>
                                            <li><strong>Special Teams and Defensive Touchdowns</strong>: The only Touchdowns considered to be Special Teams Touchdowns are on plays where the ball is actually kicked or punted (these include: Kickoff Returns, Punt Returns, returns of a fumbled Kickoff Return, returns of a fumbled Punt Return, blocked Field Goal Returns, or blocked Punt Returns). A fake Field Goal or fake Punt which results in a Touchdown by the team that snapped the ball is considered an offensive Touchdown.</li>
                                            <li><strong>Competitor to Score a Touchdown</strong>: Passing for a Touchdown is not considered scoring a Touchdown. Only the competitor who has possession of the ball in the End Zone is considered to have scored the Touchdown.</li>
                                            <li><strong>Pass Interference Penalties</strong>: Both offensive and defensive Interference counts, however the penalty must be accepted and enforced on the play to be considered valid. If the penalty is declined or if there are offsetting penalties negating enforcement of Interference, then the winner will be determined on the next Interference penalty.</li>
                                            <li><strong>Holding Penalties</strong>: Both offensive and defensive Holding counts, however the penalty must be accepted and enforced on the play to be considered valid. If the penalty is declined or if there are offsetting penalties negating enforcement of Holding, then the winner will be determined on the next Holding penalty.</li>
                                            <li><strong>Longest Kickoff Return</strong>: Bets are void if each team doesn’t have at least one Kickoff Return.</li>
                                            <li><strong>Longest Punt Return</strong>: Bets are void if each team doesn’t have at least one Punt Return.</li>
                                            <li><strong>Number of Different Players to Score</strong>: All scoring plays except Safeties are counted.</li>
                                            <li><strong>First Touchdown Pass Distance Over/Under</strong>: Bets are void if the named Quarterback doesn’t complete at least one Touchdown Pass.</li>
                                            <li><strong>AFC/NFC Champion Futures</strong>: The champion of each conference is the team that reaches the Super Bowl.</li>
                                            <li><strong>Regular Season Wins</strong>: Will be settled when a team exceeds their win total and is expected to play all of their scheduled games or cannot possibly exceed their win total given their number of games remaining and are expected to play all of their scheduled games. If there is any reasonable doubt as to whether or not a team will play a complete season, their Season Wins markets won’t be settled until they do. Once Season Wins markets have been settled, they will not be changed, even if a team plays fewer games than expected for any reason.</li>
                                            <li><strong>NCAA Football Season Wins: </strong>Bowl games and Conference Championship games are not counted towards Regular Season Wins totals. Teams must play every scheduled regular season game for action.</li>
                                            <li><strong>NCAA Football Conference Championship Futures</strong>: If the conference has an official championship game, the winner of that game is considered to have won that conference. For Divisional Odds within the conferences, the team participating in the Conference Championship game is considered to have won that division.</li>
                                            <li><strong>NFL Weekly Markets</strong>: If any game in the listed week is cancelled or postponed, and not completed within 96 hours of its scheduled start time, all weekly markets will be void, regardless of the outcome of any specific game.</li>
                                            <li><strong>Heisman Trophy Winner Yes/No</strong>: Bets made before the competitor’s team’s first scheduled game will be void if the competitor does not play in that game.</li>
                                            <li><strong>Tied After First Score: “</strong>Yes” will be considered the winner if the game is tied any time after the first score, including if it is tied following a Touchdown, before the Extra Point or 2-Point Conversion attempt.</li>
                                            <li><strong>Kickoff/Punt Return Match-ups</strong>: Both listed competitors must have at least one Kick/Punt Return for action.</li>
                                            <li><strong>Last Score Markets</strong>: Only Touchdowns, Field Goals and Safeties will be counted. Extra Points and 2-Point Conversions following Touchdowns will not.</li>
                                            <li><strong>Punt Markets</strong>: A blocked Punt will count as a Punt for Team Punt markets, but not count towards markets for a competitor’s number of Punts.</li>
                                            <li><strong>Punter Markets</strong>: In all markets with an individual Punter named - except “Total Punts by a Punter Over/Under” - that punter must have at least one Punt for action.</li>
                                            <li><strong>Longest Field Goal</strong>: Bets will be void if there are no successful Field Goals.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Athletics">
                                    <h2 className="privacy-policy-section-title desktop" >Athletics</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle"onClick={() => this.setVisible(3)}>
                                        Athletics
                                        <div className="arrow-up" style={{ display: showMobile == 3 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 3 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 3 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><strong>Match-ups Markets: </strong>The competitor who advances to the latest round of competition will be considered the winner. If both competitors are knocked out in the same preliminary round but compete in the same race, starting at the same time, then the better finisher in that race will be considered the winner. If both contestants are knocked out in the same preliminary round, but race in separate heats then regardless of the time or finish bets will be void. If both competitors make the final round of competition, the better finisher in that round will be the winner.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Aussie-Rules">
                                    <h2 className="privacy-policy-section-title desktop" >Aussie Rules</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(4)}>
                                        Aussie Rules
                                        <div className="arrow-up" style={{ display: showMobile == 4 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 4 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 4 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>All Aussie Rules matches must complete at least 80 minutes of play to have action, except for matches which are scheduled to play less time.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Auto-Racing">
                                    <h2 className="privacy-policy-section-title desktop" >Auto Racing</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(5)}>
                                        Auto Racing
                                        <div className="arrow-up" style={{ display: showMobile == 5 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 5 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 5 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a Race or Qualifier is delayed for any reason, if the delay lasts longer than 48 hours all bets will be void.</li>
                                            <li>The start of any Race is defined as the signal to start the warm-up lap.</li>
                                        </ol>
                                        <p ><strong>Auto Racing Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Qualifying: </strong>All Qualifying bets on a competitor have action once that competitor starts qualifying. Subsequent penalties or demotions will not affect the results of bets. If a competitor does not start qualifying, bets on that competitor qualifying or on qualifying position are void.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Badminton">
                                    <h2 className="privacy-policy-section-title desktop" >Badminton</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(6)}>
                                        Badminton
                                        <div className="arrow-up" style={{ display: showMobile == 6 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 6 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 6 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a competitor retires or is disqualified bets on the Match Money Line market will have action as long as one Set has been completed, otherwise these bets will be void. Bets on other markets will be void unless the period was played to completion before the retirement or disqualification.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Bandy">
                                    <h2 className="privacy-policy-section-title desktop" >Bandy</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(7)}>
                                        Bandy
                                        <div className="arrow-up" style={{ display: showMobile == 7 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 7 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 7 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified all Match-period markets are for regulation time only and do not include overtime.</li>
                                            <li>If the format of a match is changed from two halves of 45 minutes to three periods of 30 minutes, bets on the Match-period will have action and bets on all other periods will be void.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Baseball">
                                    <h2 className="privacy-policy-section-title desktop" >Baseball</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(8)}>
                                        Baseball
                                        <div className="arrow-up" style={{ display: showMobile == 8 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 8 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 8 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>A pitcher is considered to have started a game once they have thrown the first pitch for their team. A non-pitcher is considered to have started the game once they have made their first plate appearance.</li>
                                            <li>If a market includes exactly one or two names of competitors, then all listed competitors must start the game for the bet to have action. The exception to this rule is markets for competitor “Save” statistics which will have action regardless of whether or not the competitor plays in the game.</li>
                                            <li>Bets made before the start of the game on the Game-period Money Line market have action as long as at least 5 innings (or 4.5 innings if the Home team is winning) are completed. If a game is called before 9 innings (or 8.5 innings of the Home team wins) are complete, the score at the end of the last completed inning will be considered final. All Game-period markets, other than the Money Line, have action only once 9 innings or (8.5 if Home team wins) are completed. Periods that have been played to completion will have action even if the game is not completed.</li>
                                            <li>All Game-period In-Play markets require that the game be played to completion with 9 innings (or 8.5 if Home team wins) to have action. Periods that have been played to completion will have action even if the game is not played to completion.</li>
                                            <li>A baseball game is considered to have been played to completion when at least 9 innings (or 8.5 innings if Home wins) have been completed and a final result has been determined. In games where a “Mercy Rule” is expressly part of the rules, a game is considered to have been played to completion when a Mercy Rule is invoked. If a game is declared official by its governing body, it has no bearing on how bets are settled if sufficient innings have not been played.</li>
                                            <li>Bets on the 1<sup>st</sup> Half-period of baseball games are based on the results at the conclusion of five innings of play. Bets made before the game on the 1<sup>st</sup> Half-period Handicap and Money Line markets have action once five innings are played or 4.5 innings if the game is called at 4.5 innings and the Home team is declared the winner. All other 1<sup>st</sup> Half markets (including the In-Play 1<sup>st</sup> Half Handicap and Money Line markets) require at least five innings to be played for action.</li>
                                            <li>If a game is suspended in order to be resumed at a later date, all bets on the Game-period markets are void, and bets on completed periods have action. With the exception of MLB Playoff games, which will have action whenever the game is completed.</li>
                                            <li>In circumstances when the “Home” team is not playing at their home stadium, the team whose starting pitcher throws the very first pitch of the game is considered the Home team.</li>
                                            <li>Seven Inning Doubleheader Rules:
                                <ol>
                                                    <li>Bets made before the start of the game on the Game-period Money Line market have action as long as at least 5 innings (or 4.5 innings if the Home team is winning) are completed. All Game-period markets, other than the Money Line, have action only once 7 innings or (6.5 if Home team wins) are completed. Periods that have been played to completion will have action even if the game is not completed.</li>
                                                    <li>All Game-period In-Play markets require that the game be played to completion with 7 innings (or 6.5 if Home team wins) to have action. Periods that have been played to completion will have action even if the game is not played to completion.</li>
                                                    <li>All bets on Seven Inning Doubleheader games will be void if it is not indicated that it is a seven inning game.</li>
                                                </ol>
                                            </li>
                                        </ol>
                                        <p ><strong>Baseball Market Rules</strong></p>
                                        <ol >
                                            <li><strong>MLB Regular Season Wins</strong>: Will be settled when a team exceeds their win total and is expected to play at least 160 games or cannot possibly exceed their win total given their number of games remaining and is expected to play at least 160 games. If there is any reasonable doubt as to whether or not a team will play at least 160 games, their Season Wins markets won’t be settled until they do. Any additional tiebreaker games (such as Wildcard or Division) will not be counted towards Regular Season Wins. Once Season Wins markets have been settled, they will not be changed, even if a team plays fewer games than expected for any reason.</li>
                                            <li><strong>Total Bases</strong>: A Single is worth one, a Double is worth two, a Triple is worth three, a Home Run is worth four. No other type of play counts towards Total Bases markets.</li>
                                            <li><strong>Runs Allowed</strong>: Earned and Unearned Runs are counted.</li>
                                            <li><strong>Innings Pitched</strong>: Each inning completed is worth one, and each out recorded thereafter worth 0.1.</li>
                                            <li><strong>Division Winner</strong>: Markets are resulted based on standings at the end of the season, as long as every team in the division has played at least 90% of their scheduled games. If teams are tied in terms of record, the winner will be 1) the winner of the tiebreaker game or 2) the team declared the winner by the league's tiebreaker system for seeding playoff teams.</li>
                                            <li><strong>Season-Long Home Run Leader</strong>: If the Home Run lead is tied, Batting Average will be used as the tiebreaker.</li>
                                            <li><strong>Season-Long Competitor Match-ups</strong>: If either competitor does not play in at least one of his team’s first 10 games all bets are void.</li>
                                            <li><strong>Hits + Runs + Errors Markets</strong>: Games must be played to completion for action. If a game is called or suspended in extra innings, the results will be determined after the last completed inning, unless the home team scores to tie in the bottom half of the inning, in which case the result is determined at the time the game is called.</li>
                                            <li><strong>No-Hitters Markets</strong>: Individual and combined No-Hitters are counted as long as the game is played to completion.</li>
                                            <li><strong>Competitor Statistics Markets</strong>: Games must be played to completion for action. If a game is suspended before completion and the game is resumed the following day, statistics from both days will be counted towards the results of these markets. If the game is not resumed the following day, all bets will be void.</li>
                                            <li><strong>Competitor Statistic Match-Up Markets</strong>: All bets have action as long as both competitors start the game and the game is played to completion.</li>
                                            <li><strong>Home/Away Markets</strong>: If a game is suspended after at least nine innings have been completed, the score after the last fully completed inning will be used for that game.</li>
                                            <li><strong>MLB Regular Season Win Percentage</strong>: Bets will be settled at the conclusion of the Regular Season. Bets have action as long as the team has completed at least 140 Regular Season games. Any Play-In Games are NOT considered for the purposes of Regular Season Win Percentage.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Basketball">
                                    <h2 className="privacy-policy-section-title desktop" >Basketball</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(9)}>
                                        Basketball
                                        <div className="arrow-up" style={{ display: showMobile == 9 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 9 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 9 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>In the NBA all bets on the Game-period are void if fewer than 43 minutes are completed. In all other competitions, bets on the Game-period are void if fewer than 35 minutes are completed. Bets on any periods that have been played to completion will have action.</li>
                                            <li>If an "Elam Ending" is used, the target score has to be reached for bets to have action for any period that includes such an ending. All bets will be settled based on the final score once the target score is reached, regardless of the actual duration of the game.</li>
                                            <li>Bets on the Game and 2<sup>nd</sup>-Half periods include all overtimes played in their result.</li>
                                        </ol>
                                        <p ><strong>Basketball Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Regular Season Wins:</strong> Will be settled when a team exceeds their win total and is expected to play all of their scheduled games or cannot possibly exceed their win total given their number of games remaining and are expected to play all of their scheduled games. If there is any reasonable doubt about whether or not a team will play a complete season, their Season Wins markets won’t be settled until they do. Once Season Wins markets have been settled, they will not be changed, even if a team plays fewer games than expected for any reason.</li>
                                            <li><strong>NBA Regular Season Win Percentage 2020-2021: </strong>Bets will be settled at the conclusion of the Regular Season. Bets have action as long as the team has completed at least 50 Regular Season games. The Play-In Tournaments between the 7-10 seeds in each Conference are not counted as Regular Season games.</li>
                                            <li><strong>NBA Conference Winners:</strong> For team to win the Conference Winner Futures, the winner of the respective Conference will be the team that reaches the NBA Finals.</li>
                                            <li><strong>Competitor Statistics: </strong>In pre-game markets that include exactly one or two names of competitors, then all listed competitors must start the game for the bet to have action. For In-Play markets with named competitors, the named competitors need only play in the game for action.</li>
                                            <li><strong>Buzzer Beater Markets</strong>: A “Buzzer Beater” is defined as a made shot that leaves absolutely no time on the game clock at the end of the game and the shot puts the shooter’s team ahead for the win, when the shooter’s team immediately prior to the shot had been tied or losing.</li>
                                            <li><strong>NBA Division Winners: </strong>NBA Division Winner markets have action as long as all teams in the division have played more than half of their scheduled games at the conclusion of the regular season. Any ties will be broken by the NBA’s determination.</li>
                                            <li><strong>Double/Triple Double Markets</strong>: A “Double Double” is defined as 10 or more of at least two of the following categories: Points, Rebounds, Assists, Steals or Blocks. A “Triple Double” is 10 or more of three of those categories.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Boxing-MMA">
                                    <h2 className="privacy-policy-section-title desktop" >Boxing &amp; MMA</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(10)}>
                                        Boxing &amp; MMA
                                        <div className="arrow-up" style={{ display: showMobile == 10 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 10 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 10 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>A fight is considered official once the first round begins, regardless of the scheduled or actual duration.</li>
                                            <li>If the number of scheduled rounds is changed, bets on the Money Line have action. Bets on Total Rounds Over/Under markets have action only if the newly scheduled round count is greater than the total that was bet. Other Total Rounds Over/Under bets will be void.</li>
                                            <li>Unless indicated otherwise, fights will be void if they do not take place within one week of the scheduled date.</li>
                                            <li>All Full-Fight period markets are void in the case of a technical draw. Periods that have been completed and markets that have been conclusively determined before the ending of the fight will be settled.</li>
                                            <li>If a fight is deemed “No Contest” all bets are void except for periods that have already been completed and markets that have already been conclusively determined.</li>
                                            <li>Bets have action if a venue is changed to another location within the same country. If it is changed to a different country, all bets on the fight are void.</li>
                                            <li>If a fight involves an extra round or “Sudden Victory” round, these rounds will be counted in all relevant markets.</li>
                                        </ol>
                                        <p ><strong>Boxing Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Inside Distance Markets</strong>: A bet on a fighter to win “Inside Distance” wins if the selected fighter wins by KO, TKO, DQ or Technical Decision.</li>
                                            <li><strong>“KO” Markets</strong>:A bet on a fighter to win by “KO” wins if the selected fighter wins by KO, TKO, or DQ.</li>
                                            <li><strong>Rounds Over/Under</strong>: For the purposes of this market, a round is considered complete once half of its time has elapsed and the fight is ongoing.</li>
                                        </ol>
                                        <p ><strong>MMA Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Rounds Over/Under Markets</strong>: For the purposes of this market, a round is considered complete once half of its time has elapsed and the fight is ongoing.</li>
                                            <li><strong>Inside Distance Markets</strong>: A bet on a fighter to win “Inside Distance” wins if the selected fighter wins by KO, TKO, DQ, Submission or any other form of stoppage.</li>
                                            <li><strong>“KO” Markets</strong>: A bet on a fighter to win by “KO” wins if the selected fighter wins by KO, TKO, or corner stoppage. A win by submission is not considered a KO/TKO in MMA.</li>
                                            <li><strong>Victory Method Markets</strong>: Yes/No markets for a fighter’s method of victory will be deemed “No” if the fight ends in a draw.</li>
                                            <li><strong>Win in Round X Markets</strong>: Fights are deemed to have finished in a round if the fight ends during that round, or a fighter doesn’t answer the bell for the following round.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Cricket">
                                    <h2 className="privacy-policy-section-title desktop" >Cricket</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(11)}>
                                        Cricket
                                        <div className="arrow-up" style={{ display: showMobile == 11 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 11 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 11 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a Test match does not complete four innings, Money Line bets will be settled based on the official announcement and Match-period Over/Under markets are void. If a match is not completed, bets on periods that have been completed will have action.</li>
                                            <li>If a One-Day International or Twenty20 match does not complete at least the scheduled number of Overs, Money Line bets will be settled based on the official announcement and Match-Period Over/Under markets will be void. If a match is not completed, bets on periods that have been completed will have action.</li>
                                            <li>Unless otherwise specified, Match-period bets include any Super Overs played.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Curling">
                                    <h2 className="privacy-policy-section-title desktop" >Curling</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(12)}>
                                        Curling
                                        <div className="arrow-up" style={{ display: showMobile == 12 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 12 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 12 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise stated “Extra Ends” are always included in the result.</li>
                                            <li>Any match that is played and has an official result is considered completed.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Cycling">
                                    <h2 className="privacy-policy-section-title desktop" >Cycling</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle"onClick={() => this.setVisible(13)}>
                                        Cycling
                                        <div className="arrow-up" style={{ display: showMobile == 13 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 13 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 13 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a race is postponed for any reason, bets have action as long as the race is started within one week of the original starting date.</li>
                                            <li>In “Classifications” that are decided over multiple legs/stages the winner will be the competitor or team that is classified highest at the end of the contest.</li>
                                        </ol>
                                        <p ><strong>Cycling Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Matchups: </strong>If neither competitor completes the contest, then the winner will be the competitor that completed the most stages. If both competitors complete the same number of stages, then the winner will be the competitor that was classified higher after the last completed leg or stage.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Darts">
                                    <h2 className="privacy-policy-section-title desktop" >Darts</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(14)}>
                                        Darts
                                        <div className="arrow-up" style={{ display: showMobile == 14 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 14 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 14 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Once each competitor throws their first dart the match and any completed periods will have action, regardless of any competitor retirements.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Esports">
                                    <h2 className="privacy-policy-section-title desktop" >Esports</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(15)}>
                                        Esports
                                        <div className="arrow-up" style={{ display: showMobile == 15 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 15 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 15 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If the format of a match is changed (number of Maps, rounds etc.) all bets will be void unless that information was conveyed in the market or the change had no effect on a particular market (such as bets on specific Maps or First Blood etc.).</li>
                                            <li>If a Map is remade or rewound by Chronobreak or similar method, any markets that have already been determined (such as First Blood, First Tower, First to 10 Kills etc.) will be not be changed. Any markets that have not previously been determined will be settled based on the results of the remade or rewound Map.</li>
                                            <li>In a match where one team or competitor has an advantage of one or more Maps awarded as part of the tournament format (for example due to one team coming from the upper bracket in a double elimination format), Pinnacle’s match line will include the given advantage. If there is a 1-0 advantage, Pinnacle’s Map offering will start with Map 2, if there is a 2-0 advantage, Pinnacle’s Map offering will start with Map 3 etc. If the advantage comes from a walkover/default win that was awarded by admin decision - for example due to one team showing up late to their match - this does not apply.</li>
                                            <li>“Kill” markets will be resulted using the in-game scoreboard.</li>
                                            <li>Match-period Handicap, Money Line and Over/Under markets use Maps won as scoring units.</li>
                                            <li>Any overtime or other tiebreaker method used is considered valid in determining results.</li>
                                            <li>If a Map is void due to retirement, disconnection, disqualification, walkover, or other admin decision, all bets on the Match-period are void. Bets on any individual Maps that are played to completion will have action.</li>
                                        </ol>
                                        <p ><strong>Sub-Sport Rules</strong></p>
                                        <p ><strong>CS:GO</strong></p>
                                        <ol >
                                            <li>If at least five rounds of a Map are played with fewer than 10 competitors, all bets on the Map will be void.</li>
                                            <li>If a team retires, receives a win by admin decision or is disqualified before all scheduled rounds of a Map are played, all bets on that Map will be void.</li>
                                        </ol>
                                        <p ><strong>Valorant</strong></p>
                                        <ol >
                                            <li>If at least five rounds of a Map are played with fewer than 10 competitors, all bets on the Map will be void.</li>
                                            <li>If a team retires, receives a win by admin decision or is disqualified before all scheduled rounds of a Map are played, all bets on that Map will be void.</li>
                                        </ol>
                                        <p ><strong>Dota 2</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 10 competitors all bets on the Map will be void.</li>
                                            <li>If a competitor disconnects in the first 10 minutes and is unable to reconnect or be replaced for the rest of the Map, all bets on the Map will be void. If a competitor disconnects or quits after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>If a walkover or win by admin decision is given in the first 10 minutes of a Map, all bets on the Map will be void. If a win by admin decision is awarded after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                        </ol>
                                        <p ><strong>King of Glory</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 10 competitors all bets on the Map will be void.</li>
                                            <li>If a competitor disconnects in the first 10 minutes and is unable to reconnect or be replaced for the rest of the Map, all bets on the Map will be void. If a competitor disconnects or quits after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>If a walkover or win by admin decision is given in the first 10 minutes of a Map, all bets on the Map will be void. If a win by admin decision is awarded after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                        </ol>
                                        <p ><strong>Arena of Valor</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 10 competitors all bets on the Map will be void.</li>
                                            <li>If a competitor disconnects in the first 10 minutes and is unable to reconnect or be replaced for the rest of the Map, all bets on the Map will be void. If a competitor disconnects or quits after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>If a walkover or win by admin decision is given in the first 10 minutes of a Map, all bets on the Map will be void. If a win by admin decision is awarded after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                        </ol>
                                        <p ><strong>Heroes of the Storm</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 10 competitors all bets on the Map will be void.</li>
                                            <li>If a competitor disconnects in the first 10 minutes and is unable to reconnect or be replaced for the rest of the Map, all bets on the Map will be void. If a competitor disconnects or quits after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>If a walkover or win by admin decision is given in the first 10 minutes of a Map, all bets on the Map will be void. If a win by admin decision is awarded after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                        </ol>
                                        <p ><strong>League of Legends</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 10 competitors all bets on the Map will be void.</li>
                                            <li>If a competitor disconnects in the first 10 minutes and is unable to reconnect or be replaced for the rest of the Map, all bets on the Map will be void. If a competitor disconnects or quits after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>If a walkover or win by admin decision is given in the first 10 minutes of a Map, all bets on the Map will be void. If a win by admin decision is awarded after the 10<sup>th</sup> minute of play of a Map has started, bets have action according to the official result.</li>
                                            <li>"Elemental Dragons" includes only Cloud, Mountain, Infernal, and Ocean dragons.</li>
                                        </ol>
                                        <p ><strong>Overwatch</strong></p>
                                        <ol >
                                            <li>If a Map starts with fewer than 12 competitors, all bets on the Map will be void.</li>
                                        </ol>
                                        <p ><strong>Rainbow Six</strong></p>
                                        <ol >
                                            <li>If a team retires, receives a win by admin decision or is disqualified before all scheduled rounds of a Map are completed, all bets on the Map will be void.</li>
                                        </ol>
                                        <p ><strong>Fortnite</strong></p>
                                        <ol >
                                            <li>The standings will be determined according to the official tournament ranking whenever possible. If the tournament does not make clear what it considers to be the final results the following formula will be used: Bets on an individual round will be determined based on the team or competitor that lasted longest. Bets on a day of play will be determined based on the total points (placement points + kill points) gained on that day by the team or competitors in question. Bets on the winner of an event will be determined based on the total points (placement points + kill points) gained by each team over the course of the event.</li>
                                        </ol>
                                        <p ><strong>PUBG</strong></p>
                                        <ol >
                                            <li>The standings will be determined according to the official tournament ranking whenever possible. If the tournament does not make clear what it considers to be the final results the following formula will be used: Bets on an individual round will be determined based on the team or competitor that lasted longest. Bets on a day of play will be determined based on the total points (placement points + kill points) gained on that day by the team or competitors in question. Bets on the winner of an event will be determined based on the total points (placement points + kill points) gained by each team over the course of the event.</li>
                                        </ol>
                                        <p ><strong>Free Fire</strong></p>
                                        <ol >
                                            <li>The standings will be determined according to the official tournament ranking whenever possible. If the tournament does not make clear what it considers to be the final results the following formula will be used: Bets on an individual round will be determined based on the team or competitor that lasted longest. Bets on a day of play will be determined based on the total points (placement points + kill points) gained on that day by the team or competitors in question. Bets on the winner of an event will be determined based on the total points (placement points + kill points) gained by each team over the course of the event.</li>
                                        </ol>
                                        <p >&nbsp;</p>
                                        <p ><strong>Esports Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Map Duration Over/Under</strong>: A Total Duration (in minutes) is offered. Under bets win when the Map ends in fewer than that number of minutes and Over bets win when the Map lasts longer than that number. If the Map ends while that minute is displayed on the in-game scoreboard bets will be void.</li>
                                            <li><strong>First Tower</strong>: Bets on the team that has one of their towers destroyed first lose, and bets on the other team win.</li>
                                            <li><strong>First Blood</strong>: Bets on the team that is announced in-game to get “First Blood” win, and bets on the other team lose</li>
                                            <li><strong>First Inhibitor</strong>: Bets on the team that has one of their inhibitors destroyed first lose, and bets on the other team win.</li>
                                            <li><strong>First Barracks</strong>: Bets on the team that has one of their barracks destroyed first lose, and bets on the other team win.</li>
                                            <li><strong>First Turret:</strong> Bets on the team that has one of their turrets destroyed first lose, and bets on the other team win.</li>
                                            <li><strong>Will there be an Ace:</strong> Ace is defined as a single player who kills five enemies in a single round</li>
                                            <li><strong>Will there be a Knife Kill: </strong>A Knife Kill is defined as a player killing an enemy using a knife in an official round.</li>
                                            <li><strong>To Advance:</strong> Markets on teams “To Advance” or “To Win Final” are bets on which team advances to the next round of or wins a tournament. They have action when and wherever a match or stage is completed, regardless of if it is moved, delayed or postponed.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Golf">
                                    <h2 className="privacy-policy-section-title desktop" >Golf</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(16)}>
                                        Golf
                                        <div className="arrow-up" style={{ display: showMobile == 16 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 16 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 16 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If the number of holes played in a tournament is reduced to 36 or more holes from the scheduled number for any reason (e.g. weather), bets placed prior to the completion of the final completed round have action. Bets placed after the final completed round will be void. If holes are reduced and fewer than 36 holes are completed, all bets will be void, except on rounds and markets that have already been settled.</li>
                                            <li>Bets on a golfer’s results in a tournament are void if that golfer does not start the tournament. Starting the tournament includes playing in qualifying rounds.</li>
                                            <li>A golfer is deemed to have played once they have teed off. Once they have teed off all markets on or including them have action, even if they withdraw.</li>
                                            <li>In the event that two or more golfers are tied for the lead at the end of regulation play, Pinnacle will respect whatever method is used to break the tie. All tied golfers who do not win the tiebreaker will be considered second-place finishers.</li>
                                            <li>Skins tournaments will be determined by the total money won by the competitors. Any format the tournament uses to break ties will be respected. The officially declared winner of the tournament takes precedence over the money won in case there is a difference.</li>
                                        </ol>
                                        <p ><strong>Golf Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Match-ups: </strong>Bets will be void if both golfers do not tee off. If one golfer misses the cut the other is deemed the winner, regardless of what happens after the cut. If both miss the cut, the lower scorer after the cut will be deemed the winner.</li>
                                            <li><strong>Golfer’s Round Score: </strong>Bets will be void if the golfer does not complete the round.</li>
                                            <li><strong>Next Hole Score: </strong>Bets will be void if the competitor does not complete the hole. Results are determined as the golfer leaves the green, regardless of any penalties incurred later on.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Handball">
                                    <h2 className="privacy-policy-section-title desktop" >Handball</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(17)}>
                                        Handball
                                        <div className="arrow-up" style={{ display: showMobile == 17 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 17 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 17 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified, Match-period bets do not include overtime.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Hockey">
                                    <h2 className="privacy-policy-section-title desktop" >Hockey</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(18)}>
                                        Hockey
                                        <div className="arrow-up" style={{ display: showMobile == 18 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 18 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 18 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified, Game-period bets include overtime and penalty shootouts.</li>
                                            <li>For markets that include overtime, penalty shootouts are considered part of overtime. If a penalty shootout occurs, the winning team is credited with <strong>one</strong> goal.</li>
                                            <li>Bets on Match markets require a minimum of 55 minutes to be played for action. If a game is suspended before 55 minutes are played, bets on periods that have been played to completion will have action and all others will be void.</li>
                                        </ol>
                                        <p ><strong>Hockey Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Competitor Statistics: </strong>Includes overtime but does not include penalty shootouts.</li>
                                            <li><strong>Regular Season Points: </strong>Will be settled when a team exceeds their points total and is expected to play all of their scheduled games or cannot possibly exceed their points total given their number of games remaining and are expected to play all of their scheduled games. If there is any reasonable doubt about whether or not a team will play a complete season, their Season Points markets won’t be settled until they do. Once Season Points markets have been settled, they will not be changed, even if a team plays fewer games than expected for any reason.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Olympics">
                                    <h2 className="privacy-policy-section-title desktop" >Olympics</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(19)}>
                                        Olympics
                                        <div className="arrow-up" style={{ display: showMobile == 19 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 19 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 19 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Results are considered official after the medal ceremony. Any subsequent changes to those results for any reason are not considered.</li>
                                        </ol>
                                        <p ><strong>Olympics Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Individual’s Medal Totals Markets: </strong>The individual must start the first event they are scheduled to participate in for action.</li>
                                            <li><strong>Weightlifting: </strong>Bets on all competitors will be void if no competitor completes the entire event.</li>
                                            <li><strong>Country Medal Totals Markets:&nbsp; </strong>These markets will be settled at the conclusion of the Olympic Games with the results of the official medal table.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Poker">
                                    <h2 className="privacy-policy-section-title desktop" >Poker</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(20)}>
                                        Poker
                                        <div className="arrow-up" style={{ display: showMobile == 20 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 20 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 20 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified, only events that are open entry are considered Bracelet Events.</li>
                                            <li>A “session” is defined as one day of poker regardless of the amount of time played in that day, or if play passes midnight into the next day.</li>
                                        </ol>
                                        <p ><strong>Poker Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Match-ups: </strong>Both competitors must be seated at the table and play at least one hand in the event for action. The competitor that finishes higher in the money is considered the winner. If both competitors finish out of the money, then the competitor who plays in more sessions is considered the winner. If both competitors play the same number of sessions, and finish out of the money, the bet is void.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Politics">
                                    <h2 className="privacy-policy-section-title desktop" >Politics</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(21)}>
                                        Politics
                                        <div className="arrow-up" style={{ display: showMobile == 21 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 21 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 21 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>All politics bets will be determined using the official result as declared by the local Electoral Commission or similar official body.</li>
                                            <li>If it is stipulated that a candidate “must announce”, bets only have action once the candidate officially announces that they will run for that office. If they don’t, all bets will be void.</li>
                                            <li>Once politics bets have been settled according to Rule #1, the result is considered final and will not change based on any other circumstance such illness, death or legal challenge.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Rugby">
                                    <h2 className="privacy-policy-section-title desktop" >Rugby</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(22)}>
                                        Rugby
                                        <div className="arrow-up" style={{ display: showMobile == 22 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 22 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 22 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified, any overtime played is included for all Match-period markets.</li>
                                            <li>All bets will be void if fewer than 80 minutes are played, with the exception of matches that are scheduled to play less time.</li>
                                        </ol>
                                        <p ><strong>Rugby Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Scoring Margin Markets: </strong>Only count scoring in regulation time and do not include any overtime or “Golden Points”.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Snooker">
                                    <h2 className="privacy-policy-section-title desktop" >Snooker</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(23)}>
                                        Snooker
                                        <div className="arrow-up" style={{ display: showMobile == 23 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 23 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 23 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>In the event that a match is started and not completed, bets on the Money Line will have action as long as there is an official result. All other markets will be void.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Soccer">
                                    <h2 className="privacy-policy-section-title desktop" >Soccer</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(24)}>
                                        Soccer
                                        <div className="arrow-up" style={{ display: showMobile == 24 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 24 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 24 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a match is delayed and is not started within 12 hours of the originally scheduled time, all bets on the match will be void. Bets on periods that have been completed will be settled.</li>
                                            <li>All Match-period markets are based on two halves of 45 minutes of regulation time as well as any injury time, unless indicated otherwise. If a match is finished or abandoned before the completion of 90 minutes of play all bets on the Match-period are void. The exception to this rule is if a referee ends a match with an official result after at least 85 minutes of play. If a match is void because it finished early or was abandoned, periods that were played to completion (such as the 1<sup>st</sup> Half) will have action.&nbsp;</li>
                                            <li>Own goals do not count towards markets with named competitors.&nbsp;</li>
                                            <li>If a soccer match is played at a neutral pitch, whether it is indicated in the market or not, it will have action. If it is played at the pitch of the team listed second it is void.</li>
                                            <li>In-Play bets will be void if a Video Assistant Referee (VAR) decision materially affects the odds of the bets.</li>
                                            <li>Score and booking information are considered to be part of the market for In-Play bets. If that information is incorrect, then bets while incorrect information is displayed will be void.</li>
                                            <li>In friendly matches, if a red card is shown but play continues with the same number of competitors on the pitch, the red card score will be updated and bets will have action.</li>
                                            <li>Unless a duration of time is specified for a bet, injury time is included.</li>
                                        </ol>
                                        <p ><strong>Soccer Market Rules</strong></p>
                                        <ol >
                                            <li><strong>Bookings</strong>: A Yellow Card is worth one and Red Card two. Two Yellow Cards on a competitor leading to a Red Card is worth three. Any cards shown to non-competitors (such as teammates on the bench, competitors leaving the pitch, the manager, coach or other staff) are not counted. Cards shown during the half-time break are counted towards the 2<sup>nd</sup>-half period bookings markets. Any cards shown after the whistle that ends regulation time will not be counted towards the markets for that game.</li>
                                            <li><strong>To Advance:</strong> Markets on teams “To Advance” or “To Win Final” are bets on which team advances to the next round of or wins a cup or tournament. They have action when and wherever a match or stage is completed, regardless of if it is moved, delayed or postponed.</li>
                                            <li><strong>Season Points: </strong>Will be settled when a team exceeds their points total and is expected to play all of their scheduled games or cannot possibly exceed their points total given their number of games remaining and are expected to play all of their scheduled games. If there is any reasonable doubt about whether or not a team will play a complete season, their Season Points markets won’t be settled until they do. Once Season Points markets have been settled, they will not be changed, even if a team plays fewer games than expected for any reason.</li>
                                            <li><strong>League Winner &amp; Relegation Markets: </strong>Will have action based on the official results of the league regardless of how many games each team plays.</li>
                                            <li><strong>Home vs. Away Markets: </strong>If a match isn’t played at a team’s regular pitch, the team listed first will be considered the home team for Home vs. Away markets.</li>
                                            <li><strong>In-Play 2-Way (“Asian”) Handicaps</strong>: Bets are settled according to the score for the remainder of the period after the bet has been placed. Any scores prior to the bet being placed are ignored for resulting purposes.</li>
                                            <li><strong>Corners</strong>: In the event of a corner kick having to be retaken, only one corner kick will be counted. Corner kicks that are awarded and not taken are not counted.</li>
                                            <li><strong>Penalty Shootouts:</strong> Handicap markets include goals scored on all kicks taken. Total markets count only goals in the first 10 kicks taken.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Sports-Simulations">
                                    <h2 className="privacy-policy-section-title desktop" >Sports Simulations</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(25)}>
                                        Sports Simulations
                                        <div className="arrow-up" style={{ display: showMobile == 25 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 25 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 25 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Fixtures can be watched live and replayed on the Twitch channel listed on markets.</li>
                                            <li>All results are determined by a completely random computer simulation.</li>
                                            <li>Fixtures must be fully completed for bets to have action.</li>
                                            <li>If for any reason the game goes offline due to internet interruption, it will restart where it left off once the internet connection is back. However, if the game failed to auto save, then all progress up to that point will be lost and all bets on that fixture will be void.</li>
                                            <li>Bets on the full-fixture and 2<sup>nd</sup>-Half periods include any points scored in overtime.</li>
                                            <li>Games are played in “simulation mode” (CPU vs CPU).</li>
                                        </ol>
                                        <p ><strong>Sub-Sport Rules</strong></p>
                                        <p ><strong>MADDEN NFL 20</strong></p>
                                        <ol >
                                            <li>10 minute quarters</li>
                                            <li>The accelerated clock will be OFF</li>
                                            <li>There will be a five-minute pause during half-time for 2<sup>nd</sup>-Half betting</li>
                                        </ol>
                                        <p ><strong>MLB The Show 20</strong></p>
                                        <ol >
                                            <li>Nine inning games</li>
                                        </ol>
                                        <p ><strong>NBA2K20</strong></p>
                                        <ol >
                                            <li>Six minute quarters</li>
                                        </ol>
                                        <p ><strong>NHL20 EA</strong></p>
                                        <ol >
                                            <li>10 minute periods</li>
                                        </ol>
                                        <p ><strong>FIFA20</strong></p>
                                        <ol >
                                            <li>Quick Substitutes: On</li>
                                            <li>Match Conditions: Spring</li>
                                            <li>Game Speed: Normal</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Squash">
                                    <h2 className="privacy-policy-section-title desktop" >Squash</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(26)}>
                                        Squash
                                        <div className="arrow-up" style={{ display: showMobile == 26 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 26 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 26 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a competitor retires or is disqualified bets on the Match Money Line market will have action as long as one Set has been completed, otherwise these bets will be void. Bets on other markets will be void unless the period was played to completion before the retirement or disqualification.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Table-Tennis">
                                    <h2 className="privacy-policy-section-title desktop" >Table Tennis</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(27)}>
                                        Table Tennis
                                        <div className="arrow-up" style={{ display: showMobile == 27 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 27 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 27 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a competitor retires or is disqualified bets on the Match Money Line market will have action as long as one Set has been completed, otherwise these bets will be void. Bets on other markets will be void unless the period was played to completion before the retirement or disqualification.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Tennis">
                                    <h2 className="privacy-policy-section-title desktop" >Tennis</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(28)}>
                                        Tennis
                                        <div className="arrow-up" style={{ display: showMobile == 28 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 28 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 28 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If a competitor retires or is disqualified bets on the Match Money Line market will have action as long as one Set has been completed, otherwise these bets will be void. Bets on other markets will be void unless the period was played to completion before the retirement or disqualification.</li>
                                            <li>All bets on a match have action as long as the match is completed within seven days of when it was originally scheduled to play.</li>
                                            <li>All bets have action regardless of any change of venue, court surface, or changing from indoors to outdoors and vice versa.</li>
                                            <li>If a match involves a “Super Tie-Break”: all bets have action except the Match Handicap and Total which are void.</li>
                                            <li>If a match involves a “Pro Set”: bets on the 1<sup>st </sup>Set Money Line and Match Money Line have action, all other bets on the Match-period are void.</li>
                                            <li>All Futures bets have action unless the market requires certain competitor(s) to start.</li>
                                            <li>The next point must be played for all In-Play bets to have action. If either competitor retires, is disqualified or does not continue to play for any reason all bets placed since the last point finished are void.</li>
                                            <li>Unless indicated otherwise, all Tennis Handicap and Total bets use Games won as the scoring unit.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Volleyball">
                                    <h2 className="privacy-policy-section-title desktop" >Volleyball</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(29)}>
                                        Volleyball
                                        <div className="arrow-up" style={{ display: showMobile == 29 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 29 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 29 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>All Match-period markets use Sets as the scoring unit. All other periods use Points as the scoring unit.</li>
                                            <li>&nbsp;Golden Sets are not considered part of the result of a match.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Water-Polo">
                                    <h2 className="privacy-policy-section-title desktop" >Water Polo</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(30)}>
                                        Water Polo
                                        <div className="arrow-up" style={{ display: showMobile == 30 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 30 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 30 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Unless otherwise specified, all bets are for regulation time only and do not include either overtime or penalty shootouts.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Winter-Sports">
                                    <h2 className="privacy-policy-section-title desktop" >Winter Sports</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(31)}>
                                        Winter Sports
                                        <div className="arrow-up" style={{ display: showMobile == 31 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 31 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 31 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>If an event is not completed within 48 hours of its original starting time, all bets on the event are void. If a shortened or suspended event is declared official within 48 hours of its original starting time, bets will have action and the official results will be used to settle all markets.</li>
                                        </ol>
                                        <p ><strong>Sub-Sport Rules</strong></p>
                                        <ol >
                                            <li><strong>Alpine Skiing: </strong>At least one of the competitors must complete the entire event for action.</li>
                                            <li><strong>Ski Jumping Match-ups: </strong>Both competitors must qualify and start the event for action. Official results will count regardless of the number of jumps made or rounds completed.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Teasers">
                                    <h2 className="privacy-policy-section-title desktop" >Teasers Rules</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(33)}>
                                        Teasers Rules
                                        <div className="arrow-up" style={{ display: showMobile == 33 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 33 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 33 ? 'block' : 'none' }}>
                                        <ol >
                                            <li>Teasers are Multiple bets in which the bettor is given a more favourable Handicap or Total on each selection, but each selection must win in order for the bet to win.</li>
                                            <li>The payout for Teasers depend upon the Sport, League, number of Selections, and the size of the point adjustment. To find the payouts for various Teasers use the tables below.</li>
                                            <li>In a <strong>Standard Teaser</strong>, if one selection ties or is void for any reason and the rest win, then the tied or void selection will be removed and the payout will be determined using the adjusted number of selections. If there is only one remaining selection once all tied or void selections have been removed, then the entire Teaser is void.</li>
                                            <li>If one selection of any two-selection Teaser ties or is void for any reason, then the entire Teaser is void.</li>
                                            <li>If one or more selections in a <strong>Super Teaser </strong>tie or are void for any reason, then the entire Super Teaser is void.</li>
                                            <li>Pinnacle reserves the right to determine the base Handicap value to be used for any Teaser.</li>
                                            <li>All NCAA Football same game Teasers on games where the difference between the Handicap and the Total is less than 28 will be cancelled due to correlation.</li>
                                        </ol>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p>Standard Basketball</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>College and WNBA</p>
                                                    </td>
                                                    <td>
                                                        <p>4 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>5 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>NBA Sides</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>5.5 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>NBA Total</p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Selections</p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 Selections</p>
                                                    </td>
                                                    <td>
                                                        <p>2.8</p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 Selections</p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                    <td>
                                                        <p>3.5</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 Selections</p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 Selections</p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5">
                                                        <p>College Football Only</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2.8</p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.5</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                    <td>
                                                        <p>3.5</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5">
                                                        <p>College Football Same Game</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2.05</p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p>Standard Football - NFL or NFL &amp; College</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.4</p>
                                                    </td>
                                                    <td>
                                                        <p>2.2</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>3.6</p>
                                                    </td>
                                                    <td>
                                                        <p>3.4</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p>NFL Same Game</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>7 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3">
                                                        <p>Arena Football</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>7.5 Points</p>
                                                    </td>
                                                    <td width="132"></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3">
                                                        <p>Football Super Teaser</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>10 Points</p>
                                                    </td>
                                                    <td>
                                                        <p>13 Points</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                    <td>
                                                        <p>1.71</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2">
                                                        <p>NBA Super Teaser</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>7 Points Sides 9 Points Totals</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>1.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>2.4</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 Teams</p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="rules gray" id="Glossary">
                                    <h2 className="privacy-policy-section-title desktop" >Glossary</h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(33)}>
                                        Glossary
                                        <div className="arrow-up" style={{ display: showMobile == 33 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 33 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 33 ? 'block' : 'none' }}>
                                        <p ><strong>Fixture: </strong>An event on which bets can be placed.</p>
                                        <p ><strong>Period:</strong> A defined portion of a fixture.</p>
                                        <p ><strong>Competitor:</strong> An individual taking part in a fixture.</p>
                                        <p ><strong>Settle:</strong>&nbsp;&nbsp; The conclusion of a bet, at which point the payout is made based on the result of the market.</p>
                                        <p ><strong>Result: </strong>The outcome of a market.</p>
                                        <p ><strong>Action: </strong>A bet "has action" as long as its conditions are met. Action means that a bet will be settled with a final result.</p>
                                        <p ><strong>Void:</strong> Refund a bet for any reason. Most commonly when it can't be resolved because of something illegitimate about the market. When a market is void, all bets on that market are void.</p>
                                        <p ><strong>Complete: </strong>A market with a valid final result that can be settled.</p>
                                        <p ><strong>Count:</strong> Scoring events considered valid in the context of a market.</p>
                                        <p ><strong>Multi-Way: </strong>A market where three or more participants compete.</p>
                                        <p ><strong>In-Play: </strong>A market is considered “In-Play” once competition has begun.</p>
                                        <p ><strong>Market: </strong>An offering on a fixture.</p>
                                        <p ><strong>Bet:</strong> A risked stake with defined payout on the result of an event or combination of events.</p>
                                        <p ><strong>Multiple:</strong> Combined bets with multiplied odds.</p>
                                        <p ><strong>Teaser:</strong> Combined bets with fixed odds and improved handicap or total.</p>
                                        <p ><strong>Conclusively Determined:</strong> Markets which have had a winner determined no matter what else happens in the period.</p>
                                        <p ><strong>Scoring Unit:</strong> The unit of scoring used to determine the results of a market. For example, a soccer match can have markets for goals, corner kicks and bookings, each of which are scoring units.</p>
                                    </div>
                                </div>
                                <a className="back-to-top rules" href="#page-top">Back To Top</a>
                            </article>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BettingRules;