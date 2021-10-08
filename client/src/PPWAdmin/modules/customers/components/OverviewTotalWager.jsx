/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import numberFormat from "../../../../helpers/numberFormat";

class OverviewTotalWager extends React.Component {
    render() {
        const { className, totalwagers, currency } = this.props;
        return (
            <div className={`card card-custom bg-success ${className}`}>
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title font-weight-bolder text-white">
                        Total Wager
                    </h3>
                    <div className="card-toolbar">
                    </div>
                </div>
                <div className="card-body d-flex flex-column p-0 text-left">
                    <h2 className="card-title font-weight-bolder text-white ml-10">
                        ${numberFormat(totalwagers.toFixed(2))}&nbsp;{currency}
                    </h2>
                </div>
            </div>
        );
    }
}

export default OverviewTotalWager;