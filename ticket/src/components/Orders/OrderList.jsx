import React from 'react';
import { getOrders } from '../../redux/services';
import { connect } from 'react-redux';
import dateformat from 'dateformat';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class OrderList extends React.Component {
    state = {
        loading: false,
        orders: [],
        total: 0,
        page: 1,
    }

    componentDidMount() {
        this.loadOrders();
    }

    loadOrders = (page = 1) => {
        this.setState({ loading: false });
        getOrders({ page }).then(({ data }) => {
            const { success, orders, page, total } = data;
            if (success) {
                this.setState({
                    loading: false,
                    page: page,
                    total: total,
                    orders: orders
                });
            } else {
                this.setState({
                    loading: false,
                    page: 1,
                    total: 0,
                    orders: []
                });
            }
        }).catch(() => {
            this.setState({
                loading: false,
                page: 1,
                total: 0,
                orders: []
            });
        })
    }

    changeRate = (usd_price) => {
        const { cad_rate } = this.props;
        return Math.ceil(usd_price * cad_rate * 100) / 100
    }

    render() {
        const { loading, orders, total, page } = this.state;
        if (loading) {
            return (
                <div className="container mb-5 mt-3">
                    <Loader />
                </div>
            )
        }
        if (!orders || orders.length === 0) {
            return (
                <div className="container my-5">
                    <h3 className='text-center'>
                        There are No Orders.
                    </h3>
                </div>
            )
        }
        return (
            <section className="blog-details-area ptb-60">
                <div className="container mb-5">
                    <div className='tab_content'>
                        <div className="tabs_item">
                            <ul className="accordion">
                                {orders.map((order, index) => {
                                    const { items: [item], total, state, created_at } = order;
                                    return (
                                        <li className="accordion-item" key={index}>
                                            <div className="accordion-title">
                                                <div className="schedule-info">
                                                    <h3>{item.ticket_group.event.name}</h3>
                                                    <h6>Sec {item.ticket_group.section}, Row {item.ticket_group.row}</h6>
                                                    <h6>Total Price: CAD ${this.changeRate(total)}</h6>
                                                    <h6>Purchased in: {dateformat(created_at, "ddd mmm dd yyyy HH:MM")}</h6>
                                                    {/* <h6>Status: {state}</h6> */}

                                                    <ul>
                                                        <li>
                                                            <i className="icofont-field" />&nbsp;
                                                            At <span>{item.ticket_group.event.venue.name}</span>&nbsp;
                                                            in {item.ticket_group.event.venue.address.locality}, {item.ticket_group.event.venue.address.region}
                                                        </li>
                                                        <li>
                                                            <i className="icofont-wall-clock" />&nbsp;
                                                            {dateformat(item.ticket_group.event.occurs_at, "ddd mmm dd yyyy HH:MM")}
                                                        </li>

                                                    </ul>
                                                </div>
                                                {/* <button className='btn btn-primary btn-buy'>Download</button> */}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <CustomPagination onChangePage={this.loadOrders}
                        total={total}
                        currentPage={page - 1} />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    cad_rate: state.cad_rate,
});

export default connect(mapStateToProps, null)(OrderList);