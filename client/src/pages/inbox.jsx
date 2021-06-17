import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link, Switch, Route, BrowserRouter } from "react-router-dom";
import InboxDetail from "./inboxDetail";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            error: null,
        }
    }
    componentDidMount() {
        const { getUser } = this.props;
        setTitle({ pageTitle: 'Inbox' });
        axios.get(`${serverUrl}/inbox`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ messages: data })
                getUser();
            })
            .catch((error) => {
                this.setState({ error: "Can't get messages" })
            })
    }

    render() {
        const { messages, error } = this.state;

        return (
            <React.Fragment>
                <BrowserRouter basename="/inbox">
                    <Switch>
                        <Route path="/:id" render={(props) => (
                            <InboxDetail {...props} />
                        )} />
                        <Route path="/" render={(props) =>
                            <div className="col-in pad-bt">
                                <h1 className="main-heading-in">Inbox</h1>
                                <div className="main-cnt">
                                    {error && <h6>{error}</h6>}
                                    {!error && messages.length == 0 && <p>There are no messages in your inbox.</p>}
                                    {!error && messages.length != 0 && messages.map(message => (
                                        <div className="in-text" key={message._id}>
                                            <Link to={`/${message._id}`}> {dayjs(message.published_at).format('ddd, MMM DD, YYYY, HH:mm')} </Link>
                                            <Link to={`/${message._id}`}>{message.title}</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>} />
                    </Switch>

                </BrowserRouter>

            </React.Fragment>
        );
    }
}

export default Inbox;