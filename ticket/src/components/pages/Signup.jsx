import React from 'react';
import { Link } from 'react-router-dom';
 
class Signup extends React.Component {
    state = {
        username: '',
        email: '',
        password: ''
    };

    onSubmit = (e) => {
        e.preventDefault();
    }
    render(){
        return (
            <section className="signup-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="signup-form">
                            <h3>Create your Account</h3>

                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Username" 
                                        value={this.state.username}
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Email Address" 
                                        value={this.state.email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Password" 
                                        value={this.state.password}
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Signup</button>

                                <p>Already a registered user? <Link to="/login">Login!</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
 
export default Signup;