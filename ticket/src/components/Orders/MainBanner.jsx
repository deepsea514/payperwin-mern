import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render() {
        return (
            <div className="page-title-area item-bg3">
                <div className="container">
                    <h1>Orders</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>Orders</li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default MainBanner;