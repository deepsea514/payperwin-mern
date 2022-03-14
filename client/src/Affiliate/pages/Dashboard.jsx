import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getDetail } from '../redux/services';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        const { user } = props;
        this.state = {
            inviteLink: window.location.origin + '/signup?referrer=' + user.unique_id,
            copied: false,
            loading: false,
            dashboardData: null,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        getDetail()
            .then(({ data }) => {
                this.setState({ loading: false, dashboardData: data });
            })
            .catch(() => {
                this.setState({ loading: false, dashboardData: null });
            })
    }

    copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        this.setState({ copied: true });
    }

    render() {
        const { inviteLink, copied, loading, dashboardData } = this.state;
        return (
            <div className="col-in">
                <div className='affiliate-header'>
                    <h2 className='affiliate-header-title'>Affiliate Dashboard</h2>
                </div>

                <div className='row mt-5'>
                    <div className='col-md-6 d-flex flex-column justify-content-center px-5 mb-3'>
                        <input value={inviteLink} readOnly className="affiliate-textarea" />
                        <div className="row px-3">
                            <div className="col-12 affiliate-copybutton py-2 cursor-pointer"
                                onClick={() => this.copyUrl(inviteLink)}>
                                {copied ? 'Copied' : 'Copy'}
                            </div>
                        </div>
                        <p className='affiliate-warn'>
                            New players only, 19 or older.
                            Available in Canada only.
                            A minimum of $100 deposit by the referral is required for you to qualify.
                        </p>
                    </div>
                    <div className='col-md-6 mb-5 d-flex flex-column align-items-center'>
                        <h4>Affiliate Track</h4>
                        {loading && <Preloader use={ThreeDots}
                            className="mt-3"
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />}
                        {!loading && !dashboardData && <h4>No Data Available</h4>}
                        {dashboardData && <div className="table-responsive mt-4">
                            <table className="table text-white">
                                <tbody>
                                    <tr>
                                        <th># of Clicks</th>
                                        <td>{dashboardData.click}</td>
                                    </tr>
                                    <tr>
                                        <th># of Conversions</th>
                                        <td>{dashboardData.conversions}</td>
                                    </tr>
                                    <tr>
                                        <th># of Deposits</th>
                                        <td>{dashboardData.deposits}</td>
                                    </tr>
                                    <tr>
                                        <th>Commission Earned</th>
                                        <td>${dashboardData.commission} CAD</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>}

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.affiliate.affiliateUser,
});

export default connect(mapStateToProps, null)(Dashboard);