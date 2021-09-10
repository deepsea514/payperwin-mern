/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../_metronic/layout";
import numberFormat from "../../../../helpers/numberFormat";

export function WinLoss({ className, winloss }) {

    return (
        <>
            <div
                className={`card card-custom bg-info ${className}`}
            >
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title font-weight-bolder text-white">
                        Win/Loss
                    </h3>
                    <div className="card-toolbar">
                    </div>
                </div>

                <div className="card-body d-flex flex-column p-0 text-left">
                    <h2 className="card-title font-weight-bolder text-white ml-10">
                        {winloss >= 0 ? ('+ $' + numberFormat(winloss.toFixed(2))) : ('- $' + numberFormat(-winloss.toFixed(2)))} CAD
                    </h2>
                </div>
            </div>
        </>
    );
}
