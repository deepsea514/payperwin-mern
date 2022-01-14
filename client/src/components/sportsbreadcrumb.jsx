import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toggleFavorites } from '../redux/services';
import { getSportName } from '../libs/getSportName';

class SportsBreadcrumb extends Component {
    constructor(props) {
        super(props);
        const { shortName } = props;
        this.state = {
            displaySportName: getSportName(shortName)
        }
    }

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
        const { user, getUser, league } = this.props;
        const { displaySportName } = this.state;
        evt.preventDefault();
        if (!user) return;
        toggleFavorites({ sport: displaySportName, type: 'league', name: league.name })
            .then(() => {
                getUser();
            })
    }

    render() {
        const { shortName, league, team, active } = this.props;
        const { displaySportName } = this.state;
        const importTeaser = ['American Football', 'Basketball'].includes(displaySportName);
        const sportLink = !league && !team && active != 'teaser';
        return (
            <div className="contentBlock hide-mobile">
                <div className="dashboard_breadcrumb">
                    <div>
                        <ul>
                            <li><Link className="dashboard_breadcrumb_textLabel" to="/">Home</Link></li>
                            <span className="dashboard_breadcrumb_separator">/</span>
                            {sportLink && <li><span className="dashboard_breadcrumb_textLabel">{displaySportName}</span></li>}
                            {!sportLink && <li><Link className="dashboard_breadcrumb_textLabel" to={`/sport/${shortName}`}>{displaySportName}</Link></li>}
                            {league && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{league.name}</span></li>
                            </>}
                            {team && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">{team}</span></li>
                            </>}
                            {active == 'teaser' && <>
                                <span className="dashboard_breadcrumb_separator">/</span>
                                <li><span className="dashboard_breadcrumb_textLabel">Teaser</span></li>
                            </>}
                        </ul>
                    </div>
                </div>
                <div className="dashboard_title">
                    <h3>
                        {!league && !team && <span>{displaySportName} {active == 'teaser' ? 'Teaser ' : ''}Odds</span>}
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
                <div className="dashboard_bottombar">
                    <div className="dashboard_bottombar_container">
                        <div className="dashboard_bottombar_wrapper" style={{ width: '100%' }}>
                            <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
                                <div className="dashboard_bottombar_scroller" style={{ transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)', transitionDuration: '0ms', transform: 'translate(0px, 0px) translateZ(0px)' }}>
                                    <Link to={`/sport/${shortName}`} className={active == 'matchup' ? "dashboard_bottombar_selected" : ''}><span>Matchups</span></Link>
                                    <Link to={`/sport/${shortName}/league`} className={active == 'league' ? "dashboard_bottombar_selected" : ''}><span>leagues</span></Link>
                                    {importTeaser && <Link to={`/sport/${shortName}/teaser`} className={active == 'teaser' ? "dashboard_bottombar_selected" : ''}><span>teasers</span></Link>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SportsBreadcrumb;