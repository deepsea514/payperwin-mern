import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function AverageBetAfter2Loss({ className, averagebetafter2loss, currency }) {
    return (
        <div className={`card border-dark ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-black mb-0">
                    Avg. Bet (2 Losses)
                </h5>
                <h3 className="card-title font-weight-bolder text-black my-2">
                    ${numberFormat(Number(averagebetafter2loss).toFixed(2))} {currency}
                </h3>
            </div>
        </div>
    );
}
