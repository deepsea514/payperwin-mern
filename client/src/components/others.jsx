import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import { FormattedMessage } from 'react-intl';
import { getCustomEvent } from '../redux/services';

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

    render() {
        const { addBet, betSlip, removeBet, timezone } = this.props;
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
                        const { startDate, name, options } = event;

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
                                    {options.map((option, index) => {
                                        return (
                                            <div className="row mx-0 pt-2" key={index}>
                                                <div className="col-12">
                                                    <span className={`box-odds line-full ${false ? 'orange' : null}`}>
                                                        <div className="vertical-align">
                                                            <div className="points">{option}</div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
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
});

export default connect(mapStateToProps, frontend.actions)(Others)
