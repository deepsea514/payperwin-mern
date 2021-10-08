/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import numberFormat from "../../../../helpers/numberFormat";

class OverviewTotalWager extends React.Component {
    render() {
        const { className, totalwagers, currency } = this.props;
        return (
            <div className={`card card-custom bg-success ${className} h-auto`}>
                <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                    <h5 className="card-title font-weight-bolder text-white mb-0">
                        Total Wager
                    </h5>
                    <h3 className="card-title font-weight-bolder text-white my-2">
                        ${numberFormat(totalwagers.toFixed(2))}&nbsp;{currency}
                    </h3>
                </div>
            </div>
        );
    }
}

export default OverviewTotalWager;