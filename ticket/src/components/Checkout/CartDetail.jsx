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
        const { cart, updateInCartAction, removeFromCartAction } = this.props;
        return (
            <>
                {cart.length === 0 && <EmptyCart />}
                {cart.length > 0 && <section className="blog-details-area ptb-60">
                    <div className="container">
                        <div className='table-responsive'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ticket Detail</th>
                                        <th className='text-right'>Price</th>
                                        <th>Count</th>
                                        <th className='text-right'>Total Price</th>
                                        <th className='text-right'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(({ count, ticket_group }, index) => (
                                        <tr key={ticket_group.id}>
                                            <td>{index + 1}</td>
                                            <td style={{ minWidth: '200px' }}>
                                                <i className={ticket_group.type === 'parking' ? 'icofont-car-alt-4' : 'icofont-chair'} />&nbsp;
                                                <span>{this.formatSectionName(ticket_group.tevo_section_name)}</span>
                                                <br />
                                                <span><b>Sec {ticket_group.section}, Row {ticket_group.row}</b></span>
                                                <br />
                                                <span>
                                                    <i className='icofont-thunder-light' />&nbsp;
                                                    {ticket_group.event.name}
                                                </span>
                                                <br />
                                                <span>
                                                    <i className="icofont-wall-clock"></i>&nbsp;
                                                    {dateformat(ticket_group.event.occurs_at, 'ddd mmm dd yyyy HH:MM')}
                                                </span>
                                            </td>
                                            <td className='text-right pt-3'>
                                                CAD&nbsp;${this.changeRate(ticket_group.retail_price)}
                                            </td>
                                            <td style={{ minWidth: '100px' }}>
                                                <select className='form-control cart-form-control'
                                                    value={count}
                                                    onChange={(evt) => updateInCartAction(ticket_group.id, evt.target.value)}>
                                                    {ticket_group.splits.map(count => (
                                                        <option value={count} key={count}>{count}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className='text-right pt-3'>
                                                CAD&nbsp;${this.changeRate(ticket_group.retail_price * parseInt(count))}
                                            </td>
                                            <td>
                                                <button className='btn btn-secondary'
                                                    onClick={() => removeFromCartAction(ticket_group.id)}>
                                                    <i className='icofont-close' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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