/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerCredits } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";
import numberFormat from "../../../../../helpers/numberFormat";

class Credit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            creditAvailable: 0,
            perPage: 10,
            credits: [],
            total: 0,
            loading: false,
            page: 1,
        }
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        this.getCreditsData(1);
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    getCreditsData = (loadpage = 1) => {
        const { id } = this.state;
        this.setState({
            loading: true,
            page: loadpage
        });
        getCustomerCredits(id, loadpage)
            .then(({ data }) => {
                const { data: credits, total, credit: creditAvailable } = data;
                this._Mounted && this.setState({
                    loading: false,
                    credits: credits,
                    total: total,
                    creditAvailable: creditAvailable
                })
            })
            .catch(() => {
                this._Mounted && this.setState({
                    loading: false,
                    credits: [],
                    total: 0,
                    creditAvailable: 0
                })
            })
    }

    onPageChange = (newpage) => {
        if (page != newpage) {
            this.getCreditsData(newpage);
        }
    }

    tableBody = () => {
        const { loading, credits } = this.state;
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
        if (credits.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Credits</h3>
                    </td>
                </tr>
            );
        }
        return credits.map((credit, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {dateformat(new Date(credit.createdAt), "yyyy-mm-dd HH:MM")}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {numberFormat(credit.amount.toFixed(2))}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {this.getCreditAction(credit.financialtype)}
                    </span>
                </td>
            </tr>
        ));
    }

    getCreditAction = (type) => {
        switch (type) {
            case 'credit':
                return <span className="label label-lg label-outline-info label-inline font-weight-lighter mr-2">Credit</span>
            case 'transfer-in':
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Transfer In</span>
            case 'transfer-out':
                return <span className="label label-lg label-outline-danger label-inline font-weight-lighter mr-2">Transfer Out</span>
        }
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className, customer } = this.props;
        const { perPage, id, page, total, creditAvailable } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                            Line of Credits
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
                    {customer && <h4 className="text-left">Credit Available: ${numberFormat(creditAvailable)}</h4>}
                    <div className="table-responsive text-left pt-3">
                        <table className="table table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="p-0" >#</th>
                                    <th className="p-0" >Time</th>
                                    <th className="p-0" >Amount</th>
                                    <th className="p-0" >Action</th>
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

export default Credit;
