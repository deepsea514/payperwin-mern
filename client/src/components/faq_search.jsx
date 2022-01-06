
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { getFAQArticles } from '../redux/services';

class FaqSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_articles: null
        }
    }

    componentDidMount() {
        const { history } = this.props;
        this.setState({ loading: true });
        getFAQArticles(history.location.search)
            .then(({ data }) => {
                this.setState({ loading: false, faq_articles: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_articles: null });
            })
    }

    getURLfromTitle = (title) => {
        title = title.toLowerCase();
        title = title.replace(/[^a-zA-Z ]/g, "");
        title = title.replaceAll(" ", "-");
        return title;
    }

    render() {
        const { intl } = this.props;
        const { loading, faq_articles } = this.state;
        return (
            <>
                <Link to="/faq" className="link-help-home"><FormattedMessage id="COMPONENTS.FAQ.HOME" /></Link>

                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}

                {!loading && (!faq_articles || !faq_articles.length) && <div className="cs-s">
                    <h3 className="heading"><FormattedMessage id="PAGES.NODATA.AVAILABLE" /></h3>
                </div>}

                {faq_articles && faq_articles.length > 0 && <div className="cs-s">
                    <h3 className="heading"><FormattedMessage id="COMPONENTS.FAQ.SEARCH_RESULT" /></h3>
                    <br />
                    <div className="cs-g-c">
                        <div className="row">
                            {faq_articles.map(item => (
                                <div className="col-12 col-sm-6 col-md-4" key={item._id}>
                                    <section className="cs-g article-list">
                                        <div className="list-lead">
                                            {item.title}
                                        </div>
                                        <div className="list-desc" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                        <Link className="list-read-more" to={`/faq/article/${item._id}-${this.getURLfromTitle(item.title)}`}>
                                            <FormattedMessage id="PAGES.READMORE" />
                                        </Link>
                                    </section>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
            </>
        );
    }
}

export default injectIntl(FaqSearch);