import React from "react";
import numberFormat from "../../../../helpers/numberFormat";

export function BetsPerDay({ className, betsperday, currency }) {
    return (
        <div className={`card border-primary ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-primary mb-0">
                    Frequency Bets Per Day
                </h5>
                <h3 className="card-title font-weight-bolder text-primary my-2">
                    {numberFormat(Number(betsperday).toFixed(2))} Bets
                </h3>
            </div>
        </div>
    );
}
