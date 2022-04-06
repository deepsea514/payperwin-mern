import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import ReactApexChart from "react-apexcharts";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { getLoyaltyPoints } from '../redux/services';
import dateformat from "dateformat";
import SVG from "react-inlinesvg";

export default class Loyalty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            data: null,
            selectedLevel: 'Junior',
            selectedLevelSpending: 3000,
            loyalty: 0,
            level: 'Junior'
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
        const { user } = this.props;
        this.setState({ loading: true });
        this.setState({ loading: false, data: { loyalty: 1000 } });
        getLoyaltyPoints()
            .then(({ data }) => {
                this.setState({ loyalty: data.loyalty });
                this.setLevel(data.loyalty)
            })
            .catch(() => { })
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    setLevel = (loyalty) => {
        if (loyalty <= 3000) {
            this.setState({ level: 'Junior', selectedLevel: 'Junior', selectedLevelSpending: 3000});
            return;
        }
        if (loyalty <= 12500) {
            this.setState({ level: 'Agent', selectedLevel: 'Agent', selectedLevelSpending: 12500});
            return;
        }
        if (loyalty <= 25000) {
            this.setState({ level: 'Rookie', selectedLevel: 'Rookie', selectedLevelSpending: 25000});
            return;
        }
        if (loyalty <= 62500) {
            this.setState({ level: 'Pro', selectedLevel: 'Pro', selectedLevelSpending: 62500});
            return;
        }
        this.setState({ level: 'AllStar', selectedLevel: 'AllStar', selectedLevelSpending: 125000});
    }

    render() {
        const { loading, error, data, selectedLevel, selectedLevelSpending, loyalty, level } = this.state;

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
                        <div className="shadow p-2">
                            <div className="d-flex align-items-center justify-content-center bg-dark p-2 rounded">
                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                    {level == 'Junior' && <div className="symbol-label bg-dark" style={{ backgroundImage: `url(/images/loyalty/level1_junior.png)`, }}/>}
                                    {level == 'Agent' && <div className="symbol-label bg-dark" style={{ backgroundImage: `url(/images/loyalty/level2_agent.png)`, }}/>}
                                    {level == 'Rookie' && <div className="symbol-label bg-dark" style={{ backgroundImage: `url(/images/loyalty/level3_rookie.png)`, }}/>}
                                    {level == 'Pro' && <div className="symbol-label bg-dark" style={{ backgroundImage: `url(/images/loyalty/level4_pro.png)`, }}/>}
                                    {level == 'AllStar' && <div className="symbol-label bg-dark" style={{ backgroundImage: `url(/images/loyalty/level5_allstar.png)`, }}/>}
                                </div>
                                <div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div>
                                            <div className="text-gray font-size-sm">Your Level</div>
                                            <div className="font-weight-bolder font-size-h5 text-white-75">{level}</div>
                                        </div>
                                        <div className="font-weight-bolder font-size-h3 text-danger pl-5">{loyalty}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="loyalty-levels mt-3">
                                <div onClick={() => this.setState({ selectedLevel: 'Junior', selectedLevelSpending: 3000 })}>
                                    <img className="shadow-sm cursor-pointer" title="Junior" alt="Junior" src="/images/loyalty/level1_junior.png" />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: 'Agent', selectedLevelSpending: 12500 })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title="Agent" alt="Agent" src="/images/loyalty/level2_agent.png" />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: 'Rookie', selectedLevelSpending: 25000 })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title="Rookie" alt="Rookie" src="/images/loyalty/level3_rookie.png" />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: 'Pro', selectedLevelSpending: 62500 })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title="Pro" alt="Pro" src="/images/loyalty/level4_pro.png" />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: 'AllStar', selectedLevelSpending: 125000 })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title="All Star" alt="All Star" src="/images/loyalty/level5_allstar.png" />
                                </div>
                            </div>

                            {selectedLevel == 'Junior' && <img src="/images/loyalty/level1_junior.png" className="rounded mx-auto d-block" />}
                            {selectedLevel == 'Agent' && <img src="/images/loyalty/level2_agent.png" className="rounded mx-auto d-block" />}
                            {selectedLevel == 'Rookie' && <img src="/images/loyalty/level3_rookie.png" className="rounded mx-auto d-block" />}
                            {selectedLevel == 'Pro' && <img src="/images/loyalty/level4_pro.png" className="rounded mx-auto d-block" />}
                            {selectedLevel == 'AllStar' && <img src="/images/loyalty/level5_allstar.png" className="rounded mx-auto d-block" />}

                            <div className="d-flex justify-content-center p-2">
                                <div className="border-right border-dark pr-2 text-right">
                                    <div className="font-weight-bolder font-size-h5 text-white-75">0 / 5</div>
                                    <div className="text-muted font-size-sm">Loyalty Points</div>
                                </div>
                                <div className="pl-2">
                                    <div className="font-weight-bolder font-size-h5 text-white-75">{selectedLevel}</div>
                                    <div className="text-muted font-size-sm">{selectedLevelSpending}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="shadow p-2">
                            <div className="loyalty-tabs">
                                <Tabs defaultActiveKey="progress">
                                    <Tab eventKey="progress" tabClassName='loyalty-tabitem' title="Milestone Progress" className="border-0">
                                        <div className="pt-2">
                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/level1_junior.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Junior</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-dark">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-dark"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/level1_junior.png)`,
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
                                                <div className="align-self-center mr-2">
                                                    <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark border-danger"
                                                        onClick={() => this.claim(1)}>
                                                        <div className="text-danger">Claim</div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center p-2">
                                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-3 align-self-start align-self-xxl-center"
                                                    style={{ backgroundColor: "#563d7c" }}>
                                                    <div className="symbol-label m-1"
                                                        style={{
                                                            backgroundImage: `url(/images/loyalty/level2_agent.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Agent</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-dark">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-dark"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/level1_junior.png)`,
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
                                                            backgroundImage: `url(/images/loyalty/level3_rookie.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Rookie</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-dark">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-dark"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/level1_junior.png)`,
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
                                                            backgroundImage: `url(/images/loyalty/level4_pro.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>Pro</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-dark">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-dark"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/level1_junior.png)`,
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
                                                            backgroundImage: `url(/images/loyalty/level5_allstar.png)`,
                                                            backgroundColor: "#563d7c",
                                                        }}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className="font-weight-bolder font-size-h5" style={{ color: "#ED254E" }}>All Star</div>
                                                    <div className="text-gray font-size-sm">Earn 5 points</div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row bg-dark">
                                                <div className="p-2 align-self-center">
                                                    <div className="symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                                        <div className="symbol-label m-1 bg-dark"
                                                            style={{
                                                                backgroundImage: `url(/images/loyalty/level1_junior.png)`,
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
                                    <Tab eventKey="claimed" tabClassName='loyalty-tabitem' title="Claimed Milestones" className="border-0">
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
