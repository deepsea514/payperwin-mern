import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render(){
        return (
            <div className="page-title-area item-bg1">
                <div className="container">
                    <h1>Search Events</h1>
                    {/* <span>Listen to the Event Speakers</span> */}
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>Events</li>
                    </ul>
                </div>
            </div>
        );
    }
}
 
export default MainBanner;