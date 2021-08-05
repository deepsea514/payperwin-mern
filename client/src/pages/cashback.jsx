import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setMeta } from '../libs/documentTitleBuilder';
import DocumentMeta from 'react-document-meta';
import ReactApexChart from "react-apexcharts";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Tabs, Tab, } from 'react-bootstrap';
import dateformat from "dateformat";
import SVG from "react-inlinesvg";

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

export default class Cashback extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            metaData: null,
            loading: false,
            data: null,
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: '70%',
                            background: '#fff',
                            image: undefined,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            position: 'front',
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 0,
                                blur: 4,
                                opacity: 0.24
                            }
                        },
                        track: {
                            background: '#fff',
                            strokeWidth: '67%',
                            margin: 0, // margin is in pixels
                            dropShadow: {
                                enabled: true,
                                top: -3,
                                left: 0,
                                blur: 4,
                                opacity: 0.35
                            }
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                offsetY: -10,
                                show: false,
                                color: '#888',
                                fontSize: '25px'
                            },
                            value: {
                                formatter: function (val) {
                                    return parseInt(val) + '%';
                                },
                                color: '#111',
                                fontSize: '36px',
                                show: true,
                            }
                        },
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#ABE5A1'],
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    lineCap: 'round'
                },
                labels: [''],
            },


        };
    }

    componentDidMount() {
        const title = 'Cashback Program';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
        this.getCashBackHistory();
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if (!prevUser && user) {
            this.setState({ error: null });
            this.getCashBackHistory();
        }
    }

    getCashBackHistory() {
        this.setState({ loading: true });
        axios.get(`${serverUrl}/cashback`, { withCredentials: true })
            .then(({ data }) => {
                console.log(data);
                this.setState({ loading: false, data });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false, error });
            })
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getCashbackPercentage = (loss) => {
        if (loss >= 0 && loss < 500) {
            return '0.5%';
        } else if (loss >= 500 && loss < 3000) {
            return '1%';
        } else if (loss >= 3000 && loss < 7000) {
            return '2%';
        } else if (loss >= 7000) {
            return '3%';
        }
    }

    getCashbackAmount = (loss, totalLoss) => {
        let cashback = 0;
        if (totalLoss >= 0 && totalLoss < 500) {
            cashback = 0.5;
        } else if (totalLoss >= 500 && totalLoss < 3000) {
            cashback = 1;
        } else if (totalLoss >= 3000 && totalLoss < 7000) {
            cashback = 2;
        } else if (totalLoss >= 7000) {
            cashback = 3;
        }
        return (Number(loss) * cashback / 100).toFixed(2);
    }

    getCashbackPercentageForGraph = (loss) => {
        let max = 0;
        if (loss >= 0 && loss < 500) {
            max = 500;
        } else if (loss >= 500 && loss < 3000) {
            max = 3000;
        } else if (loss >= 3000 && loss < 7000) {
            max = 7000;
        } else if (loss >= 7000) {
            max = loss;
        } else {
            return;
        }
        return parseInt(loss / max * 100);
    }

    getCashbackLevel = (loss) => {
        if (loss >= 0 && loss < 500) {
            return 'Beginner';
        } else if (loss >= 500 && loss < 3000) {
            return 'Journalist';
        } else if (loss >= 3000 && loss < 7000) {
            return 'Fan';
        } else if (loss >= 7000) {
            return 'Enthusiast';
        }
    }

    render() {
        const { metaData, loading, error, chartOptions, data } = this.state;

        return (
            <div className="col-in px-3">
                {metaData && <DocumentMeta {...metaData} />}
                <h3>Cashback Program</h3>
                {loading && <center><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} />
                </center>}
                {error && <p>Error...</p>}
                {data && <div className="row">
                    <div className="col-md-5">
                        <ReactApexChart options={chartOptions} series={[this.getCashbackPercentageForGraph(data.lossThisMonth)]} type="radialBar" />
                        <center>{this.getCashbackLevel(data.lossThisMonth)}</center>
                        <table className="table" style={{ fontSize: '12px' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cashback</th>
                                    <th>Minumum</th>
                                    <th>Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>0.5%</td>
                                    <td>$0</td>
                                    <td>Beginner</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1.0%</td>
                                    <td>$500</td>
                                    <td>Journalist</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2.0%</td>
                                    <td>$3000</td>
                                    <td>Fan</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>3.0%</td>
                                    <td>$7000</td>
                                    <td>Enthusiast</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-7">
                        <div className="profile-tabs">
                            <Tabs defaultActiveKey="current">
                                <Tab eventKey="current" title={dateformat(new Date(), "mmmm yyyy") + ' Cashback'} className="profile-tabitem border-0">
                                    <div className="pt-2">
                                        {data.lossBetHistory.map((history, index) => (
                                            <div className="d-flex align-items-center mb-10" key={index}>
                                                <div className="symbol symbol-40 symbol-light-success mr-2">
                                                    <span className="symbol-label">
                                                        <SVG
                                                            className="h-75 align-self-end"
                                                            src={"media/svg/misc/coin-stack-2143.svg"}
                                                        ></SVG>
                                                    </span>
                                                </div>
                                                <div className="d-flex flex-column flex-grow-1 font-weight-bold" style={{ fontSize: '13px' }}>
                                                    <p className="text-danger mb-1 font-size-lg">Cashback Pending</p>
                                                    <span className="text-muted">{history.WagerInfo.EventName}</span>
                                                    <span className="text-muted">{history.WagerInfo.Sport} | {dateformat(history.WagerInfo.EventDateFm, "mediumDate")}</span>
                                                    <span className="text-muted">Earning ${this.getCashbackAmount(history.WagerInfo.ToRisk, data.lossThisMonth)}</span>
                                                </div>
                                                <span style={{ fontSize: '16px' }}>{this.getCashbackPercentage(data.lossThisMonth)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Tab>
                                <Tab eventKey="previous" title="Previous Cashback" className="profile-tabitem border-0">
                                    <div className="pt-2">
                                        {data.cashbackHistory.map((cashback, index) => (
                                            <div className="d-flex align-items-center mb-10" key={index}>
                                                <div className="symbol symbol-40 symbol-light-success mr-2">
                                                    <span className="symbol-label">
                                                        <SVG
                                                            className="h-75 align-self-end"
                                                            src={"media/svg/misc/coin-stack-2143.svg"}
                                                        ></SVG>
                                                    </span>
                                                </div>
                                                <div className="d-flex flex-column flex-grow-1 font-weight-bold" style={{ fontSize: '13px' }}>
                                                    <span className="text-success mb-1 font-size-lg">Cashback Bonus</span>
                                                    <span className="text-muted">{dateformat(cashback.createdAt, "mediumDate")}</span>
                                                    <span className="text-muted">Earned ${cashback.amount.toFixed(2)}</span>
                                                </div>
                                                <span style={{ fontSize: '16px' }}>{this.getCashbackPercentage(cashback.fee)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}