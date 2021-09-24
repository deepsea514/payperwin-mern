import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from "react-router-dom";
import _env from '../env.json';
const serverUrl = _env.appUrl;

class InboxDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            error: null,
        }
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Inbox' });
        const id = this.props.match.params.id;
        axios.get(`${serverUrl}/inbox/${id}`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ message: data })
            })
            .catch(() => {
                this.setState({ error: "Can't get message" })
            })
    }

    deleteMessage = () => {
        const { history, match } = this.props;
        const id = match.params.id;
        axios.delete(`${serverUrl}/inbox/${id}`, { withCredentials: true })
            .then(() => {
                history.push("/");
            })
            .catch(() => {
                this.setState({ error: "Can't get message" })
            })
    }

    render() {
        const { message, error } = this.state;
        return (
            <React.Fragment>
                <div className="col-in">
                    <div className="main-cnt">
                        <Link
                            style={{ cursor: 'pointer', fontSize: 16 }}
                            to="/">
                            <strong><i className="fas fa-chevron-left"></i> Back to inbox</strong>
                        </Link>
                        {error && <div><span className="card-name">{error}</span></div>}
                        {!error && message && <div>
                            <span className="card-name">
                                <h3>{message.title}</h3>
                                <p>{dayjs(message.published_at).format('ddd, MMM DD, YYYY, HH:mm')}</p>
                            </span>
                            <span className="right-image" style={{ cursor: 'pointer' }} onClick={this.deleteMessage}><i className="fa fa-trash" /> Delete</span>
                            <hr />
                            <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                        </div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default InboxDetail;