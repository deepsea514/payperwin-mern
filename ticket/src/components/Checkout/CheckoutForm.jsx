import React from 'react';
import { connect } from 'react-redux';
import CreditCardInput from 'react-credit-card-input';

class CheckoutForm extends React.Component {
    render() {
        return (
            <div className="blog-details-area ptb-60">
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
                                        <select className='form-control cart-form-control'>
                                            <option>Select Country</option>
                                            <option>Canada</option>
                                            <option>United States</option>
                                        </select>
                                    </div>
                                    <div className='form-group cart-form-group col-md-4'>
                                        <select className='form-control cart-form-control'>
                                            <option>Select State</option>
                                        </select>
                                    </div>
                                    <div className='form-group cart-form-group col-md-4'>
                                        <input className='form-control cart-form-control'
                                            placeholder='Zip Code' />
                                    </div>
                                </div>
                                <div className='form-group cart-form-group'>
                                    <input className='form-control cart-form-control'
                                        placeholder='Phone' />
                                </div>

                                <div className='form-group cart-form-group mt-5'>
                                    <label>Payment Information</label>
                                    <input className='form-control cart-form-control'
                                        placeholder='Cardholder Name' />
                                </div>
                                <div className='form-group cart-form-group'>
                                    <CreditCardInput
                                        // cardNumberInputProps={{ value: cardNumber, onChange: this.handleCardNumberChange }}
                                        // cardExpiryInputProps={{ value: expiry, onChange: this.handleCardExpiryChange }}
                                        // cardCVCInputProps={{ value: cvc, onChange: this.handleCardCVCChange }}
                                        fieldClassName="form-control cart-form-control"
                                    />
                                </div>
                            </div>
                            <div className='col-md-6'></div>
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
});
export default connect(mapStateToProps)(CheckoutForm);