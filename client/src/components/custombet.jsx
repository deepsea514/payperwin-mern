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
import { Link } from 'react-router-dom';

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
        this.getSport();
    }

    getSport() {
        const { id, history } = this.props;

        getCustomEvent(id)
            .then(({ data }) => {
                if (data) {
                    if (id && !(data && data[0])) {
                        history.push('/side-bet');
                        return;
                    }
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
        showErrorToast('Side Bets are only available on Pro Mode.');
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
                    showSuccessToast('Successfully joined Side bet.');
                } else {
                    showErrorToast(error);
                }
            }).catch(() => {
                showErrorToast('Cannot join, please try again later.');
            })
    }

    render() {
        const { betSlip, removeBet, timezone, user, showLoginModalAction } = this.props;
        const { data, error, shareModal, lineUrl, urlCopied, addHighStaker } = this.state;

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
                <div className="tab-content">
                    <div className='d-flex justify-content-end'>
                        {user && <Link className="form-button"
                            to="/side-bets/create"
                            onClick={() => this.setState({ createModal: true })}>
                            <i className="fas fa-plus-square" /> Create a Bet
                        </Link>}
                        {!user && <button className="form-button"
                            onClick={() => showLoginModalAction(true)}>
                            <i className="fas fa-plus-square" /> Create a Bet
                        </button>}
                    </div>
                    <p className='mt-3'>
                        Create and Invite friends to bet with or against you.
                        The bet creator is the High Staker of the bet.
                        You can set the maximum risk amount you’re willing to payout.
                        All custom bets are subject to approval by Payper Win prior to acceptance.
                        Click “Create Bet” to learn more.
                        <br />
                        <br />
                        Side bet examples.
                        <br />
                        “Will there be a fight within the first 10 minutes of the Montreal Canadiens vs Toronto Maple Leafs Hockey game?”
                    </p>

                    {error && <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>}
                    {!data && <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>}
                    {data && data.map((event, index) => {
                        if (!event) return null;
                        const { startDate, name, options, uniqueid, _id, user, allowAdditional } = event;

                        return (
                            <div key={index} className="mt-2">
                                <div className="line-type-header mb-0 d-flex justify-content-between">
                                    {name}
                                    <span className='pt-1 cursor-pointer' onClick={() => this.setState({
                                        shareModal: true,
                                        lineUrl: window.location.origin + '/side-bet/' + uniqueid,
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
                                    {allowAdditional ? <button className='mt-1 form-button'
                                        onClick={() => this.setState({ addHighStaker: _id })}>
                                        <i className='fas fa-plus' /> Join High Staker
                                    </button> : null}
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
                                                                league: 'Side Bet',
                                                                pick: index,
                                                                sportName: 'Side Bet',
                                                                lineId: uniqueid,
                                                                lineQuery: {
                                                                    sportName: 'Side Bet',
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
    user: state.frontend.user
});

export default connect(mapStateToProps, frontend.actions)(CustomBet)
