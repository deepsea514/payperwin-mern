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
    adminUser,
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
    }, [getVerifications, getWithdrawLog, getEvents])

    const isAvailable = (module) => {
        if (adminUser) {
            if (AdminRoles[adminUser.role] && AdminRoles[adminUser.role][module])
                return true;
            return false;
        }
        return false;
    }

    return (
        <>
            <ul className={`menu-nav ${layoutProps.ulClasses}`}>
                {adminUser && isAvailable('dashboard') && <li className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/dashboard/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Design/Layers.svg"} />
                        </span>
                        <span className="menu-text">Dashboard</span>
                    </Link>
                </li>}

                <li className={`menu-item menu-item-submenu`}
                    aria-haspopup="true"
                    data-menu-toggle="hover">
                    <NavLink className="menu-link menu-toggle border-0" to="/reports">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Settings-2.svg"} />
                        </span>
                        <span className="menu-text">Settings</span>
                        <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu">
                        <ul className="menu-subnav">
                            {adminUser && isAvailable('admins') && <li className={`menu-item ${getMenuItemActive("/admin", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/admin">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Files/User-folder.svg"} />
                                    </span>
                                    <span className="menu-text">Admins</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('api-settings') && <li className={`menu-item ${getMenuItemActive("/api-settings", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/api-settings/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Puzzle.svg"} />
                                    </span>
                                    <span className="menu-text">API Settings</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('frontend') && <li className={`menu-item ${getMenuItemActive("/frontend", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/frontend/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Devices/Display3.svg"} />
                                    </span>
                                    <span className="menu-text">Frontend Management</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('email_templates') && <li className={`menu-item ${getMenuItemActive("/email-templates", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/email-templates/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Communication/Mail-opened.svg"} />
                                    </span>
                                    <span className="menu-text">Email Templates</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('page-metas') && <li className={`menu-item ${getMenuItemActive("/page-metas", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/page-metas/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/General/Search.svg"} />
                                    </span>
                                    <span className="menu-text">Page Metas</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('faq') && <li className={`menu-item ${getMenuItemActive("/faq", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/faq/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Question-circle.svg"} />
                                    </span>
                                    <span className="menu-text">FAQ</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('articles') && <li className={`menu-item ${getMenuItemActive("/articles", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/articles/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Option.svg"} />
                                    </span>
                                    <span className="menu-text">Articles</span>
                                </NavLink>
                            </li>}

                            {adminUser && isAvailable('errorlogs') && <li className={`menu-item ${getMenuItemActive("/errorlogs", false)}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/errorlogs/">
                                    <span className="svg-icon menu-icon">
                                        <SVG src={"/media/svg/icons/Code/Error-circle.svg"} />
                                    </span>
                                    <span className="menu-text">Error Logs</span>
                                </NavLink>
                            </li>}
                        </ul>
                    </div>
                </li>

                {adminUser && isAvailable('kyc') && <li className={`menu-item ${getMenuItemActive("/kyc", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/kyc/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Shield-check.svg"} />
                        </span>
                        <span className="menu-text">KYC</span>
                        {kyc_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{kyc_total}&nbsp;</span>}
                    </Link>
                </li>}

                {adminUser && isAvailable('users') && <li className={`menu-item ${getMenuItemActive("/users", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/users/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/User.svg"} />
                        </span>
                        <span className="menu-text">Users</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('autobet') && <li className={`menu-item ${getMenuItemActive("/placebet", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/placebet/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                        </span>
                        <span className="menu-text">Place Bet</span>
                        {pending_event_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_event_total}&nbsp;</span>}
                    </Link>
                </li>}

                {adminUser && isAvailable('messages') && <li className={`menu-item ${getMenuItemActive("/message-center", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/message-center/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Communication/Mail-box.svg"} />
                        </span>
                        <span className="menu-text">Messages</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('bet_activities') && <li className={`menu-item ${getMenuItemActive("/bet-activities", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/bet-activities/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Gamepad2.svg"} />
                        </span>
                        <span className="menu-text">Bet Activities</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('withdraw_logs') && <li className={`menu-item ${getMenuItemActive("/withdraw-log", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/withdraw-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Money.svg"} />
                        </span>
                        <span className="menu-text">Withdraw Logs</span>
                        {pending_withdraw_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_withdraw_total}&nbsp;</span>}
                    </Link>
                </li>}

                {adminUser && isAvailable('deposit_logs') && <li className={`menu-item ${getMenuItemActive("/deposit-log", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/deposit-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Wallet.svg"} />
                        </span>
                        <span className="menu-text">Deposit Logs</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('cashback') && <li className={`menu-item ${getMenuItemActive("/cashback", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/cashback/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Dollar.svg"} />
                        </span>
                        <span className="menu-text">Cashback</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('credits') && <li className={`menu-item ${getMenuItemActive("/credits", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/credits/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Wallet2.svg"} />
                        </span>
                        <span className="menu-text">Credits</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('autobet') && <li className={`menu-item ${getMenuItemActive("/autobet", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/autobet/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                        </span>
                        <span className="menu-text">AutoBet</span>
                        {pending_event_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_event_total}&nbsp;</span>}
                    </Link>
                </li>}

                {adminUser && isAvailable('custom-events') && <li className={`menu-item ${getMenuItemActive("/custom-events", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/custom-events/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Thunder-move.svg"} />
                        </span>
                        <span className="menu-text">Custom Events</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('promotions') && <li className={`menu-item ${getMenuItemActive("/promotions", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/promotions/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Cart3.svg"} />
                        </span>
                        <span className="menu-text">Promotions</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('support-tickets') && <li className={`menu-item ${getMenuItemActive("/support-tickets", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/support-tickets/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                        </span>
                        <span className="menu-text">Support Tickets</span>
                    </Link>
                </li>}

                {adminUser && isAvailable('reports') && <li className={`menu-item menu-item-submenu ${getMenuItemActive("/reports", true)}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover">
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
                            <li className={`menu-item ${getMenuItemActive("/reports/wager")}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/reports/wager">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Wager Activities</span>
                                </NavLink>
                            </li>
                            <li className={`menu-item ${getMenuItemActive("/reports/users")}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/reports/users">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Active Users</span>
                                </NavLink>
                            </li>
                            <li className={`menu-item ${getMenuItemActive("/reports/deposit")}`} aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/reports/deposit">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Deposit</span>
                                </NavLink>
                            </li>
                            <li className={`menu-item ${getMenuItemActive("/reports/withdraw")}`}
                                aria-haspopup="true">
                                <NavLink className="menu-link border-0" to="/reports/withdraw">
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Withdraw</span>
                                </NavLink>
                            </li>
                            <li className={`menu-item ${getMenuItemActive("/reports/profit")}`}
                                aria-haspopup="true">
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

                {adminUser && isAvailable('predictions') && <li className={`menu-item ${getMenuItemActive("/predictions", false)}`}
                    aria-haspopup="true">
                    <Link className="menu-link" to="/predictions/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                        </span>
                        <span className="menu-text">Predictions</span>
                    </Link>
                </li>}
            </ul>
            <br />
            <br />
        </>
    );
}

const mapStateToProps = (state) => ({
    kyc_total: state.kyc.total,
    pending_withdraw_total: state.withdrawlog.pending_total,
    pending_event_total: state.events.pending_total,
    adminUser: state.adminUser.adminUser,
});

const mapActionsToProps = {
    getVerifications: kyc.actions.getVerifications,
    getWithdrawLog: withdrawlog.actions.getWithdrawLog,
    getEvents: events.actions.getEvents,
};

export default connect(mapStateToProps, mapActionsToProps)(AsideMenuList);