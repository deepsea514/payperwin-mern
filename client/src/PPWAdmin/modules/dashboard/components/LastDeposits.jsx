/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
const config = require("../../../../../../config.json");
const FinancialStatus = config.FinancialStatus;

export function LastDeposits({ className, lastdeposits, loadingdeposits, roothistory }) {
    const getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };
    const tableBody = () => {
        if (loadingdeposits)
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
        if (lastdeposits.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Deposits</h3>
                    </td>
                </tr>
            );
        }

        return lastdeposits.map((deposit, index) => {
            return (
                <tr key={index} onClick={gotoDeposit} style={{ cursor: "pointer" }} className="text-hover-primary">
                    <td className="pl-0">
                        <span className=" font-weight-bolder text-hover-primary mb-1 font-size-lg">
                            {getDate(deposit.createdAt)}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-bolder d-block font-size-lg">
                            {deposit.user.username}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {deposit.amount} {deposit.user.currency}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {deposit.reason ? deposit.reason.title : null}
                        </span>
                    </td>
                    <td className="pl-0">
                        <span className=" font-weight-500">
                            {deposit.method}
                        </span>
                    </td>
                    {deposit.status === FinancialStatus.success &&
                        <td className="pl-0">
                            <span className="label label-lg label-light-success label-inline">
                                {deposit.status}
                            </span>
                        </td>}
                    {deposit.status === FinancialStatus.pending &&
                        <td className="pl-0">
                            <span className="label label-lg label-light-primary label-inline">
                                {deposit.status}
                            </span>
                        </td>}
                    {deposit.status === FinancialStatus.onhold &&
                        <td className="pl-0">
                            <span className="label label-lg label-light-warning label-inline">
                                {deposit.status}
                            </span>
                        </td>}
                </tr>
            );
        });
    }

    const gotoDeposit = () => {
        roothistory.push("/deposit-log");
    }

    return (
        <div className={`card card-custom ${className}`}>
            {/* Head */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label font-weight-bolder text-dark">
                        Last 10 deposits
                    </span>
                    <span className="text-muted mt-3 font-weight-bold font-size-sm">
                        More than 400+ new deposits
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
                                <th className="p-0" style={{ minWidth: "110px" }} >Reason</th>
                                <th className="p-0" style={{ minWidth: "110px" }} >Method</th>
                                <th className="p-0" style={{ minWidth: "150px" }} >Status</th>
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
