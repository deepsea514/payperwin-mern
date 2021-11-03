/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import SVG from "react-inlinesvg";
import { useHtmlClassService } from "../../../_metronic/layout";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as reports from "../../reports/redux/reducers";
import { connect } from "react-redux";

function FeesCollected({
    className,
    dashboardfees,
}) {
    return (
        <div className={`card card-custom ${className} bg-danger`}>
            <div className="card-body p-0">
                <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
                    <span className={`symbol symbol-50 symbol-light-danger mr-2`}>
                        <span className="symbol-label">
                            <span className={`svg-icon svg-icon-xl svg-icon-danger`}>
                                <SVG src="/media/svg/icons/Layout/Layout-4-blocks.svg" />
                            </span>
                        </span>
                    </span>
                    <div className="d-flex flex-column">
                        <span className="text-white font-weight-bolder font-size-h2">
                            + ${dashboardfees.totalfees}
                        </span>
                        <span className="text-white font-weight-bold mt-2 font-size-h3">
                            Fees Collected
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    profits: state.reports.profits,
    loading: state.reports.loading_profits,
    total: state.reports.total_profits,
    currentPage: state.reports.currentPage_profits,
    filter: state.reports.filter_profits,
});

export default connect(mapStateToProps, reports.actions)(FeesCollected)