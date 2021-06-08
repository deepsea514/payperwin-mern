import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";


const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Others extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Sports' });
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
        const { data, error } = this.state;
        if (error) {
            return <div>Error</div>;
        }
        if (!data) {
            return <div>Loading...</div>;
        }

        return (
            <div className="content mt-2 detailed-lines">
                <div className="tab-content" >
                    {
                        data.map((event, index) => {
                            const { startDate, name, candidates } = event;
                            let odds = {};
                            candidates.forEach((candidate) => {
                                odds[candidate.name] = candidate.currentOdds;
                            });
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
                                    <ul style={{ background: "white", paddingTop: "15px" }}>
                                        {candidates.map((candidate, index) => {
                                            const exist = betSlip.find((b) => b.lineId === event._id && b.pick === candidate.name && b.type === 'moneyline');
                                            return (
                                                <li key={index}>
                                                    <div className="row mx-0">
                                                        <div className="col-md-12 com-sm-12 col-12">
                                                            <span className={`box-odds box-moneyline line-full ${exist ? 'orange' : null}`}
                                                                onClick={exist ?
                                                                    () => removeBet(event._id, candidate.name) :
                                                                    () => addBet(
                                                                        name,
                                                                        'moneyline',
                                                                        'Other',
                                                                        odds,
                                                                        candidate.name,
                                                                        null,
                                                                        null,
                                                                        "Other",
                                                                        event._id,
                                                                        event.name,
                                                                        candidate.name,
                                                                        null,
                                                                        "other"
                                                                    )}>
                                                                <div className="vertical-align">
                                                                    <div className="points">{candidate.name}</div>
                                                                    <div className="odds">
                                                                        <div className="new-odds">
                                                                            {this.convertOdds(candidate.currentOdds)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
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
