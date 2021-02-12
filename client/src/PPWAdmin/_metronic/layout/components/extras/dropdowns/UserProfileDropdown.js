/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import axios from "axios";
const config = require('../../../../../../../../config.json');
const serverUrl = config.appAdminUrl;

export function UserProfileDropdown({ history }) {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            light:
                objectPath.get(uiService.config, "extras.user.dropdown.style") ===
                "light",
        };
    }, [uiService]);

    const logout = function () {
        localStorage.removeItem("admin-token");
        history.push("/login");
    }

    return (
        <Dropdown drop="down" alignRight>
            <Dropdown.Toggle
                as={DropdownTopbarItemToggler}
                id="dropdown-toggle-user-profile"
            >
                <div
                    className={
                        "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
                    }
                >
                    <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
                        Hi,
                    </span>{" "}
                    <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                        Admin
                    </span>
                    <span className="symbol symbol-35 symbol-light-success">
                        <span className="symbol-label font-size-h5 font-weight-bold">
                            A
                        </span>
                    </span>
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
                <>
                    {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
                    {layoutProps.light && (
                        <>
                            <div className="d-flex align-items-center p-8 rounded-top">
                                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                                    <img src={"/media/users/300_21.jpg"} alt="" />
                                </div>
                                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                                    Admin
                                </div>
                            </div>
                            <div className="separator separator-solid"></div>
                        </>
                    )}

                    {!layoutProps.light && (
                        <div
                            className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
                            style={{
                                backgroundImage: `url(${"/media/misc/bg-1.jpg"})`,
                            }}
                        >
                            <div className="symbol bg-white-o-15 mr-3">
                                <span className="symbol-label text-success font-weight-bold font-size-h4">
                                    A
                                </span>
                                {/*<img alt="Pic" className="hidden" src={user.pic} />*/}
                            </div>
                            <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                                Admin
                            </div>
                        </div>
                    )}
                </>
                <div className="navi navi-spacer-x-0 pt-5">
                    <div className="navi-footer  px-8 py-5">
                        <button
                            className="btn btn-light-primary font-weight-bold"
                            onClick={logout}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
}
