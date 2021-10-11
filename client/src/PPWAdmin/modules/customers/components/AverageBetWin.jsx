import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function AverageBetWin({ className, averagebetwin, currency }) {
    return (
        <div className={`card border-success ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-success mb-0">
                    Average Bet Win
                </h5>
                <h3 className="card-title font-weight-bolder text-success my-2">
                    ${numberFormat(Number(averagebetwin).toFixed(2))} {currency}
                </h3>
            </div>
        </div>
    );
}
