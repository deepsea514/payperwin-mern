import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";
import Line from "../components/line.jsx";
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import QRCode from "react-qr-code";
import SBModal from '../components/sbmodal';
import { FormattedMessage } from 'react-intl';
import LinesBreadcrumb from '../components/linesbreadcrumb';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getSportsLine } from '../redux/services';

class Lines extends Component {
    constructor(props) {
        super(props);
        const { href, search } = window.location;
        const currentUrl = href;
        const params = new URLSearchParams(search);
        const type = params.get('type');
        const subtype = params.get('subtype');
        const index = params.get('index');
        this.state = {
            data: null,
            error: null,
            sportsbookInfo: null,
            shareModal: false,
            currentUrl: currentUrl,
            urlCopied: false,
            timer: null,
            type: type,
            subtype: subtype,
            index: index,
            showAll: type != null || subtype != null || index != null || true,
            loading: false,
        };
    }

    componentDidMount() {
        const { type, index } = this.state;
        const { live } = this.props;
        const title = 'Betting on Detailed Sports line';
        setTitle({ pageTitle: title })
        this.getSportLine();
        this.setState({
            timer: setInterval(this.getSportLine.bind(this), live ? 10000 : 10 * 60 * 1000)
        })
    }

    componentWillUnmount() {
        const { timer } = this.state;
        if (timer) clearInterval(timer);
    }

    copyUrl = () => {
        const { currentUrl } = this.state;
        navigator.clipboard.writeText(currentUrl);
        this.setState({ urlCopied: true });
    }

    componentDidUpdate(prevProps) {
        const { shortName } = this.props;
        const { shortName: prevShortName } = prevProps;
        const sportChanged = shortName !== prevShortName;
        if (sportChanged) {
            this.setState({ error: null });
            this.getSportLine();
        }
    }

    getSportLine() {
        this.setState({ loading: true });
        const { match: { params: { shortName, leagueId, eventId } }, live } = this.props;
        if (shortName) {
            getSportsLine(live, shortName, leagueId, eventId)
                .then(({ data }) => {
                    if (data) { this.setState({ data: data, loading: false, }) }
                    else {
                        this.setState({ error: 'Line found', loading: false, });
                    }
                }).catch((err) => {
                    this.setState({ error: err, loading: false, });
                });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addBet = (bet) => {
        const { data: { started } } = this.state;
        const { addBet } = this.props;
        const { type, odds, originOdds, pick, subtype } = bet;
        if (started) return;
        if (checkOddsAvailable(originOdds, odds, pick, type, subtype)) {
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

    render() {
        const { match, betSlip, removeBet, timezone, oddsFormat, user, getUser, live } = this.props;
        const { shortName, leagueId } = match.params;
        const { data, error, sportsbookInfo, shareModal, currentUrl, urlCopied,
            type, subtype, index, showAll, loading
        } = this.state;
        if (loading && !data) {
            return <center className="mt-5">
                <Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} />
            </center>;
        }
        if (error || !data) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }

        const { teamA, teamB, startDate, lines, leagueName, timer } = data;

        return (
            <div className="content detailed-lines mb-5">
                <LinesBreadcrumb shortName={shortName}
                    league={{ name: leagueName, leagueId: leagueId }}
                    teams={{ teamA, teamB }}
                    time={timeHelper.convertTimeLineDate(new Date(startDate), timezone)}
                    user={user}
                    getUser={getUser}
                />
                {sportsbookInfo && <SBModal
                    sportsbookInfo={sportsbookInfo}
                    onClose={() => this.setState({ sportsbookInfo: null })}
                    onAccept={this.addSportsbookBet}
                />}
                {shareModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ shareModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                        <div>
                            <b><FormattedMessage id="PAGES.LINES.SHARE" /></b>
                            <hr />
                            <div className="row">
                                <div className="col input-group mb-3">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Current Url"
                                        value={currentUrl}
                                        readOnly
                                    />
                                    <div className="input-group-append">
                                        {!urlCopied && <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={this.copyUrl}
                                        >
                                            <i className="fas fa-clipboard" /> Copy
                                        </button>}
                                        {urlCopied && <button
                                            className="btn btn-outline-success"
                                            type="button">
                                            <i className="fas fa-clipboard-check" /> Copied
                                        </button>}
                                    </div>
                                </div>
                            </div>
                            <center>
                                <div className="mt-2 bg-white py-3">
                                    <QRCode value={currentUrl} />
                                </div>
                            </center>
                            <div className="text-right">
                                <button className="form-button ml-2" onClick={() => this.setState({ shareModal: false })}> Close </button>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* <center>
                    <div className="line-name">
                        {timeHelper.convertTimeLineDate(new Date(startDate), timezone)}
                        <div className="float-right">
                            <button className="form-button ml-2"
                                onClick={() => this.setState({ shareModal: true, urlCopied: false })}>
                                <i className="fas fa-link" /> Share
                            </button>
                        </div>
                    </div>
                    <strong className="line-name">{teamA} VS {teamB}</strong>
                </center> */}
                <br />
                <ul>
                    {lines && lines.map((line, i) => {
                        const {
                            spreads, moneyline, totals, alternative_spreads, alternative_totals,
                            first_half, second_half, fifth_innings,
                            home_totals, away_totals,
                            first_quarter, second_quarter,
                            third_quarter, forth_quarter
                        } = line;
                        if (i > 0 && !spreads && !moneyline && !totals) {
                            return null;
                        }

                        let lines = [
                            { line: { moneyline, totals, spreads, alternative_spreads, alternative_totals, home_totals, away_totals }, subtype: null, enabled: (!live || false) },
                            { line: first_half, subtype: "first_half", enabled: (!live || false) },
                            { line: second_half, subtype: "second_half", enabled: (!live || timer && timer.q && timer.q < "2") },
                            { line: first_quarter, subtype: "first_quarter", enabled: (!live || false) },
                            { line: second_quarter, subtype: "second_quarter", enabled: (!live || timer && timer.q && timer.q < "2") },
                            { line: third_quarter, subtype: "third_quarter", enabled: (!live || timer && timer.q && timer.q < "3") },
                            { line: forth_quarter, subtype: "forth_quarter", enabled: (!live || timer && timer.q && timer.q < "4") },
                            { line: fifth_innings, subtype: "fifth_innings", enabled: (!live || false) }
                        ]
                        return lines.slice(0, showAll ? lines.length : 1)
                            .map((line, idx) => {
                                return (line.enabled &&
                                    <React.Fragment key={idx}>
                                        {idx != 0 && line.line && <hr />}
                                        <Line
                                            type={type}
                                            subtype={subtype}
                                            index={index}
                                            event={data}
                                            line={line}
                                            betSlip={betSlip}
                                            removeBet={removeBet}
                                            addBet={this.addBet}
                                            shortName={shortName}
                                            leagueId={leagueId}
                                            oddsFormat={oddsFormat}
                                            live={live}
                                        />
                                    </React.Fragment>
                                )
                            });
                    })}
                </ul>

                {!showAll && <div className="d-flex flex-wr justify-content-center mt-3">
                    <div className="show-allmarkets-button" onClick={() => this.setState({ showAll: true })}>
                        <FormattedMessage id="COMPONENTS.LINES.SHOWALLMARKET" />&nbsp;&nbsp;<i className="fas fa-caret-down" />
                    </div>
                </div>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(withRouter(Lines))
