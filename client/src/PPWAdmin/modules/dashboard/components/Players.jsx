/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";

export function Players({ className, dashboardplayer }) {
    return (
        <>
            <div className="col-lg-6 col-xl-4 col-xxl-4">
                <div className={`card card-custom ${className} bg-success`}>
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
                            <span className={`symbol symbol-50 symbol-light-success mr-2`}>
                                <span className="symbol-label">
                                    <span className={`svg-icon svg-icon-xl svg-icon-success`}>
                                        <SVG src="/media/svg/icons/General/User.svg" />
                                    </span>
                                </span>
                            </span>
                            <div className="d-flex flex-column">
                                <span className="text-white font-weight-bolder font-size-h2">
                                    + {dashboardplayer.totalplayer}
                                </span>
                                <span className="text-white font-weight-bold mt-2 font-size-h3">
                                    Total Players
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-xl-4 col-xxl-4">
                <div className={`card card-custom ${className} bg-warning`}>
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
                            <span className={`symbol symbol-50 symbol-light-warning mr-2`}>
                                <span className="symbol-label">
                                    <span className={`svg-icon svg-icon-xl svg-icon-warning`}>
                                        <SVG src="/media/svg/icons/Devices/Gamepad2.svg" />
                                    </span>
                                </span>
                            </span>
                            <div className="d-flex flex-column">
                                <span className="text-white font-weight-bolder font-size-h2">
                                    + {dashboardplayer.totalactiveplayer}
                                </span>
                                <span className="text-white font-weight-bold mt-2 font-size-h3">
                                    Active Players
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
