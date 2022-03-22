import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render() {
        return (
            <div className="page-title-area item-bg2">
                <div className="container">
                    <h1>Performers</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>Performers</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default MainBanner;