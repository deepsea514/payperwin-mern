import React, { Component } from 'react';
import { setMeta } from '../libs/documentTitleBuilder';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link, Switch, Route, BrowserRouter } from "react-router-dom";
import InboxDetail from "./inboxDetail";
import DocumentMeta from 'react-document-meta';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            error: null,
            metaData: null,
        }
    }
    componentDidMount() {
        const { getUser } = this.props;

        const title = 'Message Inbox';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

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
        const { messages, error, metaData } = this.state;

        return (
            <React.Fragment>
                {metaData && <DocumentMeta {...metaData} />}
                <BrowserRouter basename="/inbox">
                    <Switch>
                        <Route path="/:id" render={(props) => (
                            <InboxDetail {...props} />
                        )} />
                        <Route path="/" render={(props) =>
                            <div className="col-in ">
                                <h1 className="main-heading-in">Inbox</h1>
                                <div className="main-cnt">
                                    {error && <h6>{error}</h6>}
                                    {!error && messages.length == 0 && <div className="text-center mb-0">
                                        <img src="images/announ-img.jpg" />
                                        <br />
                                        <strong>There are no messages in your announcements.</strong>
                                    </div>}
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