import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        const { user } = props;
        this.state = {
            inviteLink: window.location.origin + '/signup?referrer=' + user.unique_id,
            copied: false,
        }
    }

    copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        this.setState({ copied: true });
    }

    render() {
        const { inviteLink, copied } = this.state;
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
                    <div className='col-md-6 mb-5'>
                        <h4>Affiliate Track</h4>
                        <div className="table-responsive mt-4">
                            <table className="table text-white">
                                <tbody>
                                    <tr>
                                        <th># of Clicks</th>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <th># of Conversions</th>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <th># of Deposits</th>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <th>Commission Earned</th>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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