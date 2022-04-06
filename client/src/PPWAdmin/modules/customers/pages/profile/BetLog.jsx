/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import dateformat from "dateformat";
import { getCustomerBets } from "../../redux/services";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../../components/CustomPagination.jsx";
import { Tabs, Tab } from "react-bootstrap";
import { convertOddsFromAmerican } from '../../../../../helpers/convertOdds.js';
import { Dropdown } from "react-bootstrap";
import { DropdownMenuCustomer } from "./DropdownMenuCustomer";

class BetLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.customer._id,
            perPage: 10,
            p2pBets: {
                bets: [],
                total: 0,
                page: 1,
                loading: false,
            },
            sportsbookBets: {
                bets: [],
                total: 0,
                page: 1,
                loading: false,
            }
        }
    }

    componentDidMount() {
        this.getBetData();
        this.getBetData(1, 'sportsbook');
    }

    getBetData = (loadpage = 1, house = 'p2p') => {
        const { customer } = this.props;
        const { perPage, p2pBets, sportsbookBets } = this.state;
        const betHouse = house == 'p2p' ? p2pBets : sportsbookBets;
        const { bets, total, page } = betHouse;
        this.setState(house == 'p2p' ? {
            p2pBets: {
                bets,
                total,
                page,
                loading: true
            }
        } : {
            sportsbookBets: {
                bets,
                total,
                page,
                loading: true
            }
        });

        getCustomerBets(customer._id, loadpage, perPage, house)
            .then(({ data }) => {
                const { total, page, bets } = data;
                this.setState(house == 'p2p' ? {
                    p2pBets: {
                        total,
                        page,
                        bets,
                        loading: false,
                    }
                } : {
                    sportsbookBets: {
                        total,
                        page,
                        bets,
                        loading: false,
                    }
                });
            })
            .catch(() => {
                this.setState(house == 'p2p' ? {
                    p2pBets: {
                        bets: [],
                        total: 0,
                        page: 1,
                        loading: false
                    }
                } : {
                    sportsbookBets: {
                        total,
                        page,
                        bets,
                        loading: false,
                    }
                });
            })
    }

    onPageChange = (newpage, house = 'p2p') => {
        const { sportsbookBets, p2pBets } = this.state;
        const betHouse = house == 'p2p' ? p2pBets : sportsbookBets;
        const { page } = betHouse;
        if (page != newpage) {
            this.getBetData(newpage, house);
        }
    }

    tableBody = (house = 'p2p') => {
        const { sportsbookBets, p2pBets } = this.state;
        const betHouse = house == 'p2p' ? p2pBets : sportsbookBets;
        const { bets, loading } = betHouse;
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
                        ${bet.bet.toFixed(2)} {customer.currency}
                    </span>
                </td>
                <td className="pl-0">
                    {bet.pickName} @ {convertOddsFromAmerican(bet.pickOdds, 'american')}
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.isParlay ? 'Parlay' :
                            bet.origin == 'custom' ? 'Side Bet' : bet.lineQuery.sportName}
                    </span>
                </td>
                <td className="pl-0">
                    <span className=" font-weight-500">
                        {bet.isParlay ? '' :
                            bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}
                    </span>
                </td>
                <td className="pl-0" style={{ textTransform: "uppercase" }}>
                    {this.getBetStatus(bet.status)}
                </td>
            </tr>
        ));
    }

    getBetStatus = (status) => {
        switch (status) {
            case "Pending":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">Pending</span>
            case "Partial Match":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial&nbsp;Match</span>
            case "Matched":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Matched</span>
            case "Cancelled":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">Cancelled</span>
            case "Settled - Lose":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Lose</span>
            case "Settled - Win":
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
            case "Draw":
                return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">Draw</span>
            case "Accepted":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Accepted</span>
            case "Partial Accepted":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial Accepted</span>
        }
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mmm dd yyyy HH:MM:ss");
    };

    render() {
        const { className } = this.props;
        const { perPage, p2pBets, sportsbookBets, id } = this.state;
        const { page: pagePPW, total: totalPPW } = p2pBets;
        const { page: pageSportsBook, total: totalSportsBook } = sportsbookBets;
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
                    <Tabs>
                        <Tab eventKey="p2pBetss" title="PPW Bets" className="border-0">
                            <div className="table-responsive text-left pt-3">
                                <table className="table table-vertical-center">
                                    <thead>
                                        <tr>
                                            <th className="p-0" >#</th>
                                            <th className="p-0" >Time</th>
                                            <th className="p-0" >Wager</th>
                                            <th className="p-0" >Pick</th>
                                            <th className="p-0" >Sport</th>
                                            <th className="p-0" >Event</th>
                                            <th className="p-0" >Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={pagePPW - 1}
                                    totalPages={totalPPWPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
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
                                            <th className="p-0" >Wager</th>
                                            <th className="p-0" >Pick</th>
                                            <th className="p-0" >Sport</th>
                                            <th className="p-0" >Event</th>
                                            <th className="p-0" >Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody('sportsbook')}
                                    </tbody>
                                </table>
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={pageSportsBook - 1}
                                    totalPages={totalSportsBookPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default BetLog;
