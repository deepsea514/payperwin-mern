/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import SVG from "react-inlinesvg";
import { useHtmlClassService } from "../../../_metronic/layout";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import * as reports from "../../reports/redux/reducers";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuDashboard } from "./DropdownMenuDashboard";

function FeesCollected({
    className,
    symbolShape,
    baseColor,
    categories,
    dashboardfees,
    profits,
    loading,
    getProfitReports
}) {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            colorsGrayGray500: objectPath.get(
                uiService.config,
                "js.colors.gray.gray500"
            ),
            colorsGrayGray200: objectPath.get(
                uiService.config,
                "js.colors.gray.gray200"
            ),
            colorsGrayGray300: objectPath.get(
                uiService.config,
                "js.colors.gray.gray300"
            ),
            colorsThemeBaseSuccess: objectPath.get(
                uiService.config,
                `js.colors.theme.base.${baseColor}`
            ),
            colorsThemeLightSuccess: objectPath.get(
                uiService.config,
                `js.colors.theme.light.${baseColor}`
            ),
            fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
        };
    }, [uiService, baseColor]);

    const getChartOption = (layoutProps) => {
        const options = {
            series: [
                {
                    name: "Net Profit",
                    data: dashboardfees.fees,
                },
            ],
            chart: {
                type: "area",
                height: 150,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {},
            legend: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: "solid",
                opacity: 1,
            },
            stroke: {
                curve: "smooth",
                show: true,
                width: 3,
                colors: [layoutProps.colorsThemeBaseSuccess],
            },
            xaxis: {
                categories,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    style: {
                        colors: layoutProps.colorsGrayGray500,
                        fontSize: "12px",
                        fontFamily: layoutProps.fontFamily,
                    },
                },
                crosshairs: {
                    show: false,
                    position: "front",
                    stroke: {
                        color: layoutProps.colorsGrayGray300,
                        width: 1,
                        dashArray: 3,
                    },
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: "12px",
                        fontFamily: layoutProps.fontFamily,
                    },
                },
            },
            yaxis: {
                min: 0,
                max: dashboardfees.totalfees,
                labels: {
                    show: false,
                    style: {
                        colors: layoutProps.colorsGrayGray500,
                        fontSize: "12px",
                        fontFamily: layoutProps.fontFamily,
                    },
                },
            },
            states: {
                normal: {
                    filter: {
                        type: "none",
                        value: 0,
                    },
                },
                hover: {
                    filter: {
                        type: "none",
                        value: 0,
                    },
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: "none",
                        value: 0,
                    },
                },
            },
            tooltip: {
                style: {
                    fontSize: "12px",
                    fontFamily: layoutProps.fontFamily,
                },
                y: {
                    formatter: function (val) {
                        return "$" + val;
                    },
                },
            },
            colors: [layoutProps.colorsThemeLightSuccess],
            markers: {
                colors: [layoutProps.colorsThemeLightSuccess],
                strokeColor: [layoutProps.colorsThemeBaseSuccess],
                strokeWidth: 3,
            },
        };
        return options;
    }

    useEffect(() => {
        getProfitReports();
        const element = document.getElementById("fees_collected_chart");

        if (!element) {
            return;
        }

        const options = getChartOption(layoutProps);
        const chart = new ApexCharts(element, options);
        chart.render();
        return function cleanUp() {
            chart.destroy();
        };
    }, [layoutProps, categories, dashboardfees]);

    const tableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (profits.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No Records</h3>
                    </td>
                </tr>
            );
        }

        return profits.slice(0, 10).map((record, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{dateformat(new Date(record.updatedAt), "yyyy-mm-dd HH:MM")}</td>
                    <td>{record.user ? record.user.email : null}</td>
                    <td>{record.financialtype == 'betfee' ? 'Winning Bet Fee' : 'Withdrawal Fee'}</td>
                    <td>{record.uniqid}</td>
                    <td>CAD {Number(record.amount).toFixed(2)}</td>
                </tr>
            )
        })
    }

    return (
        <div className={`card card-custom ${className}`}>
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                        Fees Collected
                    </span>
                </h3>
                <div className="card-toolbar">
                    <Dropdown className="dropdown-inline" drop="down" alignRight>
                        <Dropdown.Toggle
                            id="dropdown-toggle-top2"
                            variant="transparent"
                            className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle">
                            Go to:
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                            <DropdownMenuDashboard />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
                    <span className={`symbol ${symbolShape} symbol-50 symbol-light-${baseColor} mr-2`}>
                        <span className="symbol-label">
                            <span className={`svg-icon svg-icon-xl svg-icon-${baseColor}`}>
                                <SVG src="/media/svg/icons/Layout/Layout-4-blocks.svg" />
                            </span>
                        </span>
                    </span>
                    <div className="d-flex flex-column text-right">
                        <span className="text-dark-75 font-weight-bolder font-size-h3">
                            + ${dashboardfees.totalfees}
                        </span>
                        <span className="text-muted font-weight-bold mt-2">
                            Fees Collected
                        </span>
                    </div>
                </div>
                <div
                    id="fees_collected_chart"
                    className="card-rounded-bottom"
                    style={{ height: "150px" }}
                ></div>
            </div>
            <div className="table-responsive p-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">User</th>
                            <th scope="col">Event</th>
                            <th scope="col">Transaction ID</th>
                            <th scope="col">Fee</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody()}
                    </tbody>
                </table>
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