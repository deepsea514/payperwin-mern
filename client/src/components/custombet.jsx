import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import { FormattedMessage } from 'react-intl';
import { getCustomEvent, joinHighStaker } from '../redux/services';
import { showErrorToast, showSuccessToast } from '../libs/toast';
import QRCode from "react-qr-code";
import CustomBetJoinModal from './CustomBetJoinModal';

class CustomBet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            shareModal: false,
            urlCopied: false,
            addHighStaker: null
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

    copyUrl = () => {
        const { lineUrl } = this.state;
        navigator.clipboard.writeText(lineUrl);
        this.setState({ urlCopied: true });
    }

    joinHighStaker = (amount) => {
        const { addHighStaker } = this.state;
        joinHighStaker(addHighStaker, amount)
            .then(({ data }) => {
                const { success, error } = data;
                if (success) {
                    showSuccessToast('Successfully joined custom bet.');
                } else {
                    showErrorToast(error);
                }
            }).catch(() => {
                showErrorToast('Cannot join, please try again later.');
            })
    }

    render() {
        const { betSlip, removeBet, timezone } = this.props;
        const { data, error, shareModal, lineUrl, urlCopied, addHighStaker } = this.state;
        if (error) {
            return <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>;
        }
        if (!data) {
            return <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>;
        }

        return (
            <div className="content mt-2 detailed-lines">
                {shareModal && <div className="modal confirmation">
                    <div className="background-closer" onClick={() => this.setState({ shareModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ shareModal: false })} />
                        <div>
                            <b>Share Bet</b>
                            <hr />
                            <div className="row">
                                <div className="col input-group mb-3">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Line's URL"
                                        value={lineUrl}
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
                                    <QRCode value={lineUrl} />
                                </div>
                            </center>
                            <div className="text-right">
                                <button className="form-button ml-2" onClick={() => this.setState({ shareModal: false })}> Close </button>
                            </div>
                        </div>
                    </div>
                </div>}
                {addHighStaker && <CustomBetJoinModal
                    onProceed={this.joinHighStaker}
                    onClose={() => this.setState({ addHighStaker: null })} />}
                <div className="tab-content" >
                    {data.map((event, index) => {
                        const { startDate, name, options, uniqueid, _id, user, allowAdditional } = event;

                        return (
                            <div key={index} className="mt-2">
                                <div className="line-type-header mb-0 d-flex justify-content-between">
                                    {name} {user.firstname && 'by ' + user.firstname + ' ' + user.lastname}
                                    <span className='pt-1 cursor-pointer' onClick={() => this.setState({
                                        shareModal: true,
                                        lineUrl: window.location.origin + '/custom-bet/' + uniqueid,
                                        urlCopied: false
                                    })}>
                                        <i className='fas fa-link' /> Share
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center" style={{
                                    padding: "3px 0 4px 15px",
                                    background: "#171717",
                                    marginBottom: "3px"
                                }}>
                                    <div style={{ fontSize: "11px", color: "#FFF" }}>
                                        {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                    </div>
                                    {allowAdditional ? <span className='pt-1 cursor-pointer text-white pr-4'
                                        onClick={() => this.setState({ addHighStaker: _id })}>
                                        <i className='fas fa-plus' /> Join High Staker
                                    </span> : null}
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
