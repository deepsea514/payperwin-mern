
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import axios from 'axios';
import ArticleSidebar from "./articlesidebar";

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class Article extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: null,
            categories: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { match: { params: { id } } } = this.props;
        axios.get(`${serverUrl}/article/${id}`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ article: data });
            })
            .catch(() => {
                this.setState({ article: null });
            })
        axios.get(`${serverUrl}/article-category`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
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
        const { article, categories } = this.state;
        if (!article) {
            return (
                <center><h3>No data available.</h3></center>
            )
        }
        return (
            <div className="col-in article-container px-5">
                <div className="social-bar article social-bar-area">
                    <Link to="/articles" className="back-to-help-wrap">
                        <i className="fas fa-chevron-left" /> &nbsp;
                        <span className="back-to-help-text">Back to Home</span>
                    </Link>
                </div>

                <div id="mainV2" className="article articleV2">
                    <div className="block article">
                        <div className="article-header">
                            <div className="left articleV2">
                                <div className="author-photo-container">
                                    <div className="author-photo">
                                        <img src="/images/payperwin logo blue.png" />
                                    </div>
                                </div>
                                <div className="author-container">
                                    {article.categories.map((category, index) => (
                                        <Link to={`/articles/category/${category}`} key={index} className="sport-name">
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                                <div className="date-container">
                                    {dateformat(article.published_at, 'mediumDate')}
                                </div>
                                <div className="text">
                                    <h1 className="title"> &nbsp;</h1>
                                </div>
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
                        <div className="col-md-8">
                            <div className="common-wrap">
                                <article className="content articleV2">
                                    <div className="introduction">
                                        <p>{article.subtitle}</p>
                                    </div>
                                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: article.content }} />
                                </article>
                                <div className="article-divider" />
                                <div className="lower-button-container social-bar-area">
                                    <ul className="tags">
                                        <li className="tag-list-header">Category:</li>
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
                                                <span className="br-home-label">Article Home</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <ArticleSidebar
                                categories={categories}
                                showrRecentPopular={true}
                                relatedArticle={article}
                                showPreview={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Article);