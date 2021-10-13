import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function AverageBet({ className, averagebet, currency }) {
    return (
        <div className={`card border-info ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-info mb-0">
                    Average Bet Size
                </h5>
                <h3 className="card-title font-weight-bolder text-info my-2">
                    ${numberFormat(Number(averagebet).toFixed(2))} {currency}
                </h3>
            </div>
        </div>
    );
}
