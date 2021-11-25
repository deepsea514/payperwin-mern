import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as gift_cards from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CustomPagination from "../../../components/CustomPagination.jsx";

class GiftCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getGiftCardsAction } = this.props;
        getGiftCardsAction(1);
    }

    onFilterChange = (filter) => {
        const { filterGiftCardChange } = this.props;
        filterGiftCardChange(filter);
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { gift_cards, loading } = this.props;

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
        if (gift_cards.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Gift Cards</h3>
                    </td>
                </tr>
            );
        }

        return gift_cards.map((gift_card, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{gift_card.card_number}</td>
                <td>{gift_card.createdAt ? this.getDateFormat(gift_card.createdAt) : null}</td>
                <td>${gift_card.amount.toFixed(2)}</td>
                <td>{gift_card.user ? gift_card.user.email : null}</td>
                <td>{gift_card.usedAt ? this.getDateFormat(gift_card.usedAt) : null}</td>
            </tr>
        ));
    }

    onPageChange = (page) => {
        const { getGiftCardsAction } = this.props;
        getGiftCardsAction(page);
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
                                <h3 className="card-label">Gift Cards</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-3 col-md-3">
                                    <select
                                        className="form-control"
                                        value={filter.status}
                                        onChange={e => this.onFilterChange({ status: e.target.value })}
                                    >
                                        <option value="all">Choose Status...</option>
                                        <option value="used">Used</option>
                                        <option value="unused">Unused</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Status
                                    </small>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Card Number</th>
                                            <th scope="col">Purchased At</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Used By</th>
                                            <th scope="col">Used At</th>
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
    gift_cards: state.gift_cards.gift_cards,
    loading: state.gift_cards.loading,
    total: state.gift_cards.total,
    currentPage: state.gift_cards.currentPage,
    filter: state.gift_cards.filter,
})

export default connect(mapStateToProps, gift_cards.actions)(GiftCards)