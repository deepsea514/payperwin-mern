import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render() {
        return (
            <div className="page-title-area venue-bg">
                <div className="container">
                    <h1>Venues</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>Venues</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default MainBanner;