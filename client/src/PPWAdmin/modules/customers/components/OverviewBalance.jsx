/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

class OverviewBalance extends React.Component {
    render() {
        const { className, balance, currency } = this.props;
        return (
            <div className={`card card-custom bg-danger ${className}`}>
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title font-weight-bolder text-white">
                        Account Balance
                    </h3>
                </div>
                <div className="card-body d-flex flex-column p-0 text-left">
                    <h2 className="card-title font-weight-bolder text-white ml-10">
                        ${numberFormat(Number(balance).toFixed(2))} {currency}
                    </h2>
                </div>
            </div>
        );
    }
}

export default OverviewBalance;