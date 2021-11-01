import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { toggleFavorites } from '../redux/services';

class SportsBreadcrumb extends Component {
    getFavoritesSelected = (league) => {
        const { user } = this.props;
        const unSelectedImage = <img src="/images/sports/star-unselected.svg" alt="Favourite" className="dashboard_starimg_unselect" />;
        if (!user) return unSelectedImage;
        if (!user.favorites) return unSelectedImage;
        const fav = user.favorites.find(fav => fav.originId == league.leagueId);
        if (fav)
            return <img src="/images/sports/star-selected.svg" alt="Favourite" />
        return unSelectedImage;
    }

    toggleFavoriteLeague = (evt) => {
        const { user, getUser, sportName, league } = this.props;
        evt.preventDefault();
        if (!user) return;
        toggleFavorites({ sport: sportName, type: 'league', name: league.name })
            .then(() => {
                getUser();
            })
    }

    render() {
        const { sportName, league, team } = this.props;
        const displaySportName = sportName ? sportName.replace("_", " ") : ""

        return (
            <div className="contentBlock hide-mobile" style={{ background: 'url("/images/sports/soccer.jpg")' }}>
                <div className="dashboard_breadcrumb">
                    <div>
                        <ul>
                            <li><Link className="dashboard_breadcrumb_textLabel" to="/">Home</Link></li>
                            <span className="dashboard_breadcrumb_separator">/</span>
                            {!league && !team && <li><span className="dashboard_breadcrumb_textLabel">{displaySportName}</span></li>}
                            {(league || team) && <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${sportName}`}>{displaySportName}</Link></li>}
                            {league && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{league.name}</span></li>
                            </>}
                            {team && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{team}</span></li>
                            </>}
                        </ul>
                    </div>
                </div>
                <div className="dashboard_title">
                    <h3>
                        {!league && !team && <span>{displaySportName} Odds</span>}
                        {league && <span>{league.name} Odds</span>}
                        {team && <span>{team} Odds</span>}
                    </h3>
                    {league && <div className="dashboard_togglefav">
                        <div>
                            <a className="dashboard_starimg dashboard_starimg_light" onClick={(evt) => this.toggleFavoriteLeague(evt)}>
                                {this.getFavoritesSelected(league)}
                            </a>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default SportsBreadcrumb;