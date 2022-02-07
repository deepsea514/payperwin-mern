import React from "react";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";

export function DropdownMenuCustomer({ id }) {
    return <>
        <ul className="navi navi-hover">
            <li className="navi-item">
                <Link to={`/users/${id}/profile/overview`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Design/Layers.svg" /></span>
                    <span className="navi-text">Customer Overview</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/information`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/General/User.svg" /></span>
                    <span className="navi-text">Personal Information</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/preference`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/General/Settings-1.svg" /></span>
                    <span className="navi-text">Preference</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/login-history`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Code/Compiling.svg" /></span>
                    <span className="navi-text">Login History</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/credit`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Shopping/Wallet2.svg" /></span>
                    <span className="navi-text">Line of Credit</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/deposit`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Communication/Shield-user.svg" /></span>
                    <span className="navi-text">Deposit</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/withdraw`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Communication/Mail-opened.svg" /></span>
                    <span className="navi-text">Withdraw</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/transactions`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Layout/Layout-top-panel-6.svg" /></span>
                    <span className="navi-text">Transactions</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/bet-log`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Layout/Layout-top-panel-6.svg" /></span>
                    <span className="navi-text">Bet Log</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/tier`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/General/Settings-1.svg" /></span>
                    <span className="navi-text">Custmoer Tier</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to={`/users/${id}/profile/referral`} className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Files/User-folder.svg" /></span>
                    <span className="navi-text">Friend Referral</span>
                </Link>
            </li>
        </ul>
    </>
}
