import React, { Component } from 'react';
import SVG from "react-inlinesvg";

class AutobetSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <div className={`card card-custom bg-white rounded-top`}>
                    {/* Header */}
                    <div className="card-header border-0 bg-primary py-3">
                        <h3 className="card-title font-weight-bolder text-white">Monthly Summary</h3>
                    </div>
                    {/* Body */}
                    <div className="card-body p-0 position-relative overflow-hidden">
                        {/* Chart */}
                        <div
                            className="card-rounded-bottom bg-primary text-center"
                            style={{ height: "140px" }}
                        >
                            <label className="font-weight-bolder text-white bg-primary">Your balance</label>
                            <h3 className="font-weight-bolder text-white bg-primary p-0 m-0"> $400.30</h3>
                        </div>

                        {/* Stat */}
                        <div className="px-3 py-5" style={{ marginTop: '-6rem' }}>
                            <div className="flex-grow-1 card card-custom px-2 bg-white">
                                <div className="d-flex align-items-center justify-content-between mb-10">
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
                                    <div className="d-flex align-items-center mr-2">
                                        <div>
                                            <a
                                                href="#"
                                                className="text-dark-75 text-hover-primary font-weight-bolder"
                                            >
                                                Bets
                                            </a>
                                            <br />
                                            <a href="#" className="text-muted font-weight-bold mt-1">
                                                258 bets
                                            </a>
                                        </div>
                                    </div>
                                    <a className="font-weight-bold text-dark-50 py-4 font-size-base">
                                        +105$
                                        <span className="svg-icon svg-icon-md svg-icon-success">
                                            <SVG src="/media/svg/icons/Navigation/Arrow-up.svg" />
                                        </span>
                                    </a>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-10">
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
                                    <div className="d-flex align-items-center mr-2">
                                        <div>
                                            <a
                                                href="#"
                                                className="text-dark-75 text-hover-primary font-weight-bolder"
                                            >
                                                Wins
                                            </a>
                                            <br />
                                            <a href="#" className="text-muted font-weight-bold mt-1">
                                                103 wins
                                            </a>
                                        </div>
                                    </div>
                                    <a className="font-weight-bold text-dark-50 py-4 font-size-base">
                                        +50$
                                        <span className="svg-icon svg-icon-md svg-icon-danger">
                                            <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                        </span>
                                    </a>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-10">
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
                                    <div className="d-flex align-items-center mr-2">
                                        <div>
                                            <a
                                                href="#"
                                                className="text-dark-75 text-hover-primary font-weight-bolder"
                                            >
                                                Loss
                                            </a>
                                            <br />
                                            <a href="#" className="text-muted font-weight-bold mt-1">
                                                103 losses
                                            </a>
                                        </div>
                                    </div>
                                    <a className="font-weight-bold text-dark-50 py-4 font-size-base">
                                        +50$
                                        <span className="svg-icon svg-icon-md svg-icon-danger">
                                            <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                        </span>
                                    </a>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-10">
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
                                    <div className="d-flex align-items-center mr-2">
                                        <div>
                                            <a
                                                href="#"
                                                className="text-dark-75 text-hover-primary font-weight-bolder"
                                            >
                                                P / L
                                            </a>
                                            <br />
                                            <a href="#" className="text-muted font-weight-bold mt-1">
                                                Profit and Loss
                                            </a>
                                        </div>
                                    </div>
                                    <a className="font-weight-bold text-dark-50 py-4 font-size-base">
                                        +50$
                                        <span className="svg-icon svg-icon-md svg-icon-danger">
                                            <SVG src="/media/svg/icons/Navigation/Arrow-down.svg" />
                                        </span>
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
            </>
        );
    }
}

export default AutobetSummary;