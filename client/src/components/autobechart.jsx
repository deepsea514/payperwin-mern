import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FormattedMessage, injectIntl } from 'react-intl';

class AutobetChart extends Component {
    render() {
        const { sports } = this.props;
        const series = sports ? sports.map(sport => sport.count) : [];
        const options = {
            chart: {
                width: '100%',
                type: 'pie',
            },
            labels: sports ? sports.map(sport => sport._id ? sport._id : 'Parlay Bets') : [],
            theme: {
                monochrome: {
                    enabled: true
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5
                    }
                }
            },
            dataLabels: {
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex]
                    return [name, val.toFixed(1) + '%']
                }
            },
            legend: {
                show: false
            }
        }

        return (
            <>
                <div className="card card-custom">
                    {/* Header */}
                    <div className="card-header align-items-center border-0 mt-4">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark"><FormattedMessage id="COMPONENTS.AUTOBET.BETSPERSPORTS" /></span>
                        </h3>
                    </div>
                    {/* Body */}
                    <div className="card-body pt-4">
                        <ReactApexChart options={options} series={series} type="pie" />
                    </div>
                </div>
            </>
        );
    }
}

export default injectIntl(AutobetChart);