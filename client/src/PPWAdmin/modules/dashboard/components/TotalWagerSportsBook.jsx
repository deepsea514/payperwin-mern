
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../_metronic/layout";
import numberFormat from "../../../../helpers/numberFormat";

export function TotalWagerSportsBook({ className, categories, dashboardwagersportsbook }) {
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
            colorsThemeBasePrimary: objectPath.get(
                uiService.config,
                "js.colors.theme.base.primary"
            ),
            fontFamily: objectPath.get(uiService.config, "js.fontFamily")
        };
    }, [uiService]);

    const getChartOptions = (layoutProps) => {
        const strokeColor = "#7441da";

        const options = {
            series: [
                {
                    name: "Net Wager",
                    data: dashboardwagersportsbook.wagers
                }
            ],
            chart: {
                type: "area",
                height: 150,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                sparkline: {
                    enabled: true
                },
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 3,
                    color: strokeColor,
                    opacity: 0.5
                }
            },
            plotOptions: {},
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: "solid",
                opacity: 0
            },
            stroke: {
                curve: "smooth",
                show: true,
                width: 3,
                colors: [strokeColor]
            },
            xaxis: {
                categories,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    style: {
                        colors: layoutProps.colorsGrayGray500,
                        fontSize: "12px",
                        fontFamily: layoutProps.fontFamily
                    }
                },
                crosshairs: {
                    show: false,
                    position: "front",
                    stroke: {
                        color: layoutProps.colorsGrayGray300,
                        width: 1,
                        dashArray: 3
                    }
                }
            },
            yaxis: {
                min: 0,
                max: dashboardwagersportsbook.totalwager,
                labels: {
                    show: false,
                    style: {
                        colors: layoutProps.colorsGrayGray500,
                        fontSize: "12px",
                        fontFamily: layoutProps.fontFamily
                    }
                }
            },
            states: {
                normal: {
                    filter: {
                        type: "none",
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: "none",
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: "none",
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: "12px",
                    fontFamily: layoutProps.fontFamily
                },
                y: {
                    formatter: function (val) {
                        return "$" + val;
                    }
                },
                marker: {
                    show: false
                }
            },
            colors: ["transparent"],
            markers: {
                colors: layoutProps.colorsThemeBasePrimary,
                strokeColor: [strokeColor],
                strokeWidth: 3
            }
        };
        return options;
    }

    useEffect(() => {
        const element = document.getElementById("total_wager_sportsbook_chart");
        if (!element) {
            return;
        }

        const options = getChartOptions(layoutProps);

        const chart = new ApexCharts(element, options);
        chart.render();
        return function cleanUp() {
            chart.destroy();
        };
    }, [layoutProps, categories, dashboardwagersportsbook]);

    return (
        <div className={`card card-custom bg-gray-100 ${className}`}>
            {/* Header */}
            <div className="card-header border-0 bg-info py-5">
                <h3 className="card-title font-weight-bolder text-white">Total Wager(HIGH STAKER)</h3>
            </div>
            {/* Body */}
            <div className="card-body p-0 position-relative bg-info overflow-hidden pb-4">
                <h1 className="font-weight-bolder text-white bg-info p-0 m-0 pl-10"> ${numberFormat(dashboardwagersportsbook.totalwager.toFixed(2))}</h1>
                {/* Chart */}
                <div
                    id="total_wager_sportsbook_chart"
                    className="card-rounded-bottom bg-info"
                    style={{ height: "150px" }}
                ></div>
            </div>
        </div>
    );
}
