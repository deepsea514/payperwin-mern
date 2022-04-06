import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import SBModal from './sbmodal';
import SportsBreadcrumb from './sportsbreadcrumb';
import { FormattedMessage } from 'react-intl';
import { getLiveSports, getSports } from '../redux/services';
import BasicModal from './basicmodal';
import RenderLeagues from './sportLines/renderLeagues';
import RenderLiveEvents from './sportLines/renderLiveEvents';

Date.prototype.addDates = function (d) {
    this.setTime(this.getTime() + (d * 24 * 60 * 60 * 1000));
    return this;
}

class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: null,
            liveData: null,
            error: null,
            sportsbookInfo: null,
            timer: null,
            liveTimer: null,
            dateSelected: 0,
            selectedLeague: null,
            showHelp: null,
            dateList: [],
        };
    }

    componentDidMount() {
        const { shortName, pro_mode } = this.props;
        this.getSport();
        pro_mode && shortName && this.getLiveSport();
        this.setState({
            timer: setInterval(() => this.getSport(false), 60 * 1000),
            liveTimer: pro_mode && shortName ? setInterval(this.getLiveSport, 10 * 1000) : null,
        })
    }

    componentWillUnmount() {
        const { timer, liveTimer } = this.state;
        if (timer) clearInterval(timer);
        if (liveTimer) clearInterval(liveTimer);
    }

    async componentDidUpdate(prevProps) {
        const { shortName, league, pro_mode } = this.props;
        const { liveTimer } = this.state;

        const { shortName: prevShortName, league: prevLeague } = prevProps;
        const sportChanged = (shortName !== prevShortName || league !== prevLeague);
        if (sportChanged) {
            await this.setState({ error: null, liveTimer: null, liveData: null, dateSelected: 0 });
            this.getSport();
            clearInterval(liveTimer);
            if (pro_mode && shortName) {
                this.getLiveSport();
                this.setState({ liveTimer: setInterval(this.getLiveSport, 10 * 1000) })
            }
        }
    }

    getLiveSport = () => {
        const { shortName, league } = this.props;
        getLiveSports(shortName, league)
            .then(({ data }) => {
                if (data) {
                    this.setState({ liveData: data });
                } else {
                    this.setState({ liveData: null })
                }
            })
            .catch((err) => {
            })
    }

    getSport = (setLoading = true) => {
        const { shortName, league, team } = this.props;
        if (setLoading) {
            this.setState({ loading: true });
        }
        getSports(shortName, league)
            .then(({ data }) => {
                if (data) {
                    if (data) {
                        const { leagues } = data;
                        const selectedLeague = leagues.find(_league => _league.originId == league);
                        let dateList = [];

                        const filteredLeagues = leagues.map(league => {
                            let events = league.events.map((event) => {
                                const { teamA, teamB, startDate, lines } = event;
                                const matchDate = new Date(startDate);
                                if (!lines || !lines.length || new Date().getTime() > matchDate.getTime()) {
                                    return null;
                                }
                                if (team && teamA != team && teamB != team) {
                                    return null;
                                }
                                const { moneyline, spreads, totals, originId: lineId } = lines[0];
                                if (!moneyline && !spreads && !totals) {
                                    return null;
                                }

                                const year = matchDate.getFullYear();
                                const month = matchDate.getMonth();
                                const day = matchDate.getDate();
                                const newDate = new Date(year, month, day);

                                let today = new Date();
                                const thisYear = today.getFullYear();
                                const thisMonth = today.getMonth();
                                const thisDate = today.getDate();
                                today = new Date(thisYear, thisMonth, thisDate)

                                if (newDate.getTime() >= today.getTime()) {
                                    const existing = dateList.find(savedDate => savedDate.getTime() == newDate.getTime())
                                    !existing && dateList.push(newDate)
                                }

                                return event;
                            }).filter(event => event);
                            if (events.length > 0) {
                                return { ...league, events }
                            }
                            return null;
                        }).filter(league => league);

                        dateList = dateList.sort((a, b) => a.getTime() - b.getTime()).slice(0, 6);
                        this.collapseLeague(filteredLeagues, dateList);

                        this.setState({
                            selectedLeague: selectedLeague ? {
                                name: selectedLeague.name,
                                originId: selectedLeague.originId
                            } : null,
                            data: { ...data, leagues: filteredLeagues },
                            loading: false,
                            dateList: dateList
                        });
                    } else {
                        this.setState({ data: null, loading: false });
                    }
                } else {
                    this.setState({ data: null, loading: false })
                }
            }).catch((err) => {
                this.setState({ error: err, loading: false });
            });
    }

    collapseLeague = (leagues, dateList) => {
        const { shortName, setCollapsedLeagues } = this.props;
        const { dateSelected } = this.state;
        const minDate = dateList.length && dateList[dateSelected] ? dateList[dateSelected].getTime() : 0;
        const maxDate = dateList.length && dateList[dateSelected] ? minDate + 86400000 : Infinity;
        if (!shortName) {
            const leagueIds = leagues
                .map(league => {
                    let events = league.events.map((event) => {
                        const { startDate } = event;

                        const matchDate = new Date(startDate).getTime();
                        if (matchDate >= maxDate || matchDate < minDate) {
                            return null;
                        }
                        return event;
                    }).filter(event => event);
                    if (events.length > 0) {
                        return { ...league, events }
                    }
                    return null;
                })
                .filter(league => league)
                .slice(8)
                .map(league => league.originId);
            setCollapsedLeagues(leagueIds);
        } else {
            setCollapsedLeagues([]);
        }
    }

    addBet = (bet) => {
        const { addBet, pro_mode } = this.props;
        const { type, odds, originOdds, pick, subtype } = bet;
        if (pro_mode == false || checkOddsAvailable(originOdds, odds, pick, type, subtype)) {
            return addBet(bet);
        }
        this.setState({ sportsbookInfo: bet });
    }

    addSportsbookBet = () => {
        const { sportsbookInfo } = this.state;
        const { addBet } = this.props;
        addBet({ ...sportsbookInfo, odds: sportsbookInfo.originOdds, sportsbook: true });
        this.setState({ sportsbookInfo: null });
    }

    onChangeDate = (date) => {
        const { data, dateList } = this.state;
        this.setState({ dateSelected: date }, () => this.collapseLeague(data.leagues, dateList));
    }

    render() {
        const {
            betSlip, removeBet, timezone, oddsFormat, team, shortName,
            hideBreacrumb, user, getUser, pro_mode,
            collapsedLeague, toggleCollapseLeague,
        } = this.props;
        const {
            loading, data, error, sportsbookInfo, liveData, dateSelected,
            selectedLeague, showHelp, dateList
        } = this.state;
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (loading) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }

        if (!data) {
            return (
                <div className="content">
                    <h3 className='no-games'>There are no games for the selected league. Please choose all or select a different league.</h3>
                </div>
            )
        }
        const { leagues, origin } = data;
        return (
            <div>
                {!hideBreacrumb && <SportsBreadcrumb shortName={shortName}
                    league={selectedLeague ? {
                        name: selectedLeague.name,
                        leagueId: selectedLeague.originId
                    } : null} user={user} getUser={getUser} team={team} active='matchup' />}
                {sportsbookInfo && <SBModal
                    sportsbookInfo={sportsbookInfo}
                    onClose={() => this.setState({ sportsbookInfo: null })}
                    onAccept={this.addSportsbookBet}
                />}
                {showHelp && <BasicModal showHelp={showHelp} onClose={() => this.setState({ showHelp: null })} />}
                {liveData && pro_mode && <RenderLiveEvents liveData={liveData}
                    origin={origin}
                    timezone={timezone} />}

                <RenderLeagues leagues={leagues}
                    collapsedLeague={collapsedLeague}
                    toggleCollapseLeague={toggleCollapseLeague}
                    pro_mode={pro_mode}
                    betSlip={betSlip}
                    timezone={timezone}
                    dateSelected={dateSelected}
                    onChangeDate={this.onChangeDate}
                    dateList={dateList}
                    oddsFormat={oddsFormat}
                    addBet={this.addBet}
                    removeBet={removeBet}
                    origin={origin}
                    showHelpAction={(type) => this.setState({ showHelp: type })} />
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    timezone: state.frontend.timezone,
    pro_mode: state.frontend.pro_mode,
    collapsedLeague: state.frontend.collapsedLeague,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(Sport))
