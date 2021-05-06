
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';
import axios from 'axios';
import { Preloader, ThreeDots } from 'react-preloader-icon';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class Faq extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_subjects: null
        }
    }
    componentDidMount() {
        this.setState({ loading: true });
        axios.get(`${serverUrl}/faqs`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ loading: false, faq_subjects: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_subjects: null });
            })
    }
    render() {
        const { intl } = this.props;
        const { loading, faq_subjects } = this.state;
        setTitle({ pageTitle: 'Frequently Asked Questions' });
        return (
            <div className="col-in faq">
                <center>
                    <h2>Frequently Asked Questions</h2>
                </center>

                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}

                {!loading && !faq_subjects && <h3>Server Error</h3>}

                {faq_subjects && faq_subjects.map((faq_subject, index) => (
                    <div key={index}>
                        <h4>{faq_subject.title}</h4>
                        {faq_subject.items.map((item, index) => (
                            <div key={index}>
                                <h5>{item.title}</h5>
                                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                <br />
                            </div>
                        ))}
                        <br />
                    </div>
                ))}
            </div>
        );
    }
}

export default injectIntl(Faq);