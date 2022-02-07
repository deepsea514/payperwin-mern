/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SVG from "react-inlinesvg";

class ProfileCard extends React.Component {
    goToBack = () => {
        const { history } = this.props;
        history.push("/users");
    }

    render() {
        const { customer } = this.props;
        const { _id: id } = customer;
        return (
            <div className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
                id="kt_profile_aside">
                <div className="card card-custom card-stretch">
                    <div className="card-body pt-8">
                        <div className="d-flex justify-content-start">
                            <Button onClick={this.goToBack} className="btn btn-secondary mr-2"> Back </Button>
                        </div>
                        <div className="d-flex align-items-start my-4 text-left">
                            <span className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                                style={{ wordBreak: 'break-all' }}>
                                {customer.email}
                            </span>
                        </div>
                        <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                            <div className="navi-item mb-2">
                                <NavLink exact
                                    to={`/users/${id}/profile/overview`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Design/Layers.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Customer Overview
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/information`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/General/User.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Personal Information
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/preference`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/General/Settings-1.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Preference
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/login-history`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Code/Compiling.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Login History
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/credit`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Shopping/Wallet2.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Line of Credit
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/deposit`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Communication/Shield-user.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Deposit
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/withdraw`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Communication/Mail-opened.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Withdraw
                                    </span>
                                </NavLink>
                            </div>
                            <li className="navi-item mb-2">
                                <NavLink to={`/users/${id}/profile/transactions`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <SVG src="/media/svg/icons/Layout/Layout-top-panel-6.svg" />
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Transactions
                                    </span>
                                </NavLink>
                            </li>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/bet-log`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Devices/Gamepad2.svg" />
                                        </span>
                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Bet Log
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/tier`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/General/Settings-1.svg" />
                                        </span>

                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Customer Tier
                                    </span>
                                </NavLink>
                            </div>
                            <div className="navi-item mb-2">
                                <NavLink
                                    to={`/users/${id}/profile/referral`}
                                    className="navi-link py-4 non-border-bottom">
                                    <span className="navi-icon mr-2">
                                        <span className="svg-icon">
                                            <SVG src="/media/svg/icons/Files/User-folder.svg" />
                                        </span>

                                    </span>
                                    <span className="text-left navi-text font-size-lg">
                                        Friend Referral
                                    </span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileCard;