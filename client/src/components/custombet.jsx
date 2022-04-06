import React, { Component } from 'react';
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import timeHelper from "../helpers/timehelper";
import { FormattedMessage } from 'react-intl';
import { getCustomEvent, joinHighStaker } from '../redux/services';
import { showErrorToast, showSuccessToast } from '../libs/toast';
import QRCode from "react-qr-code";
import CustomBetJoinModal from './CustomBetJoinModal';
import { Link } from 'react-router-dom';
import sportNameImage from '../helpers/sportNameImage';
import { Tooltip } from '@material-ui/core';
import { convertOddsFromAmerican, convertOddsToAmerican } from '../helpers/convertOdds';

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
        const { betSlip, removeBet, timezone, user, showLoginModalAction, oddsFormat } = this.props;
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
                    <div className='my-5 text-white'>
                        Create and Share with friends to bet with or against you publicly or privately.
                        The Bet Creator <Tooltip arrow
                            title={<p className='text-white mb-0 p-1'>The user that creates the bet</p>}>
                            <i className='fas fa-question-circle' />
                        </Tooltip> is the High Staker. <Tooltip arrow
                            title={<p className='text-white mb-0 p-1'>Players put up a stake and are betting against the High Staker. When the players lose, the High Staker takes their stake.</p>}>
                            <i className='fas fa-question-circle' />
                        </Tooltip>&nbsp;
                        Set the maximum risk amount you're willing to payout if you lose.
                        All Side Bets are subject to approval by Payper Win.
                        <br />
                        <br />
                        Custom bet examples.
                        <br />
                        <ul style={{ listStyle: 'inside' }}>
                            <li>“Will there be a fight within the first 10 minutes of the Montreal Canadiens vs Toronto Maple Leafs Hockey game?”</li>
                            <li>“Which of the bridesmaid will catch the bouquet?”</li>
                            <li>“Will bitcoin pump or dump tomorrow?”</li>
                        </ul>
                    </div>

                    {error && <div><FormattedMessage id="PAGES.LINE.ERROR" /></div>}
                    {!data && <div><FormattedMessage id="PAGES.LINE.LOADING" /></div>}
                    {data && data.map((event, index) => {
                        if (!event) return null;
                        const { startDate, name, options, uniqueid, _id, allowAdditional, maximumRisk, betAmount, odds_type } = event;

                        return (
                            <div key={index} className="mt-2">
                                <div className='prop-bet-container'>
                                    <div className="line-type-header d-flex justify-content-between">
                                        <span>
                                            <img src={sportNameImage('Side Bet')}
                                                style={{ marginRight: '6px', width: '14px', height: '14px' }} />
                                            Side Bets -&nbsp;
                                            {name}
                                        </span>
                                        <span className='pt-1 cursor-pointer' onClick={() => this.setState({
                                            shareModal: true,
                                            lineUrl: window.location.origin + '/side-bet/' + uniqueid,
                                            urlCopied: false
                                        })}>
                                            <i className='fas fa-link' /> Share
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center" style={{
                                    padding: "3px 0 4px 15px",
                                    background: "#171717",
                                    marginBottom: "3px"
                                }}>
                                    <div style={{ fontSize: "11px", color: "#FFF" }}>
                                        {timeHelper.convertTimeEventDate(new Date(startDate), timezone)}
                                    </div>
                                    {allowAdditional ?
                                        <span>
                                            <span className='text-white mr-2'>Max Bet: ${(maximumRisk - betAmount).toFixed(2)}</span>
                                            <button className='mt-1 join-highstaker-button'
                                                onClick={() => this.setState({ addHighStaker: _id })}>
                                                <i className='fas fa-plus' /> Back Bet
                                            </button>
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
                                                                league: 'Side Bet',
                                                                pick: index,
                                                                odds: options.map(option => convertOddsToAmerican(option.odds, odds_type)),
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
                                                                pickName: `Pick: ${option.value}`,
                                                                index: null,
                                                                origin: 'custom',
                                                                subtype: null,
                                                            })}>
                                                        <div className="vertical-align">
                                                            <div className="points">{option.value}</div>
                                                            <div className="odds">
                                                                <div className="new-odds">
                                                                    {convertOddsFromAmerican(convertOddsToAmerican(option.odds, odds_type), oddsFormat)}
                                                                </div>
                                                            </div>
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
    user: state.frontend.user,
    oddsFormat: state.frontend.oddsFormat,
});

export default connect(mapStateToProps, frontend.actions)(CustomBet)
