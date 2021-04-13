
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Security extends Component {
    render() {
        setTitle({ pageTitle: 'Password and Security' });
        return (
            <div className="col-in">
                <h1 className="main-heading-in">Password and security</h1>
                <div className="main-cnt">
                    <form>
                        <div className="row">
                            <div className="col-12">
                                <div className="card scrity mt-3 tab-card">
                                    <div
                                        className="card-header tab-card-header">
                                        <ul className="nav nav-tabs card-header-tabs"
                                            id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link"
                                                    id="one-tab"
                                                    data-toggle="tab"
                                                    href="#one" role="tab"
                                                    aria-controls="One"
                                                    aria-selected="true">PASSWORD AND SECURITY</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link"
                                                    id="two-tab"
                                                    data-toggle="tab"
                                                    href="#two" role="tab"
                                                    aria-controls="Two"
                                                    aria-selected="false">LAST LOGINS</a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="tab-content"
                                        id="myTabContent">
                                        <div className="tab-pane fade show active p-3"
                                            id="one" role="tabpanel"
                                            aria-labelledby="one-tab">
                                            <h4 className="h4"> PASSWORD</h4>
                                            <div className="form-group">
                                                <label>Current password</label>
                                                <input type="text"
                                                    name="pswrd"
                                                    className="form-control" />
                                            </div>

                                            <div className="form-group">
                                                <label>New password</label>
                                                <input type="text"
                                                    name="nw-pswrd"
                                                    className="form-control" />
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm password</label>
                                                <input type="text"
                                                    name="crn-pswrd"
                                                    className="form-control" />
                                            </div>

                                            <button type="submit"
                                                className="btn-smt">save</button>
                                            <br />
                                            <br />
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