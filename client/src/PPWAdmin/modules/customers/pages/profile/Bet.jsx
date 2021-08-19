/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerBets } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import { Tabs, Tab } from "react-bootstrap";

class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 10,
            ppwBet: {
                bets: [],
                total: 0,
                page: 1,
                loading: false,
            },
            sportsbookBet: {
                bets: [],
                total: 0,
                page: 1,
                loading: false,
            }
        }
    }

    componentDidMount() {
        this.getPPWData();
        this.getSportsBookData();
    }

    getPPWData = (loadpage = 1) => {
        const { customer } = this.props;
        const { perPage, ppwBet } = this.state;
        const { bets, total, page } = ppwBet;
        this.setState({
            ppwBet: {
                bets,
                total,
                page,
                loading: true
            }
        });

        getCustomerBets(customer._id, loadpage, perPage)
            .then(({ data }) => {
                const { total, page, bets } = data;
                this.setState({
                    ppwBet: {
                        total,
                        page,
                        bets,
                        loading: false,
                    }
                });
            })
            .catch(() => {
                this.setState({
                    ppwBet: {
                        bets: [],
                        total: 0,
                        page: 1,
                        loading: false
                    }
                });
            })
    }

    getSportsBookData = (loadpage = 1) => {
        const { customer } = this.props;
        const { perPage, sportsbookBet } = this.state;
        const { bets, total, page } = sportsbookBet;
        this.setState({
            sportsbookBet: {
                bets,
                total,
                page,
                loading: true
            }
        });

        getCustomerBets(customer._id, loadpage, perPage, 'sportsbook')
            .then(({ data }) => {
                const { total, page, bets } = data;
                this.setState({
                    sportsbookBet: {
                        total,
                        page,
                        bets,
                        loading: false,
                    }
                });
            })
            .catch(() => {
                this.setState({
                    sportsbookBet: {
                        bets: [],
                        total: 0,
                        page: 1,
                        loading: false
                    }
                });
            })
    }

    onPPWPageChange = (newpage) => {
        const { ppwBet } = this.state;
        const { page } = ppwBet;
        if (page != newpage) {
            this.getPPWData(newpage);
        }
    }

    tablePPWBody = () => {
        const { ppwBet } = this.state;
        const { bets, loading } = ppwBet;
        const { customer } = this.props;
        const { preference } = customer;

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
                    {this.convertOdds(bet.pickOdds)}
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
                    {this.getPPWBetType(bet.lineQuery.type)}
                </td>
            </tr>
        ));
    }

    getPPWBetType = (type) => {
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}</span>
            case "total":
            default:
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
        }
    }

    tableSportsBookBody = () => {
        const { sportsbookBet } = this.state;
        const { bets, loading } = sportsbookBet;
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
                        ${bet.WagerInfo.ToRisk} {customer.currency}
                    </span>
                </td>
                <td className="pl-0">
                    {this.convertOdds(bet.WagerInfo.Odds)}
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.WagerInfo.Sport}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.WagerInfo.EventName}
                    </span>
                </td>
            </tr>
        ));
    }

    convertOdds = (odd) => {
        const { customer } = this.props;
        const { preference } = customer;
        const { oddsFormat } = preference;

        odd = Number(odd);
        switch (oddsFormat) {
            case 'decimal':
                if (odd > 0)
                    return Number(1 + odd / 100).toFixed(2) + '(Decimal Odds)';
                return Number(1 - 100 / odd).toFixed(2) + '(Decimal Odds)';
            case 'american':
                if (odd > 0)
                    return '+' + odd + '(American Odds)';
                return odd + '(American Odds)';
            default:
                return odd;
        }
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className } = this.props;
        const { perPage, ppwBet, sportsbookBet } = this.state;
        const { page: pagePPW, total: totalPPW } = ppwBet;
        const { page: pageSportsBook, total: totalSportsBook } = sportsbookBet;
        const totalPPWPages = totalPPW ? (Math.floor((totalPPW - 1) / perPage) + 1) : 1;
        const totalSportsBookPages = totalSportsBook ? (Math.floor((totalSportsBook - 1) / perPage) + 1) : 1;
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
                    <Tabs>
                        <Tab eventKey="ppwbets" title="PPW Bets" className="border-0">
                            <div className="table-responsive text-left pt-3">
                                <table className="table table-vertical-center">
                                    <thead>
                                        <tr>
                                            <th className="p-0" >#</th>
                                            <th className="p-0" >Time</th>
                                            <th className="p-0" >Amount</th>
                                            <th className="p-0" >Odds</th>
                                            <th className="p-0" >Sport</th>
                                            <th className="p-0" >Event</th>
                                            <th className="p-0" >Line</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tablePPWBody()}
                                    </tbody>
                                </table>
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={pagePPW - 1}
                                    totalPages={totalPPWPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPPWPageChange(page + 1)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="sportsbook" title="SportsBook" className="border-0">
                            <div className="table-responsive text-left pt-3">
                                <table className="table table-vertical-center">
                                    <thead>
                                        <tr>
                                            <th className="p-0" >#</th>
                                            <th className="p-0" >Time</th>
                                            <th className="p-0" >Amount</th>
                                            <th className="p-0" >Odds</th>
                                            <th className="p-0" >Sport</th>
                                            <th className="p-0" >Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableSportsBookBody()}
                                    </tbody>
                                </table>
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={pagePPW - 1}
                                    totalPages={totalPPWPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPPWPageChange(page + 1)}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Bet;
