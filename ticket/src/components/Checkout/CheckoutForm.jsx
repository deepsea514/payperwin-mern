import React from 'react';
import { connect } from 'react-redux';
import CreditCardInput from 'react-credit-card-input';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            firstname: '',
            lastname: '',
            address: '',
            address2: '',
            city: '',
            country: 'CA',
            region: '',
            zipcode: '',
            phone: '',
        }
    }

    changeRate = (usd_price) => {
        const { cad_rate } = this.props;
        return Math.ceil(usd_price * cad_rate * 100) / 100
    }

    render() {
        const { cart } = this.props;
        if (cart.length === 0) return null;
        let total = 0;
        cart.forEach(({ ticket_group, count }) => {
            total += this.changeRate(ticket_group.retail_price) * parseInt(count)
        })

        return (
            <div className="mb-5">
                <div className="container">
                    <form onSubmit={(evt) => evt.preventDefault()}>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='form-group cart-form-group'>
                                    <label>Contact Information</label>
                                    <input className='form-control cart-form-control'
                                        placeholder='Email' />
                                </div>
                                <div className='row'>
                                    <div className='form-group cart-form-group col-md-6'>
                                        <input className='form-control cart-form-control'
                                            placeholder='First Name' />
                                    </div>
                                    <div className='form-group cart-form-group col-md-6'>
                                        <input className='form-control cart-form-control'
                                            placeholder='Last Name' />
                                    </div>
                                </div>
                                <div className='form-group cart-form-group'>
                                    <input className='form-control cart-form-control'
                                        placeholder='Address' />
                                </div>
                                <div className='form-group cart-form-group'>
                                    <input className='form-control cart-form-control'
                                        placeholder='Address 2 (Optional)' />
                                </div>
                                <div className='form-group cart-form-group'>
                                    <input className='form-control cart-form-control'
                                        placeholder='City' />
                                </div>
                                <div className='row'>
                                    <div className='form-group cart-form-group col-md-4'>
                                        <CountryDropdown classes='form-control cart-form-control'
                                            whitelist={['CA']} />
                                    </div>
                                    <div className='form-group cart-form-group col-md-4'>
                                        <RegionDropdown classes='form-control cart-form-control'
                                            blankOptionLabel='Select Region'
                                            defaultOptionLabel='Select Region' />
                                    </div>
                                    <div className='form-group cart-form-group col-md-4'>
                                        <input className='form-control cart-form-control'
                                            placeholder='Zip Code' />
                                    </div>
                                </div>
                                <div className='form-group cart-form-group'>
                                    <PhoneInput country={'ca'}
                                        onlyCountries={['ca']}
                                        containerClass='input-group'
                                        inputClass='form-control cart-form-control' />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='form-group cart-form-group'>
                                    <label>Payment Information</label>
                                    <input className='form-control cart-form-control'
                                        placeholder='Cardholder Name' />
                                </div>
                                <div className='form-group cart-form-group'>
                                    <CreditCardInput
                                        // cardNumberInputProps={{ value: cardNumber, onChange: this.handleCardNumberChange }}
                                        // cardExpiryInputProps={{ value: expiry, onChange: this.handleCardExpiryChange }}
                                        // cardCVCInputProps={{ value: cvc, onChange: this.handleCardCVCChange }}
                                        fieldClassName=""
                                        containerClassName="cart-form-control p-0"
                                        inputClassName="mt-3"
                                    />
                                </div>

                                <table className='table mt-5'>
                                    <tbody>
                                        <tr>
                                            <th>Shipping</th>
                                            <td>--</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>CAD ${total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button type="submit"
                                    style={{ width: '100%' }}
                                    className="btn btn-primary full-width">Complete Order</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    cad_rate: state.cad_rate,
    user: state.user,
});
export default connect(mapStateToProps)(CheckoutForm);