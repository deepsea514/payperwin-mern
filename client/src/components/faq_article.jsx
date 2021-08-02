
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Preloader, ThreeDots } from 'react-preloader-icon';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class FaqArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_article: null
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ loading: true });
        axios.get(`${serverUrl}/faq_article/${id}`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ loading: false, faq_article: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_article: null });
            })
    }

    render() {
        const { intl } = this.props;
        const { loading, faq_article } = this.state;
        return (
            <>
                {faq_article && <><Link to="/faq" className="link-help-home">Help Center Home</Link>  <span className="text-danger"> / </span> <Link to={`/faq/subjects/${faq_article.subject._id}`} className="link-help-home">{faq_article.subject.title}</Link></>}
                {!faq_article && <Link to="/faq" className="link-help-home">Help Center Home</Link>}
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}

                {!loading && !faq_article && <div className="cs-s">
                    <h3 className="heading">No data available</h3>
                </div>}

                {faq_article && <div className="fc-article-inner">
                    <h2 className="heading">{faq_article.title}</h2>
                    <hr />
                    <article className="article-body" id="article-body">
                        <div dangerouslySetInnerHTML={{ __html: faq_article.content }}></div>
                        <br />
                    </article>

                    <ul className="article-feedback-holder">
                        <li>
                            {/* <p className="article-vote" id="voting-container">
                                Did you find it helpful?
                                    <span className="vote-up a-link" id="article_thumbs_up">Yes</span>
                                <span className="vote-down-container">
                                    <span className="vote-down a-link">No</span>
                                </span>
                            </p> */}
                        </li>
                        <li>
                            <div className="fc-article-contact">
                                Still looking for a solution? <Link to="/support" className="index_new_ticket">Contact us</Link>.
                            </div>
                        </li>
                    </ul>
                </div>}
            </>
        );
    }
}

export default injectIntl(FaqArticle);