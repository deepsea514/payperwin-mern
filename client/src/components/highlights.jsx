import React, { Component, createRef } from 'react';
import Sport from './sport';
import sportNameImage from "../helpers/sportNameImage";
import { getFeaturedSports } from '../redux/services';
import { connect } from 'react-redux';
import * as frontend from "../redux/reducer";
import { getShortSportName } from '../libs/getSportName';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import CustomBet from "./custombet";

const topLeagues = [
    // {
    //     name: 'NFL',
    //     sportName: 'American Football',
    //     leagueId: '10037219',
    // },
    {
        name: 'NBA',
        sportName: 'Basketball',
        leagueId: '10041830',
    },
    {
        name: 'NCAAB',
        sportName: 'Basketball',
        leagueId: '10042997',
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
    },
    {
        name: 'UFC',
        sportName: 'Boxing/MMA',
        leagueId: '10036983',
    },
]

class Highlights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sportIndex: null,
            leagueIndex: null,
            sports: [],
            loading: false,
            showLeft: false,
            showRight: true,
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
        setTimeout(this.autoViewPopup, 3000);
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

    autoViewPopup = () => {
        const { user, toggleField } = this.props;
        if (!user) {
            toggleField('showViewModeModal')
        }
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

    onScroll = () => {
        const position = this.listRef.current?.scrollLeft;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        this.setState({
            showRight: position < scrollWidth - offsetWidth,
            showLeft: position != 0
        })
    }

    scrollLeft = () => {
        const position = this.listRef.current?.scrollLeft - 200;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        const newPos = position > 0 ? position : 0;
        this.listRef.current?.scrollTo({ left: newPos, behavior: 'smooth' })
        this.setState({
            showRight: offsetWidth < scrollWidth,
            showLeft: newPos != 0
        })
    }

    scrollRight = () => {
        const position = this.listRef.current?.scrollLeft + 200;
        const offsetWidth = this.listRef.current?.offsetWidth;
        const scrollWidth = this.listRef.current?.scrollWidth;
        const scrollLimit = scrollWidth - offsetWidth;
        const newPos = position > scrollLimit ? scrollLimit : position;

        this.listRef.current?.scrollTo({ left: position, behavior: 'smooth' })
        this.setState({
            showLeft: newPos != 0,
            showRight: newPos < scrollLimit
        });
    }

    render() {
        const { sportIndex, leagueIndex, sports, showLeft, showRight } = this.state;
        const { addBet, betSlip, removeBet, showPromotionAction, toggleField, pro_mode } = this.props;
        const sportName = sportIndex == null ? (leagueIndex == null ? null : topLeagues[leagueIndex].sportName) : sports[sportIndex];
        const shortName = getShortSportName(sportName);

        return (
            <div className="highlights">

                {/* <div className="bet-slip-header"><FormattedMessage id="COMPONENTS.SPORT.SBETTING" /></div> */}
                <div className='mobile p-3'>
                    <p className='promotion-header'><FormattedMessage id="COMPONENTS.HIGHLIGHT_1" /><br /> <FormattedMessage id="COMPONENTS.HIGHLIGHT_2" /></p>
                    <div className='p-2 d-flex justify-content-between'>
                        <div className='promotion-botton-wrap' onClick={() => showPromotionAction(true)}>
                            <div className='promotion-botton'><span><FormattedMessage id="COMPONENTS.WHATSNEW" /></span></div>
                        </div>
                        <div className='promotion-botton-wrap view-wrapper' onClick={() => toggleField('showViewModeModal')}>
                            <div className='promotion-botton'><span>{pro_mode ? 'Pro' : 'Basic'} View&nbsp;&nbsp;&nbsp;<i className='far fa-chevron-down' /></span></div>
                        </div>
                    </div>
                    <div className='p-2 d-flex justify-content-between'>
                        <div className='promotion-botton-wrap view-wrapper' onClick={() => toggleField('showPrizeModal', true)}>
                            <div className='promotion-botton'><span><FormattedMessage id="COMPONENTS.SPIN_WHEEL" /></span></div>
                        </div>
                        <Link className='promotion-botton-wrap' to="/invite">
                            <div className='promotion-botton'><span><FormattedMessage id="COMPONENTS.REFER_FRIEND_WIN" /></span></div>
                        </Link>
                    </div>
                </div>
                <div className='sportslist-container'>
                    <ul className="nav nav-tabs pt-2" ref={this.listRef} onScroll={this.onScroll}>
                        {showLeft && <li className="d-flex align-items-center sports-scroller sports-scroller-left"
                            onClick={this.scrollLeft}>
                            <span className='sports-scroller-icon'>
                                <i className='fas fa-arrow-left' />
                            </span>
                        </li>}
                        <li className="nav-item"
                            onClick={() => this.setState({ leagueIndex: null, sportIndex: null })}>
                            <center>
                                <div className={`sports-league-image-container ${leagueIndex == null && sportIndex == null ? 'active' : ''}`}>
                                    <img src='/images/sports/all.png' className='sports-league-image' />
                                </div>
                                <span className={`nav-link ${leagueIndex == null && sportIndex == null ? 'active' : ''}`}>All</span>
                            </center>
                        </li>
                        <li className="nav-item"
                            onClick={() => this.setState({ sportIndex: 'custom', leagueIndex: null })}>
                            <center>
                                <div className={`sports-league-image-container ${sportIndex == 'custom' ? 'active' : ''}`}>
                                    <img src={sportNameImage('Side Bet')}
                                        className='sports-league-image' />
                                </div>
                                <span className={`nav-link ${sportIndex == 'custom' ? 'active' : ''}`}>Side Bet</span>
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
                        {showRight && <li className="d-flex align-items-center sports-scroller sports-scroller-right"
                            onClick={this.scrollRight}>
                            <span className='sports-scroller-icon'>
                                <i className='fas fa-arrow-right' />
                            </span>
                        </li>}
                    </ul>
                </div>
                {sportIndex == 'custom' ? (
                    <CustomBet addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                    />
                ) : (
                    <Sport
                        addBet={addBet}
                        betSlip={betSlip}
                        removeBet={removeBet}
                        shortName={shortName}
                        league={sportIndex == null && leagueIndex != null ? topLeagues[leagueIndex].leagueId : null}
                        hideBreacrumb={true}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    pro_mode: state.frontend.pro_mode,
    user: state.frontend.user,
});

export default connect(mapStateToProps, frontend.actions)(Highlights);