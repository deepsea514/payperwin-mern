import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from '../../redux/reducers';
import dateformat from 'dateformat';
import EmptyCart from './EmptyCart';

class CartDetail extends React.Component {
    formatSectionName = (section_name) => {
        const words = section_name.split(' ');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    changeRate = (usd_price) => {
        const { cad_rate } = this.props;
        return Math.ceil(usd_price * cad_rate * 100) / 100
    }

    render() {
        const { cart, updateInCartAction, clearFromCartAction } = this.props;
        return (
            <>
                {cart.ticket_group === null && <EmptyCart />}
                {cart.ticket_group !== null && <section className="blog-details-area ptb-60">
                    <div className="container">
                        <div className='table-responsive'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Ticket Detail</th>
                                        <th className='text-right'>Price</th>
                                        <th>Count</th>
                                        <th className='text-right'>Total Price</th>
                                        <th className='text-right'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ minWidth: '200px' }}>
                                            <i className={cart.ticket_group.type === 'parking' ? 'icofont-car-alt-4' : 'icofont-chair'} />&nbsp;
                                            <span>{this.formatSectionName(cart.ticket_group.tevo_section_name)}</span>
                                            <br />
                                            <span><b>Sec {cart.ticket_group.section}, Row {cart.ticket_group.row}</b></span>
                                            <br />
                                            <span>
                                                <i className='icofont-thunder-light' />&nbsp;
                                                {cart.ticket_group.event.name}
                                            </span>
                                            <br />
                                            <span>
                                                <i className="icofont-wall-clock"></i>&nbsp;
                                                {dateformat(cart.ticket_group.event.occurs_at, 'ddd mmm dd yyyy HH:MM')}
                                            </span>
                                        </td>
                                        <td className='text-right pt-3'>
                                            CAD&nbsp;${this.changeRate(cart.ticket_group.retail_price)}
                                        </td>
                                        <td style={{ minWidth: '100px' }}>
                                            <select className='form-control cart-form-control'
                                                value={cart.count}
                                                onChange={(evt) => updateInCartAction(evt.target.value)}>
                                                {cart.ticket_group.splits.map(count => (
                                                    <option value={count} key={count}>{count}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='text-right pt-3'>
                                            CAD&nbsp;${(this.changeRate(cart.ticket_group.retail_price) * parseInt(cart.count)).toFixed(2)}
                                        </td>
                                        <td>
                                            <button className='btn btn-secondary'
                                                onClick={() => clearFromCartAction()}>
                                                <i className='icofont-close' />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    cad_rate: state.cad_rate,
});
export default connect(mapStateToProps, actions)(withRouter(CartDetail));