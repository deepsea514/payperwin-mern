import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as autobet from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomPagination from "../../../components/CustomPagination.jsx";

class AutoBet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        
    }

    onFilterChange = (filter) => {
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { autobets, loading } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (autobets.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Wager Feeds</h3>
                    </td>
                </tr>
            );
        }

        // return autobet.map((bet, index) => (
        //     return 
        // ));
    }

    onPageChange = (page) => {
        
    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage, filter } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Auto Bets</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col">Max.Risk</th>
                                            <th scope="col">Budget</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created</th>
                                            <th scope="col">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                                
                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={currentPage - 1}
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


const mapStateToProps = (state) => ({
    autobets: state.autobet.autobets,
    loading: state.autobet.loading,
    total: state.autobet.total,
    currentPage: state.autobet.currentPage,
    filter: state.autobet.filter,
})

export default connect(mapStateToProps, autobet.actions)(AutoBet)