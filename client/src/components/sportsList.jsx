import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
// import sportNameIcon from '../helpers/sportNameIcon';
import sportNameImage from "../helpers/sportNameImage";
const config = require('../../../config.json');
const serverUrl = config.appUrl;
import '../style/all.min.css';

const sportNameSpanStyle = {
    float: 'initial',
};

class SportsList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sports: null,
            error: null,
            leaguesData: null,
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getSports();
    }

    getSports() {
        const url = `${serverUrl}/sportsdir`;
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(({ data }) => {
            if (data) {
                this._isMounted && this.setState({ sports: data })
            }
        }).catch((err) => {
            this._isMounted && this.setState({ error: err });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getLeagues = (evt, name) => {
        evt.stopPropagation();
        this.setState({ leaguesData: { name, leagues: [] } });
        const url = `${serverUrl}/sportleague?name=${name}`;
        axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(({ data }) => {
            this.setState({ leaguesData: { name, leagues: data } });
        });

    }

    removeLeagues = (evt) => {
        evt.stopPropagation();
        this.setState({ leaguesData: null });
    }

    ellipsisTitle = (name) => {
        return (name.length > 15) ? name.substr(0, 10 - 1) + '...' : name;
    }

    render() {
        const { showNoEvents, showleagues, history } = this.props;
        const { sports, leaguesData } = this.state;
        if (!sports) {
            return null;
        }
        return (
            <ul className="left-cat top-cls-sport">
                {
                    sports.sort((a, b) => b.eventCount - a.eventCount).map(sport => {
                        const { name, eventCount } = sport;
                        const hasEvents = eventCount > 0;
                        return hasEvents || showNoEvents ? (
                            name == "Other" ?
                                (
                                    <li key={name}>
                                        <Link
                                            to={{ pathname: `/others` }}
                                            style={!hasEvents ? { opacity: 0.25, pointerEvents: 'none' } : null}
                                        >
                                            <img src={sportNameImage(name)} width="14" height="14" style={{ marginRight: '6px' }} />
                                            <span style={sportNameSpanStyle}>{this.ellipsisTitle(name)}</span>
                                            <span>{eventCount}</span>
                                        </Link>
                                    </li >
                                ) :
                                (
                                    showleagues ?
                                        <li key={name} className="sports-dropdown">
                                            <div
                                                onClick={() => { history.push(`/sport/${name}`) }}
                                                style={!hasEvents ? { opacity: 0.25, pointerEvents: 'none' } : null}
                                            >
                                                <img src={sportNameImage(name)} width="14" height="14" style={{ marginRight: '6px' }} />
                                                <span style={sportNameSpanStyle}>{this.ellipsisTitle(name)}</span>
                                                <span>{eventCount}</span>
                                                {(!leaguesData || leaguesData.name != name) && <span onClick={(evt) => this.getLeagues(evt, name)}>
                                                    <i style={{ borderLeft: '#72777f solid 1px' }} className="fas fa-chevron-down mr-0 pl-2"></i>
                                                </span>}
                                                {(leaguesData && leaguesData.name == name) && <span onClick={(evt) => this.removeLeagues(evt)}>
                                                    <i style={{ borderLeft: '#72777f solid 1px' }} className="fas fa-chevron-up mr-0 pl-2"></i>
                                                </span>}
                                            </div>
                                            {(leaguesData && leaguesData.name == name) && <ul className="top-cls-sport">
                                                {leaguesData.leagues.map(league => (
                                                    <li key={league.name} className="pl-5">
                                                        <Link
                                                            to={{ pathname: `/sport/${name}/league/${league.originId}` }}
                                                            style={!league.eventCount ? { opacity: 0.25, pointerEvents: 'none' } : null}
                                                        >
                                                            <span style={sportNameSpanStyle}>{this.ellipsisTitle(league.name)}</span>
                                                            <span>{league.eventCount}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li className="pl-5">
                                                    <Link
                                                        to={{ pathname: `/sport/${name}` }}
                                                    >
                                                        <span style={sportNameSpanStyle}>{this.ellipsisTitle('All Leagues')}</span>
                                                    </Link>
                                                </li>
                                            </ul>}
                                        </li>
                                        :
                                        <li key={name}>
                                            <Link
                                                to={{ pathname: `/sport/${name}` }}
                                                style={!hasEvents ? { opacity: 0.25, pointerEvents: 'none' } : null}
                                            >
                                                <img src={sportNameImage(name)} width="14" height="14" style={{ marginRight: '6px' }} />
                                                <span style={sportNameSpanStyle}>{this.ellipsisTitle(name)}</span>
                                                <span>{eventCount}</span>
                                            </Link>
                                        </li>
                                )
                        ) : null;
                    }
                    )
                }
            </ul >
        );
    }
}

export default withRouter(SportsList);
