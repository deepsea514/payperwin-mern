/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive } from "../../../../_helpers";
import { connect } from "react-redux";
import * as kyc from "../../../../../modules/kyc/redux/reducers";
import * as withdrawlog from "../../../../../modules/withdrawlogs/redux/reducers";
import * as events from "../../../../../modules/events/redux/reducers";
import config from "../../../../../../../../config.json";
const AdminRoles = config.AdminRoles;

function AsideMenuList({
    layoutProps,
    getVerifications,
    kyc_total,
    getWithdrawLog,
    pending_withdraw_total,
    currentUser,
    getEvents,
    pending_event_total
}) {

    const location = useLocation();
    const getMenuItemActive = (url, hasSubmenu = false) => {
        return checkIsActive(location, url)
            ? ` ${!hasSubmenu &&
            "menu-item-active"} menu-item-open menu-item-not-hightlighted`
            : "";
    };

    useEffect(() => {
        getVerifications();
        getWithdrawLog();
        getEvents();
    })

    const isAvailable = (module) => {
        if (currentUser) {
            if (AdminRoles[currentUser.role] && AdminRoles[currentUser.role][module])
                return true;
            return false;
        }
        return false;
    }

    return (
        <>
            {/* begin::Menu Nav */}
            <ul className={`menu-nav ${layoutProps.ulClasses}`}>

                {currentUser && isAvailable('dashboard') && <li
                    className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/dashboard/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Design/Layers.svg"} />
                        </span>
                        <span className="menu-text">Dashboard</span>
                    </Link>
                </li>}

                <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/reports",
                        true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                    <NavLink className="menu-link menu-toggle border-0" to="/reports">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Settings-2.svg"} />
                        </span>
                        <span className="menu-text">Settings</span>
                        <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                        <ul className="menu-subnav">
                            {currentUser && isAvailable('admins') && <li
                                className={`menu-item ${getMenuItemActive("/admin", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/admin">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Files/User-folder.svg"} />
                                    </span>
                                    <span className="menu-text">Admins</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('api-settings') && <li
                                className={`menu-item ${getMenuItemActive("/api-settings", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/api-settings/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Puzzle.svg"} />
                                    </span>
                                    <span className="menu-text">API Settings</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('frontend') && <li
                                className={`menu-item ${getMenuItemActive("/frontend", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/frontend/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Devices/Display3.svg"} />
                                    </span>
                                    <span className="menu-text">Frontend Management</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('email_templates') && <li
                                className={`menu-item ${getMenuItemActive("/email-templates", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/email-templates/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Communication/Mail-opened.svg"} />
                                    </span>
                                    <span className="menu-text">Email Templates</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('page-metas') && <li
                                className={`menu-item ${getMenuItemActive("/page-metas", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/page-metas/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/General/Search.svg"} />
                                    </span>
                                    <span className="menu-text">Page Metas</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('faq') && <li
                                className={`menu-item ${getMenuItemActive("/faq", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/faq/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Question-circle.svg"} />
                                    </span>
                                    <span className="menu-text">FAQ</span>
                                </NavLink>
                            </li>}

                            {currentUser && isAvailable('articles') && <li
                                className={`menu-item ${getMenuItemActive("/articles", false)}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/articles/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Option.svg"} />
                                    </span>
                                    <span className="menu-text">Articles</span>
                                </NavLink>
                            </li>}
                        </ul>
                    </div>
                </li>

                {currentUser && isAvailable('kyc') && <li
                    className={`menu-item ${getMenuItemActive("/kyc", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/kyc/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Shield-check.svg"} />
                        </span>
                        <span className="menu-text">KYC</span>
                        {kyc_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{kyc_total}&nbsp;</span>}
                    </Link>
                </li>}

                {currentUser && isAvailable('users') && <li
                    className={`menu-item ${getMenuItemActive("/users", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/users/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/User.svg"} />
                        </span>
                        <span className="menu-text">Users</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('messages') && <li
                    className={`menu-item ${getMenuItemActive("/message-center", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/message-center/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Communication/Mail-box.svg"} />
                        </span>
                        <span className="menu-text">Messages</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('bet_activities') && <li
                    className={`menu-item ${getMenuItemActive("/bet-activities", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/bet-activities/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Gamepad2.svg"} />
                        </span>
                        <span className="menu-text">Bet Activities</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('withdraw_logs') && <li
                    className={`menu-item ${getMenuItemActive("/withdraw-log", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/withdraw-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Money.svg"} />
                        </span>
                        <span className="menu-text">Withdraw Logs</span>
                        {pending_withdraw_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_withdraw_total}&nbsp;</span>}
                    </Link>
                </li>}

                {currentUser && isAvailable('deposit_logs') && <li
                    className={`menu-item ${getMenuItemActive("/deposit-log", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/deposit-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Wallet.svg"} />
                        </span>
                        <span className="menu-text">Deposit Logs</span>
                    </Link>
                </li>}

                <li
                    className={`menu-item ${getMenuItemActive("/cashback", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/cashback/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Dollar.svg"} />
                        </span>
                        <span className="menu-text">Cashback</span>
                    </Link>
                </li>

                {currentUser && isAvailable('autobet') && <li
                    className={`menu-item ${getMenuItemActive("/autobet", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/autobet/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                        </span>
                        <span className="menu-text">AutoBet</span>
                        {pending_event_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_event_total}&nbsp;</span>}
                    </Link>
                </li>}

                {currentUser && isAvailable('custom-events') && <li
                    className={`menu-item ${getMenuItemActive("/custom-events", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/custom-events/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Thunder-move.svg"} />
                        </span>
                        <span className="menu-text">Custom Events</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('promotions') && <li
                    className={`menu-item ${getMenuItemActive("/promotions", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/promotions/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Cart3.svg"} />
                        </span>
                        <span className="menu-text">Promotions</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('support-tickets') && <li
                    className={`menu-item ${getMenuItemActive("/support-tickets", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/support-tickets/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                        </span>
                        <span className="menu-text">Support Tickets</span>
                    </Link>
                </li>}

                {currentUser && isAvailable('reports') && <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/reports",
                        true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                    <NavLink className="menu-link menu-toggle border-0" to="/reports">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Design/Pencil.svg"} />
                        </span>
                        <span className="menu-text">Reports</span>
                        <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                        <i className="menu-arrow" />
                        <ul className="menu-subnav">
                            <li
                                className={`menu-item ${getMenuItemActive(
                                    "/reports/wager"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/reports/wager">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Wager Activities</span>
                                </NavLink>
                            </li>
                            <li
                                className={`menu-item ${getMenuItemActive(
                                    "/reports/users"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/reports/users">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Active Users</span>
                                </NavLink>
                            </li>
                            <li
                                className={`menu-item ${getMenuItemActive(
                                    "/reports/deposit"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/reports/deposit">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Deposit</span>
                                </NavLink>
                            </li>
                            <li
                                className={`menu-item ${getMenuItemActive(
                                    "/reports/withdraw"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/reports/withdraw">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Withdraw</span>
                                </NavLink>
                            </li>
                            <li
                                className={`menu-item ${getMenuItemActive(
                                    "/reports/profit"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink className="menu-link border-0" to="/reports/profit">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Profit</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </li>}

                <li
                    className={`menu-item`}
                    aria-haspopup="true"
                >
                    <br />
                    <br />
                </li>

            </ul>
        </>
    );
}

const mapStateToProps = (state) => ({
    kyc_total: state.kyc.total,
    pending_withdraw_total: state.withdrawlog.pending_total,
    pending_event_total: state.events.pending_total,
    currentUser: state.currentUser.currentUser,
});

const mapActionsToProps = {
    getVerifications: kyc.actions.getVerifications,
    getWithdrawLog: withdrawlog.actions.getWithdrawLog,
    getEvents: events.actions.getEvents,
};

export default connect(mapStateToProps, mapActionsToProps)(AsideMenuList);