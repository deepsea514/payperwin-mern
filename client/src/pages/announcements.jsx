import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Announcements extends Component {
    render() {
        setTitle({ pageTitle: 'Announcements' });
        return (
            <React.Fragment>
                <div className="col-in">
                    <h1 className="main-heading-in">Announcements</h1>
                    <div className="main-cnt text-center">
                        <img src="images/announ-img.jpg" />
                        <br />
                        <strong>There are no messages in your announcements.</strong>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Announcements;