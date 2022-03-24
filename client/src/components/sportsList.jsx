import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import sportNameImage from "../helpers/sportNameImage";
import { getSportLeagues, getSportsDir } from '../redux/services';

const defaultTopSports = [
    'American Football',
    'Baseball',
    'Ice Hockey',
    'Basketball',
    'Soccer',
    'E-sports',
    'Tennis'
]

class SportsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sports: null,
            error: null,
            leaguesData: [],
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getSports();
    }

    getSports() {
        const { topSports } = this.props;
        getSportsDir()
            .then(({ data }) => {
                if (data) {
                    if (topSports) {
                        const sports = defaultTopSports.map((sport) => {
                            const sportData = data.find(data => data.name == sport);
                            return sportData //? sportData : null;
                        }).filter(sport => sport);
                        this._isMounted && this.setState({ sports: sports })
                    } else {
                        this._isMounted && this.setState({ sports: data })
                    }
                }
            })
            .catch((err) => {
                this._isMounted && this.setState({ error: err });
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getLeagues = (evt, name) => {
        evt.stopPropagation();
        const { leaguesData } = this.state;
        const newLeaguesData = leaguesData.filter(league => league.name != name);
        getSportLeagues(name)
            .then(({ data }) => {
                newLeaguesData.push({ name, leagues: data.slice(0, 6) })
                this.setState({ leaguesData: newLeaguesData });
            });
    }

    removeLeagues = (evt, name) => {
        evt.stopPropagation();
        this.setState({ leaguesData: null });
        const { leaguesData } = this.state;
        const newLeaguesData = leaguesData.filter(league => league.name != name);
        this.setState({ leaguesData: newLeaguesData });
    }

    ellipsisTitle = (name) => {
        return (name.length > 18) ? name.substr(0, 18 - 1) + '...' : name;
    }

    render() {
        const { showNoEvents, topSports, history } = this.props;
        const { sports, leaguesData } = this.state;
        if (!sports) {
            return null;
        }
        return (
            <ul className="sport-list sport-desktop-list sport-list-compact">
                {topSports && <li className="sport-list-item sport-sublist-item sport-hide-league">
                    <Link
                        to={{ pathname: `/side-bet` }}
                        className="sport-list-compact"
                    >
                        <img src={sportNameImage('Side Bet')} style={{ marginRight: '6px' }} />
                        <label><span><span>Side Bet</span></span></label>
                    </Link>
                </li>}
                {sports.sort((a, b) => b.eventCount - a.eventCount).map(sport => {
                    const { name, eventCount, shortName } = sport;
                    const hasEvents = eventCount > 0;
                    return (hasEvents || showNoEvents) && (
                        name == "Side Bet" ?
                            (
                                <li className="sport-list-item sport-sublist-item sport-hide-league" key={name}>
                                    <Link
                                        to={{ pathname: `/side-bet` }}
                                        className="sport-list-compact"
                                        style={!hasEvents ? { opacity: 0.5, pointerEvents: 'none' } : null}
                                    >
                                        <img src={sportNameImage(name)} style={{ marginRight: '6px' }} />
                                        <label><span><span>{name}</span></span></label>
                                    </Link>
                                </li>
                            )
                            : (
                                <li className="sport-list-item sport-sublist-item" key={name}>
                                    <a
                                        onClick={() => { history.push(name == 'Soccer' ? `/sport/${shortName}/league` : `/sport/${shortName}`) }}
                                        style={!hasEvents ? { opacity: 0.5, pointerEvents: 'none' } : null}
                                        className="sport-list-compact"
                                    >
                                        <img src={sportNameImage(name)} style={{ marginRight: '6px' }} />
                                        <label><span><span>{name}</span></span></label>
                                        {/* <span className="sport-list-count">{eventCount}</span> */}
                                        {(leaguesData.length == 0 || !leaguesData.find(league => league.name == name)) && <span className="sport-list-dropdown-league" onClick={(evt) => this.getLeagues(evt, name)}>
                                            <i style={{ borderLeft: '#72777f solid 1px' }} className="fas fa-chevron-down mr-0 pl-2"></i>
                                        </span>}
                                        {(leaguesData.length != 0 && leaguesData.find(league => league.name == name)) && <span className="sport-list-dropdown-league" onClick={(evt) => this.removeLeagues(evt, name)}>
                                            <i style={{ borderLeft: '#72777f solid 1px' }} className="fas fa-chevron-up mr-0 pl-2"></i>
                                        </span>}
                                    </a>
                                    {(leaguesData && leaguesData.find(league => league.name == name)) && <ul className="sport-league-list sport-list-compact">
                                        {leaguesData.find(league => league.name == name).leagues.map(league => (
                                            <li key={league.name} className="sport-list-item sport-league-item sport-hide-league">
                                                <Link
                                                    className="sport-list-compact"
                                                    to={{ pathname: `/sport/${shortName}/league/${league.originId}` }}
                                                    style={!league.eventCount ? { opacity: 0.5, pointerEvents: 'none' } : null}
                                                >
                                                    <label><span>{league.name}</span></label>
                                                    {/* <span className="sport-list-count">{league.eventCount}</span> */}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className="sport-list-item sport-league-item sport-hide-league">
                                            <Link
                                                className="sport-list-compact"
                                                to={{ pathname: `/sport/${shortName}/league` }}
                                            >
                                                <label><span>All Leagues</span></label>
                                                <span className="sport-list-count">&nbsp;</span>
                                            </Link>
                                        </li>
                                    </ul>}
                                </li>
                            )
                    )
                })}
            </ul >
        )
    }
}

export default withRouter(SportsList);
