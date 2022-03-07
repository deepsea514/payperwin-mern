import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import { FormattedMessage } from 'react-intl';
import { getCustomEvent } from '../redux/services';
import { showErrorToast } from '../libs/toast';

class CustomBet extends Component {
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

        getCustomEvent(id)
            .then(({ data }) => {
                if (data) {
                    this.setState({ data })
                }
            })
            .catch((err) => {
                this.setState({ error: err });
            });
    }

    addBet = (betObj) => {
        const { addBet, pro_mode } = this.props;
        if (pro_mode) {
            return addBet(betObj);
        }
        showErrorToast('Custom Bets are only available on Pro Mode.');
    }

    render() {
        const { betSlip, removeBet, timezone } = this.props;
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
                    {data.map((event, index) => {
                        const { startDate, name, options, uniqueid, _id } = event;

                        return (
                            <div key={index} className="mt-2">
                                <div className="line-type-header mb-0">{name}</div>
                                <div className="d-flex" style={{
                                    padding: "3px 0 4px 10px",
                                    background: "#171717",
                                    marginBottom: "3px"
                                }}>
                                    <div style={{ fontSize: "11px", color: "#FFF" }}>
                                        {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                    </div>
                                </div>
                                <div>
                                    <div className="row mx-0 pt-2">
                                        {options.map((option, index) => {
                                            const exists = betSlip.find(bet => bet.lineId == uniqueid && bet.origin == 'custom' && bet.pick == index);
                                            return (
                                                <div className="col-12" key={index}>
                                                    <span className={`box-odds line-full ${exists ? 'orange' : null}`}
                                                        onClick={exists ? () => removeBet(uniqueid, 'moneyline', index, null, null) :
                                                            () => this.addBet({
                                                                name: name,
                                                                type: 'moneyline',
                                                                league: 'Custom Events',
                                                                pick: index,
                                                                sportName: 'Custom Bet',
                                                                lineId: uniqueid,
                                                                lineQuery: {
                                                                    sportName: 'Custom Bet',
                                                                    eventName: name,
                                                                    leagueId: uniqueid,
                                                                    eventId: _id,
                                                                    lineId: uniqueid,
                                                                    type: 'moneyline',
                                                                    subtype: null,
                                                                    index: null,
                                                                    options: options
                                                                },
                                                                pickName: `Pick: ${option}`,
                                                                index: null,
                                                                origin: 'custom',
                                                                subtype: null,
                                                            })}>
                                                        <div className="vertical-align">
                                                            <div className="points">{option}</div>
                                                        </div>
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.frontend.lang,
    search: state.frontend.search,
    timezone: state.frontend.timezone,
    pro_mode: state.frontend.pro_mode,
});

export default connect(mapStateToProps, frontend.actions)(CustomBet)
