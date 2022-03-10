import React from 'react';
import { Link } from 'react-router-dom';
 
class Login extends React.Component {
    state = {
        email: '',
        password: ''
    };

    onSubmit = (e) => {
        e.preventDefault();
    }

    render(){
        return (
            <section className="login-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="login-form">
                            <h3>Welcome Back!</h3>

                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Email Address" 
                                        value={this.state.email}
                                        onChange={ e => this.setState({ email: e.target.value }) }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Password" 
                                        value={this.state.password}
                                        onChange={ e => this.setState({ password: e.target.value }) }
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Login</button>

                                <p>
                                    <Link to="/signup" className="pull-left">Create a new account</Link>
                                    
                                    <Link to="#" className="pull-right">Forgot your password?</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default Login;