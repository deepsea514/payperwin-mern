import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as wager_feeds from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomPagination from "../../../components/CustomPagination.jsx";

class WagerFeeds extends React.Component {
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
        const { wager_feeds, loading } = this.props;

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
        if (wager_feeds.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Wager Feeds</h3>
                    </td>
                </tr>
            );
        }

        // return wager_feeds.map((bet, index) => (
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
                                <h3 className="card-label">Wager Feeds</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Wager ID</th>
                                            <th scope="col">Sport</th>
                                            <th scope="col">Event Name</th>
                                            <th scope="col">Odds</th>
                                            <th scope="col">To Risk</th>
                                            <th scope="col">To Win</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Wager Date</th>
                                            <th scope="col">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
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
        );
    }
}


const mapStateToProps = (state) => ({
    wager_feeds: state.wager_feeds.wager_feeds,
    loading: state.wager_feeds.loading,
    total: state.wager_feeds.total,
    currentPage: state.wager_feeds.currentPage,
    filter: state.wager_feeds.filter,
})

export default connect(mapStateToProps, wager_feeds.actions)(WagerFeeds)