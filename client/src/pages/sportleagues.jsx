import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import _env from '../env.json';
const serverUrl = _env.appUrl;
import { FormattedMessage } from 'react-intl';
import { toggleFavorites } from '../redux/services';

const sportNameSpanStyle = {
    float: 'initial',
};

class SportsLeagues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            leagues: [],
            letters: [
                '[0-9]',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                'Y', 'Z',
            ],
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getLeagues();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getLeagues = () => {
        const { sportName } = this.props;
        this.setState({ leagues: [] });
        axios.get(`${serverUrl}/sportleague?name=${sportName ? sportName.replace("_", " ") : ""}`).then(({ data }) => {
            this.setState({ leagues: data });
        });
    }

    componentDidUpdate(prevProps) {
        const { sportName } = this.props;
        const { sportName: prevsportName } = prevProps;
        const sportChanged = (sportName !== prevsportName);
        if (sportChanged) {
            this.getLeagues();
        }
    }

    toggleFavoriteLeague = (evt, league) => {
        const { user, getUser, sportName } = this.props;
        evt.preventDefault();
        if (!user) return;
        toggleFavorites({ sport: sportName, type: 'league', name: league.name })
            .then(() => {
                getUser();
            })
    }

    getFavoritesSelected = (league) => {
        const { user } = this.props;
        if (!user) return <img src="/images/sports/star-unselected.svg" alt="Favourite" style={{ filter: 'invert(0.5)' }} />;
        if (!user.favorites) return <img src="/images/sports/star-unselected.svg" alt="Favourite" style={{ filter: 'invert(0.5)' }} />;
        const fav = user.favorites.find(fav => fav.originId == league.originId);
        if (fav)
            return <img src="/images/sports/star-selected.svg" alt="Favourite" />
        return <img src="/images/sports/star-unselected.svg" alt="Favourite" style={{ filter: 'invert(0.5)' }} />;
    }

    render() {
        const { leagues, letters } = this.state;
        const { sportName } = this.props;

        return (
            <>
                <div className="highlights">
                    <div className="bet-slip-header"><FormattedMessage id="PAGES.LEAGUES.TOPLEAGUES" /></div>
                    <div className="content">
                        {leagues && leagues.length != 0 && <ul className="leagues-list">
                            {leagues.slice(0, 6).map(league => (
                                <li key={league.name}
                                    style={!league.eventCount ? { opacity: 0.5, pointerEvents: 'none' } : null} >
                                    <Link to={{ pathname: `/sport/${sportName ? sportName.replace(" ", "_") : ""}/league/${league.originId}` }}>
                                        <span style={sportNameSpanStyle}>
                                            <b className="mr-3">{league.name}</b> {league.eventCount}
                                        </span>
                                        <span onClick={(evt) => this.toggleFavoriteLeague(evt, league)}>
                                            {this.getFavoritesSelected(league)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>}
                        <br />
                        {letters.map(letter => {
                            const filteredLeagues = leagues.filter(league => {
                                const searchPattern = new RegExp('^' + letter, 'i');
                                return searchPattern.test(league.name);
                            });
                            if (!filteredLeagues.length) return null;
                            return (
                                <ul className="leagues-list" key={letter}>
                                    <li className="league-list-letter">{letter == '[0-9]' ? '#' : letter}</li>
                                    {filteredLeagues.map(league => (
                                        <li key={`${letter}-${league.name}`}
                                            style={!league.eventCount ? { opacity: 0.5, pointerEvents: 'none' } : null} >
                                            <Link to={{ pathname: `/sport/${sportName ? sportName.replace(" ", "_") : ""}/league/${league.originId}` }}>
                                                <span style={sportNameSpanStyle}>
                                                    <b className="mr-3">{league.name}</b> {league.eventCount}
                                                </span>
                                                <span onClick={(evt) => this.toggleFavoriteLeague(evt, league)}>
                                                    {this.getFavoritesSelected(league)}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(SportsLeagues);
