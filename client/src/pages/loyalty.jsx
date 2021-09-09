import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import ReactApexChart from "react-apexcharts";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Tabs, Tab, ProgressBar } from 'react-bootstrap';
import dateformat from "dateformat";
import SVG from "react-inlinesvg";

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

export default class Loyalty extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            data: null,
            selectedLevel: 'Beginner'
        };
    }

    componentDidMount() {
        const { user } = this.props;
        const title = 'Loyalty Program';
        setTitle({ pageTitle: title });
        if (user) {
            this.getLoyaltyPoints();
        }
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if (!prevUser && user) {
            this.setState({ error: null });
            this.getLoyaltyPoints();
        }
    }

    getLoyaltyPoints = () => {
        this.setState({ loading: true });
        this.setState({ loading: false, data: { loyalty: 1000 } });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getLevel = () => {
        return 'Beginner';
    }

    render() {
        const { loading, error, data } = this.state;
        const level = this.getLevel();

        return (
            <div className="col-in px-3">
                <h3 className="mb-5">Loyalty Program</h3>
                {loading && <center><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} />
                </center>}
                {error && <p>Error...</p>}
                {data && <div className="row">
                    <div className="col-md-5">
                        <div className="card shadow p-2">
                            <div className="d-flex align-items-center justify-content-center bg-light-info p-2 rounded">
                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                    <div className="symbol-label bg-light-info"
                                        style={{ backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`, }}
                                    ></div>
                                </div>
                                <div>
                                    <div className="text-gray font-size-sm">Your Level</div>
                                    <div className="font-weight-bolder font-size-h5 text-dark-75">{level}</div>
                                </div>
                            </div>
                            <div className="loyalty-levels mt-3">
                                <img className="shadow-sm cursor-pointer active" title="Beginner" alt="Beginner"
                                    src="/images/loyalty/loyalty-beginner-small.png" />
                                <img className="shadow-sm cursor-pointer opacity-50" title="Fan" alt="Fan"
                                    src="/images/loyalty/loyalty-fan-small.png" />
                                <img className="shadow-sm cursor-pointer opacity-50" title="Master" alt="Master"
                                    src="/images/loyalty/loyalty-master-small.png" />
                                <img className="shadow-sm cursor-pointer opacity-50" title="Legend" alt="Legend"
                                    src="/images/loyalty/loyalty-legend-small.png" />
                                <img className="shadow-sm cursor-pointer opacity-50" title="Expert" alt="Expert"
                                    src="/images/loyalty/loyalty-expert-small.png" />
                                <img className="shadow-sm cursor-pointer opacity-50" title="Pro" alt="Pro"
                                    src="/images/loyalty/loyalty-expert-small.png" />
                            </div>

                            <img src="/images/loyalty/loyalty-beginner-big.png" className="rounded mx-auto d-block" />
                            <div className="d-flex justify-content-center p-2">
                                <div className="border-right border-dark pr-2 text-right">
                                    <div className="font-weight-bolder font-size-h5 text-dark-75">0 / 5</div>
                                    <div className="text-muted font-size-sm">Loyalty Points</div>
                                </div>
                                <div className="pl-2">
                                    <div className="font-weight-bolder font-size-h5 text-dark-75">Beginner</div>
                                    <div className="text-muted font-size-sm">Level 1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card shadow p-2">
                            <div className="profile-tabs">
                                <Tabs defaultActiveKey="progress">
                                    <Tab eventKey="progress" title="Milestone Progress" className="profile-tabitem border-0">
                                        <div className="pt-2">
                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Beginner</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-fan-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Fan</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-master-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Master</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-legend-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Legend</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-expert-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Expert</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/loyalty-expert-small.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Pro</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-light-info">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-light-info"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/loyalty-beginner-small.png)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="p-2 align-self-center">
                                                    <div className="font-weight-bolder font-size-md">Milestone 1</div>
                                                </div>
                                                <div className="p-2 align-self-center w-50">
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>Locked</div>
                                                    <ProgressBar now={60} visuallyHidden style={{ height: '5px' }} />
                                                    <div className="text-gray" style={{ fontSize: '12px' }}>2,000 points needed</div>
                                                </div>
                                            </div>

                                        </div>

                                    </Tab>
                                    <Tab eventKey="claimed" title="Claimed Milestones" className="profile-tabitem border-0">
                                        <div className="pt-2">

                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}
