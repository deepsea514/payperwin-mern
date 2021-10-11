/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../_metronic/layout";
import numberFormat from "../../../../helpers/numberFormat";

export function WinLoss({ className, winloss }) {
    return (
        <div className={`card card-custom bg-success ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-white mb-0">
                    Win/Loss
                </h5>
                <h3 className="card-title font-weight-bolder text-white my-2">
                    {winloss >= 0 ? ('+ $' + numberFormat(winloss.toFixed(2))) : ('- $' + numberFormat(-winloss.toFixed(2)))} CAD
                </h3>
            </div>
        </div>
    );
}
