/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

class OverviewBalance extends React.Component {
    render() {
        const { className, balance, currency } = this.props;
        return (
            <>
                <div
                    className={`card card-custom bg-danger ${className}`}
                >
                    {/* begin::Header */}
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title font-weight-bolder text-white">
                            Account Balance
                        </h3>
                    </div>
                    {/* end::Header */}

                    {/* begin::Body */}
                    <div className="card-body d-flex flex-column p-0 text-left">
                        <h1 className="card-title font-weight-bolder text-white ml-10">
                            ${new Intl.NumberFormat().format(Number(balance).toFixed(2))} {currency}
                        </h1>
                    </div>
                    {/* end::Body */}
                </div>
            </>
        );
    }
}

export default OverviewBalance;