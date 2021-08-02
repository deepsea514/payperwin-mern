/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SVG from "react-inlinesvg";

class ProfileCard extends React.Component {
    goToBack = () => {
        const { history } = this.props;
        history.push("/");
    }

    render() {
        const { customer } = this.props;
        return (
            <>
                <div
                    className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
                    id="kt_profile_aside"
                >
                    <div className="card card-custom card-stretch">
                        {/* begin::Body */}
                        <div className="card-body pt-8">
                            <div className="d-flex justify-content-start">
                                <Button onClick={this.goToBack} className="btn btn-secondary mr-2"> Back </Button>
                            </div>
                            {/* begin::User */}
                            <div className="d-flex align-items-center mt-4">
                                {/* <div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                                    <div
                                        className="symbol-label"
                                        style={{ backgroundImage: `url(/media/users/300_10.jpg)` }}
                                    ></div>
                                </div> */}
                                <div>
                                    <span style={{ textTransform: "uppercase" }} className="font-weight-bolder font-size-h2 text-dark-75 text-hover-primary">
                                        {customer.username}
                                    </span>
                                </div>
                            </div>
                            {/* end::User */}
                            {/* begin::Contact */}
                            <div className="py-9">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="font-weight-bold mr-2">Email:</span>
                                    <span className="text-muted text-hover-primary">
                                        {customer.email}
                                    </span>
                                </div>
                            </div>
                            {/* end::Contact */}
                            {/* begin::Nav */}
                            <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                                <div className="navi-item mb-2">
                                    <NavLink exact
                                        to="/overview"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/Design/Layers.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Customer Overview
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/information"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/General/User.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Personal Information
                                            </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/preference"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/General/Settings-1.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Preference
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/login-history"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/Code/Compiling.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Login History
                                            </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/deposit"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/Communication/Shield-user.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Deposit
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/withdraw"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/Communication/Mail-opened.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Withdraw
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/bet-log"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG
                                                    src="/media/svg/icons/Layout/Layout-top-panel-6.svg"
                                                ></SVG>{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Bet Log
                                        </span>
                                    </NavLink>
                                </div>
                            </div>
                            {/* end::Nav */}
                        </div>
                        {/* end::Body */}
                    </div>
                </div>
            </>
        );
    }
}

export default ProfileCard;