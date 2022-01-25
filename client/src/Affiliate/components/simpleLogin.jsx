import React, { Component } from 'react';

class SimpleLogin extends Component {
    render() {
        const { showLoginModalAction } = this.props;

        return (
            <div className="form">
                <div className="form-join">
                    <div className="form-group">
                        <button className="log-in-btn" onClick={() => showLoginModalAction(true)}>Log In</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SimpleLogin;
