/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import numberFormat from "../../../../helpers/numberFormat";

class OverviewTotalDeposit extends React.Component {
    render() {
        const { className, totaldeposit, currency } = this.props;
        return (
            <div className={`card card-custom bg-primary ${className} h-auto`}>
                <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                    <h5 className="card-title font-weight-bolder text-white mb-0">
                        Total Deposit
                    </h5>
                    <h3 className="card-title font-weight-bolder text-white my-2">
                        ${numberFormat(totaldeposit.toFixed(2))}&nbsp;{currency}
                    </h3>
                </div>
            </div>
        );
    }
}

export default OverviewTotalDeposit;