/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";

export function WinPercentage({ className, wins }) {
    return (
        <div className={`card card-custom bg-dark ${className} h-auto`}>
            <div className="card-body d-flex flex-column p-0 text-left ml-5 pt-3">
                <h5 className="card-title font-weight-bolder text-white mb-0">
                    Win %
                </h5>
                <h3 className="card-title font-weight-bolder text-white my-2">
                    {wins} %
                </h3>
            </div>
        </div>
    );
}
