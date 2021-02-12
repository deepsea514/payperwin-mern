/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";

class OverviewTotalWager extends React.Component {
    render() {
        const { className, totalwagers, currency } = this.props;
        return (
            <div className={`card card-custom ${className} bg-success`}>
                <div className="card-body d-flex flex-column text-left">
                    <span className="symbol symbol-80 symbol-light-success mr-2">
                        <span className="symbol-label">
                            <span className="svg-icon svg-icon-xl svg-icon-success">
                                <SVG
                                    src="/media/svg/icons/Communication/Group.svg"
                                ></SVG>
                            </span>
                        </span>
                    </span>
                    <h1 className="card-title font-weight-bolder text-white mt-5">
                        ${totalwagers}&nbsp;{currency}
                    </h1>
                    <h3 className="card-title font-weight-bolder text-white m-0">
                        Total Wager
                    </h3>
                </div>
            </div>
        );
    }
}

export default OverviewTotalWager;