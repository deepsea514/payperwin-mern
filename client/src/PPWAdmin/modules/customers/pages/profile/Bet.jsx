/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerBets } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";

class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            bets: [],
            total: 0,
            page: 1,
            perPage: 10,
        }
    }

    componentDidMount() {
        console.log('asdf')
        this.getData();
    }

    getData = (loadpage = 1) => {
        const { customer } = this.props;
        const { perPage } = this.state;
        this.setState({ loading: true, });

        getCustomerBets(customer._id, loadpage, perPage)
            .then(({ data }) => {
                const { total, page, bets } = data;
                this.setState({ total, page, bets, loading: false });
            })
            .catch(() => {
                this.setState({
                    bets: [],
                    total: 0,
                    page: 1,
                    perPage: 15,
                    loading: false
                });
            })
    }

    onPageChange = (newpage) => {
        const { page } = this.state;
        if (page != newpage) {
            this.getData(newpage);
        }
    }

    tableBody = () => {
        const { bets, loading } = this.state;
        const { customer } = this.props;

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
        if (bets.length == 0) {
            return (
                <tr>
                    <td colSpan="6" align="center">
                        <h3>No Bets</h3>
                    </td>
                </tr>
            );
        }
        return bets.map((bet, index) => (
            <tr key={index}>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {index + 1}
                    </span>
                </td>
                <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                        {this.getDate(bet.createdAt)}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        ${bet.bet} {customer.currency}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.lineQuery.sportName}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.teamA.name} vs {bet.teamB.name}
                    </span>
                </td>
                <td className="pl-0" style={{ textTransform: "uppercase" }}>
                    {bet.lineQuery.type == "moneyline" && <span className="label label-lg label-light-danger label-inline">
                        {bet.lineQuery.type}
                    </span>}
                    {bet.lineQuery.type == "spread" && <span className="label label-lg label-light-info label-inline">
                        {bet.lineQuery.type}
                    </span>}
                    {bet.lineQuery.type == "total" && <span className="label label-lg label-light-success label-inline">
                        {bet.lineQuery.type}
                    </span>}
                </td>
            </tr>
        ));
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className } = this.props;
        const { perPage, page, total } = this.state;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;
        return (
            <div className={`card card-custom ${className}`}>
                {/* Head */}
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                            Bets
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
                    <div className="table-responsive text-left">
                        <table className="table table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="p-0" >#</th>
                                    <th className="p-0" >Time</th>
                                    <th className="p-0" >Amount</th>
                                    <th className="p-0" >Sport</th>
                                    <th className="p-0" >Event</th>
                                    <th className="p-0" >Line</th>
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
        );
    }
}

export default Bet;
