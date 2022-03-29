import React from 'react';
import * as Yup from "yup";
import { Formik } from "formik";
import { getInputClasses } from '../lib/getInputClasses';
import { login } from '../redux/services';
import { connect } from 'react-redux';
import { actions } from '../redux/reducers';

class Login extends React.Component {
    state = {
        initialValues: {
            email: '',
            password: '',
        },
        loginSchema: Yup.object().shape({
            email: Yup.string()
                .email("Please input correct Email.")
                .required("Email Address is required."),
            password: Yup.string()
                .required('Password is Required')
        }),
        error: '',
    };

    componentDidMount() {
        const { user, history } = this.props;
        if (user) {
            history.push('/');
        }
    }

    onSubmit = (values, formik) => {
        const { history, getUserAction } = this.props;
        this.setState({ error: '' });
        login(values).then(() => {
            formik.setSubmitting(false);
            getUserAction(() => history.push('/'));
        }).catch(() => {
            this.setState({ error: 'Email and password are not matching.' });
            formik.setSubmitting(false);
        })
    }

    render() {
        const { initialValues, loginSchema } = this.state;
        return (
            <section className="login-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="login-form">
                            <h3>Welcome Back!</h3>
                            <Formik onSubmit={this.onSubmit}
                                initialValues={initialValues}
                                validationSchema={loginSchema}>
                                {(formik) => {
                                    const { errors, touched, getFieldProps, handleSubmit } = formik;
                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${getInputClasses(formik, 'email')}`}
                                                    placeholder="Email Address"
                                                    {...getFieldProps('email')}
                                                />
                                                {touched.email && errors.email ? (
                                                    <div className="invalid-feedback">
                                                        {errors.email}
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="form-group">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className={`form-control ${getInputClasses(formik, 'password')}`}
                                                    placeholder="Password"
                                                    {...getFieldProps('password')}
                                                />
                                                {touched.password && errors.password ? (
                                                    <div className="invalid-feedback">
                                                        {errors.password}
                                                    </div>
                                                ) : null}
                                            </div>

                                            <button type="submit" className="btn btn-primary">
                                                Login
                                            </button>
                                        </form>
                                    )
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});
export default connect(mapStateToProps, actions)(Login);