import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class LinesBreadcrumb extends Component {
    render() {
        const { sportName, league, teams, time } = this.props;
        const displaySportName = sportName ? sportName.replace("_", " ") : ""

        return (
            <div className="contentBlock contentBlock_line">
                <div style={{ minHeight: '35px' }}>
                    <div className="dashboard_breadcrumb line_breadcrumb">
                        <div className="style_desktop_listWrap__2sU66">
                            <ul>
                                <li><Link className="dashboard_breadcrumb_textLabel" to="/">Home</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${sportName}`}>{displaySportName}</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${sportName}/league/${league.leagueId}`}>{league.name}</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{teams.teamA} vs {teams.teamB}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="line_breadcrumb_participant_container pl-0">
                    <div class="line_breadcrumb_participant_row">
                        <div class="pl-4">
                            <div class="line_breadcrumb_time">
                                <div class="line_breadcrumb_participantWrapper">
                                    <label class="line_breadcrumb_participantName mb-0">{time}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="line_breadcrumb_participant_row">
                        <div class="pl-3">
                            <div class="line_breadcrumb_favorite">
                                <a class="dashboard_starimg">
                                    <img src="/images/sports/star-unselected.svg" alt="Favourite" />
                                </a>
                            </div>
                        </div>
                        <div class="line_breadcrumb_participant">
                            <div class="line_breadcrumb_participantWrapper">
                                <label class="line_breadcrumb_participantName mb-0">{teams.teamA}</label>
                            </div>
                        </div>
                    </div>
                    <div class="line_breadcrumb_participant_row">
                        <div class="pl-3">
                            <div class="line_breadcrumb_favorite">
                                <a class="dashboard_starimg">
                                    <img src="/images/sports/star-unselected.svg" alt="Favourite" />
                                </a>
                            </div>
                        </div>
                        <div class="line_breadcrumb_participant">
                            <div class="line_breadcrumb_participantWrapper">
                                <label class="line_breadcrumb_participantName mb-0">{teams.teamB}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LinesBreadcrumb;