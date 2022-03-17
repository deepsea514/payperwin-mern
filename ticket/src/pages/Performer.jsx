import React from 'react';
import { Link } from 'react-router-dom';
import Footer from "../components/Common/Footer";

class Performer extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="page-title-area item-bg2">
                    <div className="container">
                        <h1>Performer Name</h1>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/performers">Performers</Link></li>
                            <li>Performer Name</li>
                        </ul>
                    </div>
                </div>

                <Footer />
            </React.Fragment>
        );
    }
}

export default Performer;