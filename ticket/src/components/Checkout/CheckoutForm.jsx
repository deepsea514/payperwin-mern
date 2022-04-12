import React from 'react';
import { connect } from 'react-redux';
import PhoneInput, { } from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import * as Yup from "yup";
import { Formik } from "formik";
import { getInputClasses } from '../../lib/getInputClasses';
import { getRandomID } from '../../lib/getRandomID';
import { withRouter } from 'react-router-dom';
import { checkoutSubmit } from '../../redux/services';
import { errorMessage, successMessage } from '../../lib/showMessage';
import { actions } from '../../redux/reducers';
import { CardElement } from "@stripe/react-stripe-js";

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);
        const { user } = props;
        const session_id = `PPW_TICKET${getRandomID()}`;
        this.state = {
            initialValues: {
                email: user && user.email ? user.email : '',
                firstname: user && user.firstname ? user.firstname : '',
                lastname: user && user.lastname ? user.lastname : '',
                address: '',
                address2: '',
                city: '',
                country: 'Canada',
                region: '',
                zipcode: '',
                phone: '',
            },
            checkoutSchema: Yup.object().shape({
                email: Yup.string()
                    .required('Email Address is required.')
                    .email('Please input correct email format.'),
                firstname: Yup.string()
                    .required('First Name is required.'),
                lastname: Yup.string()
                    .required('Last Name is required.'),
                address: Yup.string()
                    .required('Address is required.'),
                address2: Yup.string(),
                city: Yup.string()
                    .required('City is required.'),
                country: Yup.string()
                    .required('Please select the country.'),
                region: Yup.string()
                    .required('Please Select region'),
                zipcode: Yup.string()
                    .required('Zip Code is required.'),
                phone: Yup.string()
                    .required('Phone Number is required.'),
            }),
            session_id: session_id,
        }
    }

    componentDidMount() {
        const { session_id } = this.state;
        const store_domain = 'ticketevolution.com';
        const url = ('https:' === document.location.protocol ? 'https://' : 'http://') + "beacon.riskified.com?shop=" + store_domain + "&sid=" + session_id;
        const script_obj = document.createElement('script');
        script_obj.type = 'text/javascript';
        script_obj.async = true;
        script_obj.src = url;
        script_obj.id = 'riskified_script';

        const target_node = document.getElementsByTagName('script')[0];
        target_node.parentNode.insertBefore(script_obj, target_node);
    }

    componentWillUnmount() {
        const script_obj = document.getElementById('riskified_script');
        script_obj.parentNode.removeChild(script_obj);
    }

    changeRate = (usd_price) => {
        const { cad_rate } = this.props;
        return Math.ceil(usd_price * cad_rate * 100) / 100
    }

    onSubmit = (values, formik) => {
        const { user, history, cart, clearFromCartAction } = this.props;
        const { session_id } = this.state;
        if (!user) {
            history.push('/login');
            return;
        }

        const { elements, stripe } = this.props;
        const cardElement = elements.getElement(CardElement);
        stripe.createToken(cardElement, {
            name: values.firstname + ' ' + values.lastname,
            address_line1: values.address,
            address_line2: values.address2,
            address_city: values.city,
            address_state: values.region,
            address_zip: values.zipcode,
            address_country: 'Canada',
            currency: 'CAD'
        }).then(({ error, token }) => {
            if (error) {
                formik.setSubmitting(false);
                errorMessage('Cannot Purchase Ticket. Please try again later.');
            } else {
                const { id } = token;
                checkoutSubmit({ ...values, session_id, cart, token: id }).then(({ data }) => {
                    const { success, error } = data;
                    if (success) {
                        successMessage('Ticket Purchased Successfully.');
                        clearFromCartAction();
                        formik.setSubmitting(false);
                        return;
                    }
                    errorMessage(error);
                    formik.setSubmitting(false);
                }).catch(() => {
                    errorMessage('Cannot Purchase Ticket. Please try again later.');
                    formik.setSubmitting(false);
                })
            }
        }).catch(error => {
            console.error(error)
            formik.setSubmitting(false);
            errorMessage('Cannot Purchase Ticket. Please try again later.');
        })
    }

    render() {
        const { cart, user } = this.props;
        if (cart.ticket_group === null) return null;
        const total = (this.changeRate(cart.ticket_group.retail_price) * parseInt(cart.count)).toFixed(2);
        const { initialValues, checkoutSchema } = this.state;

        return (
            <div className="mb-5">
                <div className="container">
                    <Formik onSubmit={this.onSubmit}
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}>
                        {(formik) => {
                            const {
                                values, touched, errors, isSubmitting,
                                getFieldProps, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched
                            } = formik;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className='form-group cart-form-group'>
                                                <label>Contact Information</label>
                                                <input className={`form-control cart-form-control ${getInputClasses(formik, 'email')}`}
                                                    type='email'
                                                    placeholder='Email'
                                                    readOnly={user !== null}
                                                    {...getFieldProps('email')} />
                                                {touched.email && errors.email ? (
                                                    <div className="invalid-feedback">
                                                        {errors.email}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className='row'>
                                                <div className='form-group cart-form-group col-md-6'>
                                                    <input className={`form-control cart-form-control ${getInputClasses(formik, 'firstname')}`}
                                                        placeholder='First Name'
                                                        {...getFieldProps('firstname')} />
                                                    {touched.firstname && errors.firstname ? (
                                                        <div className="invalid-feedback">
                                                            {errors.firstname}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className='form-group cart-form-group col-md-6'>
                                                    <input className={`form-control cart-form-control ${getInputClasses(formik, 'lastname')}`}
                                                        placeholder='Last Name'
                                                        {...getFieldProps('lastname')} />
                                                    {touched.lastname && errors.lastname ? (
                                                        <div className="invalid-feedback">
                                                            {errors.lastname}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className='form-group cart-form-group'>
                                                <input className={`form-control cart-form-control ${getInputClasses(formik, 'address')}`}
                                                    placeholder='Address'
                                                    {...getFieldProps('address')} />
                                                {touched.address && errors.address ? (
                                                    <div className="invalid-feedback">
                                                        {errors.address}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className='form-group cart-form-group'>
                                                <input className={`form-control cart-form-control ${getInputClasses(formik, 'address2')}`}
                                                    placeholder='Address 2 (Optional)'
                                                    {...getFieldProps('address2')} />
                                                {touched.address2 && errors.address2 ? (
                                                    <div className="invalid-feedback">
                                                        {errors.address2}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className='form-group cart-form-group'>
                                                <input className={`form-control cart-form-control ${getInputClasses(formik, 'city')}`}
                                                    placeholder='City'
                                                    {...getFieldProps('city')} />
                                                {touched.city && errors.city ? (
                                                    <div className="invalid-feedback">
                                                        {errors.city}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className='row'>
                                                <div className='form-group cart-form-group col-md-4'>
                                                    <CountryDropdown classes={`form-control cart-form-control ${getInputClasses(formik, 'country')}`}
                                                        whitelist={['CA']}
                                                        {...getFieldProps('country')}
                                                        onChange={(val, evt) => handleChange(evt)} />
                                                    {touched.country && errors.country ? (
                                                        <div className="invalid-feedback">
                                                            {errors.country}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className='form-group cart-form-group col-md-4'>
                                                    <RegionDropdown classes={`form-control cart-form-control ${getInputClasses(formik, 'region')}`}
                                                        blankOptionLabel='Select Region'
                                                        defaultOptionLabel='Select Region'
                                                        country={values.country}
                                                        {...getFieldProps('region')}
                                                        onChange={(val, evt) => handleChange(evt)} />
                                                    {touched.region && errors.region ? (
                                                        <div className="invalid-feedback">
                                                            {errors.region}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className='form-group cart-form-group col-md-4'>
                                                    <input className={`form-control cart-form-control ${getInputClasses(formik, 'zipcode')}`}
                                                        placeholder='Zip Code'
                                                        {...getFieldProps('zipcode')} />
                                                    {touched.zipcode && errors.zipcode ? (
                                                        <div className="invalid-feedback">
                                                            {errors.zipcode}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className='form-group cart-form-group'>
                                                <PhoneInput country={'ca'}
                                                    onlyCountries={['ca']}
                                                    placeholder='+1 (702) 123-4567'
                                                    value={values.phone}
                                                    containerClass={'input-group ' + getInputClasses(formik, 'phone')}
                                                    inputClass={`form-control cart-form-control `}
                                                    inputProps={{ name: 'phone' }}
                                                    onChange={(value, data, evt, formatedvalue) => {
                                                        setFieldValue('phone', formatedvalue);
                                                        setFieldTouched('phone', true);
                                                    }}
                                                    onBlur={handleBlur}
                                                    buttonStyle={{ zIndex: 3 }} />
                                                {touched.phone && errors.phone ? (
                                                    <div className="invalid-feedback">
                                                        {errors.phone}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='form-group cart-form-group'>
                                                <label>Payment Information</label>
                                                {/* <input className={`form-control cart-form-control ${getInputClasses(formik, 'card_holder')}`}
                                                    placeholder='Cardholder Name'
                                                    {...getFieldProps('card_holder')} />
                                                {touched.card_holder && errors.card_holder ? (
                                                    <div className="invalid-feedback">
                                                        {errors.card_holder}
                                                    </div>
                                                ) : null} */}
                                            </div>
                                            <CardElement />

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
                                                disabled={isSubmitting}
                                                style={{ width: '100%' }}
                                                className="btn btn-primary full-width">Complete Order</button>
                                        </div>
                                    </div>
                                </form>
                            )
                        }}
                    </Formik>
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
export default connect(mapStateToProps, actions)(withRouter(CheckoutForm));