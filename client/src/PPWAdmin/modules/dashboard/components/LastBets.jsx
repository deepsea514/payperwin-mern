/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import { Tabs, Tab, Dropdown } from "react-bootstrap";
import { DropdownMenuDashboard } from "./DropdownMenuDashboard";

export function LastBets({ className, loadingbets, lastbets, roothistory, lastsportsbookbets, loadingsportsbookbets, }) {
    const getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    const getBetType = (bet) => {
        if (bet.isParlay) {
            return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">parlay</span>
        }
        const type = bet.origin == 'custom' ? 'moneyline' : bet.lineQuery.type;
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
                const spreads = bet.pickName.split(' ');
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}@{spreads[spreads.length - 1]}</span>
            case "total":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
            default:
                return null;
        }
    }

    const tableBody = (sportsbook) => {
        let loading = false;
        let bets = [];
        if (sportsbook) {
            loading = loadingsportsbookbets;
            bets = lastsportsbookbets
        } else {
            loading = loadingbets;
            bets = lastbets;
        }
        if (loading)
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            )
        if (bets.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Bets</h3>
                    </td>
                </tr>
            );
        }

        return bets.map((bet, index) => {
            if (!bet.userId) return null;
            return (
                <tr key={index} onClick={gotoBet} style={{ cursor: "pointer" }} className="text-hover-primary">
                    <td className="pl-0">
                        <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">
                            {getDate(bet.createdAt)}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className="font-weight-bolder d-block font-size-lg">
                            {bet.userId ? bet.userId.email : null}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {Number(bet.bet).toFixed(2)} {bet.userId ? bet.userId.currency : 'CAD'}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {bet.isParlay ? 'Parlay' :
                                bet.origin == 'custom' ? 'Side Bets' : bet.lineQuery.sportName}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {bet.isParlay ? '' :
                                bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}
                        </span>
                    </td>
                    <td className="pl-0">
                        {getBetType(bet)}
                    </td>
                </tr>
            )
        })
    }

    const gotoBet = () => {
        roothistory.push("/bet-activities");
    }

    return (
        <div className={`card card-custom ${className}`}>
            {/* Head */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                        Last 10 bets
                    </span>
                    <span className="text-muted mt-3 font-weight-bold font-size-sm">
                        More than 400+ new bets
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
                <Tabs>
                    <Tab eventKey="ppwbets" title="P2P Bets" className="border-0">
                        <div className="table-responsive p-3">
                            <table className="table table-vertical-center">
                                <thead>
                                    <tr>
                                        <th className="p-0">Time</th>
                                        <th className="p-0">Customer</th>
                                        <th className="p-0">Amount</th>
                                        <th className="p-0">Sport</th>
                                        <th className="p-0">Event</th>
                                        <th className="p-0">Line</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableBody(false)}
                                </tbody>
                            </table>
                        </div>
                    </Tab>
                    <Tab eventKey="sportsbook" title="SB Bets" className="border-0">
                        <div className="table-responsive p-3">
                            <table className="table table-vertical-center">
                                <thead>
                                    <tr>
                                        <th className="p-0">Time</th>
                                        <th className="p-0">Customer</th>
                                        <th className="p-0">Amount</th>
                                        <th className="p-0">Sport</th>
                                        <th className="p-0">Event</th>
                                        <th className="p-0">Line</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableBody(true)}
                                </tbody>
                            </table>
                        </div>
                    </Tab>
                </Tabs>

            </div>
        </div>
    );
}
