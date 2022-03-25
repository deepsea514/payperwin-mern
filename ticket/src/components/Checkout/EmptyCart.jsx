import React from 'react';
import { Link } from 'react-router-dom';

class EmptyCart extends React.Component {
    render() {
        return (
            <div className="error-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <h3>Your Cart is Empty</h3>
                        <p>Please purchase the tickets you are looking for.</p>
                        <Link to="/search"
                            className="btn btn-primary">
                            Find Tickets
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmptyCart;