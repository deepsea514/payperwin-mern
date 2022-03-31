import React from 'react';
import { Link } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomPagination from '../Common/CustomPagination';
import Loader from '../Common/Loader';

class OrderList extends React.Component {
    state = {
        loading: false,
        orders: [1, 2],
        total: 0,
        page: 1,
    }

    componentDidMount() {
        this.loadOrders();
    }

    loadOrders = (page = 1) => {

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
                                {orders.map((order, index) => (
                                    <li className="accordion-item" key={index}>
                                        <div className="accordion-title">
                                            <div className="schedule-info">
                                                <h3>San Jose Sharks at Chicago Blackhawks</h3>
                                                <h6>Sec 5, Row 10</h6>
                                                <h6>Total Price: CAD $310.4 ($310.4 * 1)</h6>

                                                <ul>
                                                    <li>
                                                        <i className="icofont-field" />&nbsp;
                                                        At <Link to="/venues/united-center"><span>United Center</span></Link>&nbsp;
                                                        in Chicago, IL
                                                    </li>
                                                    <li>
                                                        <i className="icofont-wall-clock" />&nbsp;
                                                        Wed Apr 13 2022 04:30
                                                    </li>
                                                    <li>
                                                        <i className="icofont-users-alt-4" />&nbsp;
                                                        <Link to="/performers/san-jose-sharks">San Jose Sharks</Link>
                                                    </li>
                                                </ul>

                                                <div className="mt-2 tagcloud">
                                                    <Link to="/categories/sports">Sports</Link>
                                                    <Link to="/categories/hockey">Hockey</Link>
                                                    <Link to="/categories/nhl">NHL</Link>
                                                </div>
                                            </div>
                                            <button to={"/event/" + order.id} className='btn btn-primary btn-buy'>Download</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <CustomPagination onChangePage={this.loadOrders}
                        total={total}
                        currentPage={page - 1} />

                    <div className="shape1">
                        <img src="/images/shapes/1.png" alt="shape1" />
                    </div>
                    <div className="shape2 rotateme">
                        <img src="/images/shapes/2.png" alt="shape2" />
                    </div>
                    <div className="shape3 rotateme">
                        <img src="/images/shapes/3.png" alt="shape3" />
                    </div>
                    <div className="shape4">
                        <img src="/images/shapes/4.png" alt="shape4" />
                    </div>
                </div>
            </section>
        );
    }
}


export default OrderList;