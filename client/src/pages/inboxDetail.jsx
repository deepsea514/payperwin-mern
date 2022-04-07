import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { Link } from "react-router-dom";
import { FormattedMessage } from 'react-intl';
import { deleteInbox, getInboxDetail } from '../redux/services';
import dateformat from 'dateformat';

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
        getInboxDetail(id)
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
        deleteInbox(id)
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
                            <strong><i className="fas fa-chevron-left"></i> <FormattedMessage id="PAGES.INBOX.BACKTOINBOX" /></strong>
                        </Link>
                        {error && <div><span className="card-name">{error}</span></div>}
                        {!error && message && <div>
                            <span className="card-name">
                                <h3>{message.title}</h3>
                                <p>{dateformat(message.published_at, 'ddd, mmm dd, yyyy, HH:MM')}</p>
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