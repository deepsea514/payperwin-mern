import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import SportsBreadcrumb from './sportsbreadcrumb';
import { FormattedMessage } from 'react-intl';
import { getSports } from '../redux/services';
import { getSportName } from "../libs/getSportName";

const teaserPoints = {
    'football': [6, 6.5, 7],
    'basketball': [4, 4.5, 5]
}

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

class SportTeaser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            timer: null,
            teaserPoint: 0,
        };
    }

    componentDidMount() {
        const { setBetSlipType, history, shortName } = this.props;
        if (!shortName || !(['football', 'basketball'].includes(shortName))) {
            history.push('/');
            return;
        }
        this.setState({ teaserPoint: teaserPoints[shortName][0] });

        setBetSlipType('teaser');
        this.getSport();
        this.setState({
            timer: setInterval(this.getSport, 60 * 1000),
        });
    }

    componentWillUnmount() {
        const { timer } = this.state;
        if (timer) clearInterval(timer);
    }

    componentDidUpdate(prevProps) {
        const { shortName, history } = this.props;
        const { shortName: prevShortName } = prevProps;
        const sportChanged = shortName !== prevShortName;
        if (sportChanged) {
            if (!shortName || !(['American Football', 'Basketball'].includes(shortName))) {
                history.push('/');
                return;
            }
            this.setState({ teaserPoint: teaserPoints[shortName][0], error: null });
            this.getSport();
        }
    }

    getSport = () => {
        const { shortName } = this.props;
        if (shortName) {
            getSports(shortName)
                .then(({ data }) => {
                    if (data) {
                        this.setState({ data });
                    } else {
                        this.setState({ data: null })
                    }
                }).catch((err) => {
                    this.setState({ error: err });
                });
        }
    }

    render() {
        const { addBet, removeBet, timezone, shortName, user, getUser, teaserBetSlip } = this.props;
        const { data, error, teaserPoint } = this.state;
        const sportName = getSportName(shortName);
        
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (!data) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }

        const { leagues, origin } = data;
        return (
            <div>
                <SportsBreadcrumb shortName={shortName}
                    user={user} getUser={getUser} active='teaser' />

                {(() => {
                    const filteredLeagues = leagues.map(league => {
                        const { name: leagueName, originId: leagueId } = league;
                        let events = league.events.map((event, i) => {
                            const { teamA, teamB, startDate, lines, originId: eventId } = event;
                            if (!lines || !lines.length || new Date().getTime() > new Date(startDate).getTime())
                                return null;
                            const { spreads, totals, originId: lineId } = lines[0];
                            if (!spreads && !totals)
                                return null;
                            return (
                                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                                    <li>
                                        <p className="widh-adf">
                                            <strong>{teamA}</strong> <strong>{teamB}</strong>{timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                        </p>
                                    </li>
                                    <React.Fragment key={lineId}>
                                        <li className='not-mobile'></li>
                                        {spreads && spreads[0] ? (
                                            (() => {
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
                                                const homeExist = teaserBetSlip.betSlip.find(bet => bet.lineId == lineId && bet.type == 'spread' && bet.pick == 'home');
                                                const awayExist = teaserBetSlip.betSlip.find(bet => bet.lineId == lineId && bet.type == 'spread' && bet.pick == 'away');
                                                const pointHome = spreads[0].hdp + teaserPoint;
                                                const pointAway = -spreads[0].hdp + teaserPoint;
                                                return (
                                                    <li>
                                                        <span className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'spread', 'home')
                                                                : () => addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'spread',
                                                                    league: leagueName,
                                                                    pick: 'home',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: { ...lineQuery, points: pointHome },
                                                                    pickName: `Pick: ${teamA} ${pointHome >= 0 ? '+' : ''}${pointHome} (${spreads[0].hdp} + ${teaserPoint} pts)`,
                                                                    origin: origin,
                                                                    subtype: null,
                                                                    teaserPoint: teaserPoint
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="teaser-points">{`${pointHome >= 0 ? '+' : ''}${pointHome}`}</div>
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'spread', 'away')
                                                                : () => addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'spread',
                                                                    league: leagueName,
                                                                    pick: 'away',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: { ...lineQuery, points: pointAway },
                                                                    pickName: `Pick: ${teamB} ${pointAway >= 0 ? '+' : ''}${pointAway} (${-spreads[0].hdp} + ${teaserPoint} pts)`,
                                                                    origin: origin,
                                                                    subtype: null,
                                                                    teaserPoint: teaserPoint
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="teaser-points">{`${pointAway >= 0 ? '+' : ''}${pointAway}`}</div>
                                                            </div>
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                        {totals && totals[0] ? (
                                            (() => {
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
                                                const homeExist = teaserBetSlip.betSlip.find(bet => bet.lineId == lineId && bet.type == 'total' && bet.pick == 'home');
                                                const awayExist = teaserBetSlip.betSlip.find(bet => bet.lineId == lineId && bet.type == 'total' && bet.pick == 'away');
                                                const pointHome = totals[0].points - teaserPoint;
                                                const pointAway = totals[0].points + teaserPoint;
                                                return (
                                                    <li>
                                                        <span
                                                            className={`box-odds ${homeExist ? 'orange' : null}`}
                                                            onClick={homeExist
                                                                ? () => removeBet(lineId, 'total', 'home')
                                                                : () => addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'total',
                                                                    league: leagueName,
                                                                    pick: 'home',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: { ...lineQuery, points: pointHome },
                                                                    pickName: `Pick: Over ${pointHome} (${totals[0].points} - ${teaserPoint} pts)`,
                                                                    origin: origin,
                                                                    subtype: null,
                                                                    teaserPoint: teaserPoint
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="teaser-points">O {`${pointHome}`}</div>
                                                            </div>
                                                        </span>
                                                        <span
                                                            className={`box-odds ${awayExist ? 'orange' : null}`}
                                                            onClick={awayExist
                                                                ? () => removeBet(lineId, 'total', 'away')
                                                                : () => addBet({
                                                                    name: `${teamA} - ${teamB}`,
                                                                    type: 'total',
                                                                    league: leagueName,
                                                                    pick: 'away',
                                                                    home: teamA,
                                                                    away: teamB,
                                                                    sportName,
                                                                    lineId: lineId,
                                                                    lineQuery: { ...lineQuery, points: pointAway },
                                                                    pickName: `Pick: Under ${pointAway} (${totals[0].points} + ${teaserPoint} pts)`,
                                                                    origin: origin,
                                                                    subtype: null,
                                                                    teaserPoint: teaserPoint
                                                                })}>
                                                            <div className="vertical-align">
                                                                <div className="teaser-points">U {`${pointAway}`}</div>
                                                            </div>
                                                        </span>
                                                    </li>
                                                );
                                            })()
                                        ) : emptyBoxLine}
                                    </React.Fragment>
                                    <li className="detailed-lines-link not-mobile">
                                    </li>
                                </ul>
                            );
                        }).filter(event => event);
                        return (events.length > 0 &&
                            <div className="tab-content" key={leagueName}>
                                <div className="tab-pane fade show active tab-pane-leagues" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                                    <ul className="table-list table-list-top d-flex">
                                        <li>{leagueName}&nbsp;<i className="fas fa-chevron-right" style={{ display: 'initial' }}></i></li>
                                        <li className='not-mobile'></li>
                                        <li>SPREAD</li>
                                        <li>TOTAL</li>
                                        <li className="detailed-lines-link not-mobile"></li>
                                    </ul>
                                    {events}
                                </div>
                            </div>
                        );
                    }).filter(league => league);
                    return filteredLeagues.length > 0 && (
                        <>
                            <div className="table-title border-0">MARKETS</div>
                            <div className="content">
                                <div className='teaser-markets'>
                                    <div className="teaser-markets-wrapper" style={{ width: '100%' }}>
                                        <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
                                            <div className="teaser-markets-scroller" style={{ transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)', transitionDuration: '0ms', transform: 'translate(0px, 0px) translateZ(0px)' }}>
                                                {teaserPoints[shortName].map(point => (
                                                    <span
                                                        key={point}
                                                        className={point == teaserPoint ? 'dashboard_bottombar_selected' : ''}
                                                        onClick={() => this.setState({ teaserPoint: point })}
                                                    >
                                                        {point} PTS
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="content">
                                {filteredLeagues}
                            </div>
                        </>
                    )
                })()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(SportTeaser))
