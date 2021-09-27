import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import timeHelper from "../helpers/timehelper";
import LineDetail from "../components/linedetail.jsx";
import Line from "../components/line.jsx";
import checkOddsAvailable from '../helpers/checkOddsAvailable';
import MetaTags from "react-meta-tags";
import QRCode from "react-qr-code";
import _env from '../env.json';
const serverUrl = _env.appUrl;

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
            showModal: false,
            shareModal: false,
            currentUrl: currentUrl,
            urlCopied: false,
            timer: null,
            type: type,
            subtype: subtype,
            index: index,
            ogTitle: '',
            ogDescription: '',
            showAll: false,
        };
    }

    componentDidMount() {
        const { type, index } = this.state;
        const title = 'Betting on Detailed Sports line';
        if (!type || !index) {
            setTitle({ pageTitle: title })
        } else {
            setTitle({ pageTitle: title });
        }
        this.getSportLine();
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
        const { sportName } = this.props;
        const { sportName: prevSportName } = prevProps;
        const sportChanged = sportName !== prevSportName;
        if (sportChanged) {
            this.setState({ error: null });
            this.getSportLine();
        }
    }

    getSportLine() {
        const { match: { params: { sportName, leagueId, eventId } } } = this.props;
        if (sportName) {
            axios.get(`${serverUrl}/sport`, { params: { name: sportName, leagueId: leagueId, eventId } })
                .then(({ data }) => {
                    const { timer } = this.state;
                    if (timer) clearInterval(timer);
                    if (data) {
                        this.setState({
                            data: data,
                            timer: setInterval(() => {
                                const { data } = this.state;
                                const { startDate } = data;
                                if ((new Date(startDate)).getTime() > (new Date()).getTime()) {
                                    this.setState({
                                        data: { ...data, started: false }
                                    });
                                } else {
                                    this.setState({
                                        data: { ...data, started: true }
                                    });
                                }
                            }, 1 * 60 * 1000),
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                    this.setState({ error: err });
                });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    addBet = (name, type, league, odds, originOdds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin, subtype) => {
        const { data: { started } } = this.state;
        if (started) return;
        if (checkOddsAvailable(originOdds, odds, pick, type)) {
            return this.props.addBet(name, type, league, odds, pick, home, away, sportName, lineId, lineQuery, pickName, index, origin, subtype);
        }
        this.setState({ showModal: true });
    }

    render() {
        const { match, betSlip, removeBet, timezone, oddsFormat } = this.props;
        const { sportName, leagueId, eventId } = match.params;
        const { data, error, showModal, shareModal, currentUrl, urlCopied,
            type, subtype, index, ogTitle, ogDescription, showAll
        } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        const { teamA, teamB, startDate, leagueName, lines, origin, started } = data;
        return (
            <div className="content detailed-lines mb-5">
                {ogTitle && <MetaTags>
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={ogTitle} />
                    <meta property="og:description" content={ogDescription} />
                </MetaTags>}
                {showModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b>BET ON SPORTSBOOK</b>
                            <hr />
                            <p>
                                Peer-to-Peer betting is unavailable for this particular bet, please bet with the Sportsbook.
                            </p>
                            <div className="text-right">
                                {/* <Link className="form-button" to="/sportsbook"> Bet on Sportsbook </Link> */}
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> Cancel </button>
                            </div>
                        </div>
                    </div>
                </div>}
                {shareModal && <div className="modal confirmation">
                    <div className="background-closer bg-modal" onClick={() => this.setState({ shareModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                        <div>
                            <b>Share This Link</b>
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
                <center>
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
                </center>
                <br />
                <ul>
                    {lines ? lines.map((line, i) => {
                        const { spreads, originId: lineId, moneyline, totals,
                            first_half, second_half, first_quarter, second_quarter, third_quarter, forth_quarter } = line;
                        if (i > 0 && !spreads && !moneyline && !totals) {
                            return null;
                        }

                        let lines = [
                            { line: { moneyline, totals, spreads }, subtype: null },
                            { line: first_half, subtype: "first_half" },
                            { line: second_half, subtype: "second_half" },
                            { line: first_quarter, subtype: "first_quarter" },
                            { line: second_quarter, subtype: "second_quarter" },
                            { line: third_quarter, subtype: "third_quarter" },
                            { line: forth_quarter, subtype: "forth_quarter" },
                        ]
                        return lines.slice(0, showAll ? lines.length : 1)
                            .map((line, idx) =>
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
                                        sportName={sportName}
                                        leagueId={leagueId}
                                        oddsFormat={oddsFormat}
                                    />
                                </React.Fragment>
                            );
                    }) : null}
                </ul>

                {!showAll && <div className="d-flex flex-wr justify-content-center mt-3">
                    <div className="show-allmarkets-button" onClick={() => this.setState({ showAll: true })}>
                        Show All markets&nbsp;&nbsp;<i className="fas fa-caret-down" />
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
