import React from 'react';
import { Link } from 'react-router-dom';

class NotFound extends React.Component {
    render() {
        return (
            <div className="error-area">
                <div className="d-table">
                    <div className="d-table-cell">
                        <h1>4<span>0</span><b>4</b>!</h1>
                        <h3>Oops! Performer Not Found</h3>
                        <p>The performer you were looking for could not be found.</p>
                        <Link to="/performers"
                            className="btn btn-primary">
                            Find Another Performers
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;