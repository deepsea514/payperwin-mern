import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import axios from "axios";
import config from "../../../config.json";
const serverUrl = config.appUrl;

class Verification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            address: "required",
            identification: "required",
        }
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Verification' });
        axios.get(`${serverUrl}/checkverified`, { withCredentials: true })
            .then(({ data }) => {
                const { verify_submitted } = data;
                const { address, identification } = verify_submitted;
                this.setState({
                    address: address ? "submitted" : "required",
                    identification: identification ? "submitted" : "required",
                });
            });
    }

    handleFileUpload = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            return;
        }
        this.setState({ [name]: 'submitting' });

        let data = new FormData();
        data.append(name, file, file.name);

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            withCredentials: true,
        }
        axios.post(`${serverUrl}/verification`, data, config)
            .then(() => {
                this.setState({ [name]: 'submitted' });
            })
            .catch(() => {
                this.setState({ [name]: 'error' });
            });
    }

    clickUpload = (field) => {
        if (this.state[field] == 'submitted' || this.state[field] == 'submitting')
            return;
        this.refs[field].click();
    }

    render() {
        const { user } = this.props;
        const { address, identification } = this.state;
        return (
            <div className="col-in">
                <h3>Verification</h3>
                {user && user.roles.verified && <p>You already verified your identify.</p>}
                {user && !user.roles.verified && <div className="main-cnt">
                    <p className="text-black">
                        Please follow the instruction and upload copies of the documents we support.
                        The document must be smaller than 5MB.
                        Verifying your account can take up to 72 hours after submission.
                    </p>
                    <div className="bg-color-box pad10">
                        <h4>DOCUMENT STATUS</h4>
                        <br />
                        <p className="verification-items" onClick={() => this.clickUpload('address')}>
                            Address verification
                            &nbsp;{address == 'required' && <span className="badge badge-primary">REQUIRED</span>}
                            &nbsp;{address == 'submitting' && <img src="/images/loading.gif" className="m-0" width="16" height="16" />}
                            &nbsp;{address == 'submitted' && <span className="badge badge-success">SUBMITTED</span>}
                            &nbsp;{address == 'error' && <span className="badge badge-danger">SUBMIT FAILED, PLEASE TRY AGAIN</span>}
                        </p>
                        <input ref="address" name="address" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />

                        <p className="verification-items" onClick={() => this.clickUpload('identification')}>
                            Personal identification verification
                            &nbsp;{identification == 'required' && <span className="badge badge-primary">REQUIRED</span>}
                            &nbsp;{identification == 'submitting' && <img src="/images/loading.gif" className="m-0" width="16" height="16" />}
                            &nbsp;{identification == 'submitted' && <span className="badge badge-success">SUBMITTED</span>}
                            &nbsp;{identification == 'error' && <span className="badge badge-danger">SUBMIT FAILED, PLEASE TRY AGAIN</span>}
                        </p>
                        <input ref="identification" name="identification" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />
                    </div>
                </div>}
            </div>
        );
    }
}

export default withRouter(Verification);