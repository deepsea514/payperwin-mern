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
        sportName: 'American Football',
        leagueId: '10037219',
    },
    {
        name: 'NBA',
        sportName: 'Basketball',
        leagueId: '10041830',
    },
    {
        name: 'MLB',
        sportName: 'Baseball',
        leagueId: '10037485',
    },
    {
        name: 'NHL',
        sportName: 'Ice Hockey',
        leagueId: '10037477',
    }
]

export default class Highlights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sportIndex: null,
            leagueIndex: null,
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

    getSportName = (sport) => {
        switch (sport) {
            case 'American Football':
                return 'Football';
            case 'Ice Hockey':
                return 'Hockey';
            default:
                return sport;
        }
    }

    render() {
        const { sportIndex, leagueIndex, sports, loading } = this.state;
        const { addBet, betSlip, removeBet } = this.props;
        const sportName = sportIndex == null ? (leagueIndex == null ? null : topLeagues[leagueIndex].sportName) : sports[sportIndex];
        return (
            <div className="highlights">
                {/* <div className="bet-slip-header"><FormattedMessage id="COMPONENTS.SPORT.SBETTING" /></div> */}
                <div className='mobile p-3'>
                    <p className='promotion-header'>PAYPER Win is a social sportsbetting platform. Risk less, win more!</p>
                    <div className='d-flex justify-content-center p-3'>
                        <div className='promotion-botton'><span>Promotions</span></div>
                        {/* <div className='promotion-botton'><span>Favorites</span></div> */}
                    </div>
                </div>
                <ul className="nav nav-tabs pt-2">
                    <li className="nav-item"
                        onClick={() => this.setState({ leagueIndex: null, sportIndex: null })}>
                        <center>
                            <div className={`sports-league-image-container ${leagueIndex == null && sportIndex == null ? 'active' : ''}`}>
                                <img src='/images/sports/book.png' className='sports-league-image' />
                            </div>
                            <span className="nav-link">All</span>
                        </center>
                    </li>
                    {topLeagues.map((league, i) => {
                        return (
                            <li className="nav-item"
                                onClick={() => this.setState({ leagueIndex: i, sportIndex: null })}
                                key={league.leagueId}>
                                <center>
                                    <div className={`sports-league-image-container ${leagueIndex == i ? 'active' : ''}`}>
                                        <img src={sportNameImage(league.sportName, league.name)}
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
                                    <span className="nav-link">{this.getSportName(sport)}</span>
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
                        league={sportIndex == null && leagueIndex != null ? topLeagues[leagueIndex].leagueId : null}
                        hideBreacrumb={true}
                    />}
            </div>
        );
    }
}
