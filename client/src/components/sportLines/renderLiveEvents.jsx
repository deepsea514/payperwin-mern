import React from 'react';
import { Link } from 'react-router-dom';
import timeHelper from "../../helpers/timehelper";
import { FormattedMessage } from 'react-intl';
import getLineCount from '../../helpers/getLineCount';

const RenderLiveEvents = (props) => {
    const { liveData, timezone } = props;
    const { leagues } = liveData;
    if (!leagues || !leagues.length) return null;

    const filteredLeagues = leagues.map(league => {
        const { name: leagueName, originId: leagueId, events, shortName } = league;
        const filteredEvents = events.map((event, i) => {
            const { teamA, teamB, startDate, lines, timer, originId: eventId } = event;
            if (!lines || !lines.length)
                return null;
            const lineCount = getLineCount(lines[0], timer);
            if (!lineCount) return null;
            const pathname = `/sport/${shortName}/league/${leagueId}/event/${eventId}/live`;
            return (
                <ul className="table-list d-flex table-bottom" key={`${teamA}${teamB}${startDate}${i}`}>
                    <li>
                        <Link to={{ pathname: pathname }} className="widh-adf">
                            <strong>{teamA}</strong> <strong>{teamB}</strong>
                        </Link>
                        <Link to={{ pathname: pathname }} className="widh-adf mt-3">
                            {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                            <strong>{lineCount}+ <FormattedMessage id="COMPONENTS.SPORT.ADDITIONAL" /> <i className="fas fa-angle-right" /></strong>
                        </Link>
                    </li>
                    {[1, 2, 3].map(i => (
                        <li key={i}>
                            <span className="box-odds">
                                <div className="vertical-align">
                                    <div className="origin-odds">
                                        <i className="fas fa-lock" />
                                    </div>
                                </div>
                            </span>
                            <span className="box-odds">
                                <div className="vertical-align">
                                    <div className="origin-odds">
                                        <i className="fas fa-lock" />
                                    </div>
                                </div>
                            </span>
                        </li>
                    ))}
                    <li className="detailed-lines-link not-mobile">
                        <Link to={{ pathname: pathname }}>
                            +{lineCount}<i className="fas fa-angle-right" />
                        </Link>
                    </li>
                </ul>
            )
        }).filter(event => event);
        return filteredEvents.length > 0 && (
            <div className="tab-content" key={leagueName}>
                <div className="tab-pane fade show active tab-pane-leagues" id="home" role="tabpanel" aria-labelledby="home-tab" key={leagueName}>
                    <div className='leagues-content'>
                        <ul className="table-list table-list-top d-flex">
                            <li className='d-flex justify-content-start'>{leagueName}&nbsp;<i className="fas fa-chevron-right"></i></li>
                            <li>ML</li>
                            <li>SPREAD</li>
                            <li>TOTAL</li>
                            <li className="detailed-lines-link not-mobile"></li>
                        </ul>
                        {filteredEvents}
                    </div>
                </div>
            </div>
        );
    }).filter(league => league);

    return filteredLeagues.length > 0 && (
        <>
            <div className="table-title">LIVE</div>
            <div className="content mb-3">
                {filteredLeagues}
            </div>
        </>
    )
}

export default RenderLiveEvents;