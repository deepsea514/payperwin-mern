/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";

export function LastBets({ className, loadingbets, lastbets, roothistory }) {
    const getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };
    const tableBody = () => {
        if (loadingbets)
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
        if (lastbets.length == 0) {
            return (
                <tr>
                    <td colSpan="5" align="center">
                        <h3>No Bets</h3>
                    </td>
                </tr>
            );
        }

        return lastbets.map((bet, index) => {
            return (
                <tr key={index} onClick={gotoBet} style={{ cursor: "pointer" }} className="text-hover-primary">
                    <td className="pl-0">
                        <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">
                            {getDate(bet.createdAt)}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className="font-weight-bolder d-block font-size-lg">
                            {bet.userId.username}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {bet.bet} {bet.userId.currency}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {bet.lineQuery.sportName}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {`${bet.teamA.name} vs ${bet.teamB.name}`}
                        </span>
                    </td>
                    {bet.lineQuery.type == "moneyline" &&
                        <td className="pl-0">
                            <span className="label label-lg label-light-danger label-inline" style={{ textTransform: "uppercase" }}>
                                {bet.lineQuery.type}
                            </span>
                        </td>}
                    {bet.lineQuery.type == "spread" &&
                        <td className="pl-0">
                            <span className="label label-lg label-light-info label-inline" style={{ textTransform: "uppercase" }}>
                                {bet.lineQuery.type}
                            </span>
                        </td>}
                    {bet.lineQuery.type == "total" &&
                        <td className="pl-0">
                        <span className="label label-lg label-light-success label-inline" style={{ textTransform: "uppercase" }}>
                                {bet.lineQuery.type}
                            </span>
                        </td>}
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
                </div>
            </div>
            {/* Body */}
            <div className="card-body pt-3 pb-0">
                <div className="table-responsive">
                    <table className="table table-vertical-center">
                        <thead>
                            <tr>
                                <th className="p-0" style={{ minWidth: "200px" }} >Time</th>
                                <th className="p-0" style={{ minWidth: "125px" }} >Customer</th>
                                <th className="p-0" style={{ minWidth: "100px" }} >Amount</th>
                                <th className="p-0" style={{ minWidth: "100px" }} >Sport</th>
                                <th className="p-0" style={{ minWidth: "110px" }} >Event</th>
                                <th className="p-0" style={{ minWidth: "150px" }} >Line</th>
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
