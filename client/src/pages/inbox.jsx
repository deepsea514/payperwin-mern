import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Inbox extends Component {
    render() {
        setTitle({ pageTitle: 'Inbox' });
        return (
            <React.Fragment>
                <div className="col-in pad-bt">
                    <h1 className="main-heading-in">Inbox</h1>
                    <div className="main-cnt">
                        <div className="in-text">
                            <a href="#"> fab 04 </a><a href="#">
                                [Basketball] [LIVE NBA] [Game] [Minnesota
                                Timberwolves vs. Sacramento Kings]. The
                                event has been re-graded fro </a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Inbox;