import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setMeta } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class Others extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            metaData: null
        };
    }

    componentDidMount() {
        const title = 'Betting on Custom Events';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
        this.getSport();
    }

    getSport() {
        const sportName = "Other";
        if (sportName) {
            const url = `${serverUrl}/others`;
            axios({
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(({ data }) => {
                if (data) {
                    this.setState({ data })
                }
            }).catch((err) => {
                console.log(err)
                this.setState({ error: err });
            });
        }
    }

    convertOdds = (odd) => {
        const { oddsFormat } = this.props;
        switch (oddsFormat) {
            case 'decimal':
                if (odd > 0)
                    return Number(1 + odd / 100).toFixed(2);
                return Number(1 - 100 / odd).toFixed(2);
            case 'american':
                if (odd > 0)
                    return '+' + odd;
                return odd;
            default:
                return odd;
        }
    }

    render() {
        const { addBet, betSlip, removeBet, timezone, search } = this.props;
        const { data, error, metaData } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        return (
            <div className="content mt-2 detailed-lines">
                {metaData && <DocumentMeta {...metaData} />}
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
                                            <span className={`box-odds box-moneyline line-full ${teamAExist ? 'orange' : null}`}
                                                onClick={teamAExist ?
                                                    () => removeBet(event._id, 'moneyline', 'home') :
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
                                                        "other"
                                                    )}>
                                                <div className="vertical-align">
                                                    <div className="points">{teamA.name}</div>
                                                    <div className="odds">
                                                        <div className="new-odds">
                                                            {this.convertOdds(teamA.currentOdds)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div className="col-md-6 com-sm-6 col-12">
                                            <span className={`box-odds box-moneyline line-full ${teamBExist ? 'orange' : null}`}
                                                onClick={teamBExist ?
                                                    () => removeBet(event._id, 'moneyline', 'away') :
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
                                                        "other"
                                                    )}>
                                                <div className="vertical-align">
                                                    <div className="points">{teamB.name}</div>
                                                    <div className="odds">
                                                        <div className="new-odds">
                                                            {this.convertOdds(teamB.currentOdds)}
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
