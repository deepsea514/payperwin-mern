import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import { FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import axios from 'axios';
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[window.location.host].appUrl;

class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enable_2fa: 'false',
            metaData: null,
        }
    }

    componentDidMount() {
        const title = 'Account Security';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    getSnapshotBeforeUpdate(prevProps) {
        const { user } = this.props;
        return { enable_2fa: user ? true : false };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot.enable_2fa) {
            const { user } = this.props;
            const enable_2fa = user.roles.enable_2fa == true ? 'true' : 'false';
            if (prevState.enable_2fa != enable_2fa) {
                this.setState({ enable_2fa });
            }
        }
    }

    handleChange = (evt) => {
        const { getUser } = this.props;
        const value = evt.target.value;
        this.setState({ enable_2fa: value });
        axios.post(`${serverUrl}/enable-2fa`, { enable_2fa: value == 'true' }, { withCredentials: true })
            .then(() => {
                getUser();
            });
    }

    render() {
        const { enable_2fa, metaData } = this.state;
        return (
            <div className="col-in">
                {metaData && <DocumentMeta {...metaData} />}
                <h1 className="main-heading-in">Password and security</h1>
                <div className="main-cnt">
                    <form>
                        <div className="row">
                            <div className="col-12">
                                <div className="card scrity mt-3 tab-card">
                                    <div className="card-header tab-card-header">
                                        <ul className="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link" id="one-tab" data-toggle="tab" href="#one" role="tab" aria-controls="One" aria-selected="true">PASSWORD AND SECURITY</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="two-tab" data-toggle="tab" href="#two" role="tab" aria-controls="Two" aria-selected="false">LAST LOGINS</a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade show active p-3" id="one" role="tabpanel" aria-labelledby="one-tab">
                                            <h4 className="h4"> PASSWORD</h4>
                                            <div className="form-group">
                                                <label>Current password</label>
                                                <input type="text" name="pswrd" className="form-control" />
                                            </div>

                                            <div className="form-group">
                                                <label>New password</label>
                                                <input type="text" name="nw-pswrd" className="form-control" />
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm password</label>
                                                <input type="text" name="crn-pswrd" className="form-control" />
                                            </div>

                                            <button type="submit" className="form-button">SAVE</button>
                                            <br />
                                            <br />

                                            <h4 className="h4">Enable Two-Factor Authorization</h4>
                                            <FormControl component="fieldset">
                                                <RadioGroup aria-label="gender" name="gender1" value={enable_2fa} onChange={this.handleChange}>
                                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                                </RadioGroup>
                                            </FormControl>
                                            {/* <h4 className="h4">SECURITY QUESTION AND ANSWER</h4>
                                            <div className="form-group">
                                                <label>Security question</label>
                                                <input type="text"
                                                    name="tkd"
                                                    placeholder="Tickets"
                                                    className="form-control" />
                                                <i
                                                    className="fas fa-check"></i>
                                                <i className="fa fa-info-circle"
                                                    aria-hidden="true"></i>
                                            </div>

                                            <div className="form-group">
                                                <label>Security Answer</label>
                                                <input type="text"
                                                    name="tkd"
                                                    placeholder="Tickets"
                                                    className="form-control" />
                                                <i
                                                    className="fas fa-check"></i>
                                                <i className="fa fa-info-circle"
                                                    aria-hidden="true"></i>
                                            </div>

                                            <button type="submit"
                                                className="btn-smt">save</button> */}
                                        </div>
                                        <div className="login-d tab-pane fade p-3"
                                            id="two" role="tabpanel"
                                            aria-labelledby="two-tab">
                                            <h4 className="h4">SUCCESSFUL LOGINS</h4>
                                            <div className="row bord-b">
                                                <div className="col-sm-8">Date and Time</div>

                                                <div className="col-sm-4">IP Address</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-sm-8">
                                                    Thursday, April 30,
                                                    2020, 16:57
                                                </div>

                                                <div className="col-sm-4">
                                                    103.214.119.44
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-sm-8">
                                                    Thursday, April 30,
                                                    2020, 10:22
                                                </div>

                                                <div className="col-sm-4">
                                                    103.214.119.12
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-8">
                                                    Thursday, April 30,
                                                    2020, 09:57
                                                </div>
                                                <div className="col-sm-4">
                                                    51.79.70.147
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Security;