import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import timeHelper from "../../helpers/timehelper";
import calculateNewOdds from '../../helpers/calculateNewOdds';
import convertOdds from '../../helpers/convertOdds';
import checkOddsAvailable from '../../helpers/checkOddsAvailable';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import sportNameImage from '../../helpers/sportNameImage';
import getLineCount from '../../helpers/getLineCount';
import RenderBasicEvent from './renderBasicEvent';
import RenderProEvent from './renderProEvent';

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

const RenderLeagues = (props) => {
    const {
        leagues, collapsedLeague, toggleCollapseLeague, pro_mode, betSlip,
        timezone, location, dateSelected, onChangeDate, oddsFormat, addBet,
        showHelpAction, removeBet
    } = props;
    const { pathname } = location;

    const getDateStr = (day) => {
        switch (day) {
            case 0:
                return 'Today';
            case null:
                return 'All';
            default:
                const date = new Date().addDates(day);
                return dateFormat(date, "mmm d");
        }
    }

    const filteredLeagues = leagues.map(league => {
        const { name: leagueName, originId: leagueId, sportName, shortName } = league;
        const collapsed = collapsedLeague.find(league => league == leagueId);

        let events = collapsed ? null : league.events.map((event, idx) => {
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
                        removeBet={removeBet} />
                );
            }
            return (
                <RenderBasicEvent key={idx}
                    oddsFormat={oddsFormat}
                    leagueName={leagueName}
                    leagueId={leagueId}
                    shortName={shortName}
                    event={event}
                    sportName={sportName}
                    betSlip={betSlip}
                    timezone={timezone}
                    addBet={addBet}
                    removeBet={removeBet} />
            );
        });

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
                        {events != null && <ul className={`table-list table-list-top border-0 ${pro_mode ? 'd-flex' : 'd-none d-md-flex'}`}>
                            <li></li>
                            <li>
                                {pro_mode ? 'ML' : <span className='cursor-pointer' onClick={() => showHelpAction('moneyline')}>MONEYLINE<i className='ml-3 fas fa-question-circle' /></span>}
                            </li>
                            <li>
                                {pro_mode ? 'SPREAD' : <span className='cursor-pointer' onClick={() => showHelpAction('spread')}>POINT SPREAD<i className='ml-3 fas fa-question-circle' /></span>}
                            </li>
                            <li>
                                {pro_mode ? 'TOTAL' : <span className='cursor-pointer' onClick={() => showHelpAction('total')}>TOTAL POINTS<i className='ml-3 fas fa-question-circle' /></span>}
                            </li>
                            {pro_mode && <li className="detailed-lines-link not-mobile"></li>}
                        </ul>}
                        {events}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <>
            <div className={`dashboard_bottombar date_bottombar_container${pathname == '/' ? '_dashboard' : ''}`}>
                <div className="dashboard_bottombar_container date_bottombar">
                    <div className="dashboard_bottombar_wrapper" style={{ minWidth: '100%' }}>
                        <div className='dashboard_bottombar_scroller_container'>
                            <div className="dashboard_bottombar_scroller date_bottombar" style={{
                                transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                                transitionDuration: '0ms',
                                transform: 'translate(0px, 0px) translateZ(0px)'
                            }}>
                                {[0, 1, 2, 3, 4, 5].map((date, index) => {
                                    return (
                                        <a key={index}
                                            className={dateSelected == date ? "dashboard_bottombar_selected" : ''}
                                            onClick={() => onChangeDate(date)}><span>{getDateStr(date)}</span></a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                {filteredLeagues.length > 0 ? filteredLeagues :
                    (
                        <h3 className='no-games'>There are no games for the selected date. Please choose all or select a different league.</h3>
                    )}
            </div>
        </>
    )
}

export default withRouter(RenderLeagues);