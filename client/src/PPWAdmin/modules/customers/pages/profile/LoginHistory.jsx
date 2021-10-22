import React from "react";
import dateformat from "dateformat";
import { getCustomerLoginHistory } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";

class LoginHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            loading: true,
            loginHistory: [],
            total: 0,
            page: 1,
            perPage: 10,
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        const { customer } = this.props;
        const { page, perPage } = this.state;
        this.setState({ loading: true });

        getCustomerLoginHistory(customer._id, page, perPage)
            .then(({ data }) => {
                const { total, page, perPage, loginHistory } = data;
                this.setState({ total, page, perPage, loginHistory });
            })
            .catch(() => {
                this.setState({
                    loginHistory: [],
                    total: 0,
                    page: 1,
                    perPage: 15,
                });
            })
            .finally(() => this.setState({ loading: false }));
    }

    onPageChange = async (newpage) => {
        const { page } = this.state;
        if (page != newpage) {
            await this.setState({ page: newpage });
            this.getData();
        }
    }

    tableBody = () => {
        const { loginHistory, loading } = this.state;

        if (loading) {
            return (
                <tr>
                    <td colSpan="3" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (loginHistory.length == 0) {
            return (
                <tr>
                    <td colSpan="3" align="center">
                        <h3>No History</h3>
                    </td>
                </tr>
            );
        }
        return loginHistory.map((history, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {this.getDate(history.createdAt)}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        {history.ip_address}
                    </span>
                </td>
            </tr>
        ));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };
    render() {
        const { perPage, page, total, id } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card card-custom card-stretch">
                        <div className="card-header border-0">
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-title font-weight-bolder text-dark">Login History</h3>
                            </div>
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
                        <div className="card-body pt-3 pb-0">
                            <div className="">
                                <table className="table table-vertical-center text-left">
                                    <thead>
                                        <tr>
                                            <th className="p-0" >#</th>
                                            <th className="p-0" >Time</th>
                                            <th className="p-0" >Ip Address</th>
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
                    </div>
                </div>
            </div>

        );
    }
}

export default LoginHistory;