import React from 'react';
import { Link } from 'react-router-dom';

class MainBanner extends React.Component {
    render(){
        return (
            <div className="page-title-area item-bg2">
                <div className="container">
                    <h1>About Us</h1>
                    <span>Are you ready to attend?</span>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>About</li>
                    </ul>
                </div>
            </div>
        );
    }
}
 
export default MainBanner;