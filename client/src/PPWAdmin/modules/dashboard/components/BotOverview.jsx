/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import { Dropdown } from "react-bootstrap";
import config from "../../../../../../config.json";
import { DropdownMenuDashboard } from "./DropdownMenuDashboard";
import numberFormat from "../../../../helpers/numberFormat";

export function BotOverview({ className, bots, loadingbots, roothistory }) {
    const tableBody = () => {
        if (loadingbots)
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            )
        if (bots.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Bots</h3>
                    </td>
                </tr>
            );
        }
        return bots.map((bot, index) => {
            if (!bot.userId) return null;
            const profit = bot.userId.balance - bot.deposit + bot.withdraw;
            return (
                <tr key={index} className="text-hover-primary">
                    <td className="pl-0">
                        <span className=" font-weight-bolder text-hover-primary mb-1 font-size-lg">
                            {index + 1}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-bolder d-block font-size-lg">
                            {bot.userId ? bot.userId.email : null}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {bot.userId ? '$' + numberFormat(bot.userId.balance) : null}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            ${numberFormat(bot.inplay)}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {profit >= 0 ? '' : '-'} ${numberFormat(profit >= 0 ? profit : -profit)}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            ${numberFormat(bot.fee)}
                        </span>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div className={`card card-custom ${className}`}>
            {/* Head */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                        Autobet Bot Overview
                    </span>
                </h3>
                <div className="card-toolbar">
                    <Dropdown className="dropdown-inline" drop="down" alignRight>
                        <Dropdown.Toggle
                            id="dropdown-toggle-top2"
                            variant="transparent"
                            className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle">
                            View:
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                            <DropdownMenuDashboard />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {/* Body */}
            <div className="card-body pt-3 pb-0">
                <div className="table-responsive">
                    <table className="table table-vertical-center">
                        <thead>
                            <tr>
                                <th className="p-0">#</th>
                                <th className="p-0">User</th>
                                <th className="p-0">Balance</th>
                                <th className="p-0">In play</th>
                                <th className="p-0">P/L</th>
                                <th className="p-0">Fees Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableBody()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
