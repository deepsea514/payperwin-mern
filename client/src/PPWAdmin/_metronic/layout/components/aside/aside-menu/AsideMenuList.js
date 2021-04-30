/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
    const location = useLocation();
    const getMenuItemActive = (url, hasSubmenu = false) => {
        return checkIsActive(location, url)
            ? ` ${!hasSubmenu &&
            "menu-item-active"} menu-item-open menu-item-not-hightlighted`
            : "";
    };

    return (
        <>
            {/* begin::Menu Nav */}
            <ul className={`menu-nav ${layoutProps.ulClasses}`}>
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/dashboard/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Design/Layers.svg"} />
                        </span>
                        <span className="menu-text">Dashboard</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/kyc", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/kyc/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Shield-check.svg"} />
                        </span>
                        <span className="menu-text">KYC</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/customers", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/customers/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/User.svg"} />
                        </span>
                        <span className="menu-text">Customers</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/bet-activities", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/bet-activities/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Gamepad2.svg"} />
                        </span>
                        <span className="menu-text">Bet Activities</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/withdraw-log", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/withdraw-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Money.svg"} />
                        </span>
                        <span className="menu-text">Withdraw Logs</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/deposit-log", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/deposit-log/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Wallet.svg"} />
                        </span>
                        <span className="menu-text">Deposit Logs</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/wager-feeds", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/wager-feeds/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Gamepad2.svg"} />
                        </span>
                        <span className="menu-text">Wager Feeds</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/autobet", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/autobet/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Devices/Laptop-macbook.svg"} />
                        </span>
                        <span className="menu-text">AutoBet</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/events", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/events/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Thunder-move.svg"} />
                        </span>
                        <span className="menu-text">Events</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/email-templates", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/email-templates/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Communication/Mail-opened.svg"} />
                        </span>
                        <span className="menu-text">Email Templates</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/promotions", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/promotions/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/Shopping/Cart3.svg"} />
                        </span>
                        <span className="menu-text">Promotions</span>
                    </Link>
                </li>
                {/*end::1 Level*/}

                {/*begin::1 Level*/}
                <li
                    className={`menu-item ${getMenuItemActive("/tickets", false)}`}
                    aria-haspopup="true"
                >
                    <Link className="menu-link" to="/tickets/">
                        <span className="svg-icon menu-icon">
                            <SVG src={"/media/svg/icons/General/Bookmark.svg"} />
                        </span>
                        <span className="menu-text">Tickets</span>
                    </Link>
                </li>
                {/*end::1 Level*/}
            </ul>
            {/* end::Menu Nav */}
        </>
    );
}
