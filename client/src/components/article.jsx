import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { getArticle } from '../redux/services';

class Article extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: null,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { match: { params: { id } } } = this.props;
        getArticle(id)
            .then(({ data }) => {
                this.setState({ article: data });
            })
            .catch(() => {
                this.setState({ article: null });
            })
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: prevId } } } = prevProps;
        const articleChanged = (id !== prevId);
        if (articleChanged) {
            this.getData();
        }
    }

    render() {
        const { article } = this.state;
        if (!article) {
            return (
                <center><h3>
                    <FormattedMessage id="COMPONENTS.ARTICLE.NODATA" />
                </h3></center>
            )
        }
        return (
            <div className="col-in article-container px-5">
                <div className="social-bar article social-bar-area">
                    <Link to="/articles" className="back-to-help-wrap">
                        <i className="fas fa-chevron-left" /> &nbsp;
                        <span className="back-to-help-text"><FormattedMessage id="COMPONENTS.ARTICLE.BACK" /></span>
                    </Link>
                </div>

                <div id="mainV2" className="article articleV2">
                    <div className="block article">
                        <div className="article-header">
                            <div className="left articleV2">
                                <div className="text">
                                    <h1 className="title">{article.title}</h1>
                                </div>
                                <div className="image">
                                    <img src={article.logo} alt={article.title} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className='d-flex justify-content-center'>
                                <div>
                                    {article.authors && article.authors.map((author, index) => (
                                        <div className='d-flex align-items-center mt-2' key={index}>
                                            <img src={author.logo} className='article-author-image' />
                                            <div className='ml-3'>
                                                <div className='article-author-name'>{author.name}</div>
                                                <div className='article-author-date'>{dateformat(article.posted_at ? article.posted_at : article.published_at, 'mediumDate')}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="common-wrap">
                                <article className="content articleV2">
                                    <div className="introduction">
                                        <p>{article.subtitle}</p>
                                    </div>
                                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: article.content }} />
                                </article>
                                <div className='article-share-twitter'>
                                    <a href={`https://twitter.com/intent/tweet?url=${window.location.toString()}`}
                                        target="_blank"
                                        className="article-share-btn-twitter">
                                        <span className="article-share-btn-icon">
                                            <i className="fab fa-twitter" />
                                        </span>
                                        <div className="article-share-btn-text">
                                            <span className="article-share-btn-title">Twitter</span>
                                        </div>
                                    </a>
                                </div>
                                <div className="article-divider" />
                                <div className="lower-button-container social-bar-area">
                                    <ul className="tags">
                                        <li className="tag-list-header"><FormattedMessage id="COMPONENTS.ARTICLE.CATEGORY" />:</li>
                                        {article.categories.map((category, index) => (
                                            <li key={index} className="category-tags-item">
                                                <Link to={`/articles/category/${category}`}>
                                                    {category}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="buttons-wrapper">
                                        <Link to="/articles" className="br-home-link">
                                            <div className="br-home-button">
                                                <i className="fas fa-chevron-left" /> &nbsp;
                                                <span className="br-home-label"><FormattedMessage id="COMPONENTS.ARTICLE.HOME" /></span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Article);