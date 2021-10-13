/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function Fees({ className, fees, currency }) {
    return (
        <div className={`card card-custom bg-warning ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-white mb-0">
                    Fees Paid
                </h5>
                <h3 className="card-title font-weight-bolder text-white my-2">
                    ${numberFormat(fees.toFixed(2))}&nbsp;{currency}
                </h3>
            </div>
        </div>
    );
}
