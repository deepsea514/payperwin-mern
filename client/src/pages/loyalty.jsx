import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { getLoyaltyPoints, claimReward, getClaims, } from '../redux/services';
import { showSuccessToast, showErrorToast } from '../libs/toast';

export default class Loyalty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            LEVELS: [
                {
                    title: 'Junior',
                    level: 'Junior',
                    image: '/images/loyalty/level1_junior.png',
                    milestones: [
                        { points: 1500, isClaimed: false, credit: 5.30 },
                        { points: 3000, isClaimed: false, credit: 0.45 },
                        { points: 4500, isClaimed: false, credit: 0.75 },
                        { points: 6000, isClaimed: false, credit: 1.00 }
                    ],
                },
                {
                    title: 'Agent',
                    level: 'Agent',
                    image: '/images/loyalty/level2_agent.png',
                    milestones: [
                        { points: 7500, isClaimed: false, credit: 1.50 },
                        { points: 9000, isClaimed: false, credit: 1.75 },
                        { points: 10500, isClaimed: false, credit: 2.00 },
                        { points: 13000, isClaimed: false, credit: 2.25 }
                    ],
                },
                {
                    title: 'Rookie',
                    level: 'Rookie',
                    image: '/images/loyalty/level3_rookie.png',
                    milestones: [
                        { points: 15000, isClaimed: false, credit: 2.75 },
                        { points: 18000, isClaimed: false, credit: 2.85 },
                        { points: 21000, isClaimed: false, credit: 2.95 },
                        { points: 26000, isClaimed: false, credit: 3.00 }
                    ],
                },
                {
                    title: 'Pro',
                    level: 'Pro',
                    image: '/images/loyalty/level4_pro.png',
                    milestones: [
                        { points: 30000, isClaimed: false, credit: 3.00 },
                        { points: 35000, isClaimed: false, credit: 3.25 },
                        { points: 45000, isClaimed: false, credit: 3.75 },
                        { points: 52000, isClaimed: false, credit: 3.95 }
                    ],
                },
                {
                    title: 'All Star',
                    level: 'AllStar',
                    image: '/images/loyalty/level5_allstar.png',
                    milestones: [
                        { points: 60000, isClaimed: false, credit: 10.00 },
                        { points: 70000, isClaimed: false, credit: 4.00 },
                        { points: 90000, isClaimed: false, credit: 4.50 },
                        { points: 150000, isClaimed: false, credit: 10.00 }
                    ],
                },
            ],
            selectedLevel: 'Junior',
            levelRuleString: `0 - 6,000`,
            loyalty: 0,
            level: 'Junior',
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
        }
    }

    getLoyaltyPoints = () => {
        this.setState({ loading: true });
        getLoyaltyPoints()
            .then(({ data }) => {
                this.setState({ loyalty: data.loyalty });
                this.setLevel(data.loyalty)
                getClaims()
                    .then(({ data }) => {
                        const claims = data;
                        const { LEVELS } = this.state;

                        if (claims.length) {
                            this.setState({
                                LEVELS: LEVELS.map((level) => {
                                    return {
                                        ...level,
                                        milestones: level.milestones.map(milestone => {
                                            const claimIndex = claims.findIndex(claim => claim.points == milestone.points);
                                            if (claimIndex == -1) {
                                                return milestone;
                                            }
                                            return {
                                                ...milestone,
                                                isClaimed: true
                                            }
                                        })
                                    }
                                })
                            });
                        }
                        this.setState({ loading: false });
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    })
            })
            .catch(() => {
                this.setState({ loading: false });
            })
    }

    setLevel = (loyalty) => {
        const { LEVELS } = this.state;
        if (loyalty <= LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points) {
            this.setState({ level: LEVELS[0].level, selectedLevel: LEVELS[0].level, levelRuleString: `0 - ${this.numberWithCommas(LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points)}` });
            return;
        }
        if (loyalty <= LEVELS[1].milestones[LEVELS[1].milestones.length - 1].points) {
            this.setState({ level: LEVELS[1].level, selectedLevel: LEVELS[1].level, levelRuleString: `${this.numberWithCommas(LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[1].milestones[LEVELS[0].milestones.length - 1].points)}` });
            return;
        }
        if (loyalty <= LEVELS[2].milestones[LEVELS[2].milestones.length - 1].points) {
            this.setState({ level: LEVELS[2].level, selectedLevel: LEVELS[2].level, levelRuleString: `${this.numberWithCommas(LEVELS[1].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[2].milestones[LEVELS[0].milestones.length - 1].points)}` });
            return;
        }
        if (loyalty <= LEVELS[3].milestones[LEVELS[3].milestones.length - 1].points) {
            this.setState({ level: LEVELS[3].level, selectedLevel: LEVELS[3].level, levelRuleString: `${this.numberWithCommas(LEVELS[2].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[3].milestones[LEVELS[0].milestones.length - 1].points)}` });
            return;
        }
        this.setState({ level: LEVELS[4].level, selectedLevel: LEVELS[4].level, levelRuleString: `+${this.numberWithCommas(LEVELS[3].milestones[LEVELS[0].milestones.length - 1].points + 1)}` });
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    claim = ({ points }) => {
        const { LEVELS } = this.state;

        claimReward(points)
            .then(({ data }) => {
                if (data.success) {
                    showSuccessToast('Claimed successfully.');
                    this.setState({
                        LEVELS: LEVELS.map((level) => {
                            return {
                                ...level,
                                milestones: level.milestones.map(milestone => {
                                    if (milestone.points != points) {
                                        return milestone;
                                    }
                                    return {
                                        ...milestone,
                                        isClaimed: true
                                    }
                                })
                            }
                        })
                    });
                    this.props.getUser();
                }
                else {
                    showErrorToast(data.error);
                }
            }).catch((error) => {
                showErrorToast('Server Error.');
            })
    }

    renderMilestones = () => {
        const { loyalty, LEVELS } = this.state;
        return <div className="pt-2">
            {LEVELS.map((level, pros_index) =>
                <React.Fragment key={pros_index}>
                    {this.isRenderLevelTitle(level, 'milestone') && <div className="d-flex flex-row  mt-2" key={`prop_milestone_${pros_index + 1}`}>
                        <div className="p-2 align-self-center">
                            <div className="symbol symbol-30 mr-1 align-self-start">
                                <div className="symbol-label m-1 bg-dark"
                                    style={{
                                        backgroundImage: `url(${level.image})`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="align-self-center">
                            <div className="font-weight-bolder font-size-md">{level.title}</div>
                        </div>
                        <div className="pl-3 align-self-center w-50">
                            <div className="text-gray" style={{ fontSize: '12px' }}>{this.numberWithCommas(level.milestones[level.milestones.length - 1].points)} points</div>
                        </div>
                    </div>}
                    {level.milestones.map((milestone, index) =>

                        !milestone.isClaimed && <div className="d-flex flex-row bg-dark mt-2 p-3" key={`milestone_${index + 1}`}>
                            {/* <div className="p-2 align-self-center">
                                <div className="symbol symbol-30 mr-1 align-self-start">
                                    <div className="symbol-label m-1 bg-dark"
                                        style={{
                                            backgroundImage: `url(/images/loyalty/milestone_flag.png)`,
                                        }}
                                    ></div>
                                </div>
                            </div> */}
                            <div className="align-self-center">
                                <div className="font-weight-bolder font-size-md">Milestone&nbsp;{pros_index * level.milestones.length + index + 1}</div>
                            </div>
                            <div className="pl-3 align-self-center w-100">
                                <div className="text-gray" style={{ fontSize: '12px' }}>{this.numberWithCommas(milestone.points)} points</div>
                                <ProgressBar now={100 / milestone.points * loyalty} visuallyhidden="true" style={{ height: '5px' }} />
                                {/* {milestone.points > loyalty && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>{this.numberWithCommas(milestone.points - loyalty)} points needed</div>} */}
                            </div>
                            <div className="align-self-right mr-2 d-block">
                                {milestone.points <= loyalty && <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark border-0" style={{ backgroundColor: '#ED254E' }}
                                    onClick={() => this.claim(milestone)}>
                                    <div>Claim</div>
                                </button>}
                                {milestone.points > loyalty && <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark border-0 invisible">
                                    <div>Claim</div>
                                </button>}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    }

    getCurrentLevelStateString = () => {
        const { loyalty, selectedLevel, LEVELS } = this.state;
        let curLevel = LEVELS.filter(lv => lv.level == selectedLevel);
        let preIndex = curLevel[0].milestones.findIndex(mile => mile.points > loyalty).toString();
        if (preIndex < 0) preIndex = curLevel[0].milestones.length;
        return preIndex + ' / ' + curLevel[0].milestones.length;

    }

    isRenderLevelTitle = (level, type) => {
        return level.milestones.filter(mile => type == 'claimed' ? mile.isClaimed : !mile.isClaimed).length > 0;
    }

    renderClaims = () => {
        const { LEVELS } = this.state;
        return <div className="pt-2">
            {LEVELS.map((level, pros_index) =>
                <React.Fragment key={pros_index}>
                    {this.isRenderLevelTitle(level, 'claimed') && <div className="d-flex flex-row  mt-2" key={`prop_milestone_${pros_index + 1}`}>
                        <div className="p-2 align-self-center">
                            <div className="symbol symbol-30 mr-1 align-self-start">
                                <div className="symbol-label m-1 bg-dark"
                                    style={{
                                        backgroundImage: `url(${level.image})`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="align-self-center">
                            <div className="font-weight-bolder font-size-md">{level.title}</div>
                        </div>
                        <div className="pl-3 align-self-center w-50">
                            <div className="text-gray" style={{ fontSize: '12px' }}>{this.numberWithCommas(level.milestones[level.milestones.length - 1].points)} points</div>
                        </div>
                    </div>}
                    {level.milestones.map((milestone, index) =>

                        milestone.isClaimed && <div className="d-flex flex-row bg-dark mt-2 p-3" key={`milestone_${index + 1}`}>
                            <div className="align-self-center">
                                <div className="font-weight-bolder font-size-md">Milestone&nbsp;{pros_index * level.milestones.length + index + 1}</div>
                            </div>
                            <div className="pl-3 align-self-center w-100">
                                <div className="text-gray" style={{ fontSize: '12px' }}>{this.numberWithCommas(milestone.points)} points</div>
                                <div className="font-weight-bolder font-size-lg text-success">+${milestone.credit.toFixed(2)}</div>
                            </div>
                            <div className="align-self-center mr-2">
                                <button className="adminMessage_button cookieBanner_small dead-center cookieBanner_dark border-success" disabled style={{ cursor: 'not-allowed' }}>
                                    <div className="text-success">Claimed</div>
                                </button>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    }

    render() {
        const { loading, error, selectedLevel, levelRuleString, loyalty, level, LEVELS } = this.state;

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
                {!loading && <div className="row">
                    <div className="col-md-5">
                        <div className="shadow p-2">
                            <div className="d-flex align-items-center justify-content-center bg-dark p-2 rounded">
                                <div className="align-self-center symbol symbol-40 symbol-xxl-60 mr-1 align-self-start align-self-xxl-center">
                                    {level == LEVELS[0].level && <div className="symbol-label bg-dark" style={{ backgroundImage: LEVELS[0].image, }} />}
                                    {level == LEVELS[1].level && <div className="symbol-label bg-dark" style={{ backgroundImage: LEVELS[1].image, }} />}
                                    {level == LEVELS[2].level && <div className="symbol-label bg-dark" style={{ backgroundImage: LEVELS[2].image, }} />}
                                    {level == LEVELS[3].level && <div className="symbol-label bg-dark" style={{ backgroundImage: LEVELS[3].image, }} />}
                                    {level == LEVELS[4].level && <div className="symbol-label bg-dark" style={{ backgroundImage: LEVELS[4].image, }} />}
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
                                <div onClick={() => this.setState({ selectedLevel: LEVELS[0].level, levelRuleString: `0 - ${this.numberWithCommas(LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points)}` })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title={LEVELS[0].title} alt={LEVELS[0].title} src={LEVELS[0].image} />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: LEVELS[1].level, levelRuleString: `${this.numberWithCommas(LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[1].milestones[LEVELS[0].milestones.length - 1].points)}` })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title={LEVELS[1].title} alt={LEVELS[1].title} src={LEVELS[1].image} />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: LEVELS[2].level, levelRuleString: `${this.numberWithCommas(LEVELS[1].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[2].milestones[LEVELS[0].milestones.length - 1].points)}` })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title={LEVELS[2].title} alt={LEVELS[2].title} src={LEVELS[2].image} />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: LEVELS[3].level, levelRuleString: `${this.numberWithCommas(LEVELS[2].milestones[LEVELS[0].milestones.length - 1].points + 1)} - ${this.numberWithCommas(LEVELS[3].milestones[LEVELS[0].milestones.length - 1].points)}` })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title={LEVELS[3].title} alt={LEVELS[3].title} src={LEVELS[3].image} />
                                </div>
                                <div onClick={() => this.setState({ selectedLevel: LEVELS[4].level, levelRuleString: `+${this.numberWithCommas(LEVELS[3].milestones[LEVELS[0].milestones.length - 1].points + 1)}` })}>
                                    <img className="shadow-sm cursor-pointer opacity-90" title={LEVELS[4].title} alt={LEVELS[4].title} src={LEVELS[4].image} />
                                </div>
                            </div>

                            {selectedLevel == LEVELS[0].level &&
                                <div style={{ position: 'relative' }}>
                                    <img src={LEVELS[0].image} className="rounded mx-auto d-block" style={{ opacity: loyalty > 0 ? 1.0 : 0.4 }} />
                                    {loyalty == 0 && <img src='/images/loyalty/Lock.png' className="rounded mx-auto d-block" style={{ position: 'absolute', top: 70, opacity: 0.9 }} />}
                                </div>}
                            {selectedLevel == LEVELS[1].level &&
                                <div style={{ position: 'relative' }}>
                                    <img src={LEVELS[1].image} className="rounded mx-auto d-block" style={{ opacity: loyalty > LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points ? 1.0 : 0.4 }} />
                                    {loyalty <= LEVELS[0].milestones[LEVELS[0].milestones.length - 1].points && <img src='/images/loyalty/Lock.png' className="rounded mx-auto d-block" style={{ position: 'absolute', top: 70, opacity: 0.9 }} />}
                                </div>}
                            {selectedLevel == LEVELS[2].level &&
                                <div style={{ position: 'relative' }}>
                                    <img src={LEVELS[2].image} className="rounded mx-auto d-block" style={{ opacity: loyalty > LEVELS[1].milestones[LEVELS[1].milestones.length - 1].points ? 1.0 : 0.4 }} />
                                    {loyalty <= LEVELS[1].milestones[LEVELS[1].milestones.length - 1].points && <img src='/images/loyalty/Lock.png' className="rounded mx-auto d-block" style={{ position: 'absolute', top: 70, opacity: 0.9 }} />}
                                </div>}
                            {selectedLevel == LEVELS[3].level &&
                                <div style={{ position: 'relative' }}>
                                    <img src={LEVELS[3].image} className="rounded mx-auto d-block" style={{ opacity: loyalty > LEVELS[2].milestones[LEVELS[2].milestones.length - 1].points ? 1.0 : 0.4 }} />
                                    {loyalty <= LEVELS[2].milestones[LEVELS[2].milestones.length - 1].points && <img src='/images/loyalty/Lock.png' className="rounded mx-auto d-block" style={{ position: 'absolute', top: 70, opacity: 0.9 }} />}
                                </div>}
                            {selectedLevel == LEVELS[4].level &&
                                <div style={{ position: 'relative' }}>
                                    <img src={LEVELS[4].image} className="rounded mx-auto d-block" style={{ opacity: loyalty > LEVELS[3].milestones[LEVELS[3].milestones.length - 1].points ? 1.0 : 0.4 }} />
                                    {loyalty <= LEVELS[3].milestones[LEVELS[3].milestones.length - 1].points && <img src='/images/loyalty/Lock.png' className="rounded mx-auto d-block" style={{ position: 'absolute', top: 70, opacity: 0.9 }} />}
                                </div>}

                            <div className="d-flex justify-content-center p-2">
                                <div className="border-right border-dark pr-2 text-right">
                                    <div className="font-weight-bolder font-size-h5 text-white-75">{this.getCurrentLevelStateString()}</div>
                                    <div className="text-muted font-size-sm">Loyalty Points</div>
                                </div>
                                <div className="pl-2">
                                    <div className="font-weight-bolder font-size-h5 text-white-75">{selectedLevel}</div>
                                    <div className="text-muted font-size-sm">{levelRuleString}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="shadow p-2">
                            <div className="loyalty-tabs">
                                <Tabs defaultActiveKey="progress">
                                    <Tab eventKey="progress" tabClassName='loyalty-tabitem' title="Milestone Progress" className="border-0">
                                        {this.renderMilestones()}
                                    </Tab>
                                    <Tab eventKey="claimed" tabClassName='loyalty-tabitem' title="Claimed Milestones" className="border-0">
                                        {this.renderClaims()}
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
