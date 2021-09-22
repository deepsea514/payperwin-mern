/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SVG from "react-inlinesvg";

class DashboardCard extends React.Component {
    render() {
        return (
            <>
                <div
                    className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
                    id="kt_profile_aside"
                >
                    <div className="card card-custom card-stretch">
                        {/* begin::Body */}
                        <div className="card-body pt-8">
                            {/* begin::Nav */}
                            <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                                <div className="navi-item mb-2">
                                    <NavLink exact
                                        to="/lastdeposits"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG src="/media/svg/icons/Design/Layers.svg" />{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Last Deposits
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/lastwithdraws"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG src="/media/svg/icons/Design/Layers.svg" />{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Last Withdraws
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/lastbets"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG src="/media/svg/icons/Design/Layers.svg" />{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Last Bets
                                        </span>
                                    </NavLink>
                                </div>
                                <div className="navi-item mb-2">
                                    <NavLink
                                        to="/fees"
                                        className="navi-link py-4 non-border-bottom"
                                    >
                                        <span className="navi-icon mr-2">
                                            <span className="svg-icon">
                                                <SVG src="/media/svg/icons/Design/Layers.svg" />{" "}
                                            </span>
                                        </span>
                                        <span className="text-left navi-text font-size-lg">
                                            Fees Collected
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

export default DashboardCard;