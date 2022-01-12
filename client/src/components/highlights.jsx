import React, { Component, createRef } from 'react';
import Sport from './sport';
import Others from "./others";
import { FormattedMessage, injectIntl } from "react-intl";
import sportNameImage from "../helpers/sportNameImage";
import PromotionModal from './promotionModal';
import { getFeaturedSports } from '../redux/services';

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
    // {
    //     name: 'MLB',
    //     sportName: 'Baseball',
    //     leagueId: '10037485',
    // },
    {
        name: 'NHL',
        sportName: 'Ice Hockey',
        leagueId: '10037477',
    },
    {
        name: 'UFC',
        sportName: 'Boxing-UFC',
        leagueId: '10036983',
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
            showPromotion: false,
        };
        this._isMounted = false;
        this.listRef = createRef();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true });
        getFeaturedSports()
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

    scrollLeft = () => {
        const position = this.listRef.current?.scrollLeft - 200;
        this.listRef.current?.scrollTo({ left: position > 0 ? position : 0, behavior: 'smooth' })
    }

    scrollRight = () => {
        const position = this.listRef.current?.scrollLeft + 200;
        this.listRef.current?.scrollTo({ left: position, behavior: 'smooth' })
    }

    render() {
        const { sportIndex, leagueIndex, sports, showPromotion } = this.state;
        const { addBet, betSlip, removeBet } = this.props;
        const sportName = sportIndex == null ? (leagueIndex == null ? null : topLeagues[leagueIndex].sportName) : sports[sportIndex];
        return (
            <div className="highlights">
                {showPromotion && <PromotionModal closePromotion={() => this.setState({ showPromotion: false })} />}
                {/* <div className="bet-slip-header"><FormattedMessage id="COMPONENTS.SPORT.SBETTING" /></div> */}
                <div className='mobile p-3'>
                    <p className='promotion-header'>Peer-to-Peer Betting Exchange.<br /> Risk less Win more!</p>
                    <div className='p-3'>
                        <div className='promotion-botton-wrap' onClick={() => this.setState({ showPromotion: true })}>
                            <div className='promotion-botton'><span>What's New</span></div>
                        </div>
                    </div>
                </div>
                <ul className="nav nav-tabs pt-2" ref={this.listRef}>
                    <li className="d-flex align-items-center sports-scroller sports-scroller-left" onClick={this.scrollLeft}>
                        <span className='sports-scroller-icon'>
                            <i className='fas fa-arrow-left' />
                        </span>
                    </li>
                    <li className="nav-item"
                        onClick={() => this.setState({ leagueIndex: null, sportIndex: null })}>
                        <center>
                            <div className={`sports-league-image-container ${leagueIndex == null && sportIndex == null ? 'active' : ''}`}>
                                <img src='/images/sports/all.png' className='sports-league-image' />
                            </div>
                            <span className={`nav-link ${leagueIndex == null && sportIndex == null ? 'active' : ''}`}>All</span>
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
                                    <span className={`nav-link ${leagueIndex == i ? 'active' : ''}`}>{league.name}</span>
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
                                    <span className={`nav-link ${sportIndex == i ? 'active' : ''}`}>{this.getSportName(sport)}</span>
                                </center>
                            </li>
                        );
                    })}
                    <li className="d-flex align-items-center sports-scroller sports-scroller-right" onClick={this.scrollRight}>
                        <span className='sports-scroller-icon'>
                            <i className='fas fa-arrow-right' />
                        </span>
                    </li>
                </ul>
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
