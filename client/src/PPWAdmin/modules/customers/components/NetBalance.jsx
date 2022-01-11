import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function NetBalance({ className, balance, currency }) {
    return (
        <div className={`card card-custom bg-success ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-white mb-0">
                    Net Balance (after credit)
                </h5>
                <h3 className="card-title font-weight-bolder text-white my-2">
                    ${numberFormat(Number(balance).toFixed(2))} {currency}
                </h3>
            </div>
        </div>
    );
}
