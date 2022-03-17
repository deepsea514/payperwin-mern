import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <div className="page-title-area event-bg">
                <div className="container">
                    <h1>{title}</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Events</Link></li>
                        <li>Detail</li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default MainBanner;