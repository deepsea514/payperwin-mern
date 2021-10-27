import React from "react";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";

export function DropdownMenuDashboard() {
    return <>
        <ul className="navi navi-hover">
            <li className="navi-item">
                <Link to="/lastdeposits" className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Design/Layers.svg" /></span>
                    <span className="navi-text">Last Deposits</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to="/lastwithdraws" className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Design/Layers.svg" /></span>
                    <span className="navi-text">Last Withdraws</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to="/lastbets" className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Design/Layers.svg" /></span>
                    <span className="navi-text">Last Bets</span>
                </Link>
            </li>
            <li className="navi-item">
                <Link to="/bots" className="navi-link">
                    <span className="navi-icon"><SVG src="/media/svg/icons/Design/Layers.svg" /></span>
                    <span className="navi-text">Bot Overview</span>
                </Link>
            </li>
        </ul>
    </>
}
