/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerReferrals } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
import numberFormat from "../../../../../helpers/numberFormat";

class Referral extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            perPage: 10,
            referrals: [],
            total: 0,
            comission: 0,
            loading: false,
            page: 1,
        }
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        this.getReferralData(1);
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    getReferralData = (loadpage = 1) => {
        const { id } = this.state;
        this.setState({
            loading: true,
            page: loadpage
        });
        getCustomerReferrals(id, loadpage)
            .then(({ data }) => {
                const { data: referrals, total, comission } = data;
                this._Mounted && this.setState({
                    loading: false,
                    referrals: referrals,
                    total: total,
                    comission: comission ? comission : 0,
                })
            })
            .catch(() => {
                this._Mounted && this.setState({
                    loading: false,
                    referrals: [],
                    total: 0,
                    comission: 0,
                })
            })
    }

    onPageChange = (newpage) => {
        if (page != newpage) {
            this.getReferralData(newpage);
        }
    }

    tableBody = () => {
        const { loading, referrals } = this.state;
        if (loading) {
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
            );
        }
        if (referrals.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Records</h3>
                    </td>
                </tr>
            );
        }
        return referrals.map((referral, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {referral.email}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {dateformat(new Date(referral.createdAt), "mediumDate")}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        <span className={`label label-lg label-inline font-weight-lighter mr-2  label-${referral.firstDeposit ? 'success' : 'info'}`}>
                            {referral.firstDeposit ? "Deposit Made" : "Didn't make"}
                        </span>
                    </span>
                </td>
            </tr>
        ));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className, customer } = this.props;
        const { perPage, id, page, total, comission } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                            Customer Referral
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
                                <DropdownMenuCustomer id={id} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                {/* Body */}
                <div className="card-body pt-3 pb-0">
                    {customer && <h4 className="text-left">Comission Paid: ${numberFormat(comission)}</h4>}
                    <div className="table-responsive text-left pt-3">
                        <table className="table table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="p-0" >#</th>
                                    <th className="p-0" >User</th>
                                    <th className="p-0" >Joined in</th>
                                    <th className="p-0" >Deposit Made</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.tableBody()}
                            </tbody>
                        </table>
                        <CustomPagination
                            className="pagination pull-right"
                            currentPage={page - 1}
                            totalPages={totalPages}
                            showPages={7}
                            onChangePage={(page) => this.onPageChange(page + 1)}
                        />
                    </div>
                </div>
            </div >
        );
    }
}

export default Referral;
