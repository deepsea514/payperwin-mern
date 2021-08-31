/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";

class OverviewTotalDeposit extends React.Component {
    render() {
        const { className, totaldeposit, currency } = this.props;
        return (
            <div className={`card card-custom ${className} bg-primary`}>
                <div className="card-body d-flex flex-column text-left">
                    <span className="symbol symbol-80 symbol-light-primary mr-2">
                        <span className="symbol-label">
                            <span className="svg-icon svg-icon-xl svg-icon-primary">
                                <SVG
                                    src="/media/svg/icons/Communication/Group.svg"
                                ></SVG>
                            </span>
                        </span>
                    </span>
                    <h1 className="card-title font-weight-bolder text-white mt-5">
                        ${new Intl.NumberFormat().format(Number(totaldeposit).toFixed(2))}&nbsp;{currency}
                    </h1>
                    <h3 className="card-title font-weight-bolder text-white m-0">
                        Total Deposit
                    </h3>
                </div>
            </div>
        );
    }
}

export default OverviewTotalDeposit;