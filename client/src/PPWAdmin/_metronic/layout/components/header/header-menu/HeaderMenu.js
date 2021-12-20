/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink, Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive } from "../../../../_helpers";
import config from "../../../../../../../../config.json";
import { connect } from "react-redux";
const AdminRoles = config.AdminRoles;

function HeaderMenu({ layoutProps, currentUser, kyc_total, pending_withdraw_total, pending_event_total }) {
    const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }

    const isAvailable = (module) => {
        if (currentUser) {
            if (AdminRoles[currentUser.role] && AdminRoles[currentUser.role][module])
                return true;
            return false;
        }
        return false;
    }

    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            <li className={`menu-item menu-item-rel ${getMenuItemActive('/dashboard')}`}>
                <NavLink className="menu-link" to="/dashboard">
                    <span className="menu-text">Dashboard</span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow" />)}
                </NavLink>
            </li>

            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel`}>
                <NavLink className="menu-link menu-toggle" to="/">
                    <span className="menu-text">Menu</span>
                    <i className="menu-arrow"></i>
                </NavLink>

                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                    <ul className="menu-subnav">
                        <li
                            className={`menu-item menu-item-submenu`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link menu-toggle" to="/google-material/inputs">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Design/PenAndRuller.svg"} />
                                </span>
                                <span className="menu-text">
                                    Settings
                                </span>
                                <i className="menu-arrow" />
                            </NavLink>
                            <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
                                <ul className="menu-subnav">
                                    {currentUser && isAvailable('admins') && <li className={`menu-item ${getMenuItemActive("/admin", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/admin">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Files/User-folder.svg"} />
                                            </span>
                                            <span className="menu-text">Admins</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('api-settings') && <li className={`menu-item ${getMenuItemActive("/api-settings", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/api-settings/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Code/Puzzle.svg"} />
                                            </span>
                                            <span className="menu-text">API Settings</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('frontend') && <li className={`menu-item ${getMenuItemActive("/frontend", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/frontend/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Devices/Display3.svg"} />
                                            </span>
                                            <span className="menu-text">Frontend Management</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('email_templates') && <li className={`menu-item ${getMenuItemActive("/email-templates", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/email-templates/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Communication/Mail-opened.svg"} />
                                            </span>
                                            <span className="menu-text">Email Templates</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('page-metas') && <li className={`menu-item ${getMenuItemActive("/page-metas", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/page-metas/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/General/Search.svg"} />
                                            </span>
                                            <span className="menu-text">Page Metas</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('faq') && <li className={`menu-item ${getMenuItemActive("/faq", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/faq/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Code/Question-circle.svg"} />
                                            </span>
                                            <span className="menu-text">FAQ</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('articles') && <li className={`menu-item ${getMenuItemActive("/articles", false)}`}
                                        aria-haspopup="true">
                                        <NavLink className="menu-link border-0" to="/articles/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Code/Option.svg"} />
                                            </span>
                                            <span className="menu-text">Articles</span>
                                        </NavLink>
                                    </li>}

                                    {currentUser && isAvailable('errorlogs') && <li className={`menu-item ${getMenuItemActive("/errorlogs", false)}`}
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

                        <li
                            className={`menu-item menu-item-submenu`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link menu-toggle" to="/google-material/inputs">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Design/PenAndRuller.svg"} />
                                </span>
                                <span className="menu-text">
                                    Users
                                </span>
                                <i className="menu-arrow" />
                            </NavLink>
                            <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
                                <ul className="menu-subnav">
                                    {currentUser && isAvailable('kyc') && <li className={`menu-item ${getMenuItemActive("/kyc", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/kyc/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/General/Shield-check.svg"} />
                                            </span>
                                            <span className="menu-text">KYC</span>
                                            {kyc_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{kyc_total}&nbsp;</span>}
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('users') && <li className={`menu-item ${getMenuItemActive("/users", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/users/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/General/User.svg"} />
                                            </span>
                                            <span className="menu-text">Users</span>
                                        </Link>
                                    </li>}
                                </ul>
                            </div>
                        </li>

                        <li
                            className={`menu-item menu-item-submenu`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link menu-toggle" to="/google-material/inputs">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Design/PenAndRuller.svg"} />
                                </span>
                                <span className="menu-text">
                                    Bet Activities
                                </span>
                                <i className="menu-arrow" />
                            </NavLink>
                            <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
                                <ul className="menu-subnav">
                                    {currentUser && isAvailable('bet_activities') && <li className={`menu-item ${getMenuItemActive("/bet-activities", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/bet-activities/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Devices/Gamepad2.svg"} />
                                            </span>
                                            <span className="menu-text">Bet Activities</span>
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('autobet') && <li className={`menu-item ${getMenuItemActive("/placebet", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/placebet/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                                            </span>
                                            <span className="menu-text">Place Bet</span>
                                            {pending_event_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_event_total}&nbsp;</span>}
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('autobet') && <li className={`menu-item ${getMenuItemActive("/autobet", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/autobet/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                                            </span>
                                            <span className="menu-text">AutoBet</span>
                                            {pending_event_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_event_total}&nbsp;</span>}
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('custom-events') && <li className={`menu-item ${getMenuItemActive("/custom-events", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/custom-events/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/General/Thunder-move.svg"} />
                                            </span>
                                            <span className="menu-text">Custom Events</span>
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('bet_activities') && <li className={`menu-item ${getMenuItemActive("/mismatch-scores", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/mismatch-scores/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/General/Duplicate.svg"} />
                                            </span>
                                            <span className="menu-text">Mismatch Scores</span>
                                        </Link>
                                    </li>}
                                </ul>
                            </div>
                        </li>

                        {currentUser && isAvailable('messages') && <li className={`menu-item ${getMenuItemActive("/message-center", false)}`}
                            aria-haspopup="true">
                            <Link className="menu-link" to="/message-center/">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Communication/Mail-box.svg"} />
                                </span>
                                <span className="menu-text">Messages</span>
                            </Link>
                        </li>}

                        <li
                            className={`menu-item menu-item-submenu`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link menu-toggle" to="/google-material/inputs">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Design/PenAndRuller.svg"} />
                                </span>
                                <span className="menu-text">
                                    Financial
                                </span>
                                <i className="menu-arrow" />
                            </NavLink>
                            <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
                                <ul className="menu-subnav">
                                    {currentUser && isAvailable('withdraw_logs') && <li className={`menu-item ${getMenuItemActive("/withdraw-log", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/withdraw-log/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Shopping/Money.svg"} />
                                            </span>
                                            <span className="menu-text">Withdraw Logs</span>
                                            {pending_withdraw_total != 0 && <span className="badge badge-pill badge-primary">&nbsp;{pending_withdraw_total}&nbsp;</span>}
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('deposit_logs') && <li className={`menu-item ${getMenuItemActive("/deposit-log", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/deposit-log/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Shopping/Wallet.svg"} />
                                            </span>
                                            <span className="menu-text">Deposit Logs</span>
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('deposit_logs') && <li className={`menu-item ${getMenuItemActive("/gift-cards", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/gift-cards/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Shopping/Gift.svg"} />
                                            </span>
                                            <span className="menu-text">Gift Cards</span>
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('cashback') && <li className={`menu-item ${getMenuItemActive("/cashback", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/cashback/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Shopping/Dollar.svg"} />
                                            </span>
                                            <span className="menu-text">Cashback</span>
                                        </Link>
                                    </li>}

                                    {currentUser && isAvailable('credits') && <li className={`menu-item ${getMenuItemActive("/credits", false)}`}
                                        aria-haspopup="true">
                                        <Link className="menu-link" to="/credits/">
                                            <span className="svg-icon menu-icon">
                                                <SVG src={"/media/svg/icons/Shopping/Wallet2.svg"} />
                                            </span>
                                            <span className="menu-text">Credits</span>
                                        </Link>
                                    </li>}
                                </ul>
                            </div>
                        </li>

                        {currentUser && isAvailable('promotions') && <li className={`menu-item ${getMenuItemActive("/promotions", false)}`}
                            aria-haspopup="true">
                            <Link className="menu-link" to="/promotions/">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Shopping/Cart3.svg"} />
                                </span>
                                <span className="menu-text">Promotions</span>
                            </Link>
                        </li>}

                        {currentUser && isAvailable('support-tickets') && <li className={`menu-item ${getMenuItemActive("/support-tickets", false)}`}
                            aria-haspopup="true">
                            <Link className="menu-link" to="/support-tickets/">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                                </span>
                                <span className="menu-text">Support Tickets</span>
                            </Link>
                        </li>}

                        {currentUser && isAvailable('reports') && <li className={`menu-item menu-item-submenu ${getMenuItemActive("/reports", true)}`}
                            aria-haspopup="true"
                            data-menu-toggle="hover">
                            <NavLink className="menu-link menu-toggle border-0" to="/reports">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/Design/Pencil.svg"} />
                                </span>
                                <span className="menu-text">Reports</span>
                                <i className="menu-arrow" />
                            </NavLink>
                            <div className={`menu-submenu menu-submenu-classic menu-submenu-right`}>
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

                        {currentUser && isAvailable('predictions') && <li className={`menu-item ${getMenuItemActive("/predictions", false)}`}
                            aria-haspopup="true">
                            <Link className="menu-link" to="/predictions/">
                                <span className="svg-icon menu-icon">
                                    <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                                </span>
                                <span className="menu-text">Predictions</span>
                            </Link>
                        </li>}
                    </ul>
                </div>
            </li>

        </ul>
    </div>;
}

const mapStateToProps = (state) => ({
    kyc_total: state.kyc.total,
    pending_withdraw_total: state.withdrawlog.pending_total,
    pending_event_total: state.events.pending_total,
    currentUser: state.currentUser.currentUser,
});

export default connect(mapStateToProps, null)(HeaderMenu);