import React, { Component } from 'react';
import Sport from './sport';
import Others from "./others";
import { FormattedMessage, injectIntl } from "react-intl";
import sportNameImage from "../helpers/sportNameImage";
import axios from "axios";
import _env from '../env.json';
const serverUrl = _env.appUrl;

const topLeagues = [
    {
        name: 'NFL',
        sportName: 'American_Football',
        leagueId: '10037219',
        imgsrc: '/images/sports/nfl.png',
    },
    {
        name: 'NBA',
        sportName: 'Basketball',
        leagueId: '10041830',
        imgsrc: '/images/sports/nba.png',
    },
    {
        name: 'MLB',
        sportName: 'Baseball',
        leagueId: '10037485',
        imgsrc: '/images/sports/mlb.png',
    },
    {
        name: 'NHL',
        sportName: 'Ice_Hockey',
        leagueId: '10037477',
        imgsrc: '/images/sports/nhl.png',
    }
]

export default class Highlights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sportIndex: null,
            leagueIndex: 0,
            sports: [],
            loading: false,
        };
        this._isMounted = false;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true });
        axios.get(`${serverUrl}/frontend/featured_sports`)
            .then(({ data }) => {
                this._isMounted && this.setState({
                    loading: false,
                    sports: data ? data.value.sports : []
                })
            })
            .catch(() => {
                this._isMounted && this.setState({ loading: false, sports: [] })
            })
    }

    render() {
        const { sportIndex, leagueIndex, sports, loading } = this.state;
        const { addBet, betSlip, removeBet } = this.props;
        const sportName = sportIndex == null ? topLeagues[leagueIndex].sportName : sports[sportIndex];
        return (
            <div className="highlights">
                {/* <div className="bet-slip-header"><FormattedMessage id="COMPONENTS.SPORT.SBETTING" /></div> */}
                <ul className="nav nav-tabs pt-2">
                    {topLeagues.map((league, i) => {
                        return (
                            <li className="nav-item"
                                onClick={() => this.setState({ leagueIndex: i, sportIndex: null })}
                                key={league.leagueId}>
                                <center>
                                    <div className={`sports-league-image-container ${leagueIndex == i ? 'active' : ''}`}>
                                        <img src={league.imgsrc}
                                            className='sports-league-image' />
                                    </div>
                                    <span className="nav-link">{league.name}</span>
                                </center>
                            </li>
                        )
                    })}
                    {sports.map((sport, i) => {
                        return (
                            <li className="nav-item"
                                onClick={() => this.setState({ sportIndex: i, leagueIndex: null })}
                                key={sport}>
                                <center>
                                    <div className={`sports-league-image-container ${sportIndex == i ? 'active' : ''}`}>
                                        <img src={sportNameImage(sport)}
                                            className='sports-league-image' />
                                    </div>
                                    <span className="nav-link">{sport}</span>
                                </center>
                            </li>
                        );
                    })}
                </ul>
                {loading && <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>}
                {sportName == "Other" ?
                    <Others
                        addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                    /> :
                    <Sport
                        addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                        sportName={sportName}
                        league={sportIndex == null ? topLeagues[leagueIndex].leagueId : null}
                        hideBreacrumb={true}
                    />}
            </div>
        );
    }
}
