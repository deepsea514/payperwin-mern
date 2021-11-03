import React, { Component } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import convertOdds from '../helpers/convertOdds';
import { FormattedMessage } from 'react-intl';
import _env from '../env.json';
const serverUrl = _env.appUrl;

class Others extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
        };
    }

    componentDidMount() {
        const title = 'Betting on Custom Events';
        setTitle({ pageTitle: title });
        this.getSport();
    }

    getSport() {
        const { id } = this.props;
        const url = `${serverUrl}/others`;
        axios.get(url, { params: { id } })
            .then(({ data }) => {
                if (data) {
                    this.setState({ data })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ error: err });
            });
    }

    render() {
        const { addBet, betSlip, removeBet, timezone, oddsFormat } = this.props;
        const { data, error } = this.state;
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (!data) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }

        return (
            <div className="content mt-2 detailed-lines">
                <div className="tab-content" >
                    {
                        data.map((event, index) => {
                            const { startDate, name, teamA, teamB } = event;
                            const teamAExist = betSlip.find((b) => b.lineId === event._id && b.pick === 'home' && b.type === 'moneyline');
                            const teamBExist = betSlip.find((b) => b.lineId === event._id && b.pick === 'away' && b.type === 'moneyline');

                            return (
                                <div key={index} className="mt-2">
                                    <div className="line-type-header mb-0">{name}</div>
                                    <div className="d-flex" style={{
                                        padding: "3px 0 4px 10px",
                                        background: "#F9F9F9",
                                        marginBottom: "3px"
                                    }}>
                                        <a style={{ fontSize: "12px", color: "#2b2b2c" }}>
                                            {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                        </a>
                                    </div>
                                    <div className="row mx-0 pt-2 bg-white">
                                        <div className="col-md-6 com-sm-6 col-12">
                                            <span className={`box-odds line-full ${teamAExist ? 'orange' : null}`}
                                                onClick={teamAExist ?
                                                    () => removeBet(event._id, 'moneyline', 'home', null, null) :
                                                    () => addBet(
                                                        name,
                                                        'moneyline',
                                                        'Other',
                                                        { home: teamA.currentOdds, away: teamB.currentOdds },
                                                        'home',
                                                        teamA.name,
                                                        teamB.name,
                                                        "Other",
                                                        event._id,
                                                        event.name,
                                                        teamA.name,
                                                        null,
                                                        "other",
                                                        null
                                                    )}>
                                                <div className="vertical-align">
                                                    <div className="points">{teamA.name}</div>
                                                    <div className="odds">
                                                        <div className="new-odds">
                                                            {convertOdds(teamA.currentOdds, oddsFormat)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div className="col-md-6 com-sm-6 col-12">
                                            <span className={`box-odds line-full ${teamBExist ? 'orange' : null}`}
                                                onClick={teamBExist ?
                                                    () => removeBet(event._id, 'moneyline', 'away', null, null) :
                                                    () => addBet(
                                                        name,
                                                        'moneyline',
                                                        'Other',
                                                        { home: teamA.currentOdds, away: teamB.currentOdds },
                                                        'away',
                                                        teamA.name,
                                                        teamB.name,
                                                        "Other",
                                                        event._id,
                                                        event.name,
                                                        teamB.name,
                                                        null,
                                                        "other",
                                                        null
                                                    )}>
                                                <div className="vertical-align">
                                                    <div className="points">{teamB.name}</div>
                                                    <div className="odds">
                                                        <div className="new-odds">
                                                            {convertOdds(teamB.currentOdds, oddsFormat)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    oddsFormat: state.frontend.oddsFormat,
    search: state.frontend.search,
    timezone: state.frontend.timezone,
});

export default connect(mapStateToProps, frontend.actions)(Others)
