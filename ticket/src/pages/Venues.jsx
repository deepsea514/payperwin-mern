import React from 'react';
import { Link } from 'react-router-dom';
import Footer from "../components/Common/Footer";

class Venues extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="page-title-area venue-bg">
                    <div className="container">
                        <h1>Venues</h1>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li>Venues</li>
                        </ul>
                    </div>
                </div>

                <Footer />
            </React.Fragment>
        );
    }
}

export default Venues;