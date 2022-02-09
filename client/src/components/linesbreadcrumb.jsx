import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { getSportName } from '../libs/getSportName';
import { toggleFavorites } from '../redux/services';
import { showToast } from '../libs/toast';

class LinesBreadcrumb extends Component {
    getFavoritesSelected = (team) => {
        const { user, shortName } = this.props;
        const unSelectedImage = <img src="/images/sports/star-unselected.svg" alt="Favourite" />;
        if (!user) return unSelectedImage;
        if (!user.favorites) return unSelectedImage;
        const sportName = getSportName(shortName);
        const fav = user.favorites.find(fav => fav.sport == sportName && fav.name == team);
        if (fav)
            return <img src="/images/sports/star-selected.svg" alt="Favourite" />
        return unSelectedImage;
    }

    toggleFavoriteLeague = (evt, team) => {
        const { user, getUser, shortName } = this.props;
        evt.preventDefault();
        if (!user) {
            showToast('Please Login or Join to add your Favorites.');
            return;
        }
        const sportName = getSportName(shortName);
        toggleFavorites({ sport: sportName, type: 'team', name: team })
            .then(() => {
                getUser();
            })
    }

    render() {
        const { shortName, league, teams, time } = this.props;
        const sportName = getSportName(shortName);

        return (
            <div className="contentBlock contentBlock_line">
                <div style={{ minHeight: '35px' }}>
                    <div className="dashboard_breadcrumb line_breadcrumb">
                        <div className="style_desktop_listWrap__2sU66">
                            <ul>
                                <li><Link className="dashboard_breadcrumb_textLabel" to="/">Home</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${shortName}`}>{sportName}</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${shortName}/league/${league.leagueId}`}>{league.name}</Link></li>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{teams.teamA} vs {teams.teamB}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="line_breadcrumb_participant_container pl-0">
                    <div className="line_breadcrumb_participant_row">
                        <div className="pl-4">
                            <div className="line_breadcrumb_time">
                                <div className="line_breadcrumb_participantWrapper">
                                    <label className="line_breadcrumb_participantName mb-0">{time}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line_breadcrumb_participant_row">
                        <div className="pl-3">
                            <div className="line_breadcrumb_favorite">
                                <a className="dashboard_starimg" onClick={(evt) => this.toggleFavoriteLeague(evt, teams.teamA)}>
                                    {this.getFavoritesSelected(teams.teamA)}
                                </a>
                            </div>
                        </div>
                        <div className="line_breadcrumb_participant">
                            <div className="line_breadcrumb_participantWrapper">
                                <label className="line_breadcrumb_participantName mb-0">{teams.teamA}</label>
                            </div>
                        </div>
                    </div>
                    <div className="line_breadcrumb_participant_row">
                        <div className="pl-3">
                            <div className="line_breadcrumb_favorite">
                                <a className="dashboard_starimg" onClick={(evt) => this.toggleFavoriteLeague(evt, teams.teamB)}>
                                    {this.getFavoritesSelected(teams.teamB)}
                                </a>
                            </div>
                        </div>
                        <div className="line_breadcrumb_participant">
                            <div className="line_breadcrumb_participantWrapper">
                                <label className="line_breadcrumb_participantName mb-0">{teams.teamB}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LinesBreadcrumb;