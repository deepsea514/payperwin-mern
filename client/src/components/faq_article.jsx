
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getFAQArticle } from '../redux/services';

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
        getFAQArticle(id)
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
                {faq_article && <><Link to="/faq" className="link-help-home"><FormattedMessage id="COMPONENTS.FAQ.HOME" /></Link>  <span className="text-danger"> / </span> <Link to={`/faq/subjects/${faq_article.subject._id}`} className="link-help-home">{faq_article.subject.title}</Link></>}
                {!faq_article && <Link to="/faq" className="link-help-home"><FormattedMessage id="COMPONENTS.FAQ.HOME" /></Link>}
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}

                {!loading && !faq_article && <div className="cs-s">
                    <h3 className="heading"><FormattedMessage id="PAGES.NODATA.AVAILABLE" /></h3>
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
                                <FormattedMessage id="COMPONENTS.FAQ.SOLUTION" /> <Link to="/support" className="index_new_ticket"><FormattedMessage id="COMPONENTS.FAQ.CONTACTUS" /></Link>.
                            </div>
                        </li>
                    </ul>
                </div>}
            </>
        );
    }
}

export default injectIntl(FaqArticle);