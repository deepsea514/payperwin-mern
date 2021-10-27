import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import numberFormat from '../helpers/numberFormat';
import { FormattedMessage, injectIntl } from 'react-intl';

class AutobetSummary extends Component {
    balanceString = (balance) => {
        balance = parseInt(balance * 100);
        return balance / 100;
    }

    render() {
        const { user, summary, setDetail } = this.props;
        const { totalbets, winbets, lossbets, pendingbets, profit } = summary;

        return (
            <div className={`card card-custom bg-white rounded-top`}>
                {/* Header */}
                <div className="card-header border-0 bg-primary py-3">
                    <h3 className="card-title font-weight-bolder text-white"><FormattedMessage id="COMPONENTS.AUTOBET.SUMMARY" /></h3>
                </div>
                {/* Body */}
                <div className="card-body p-0 position-relative overflow-hidden">
                    {/* Chart */}
                    <div
                        className="card-rounded-bottom bg-primary text-center"
                        style={{ height: "140px" }}
                    >
                        <label className="font-weight-bolder text-white bg-primary"><FormattedMessage id="COMPONENTS.AUTOBET.YOURBALANCE" /></label>
                        <h3 className="font-weight-bolder text-white bg-primary p-0 m-0"> ${numberFormat(this.balanceString(user.balance))}</h3>
                    </div>

                    {/* Stat */}
                    <div className="px-3 py-5" style={{ marginTop: '-6rem' }}>
                        <div className="flex-grow-1 card card-custom px-2 bg-white">
                            <div className="d-flex align-items-center mb-10 cursor-pointer" onClick={() => setDetail('all')}>
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder"                                            >
                                            <FormattedMessage id="COMPONENTS.AUTOBET.BETS" />
                                        </a>
                                        <br />
                                        <a className="text-muted font-weight-bold mt-1">
                                            {totalbets.count} <FormattedMessage id="COMPONENTS.AUTOBET.BETS" />
                                        </a>
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat(totalbets.amount.toFixed(2))}
                                    <span className="svg-icon svg-icon-md svg-icon-success">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-up.svg" />
                                    </span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-10 cursor-pointer" onClick={() => setDetail('win')}>
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder">
                                            <FormattedMessage id="COMPONENTS.AUTOBET.WINS" />
                                        </a>
                                        <br />
                                        <a className="text-muted font-weight-bold mt-1">
                                            {winbets.count} <FormattedMessage id="COMPONENTS.AUTOBET.WINS" />
                                        </a>
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat(winbets.amount.toFixed(2))}
                                    <span className="svg-icon svg-icon-md svg-icon-success">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-up.svg" />
                                    </span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-10 cursor-pointer" onClick={() => setDetail('fee')}>
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder">
                                            <FormattedMessage id="COMPONENTS.AUTOBET.FEES" />
                                        </a>
                                        <br />
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat((winbets.fee ? winbets.fee : 0).toFixed(2))}
                                    <span className="svg-icon svg-icon-md svg-icon-success">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-up.svg" />
                                    </span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-10 cursor-pointer" onClick={() => setDetail('loss')}>
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder">
                                            <FormattedMessage id="COMPONENTS.AUTOBET.LOSS" />
                                        </a>
                                        <br />
                                        <a className="text-muted font-weight-bold mt-1">
                                            {lossbets.count} <FormattedMessage id="COMPONENTS.AUTOBET.LOSS" />
                                        </a>
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat(lossbets.amount.toFixed(2))}
                                    <span className="svg-icon svg-icon-md svg-icon-danger">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                    </span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-10 cursor-pointer" onClick={() => setDetail('pending')}>
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder">
                                            <FormattedMessage id="COMPONENTS.AUTOBET.INPLAY" />
                                        </a>
                                        <br />
                                        <a className="text-muted font-weight-bold mt-1">
                                            {pendingbets.count} <FormattedMessage id="COMPONENTS.AUTOBET.BETS" />
                                        </a>
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat(pendingbets.amount.toFixed(2))}
                                    <span className="svg-icon svg-icon-md svg-icon-danger">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                    </span>
                                </a>
                            </div>

                            <div className="d-flex mb-10">
                                <div className="symbol symbol-40 symbol-light-primary mr-1">
                                    <span className="symbol-label">
                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                            <SVG
                                                className="h-75 align-self-end"
                                                src="/media/svg/icons/Home/Library.svg"
                                            />
                                        </span>
                                    </span>
                                </div>
                                <div className="d-flex align-items-start mx-2">
                                    <div>
                                        <a className="text-dark-75 text-hover-primary font-weight-bolder">
                                            P/L
                                        </a>
                                        <br />
                                        <a className="text-muted font-weight-bold mt-1">
                                            <FormattedMessage id="COMPONENTS.AUTOBET.PL" />
                                        </a>
                                    </div>
                                </div>
                                <a className="ml-auto font-weight-bold text-dark-50 py-4 font-size-base">
                                    ${numberFormat(profit.toFixed(2))}
                                    {profit >= 0 && <span className="svg-icon svg-icon-md svg-icon-success">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-up.svg" />
                                    </span>}
                                    {profit < 0 && <span className="svg-icon svg-icon-md svg-icon-danger">
                                        <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                    </span>}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Resize */}
                    <div className="resize-triggers">
                        <div className="expand-trigger">
                            <div style={{ width: "411px", height: "461px" }} />
                        </div>
                        <div className="contract-trigger" />
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(AutobetSummary);