/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../_metronic/layout";
import numberFormat from "../../../../helpers/numberFormat";

export function WinLoss({ className, chartColor = "info", winloss }) {
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
            colorsThemeBaseColor: objectPath.get(
                uiService.config,
                `js.colors.theme.base.${chartColor}`
            ),
            colorsThemeLightColor: objectPath.get(
                uiService.config,
                `js.colors.theme.light.${chartColor}`
            ),
            fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
        };
    }, [uiService, chartColor]);

    useEffect(() => {
        const element = document.getElementById("lifetime_chart");

        if (!element) {
            return;
        }

        const options = getChartOption(layoutProps);
        const chart = new ApexCharts(element, options);
        chart.render();
        return function cleanUp() {
            chart.destroy();
        };
    }, [layoutProps]);

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
                    <div
                        id="lifetime_chart"
                        data-color={chartColor}
                        style={{ height: "60px", minHeight: "60px" }}
                    />
                </div>
            </div>
        </>
    );
}

function getChartOption(layoutProps) {
    const options = {
        series: [
            {
                name: "Profit",
                data: [35, 65, 75, 55, 45, 60, 55],
            },
            {
                name: "Revenue",
                data: [40, 70, 80, 60, 50, 65, 60],
            },
        ],
        chart: {
            type: "bar",
            height: "60px",
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: ["30%"],
                endingShape: "rounded",
            },
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 1,
            colors: ["transparent"],
        },
        xaxis: {
            categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: layoutProps.colorsGrayGray500,
                    fontSize: "12px",
                    fontFamily: layoutProps.fontFamily,
                },
            },
        },
        yaxis: {
            min: 0,
            max: 100,
            labels: {
                style: {
                    colors: layoutProps.colorsGrayGray500,
                    fontSize: "12px",
                    fontFamily: layoutProps.fontFamily,
                },
            },
        },
        fill: {
            type: ["solid", "solid"],
            opacity: [0.25, 1],
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
            marker: {
                show: false,
            },
        },
        colors: ["#ffffff", "#ffffff"],
        grid: {
            borderColor: layoutProps.colorsGrayGray200,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                left: 20,
                right: 20,
            },
        },
    };
    return options;
}
