import React from 'react';
import { withRouter } from 'react-router-dom';
import dateformat from 'dateformat';
import sportNameImage from '../../helpers/sportNameImage';
import RenderBasicEvent from './renderBasicEvent';
import RenderProEvent from './renderProEvent';
import { FormattedMessage } from 'react-intl';

const RenderLeagues = (props) => {
    const {
        leagues, collapsedLeague, toggleCollapseLeague, pro_mode, betSlip,
        timezone, location, dateSelected, onChangeDate, oddsFormat, addBet,
        showHelpAction, removeBet, origin, dateList
    } = props;
    const { pathname } = location;

    const getDateStr = (date) => {
        switch (date) {
            case null:
                return 'All';
            default:
                return dateformat(date, "mmm d");
        }
    }

    let eventIndex = 0;
    const filteredLeagues = leagues.map(league => {
        const { name: leagueName, originId: leagueId, sportName, shortName } = league;
        const collapsed = collapsedLeague.find(league => league == leagueId);

        let events = league.events.map((event, idx) => {
            const { startDate } = event;
            if (dateList.length > 0 && dateList[dateSelected]) {
                const matchDate = new Date(startDate).getTime();
                const minDate = dateList[dateSelected].getTime();
                const maxDate = minDate + 86400000;
                if (matchDate >= maxDate || matchDate < minDate) {
                    return null;
                }
            }
            eventIndex++;
            if (pro_mode) {
                return (
                    <RenderProEvent key={idx}
                        oddsFormat={oddsFormat}
                        leagueName={leagueName}
                        leagueId={leagueId}
                        shortName={shortName}
                        event={event}
                        sportName={sportName}
                        betSlip={betSlip}
                        timezone={timezone}
                        addBet={addBet}
                        origin={origin}
                        removeBet={removeBet} />
                );
            }
            return (
                <RenderBasicEvent key={idx}
                    eventIndex={eventIndex}
                    showHelpAction={showHelpAction}
                    oddsFormat={oddsFormat}
                    leagueName={leagueName}
                    leagueId={leagueId}
                    shortName={shortName}
                    event={event}
                    sportName={sportName}
                    betSlip={betSlip}
                    timezone={timezone}
                    addBet={addBet}
                    origin={origin}
                    removeBet={removeBet} />
            );
        }).filter(event => event);

        if (events.length == 0) {
            return null;
        }

        events = collapsed ? null : events

        return (
            <div className="tab-content" key={`${sportName} - ${leagueName}`}>
                <div className="tab-pane fade show active tab-pane-leagues border-0" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                    <div className="table-title d-flex align-items-center justify-content-between">
                        <div className='d-flex align-items-center'>
                            <img src={sportNameImage(sportName, leagueName)}
                                style={{ marginRight: '6px', width: '14px', height: '14px' }} /> {leagueName}
                        </div>
                        <i className={`fas ${collapsed ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                            onClick={() => toggleCollapseLeague(leagueId)} />
                    </div>
                    <div className={`leagues-content ${pro_mode ? '' : 'basic-mode'}`}>
                        {events != null && <ul className={`table-list table-list-top border-0 ${pro_mode ? 'd-flex' : 'd-none'}`}>
                            <li></li>
                            <li>ML</li>
                            <li>SPREAD</li>
                            <li>TOTAL</li>
                            <li className="detailed-lines-link not-mobile"></li>
                        </ul>}
                        {events}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <>
            {dateList.length > 0 && <div className={`dashboard_bottombar date_bottombar_container${pathname == '/' ? '_dashboard' : ''}`}>
                <div className="dashboard_bottombar_container date_bottombar">
                    <div className="dashboard_bottombar_wrapper" style={{ minWidth: '100%' }}>
                        <div className='dashboard_bottombar_scroller_container'>
                            <div className="dashboard_bottombar_scroller date_bottombar" style={{
                                transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                                transitionDuration: '0ms',
                                transform: 'translate(0px, 0px) translateZ(0px)'
                            }}>
                                {dateList.map((date, index) => {
                                    return (
                                        <a key={index}
                                            className={dateSelected == index ? "dashboard_bottombar_selected" : ''}
                                            onClick={() => onChangeDate(index)}><span>{getDateStr(date)}</span></a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="content">
                {filteredLeagues.length > 0 ? filteredLeagues :
                    (
                        <h3 className='no-games'><FormattedMessage id="COMPONENTS.NO_GAMES_IN_DATE" /></h3>
                    )}
            </div>
        </>
    )
}

export default withRouter(RenderLeagues);