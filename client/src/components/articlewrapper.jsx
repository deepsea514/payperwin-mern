
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import axios from 'axios';
import ArticleSidebar from "./articlesidebar";
import config from '../../../config.json';
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class ArticleWrapper extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { showMore, showCategories, categories, articles, title } = this.props;

        return (
            <div className="col-in row article-container">
                <div className="col-lg-8 col-md-8">
                    {title && <h3>{title}</h3>}
                    {articles && articles.length > 0 && articles.map((article, index) => (
                        <div className={`block feature-articles left ${index == 0 ? '' : 'mt-5'}`} key={article._id}>
                            <div className="item">
                                <Link to={`/articles/${article.permalink}/${article._id}`} className="item-image">
                                    <img src={article.logo} alt={article.title} style={{ visibility: 'visible' }} />
                                </Link>
                                <div className="text">
                                    <p className="details">
                                        {article.categories.map(caetgory => (<span key={caetgory}>
                                            <Link to={`/articles/category/${caetgory}`} className="detail-info">
                                                {caetgory}
                                            </Link>
                                        </span>))}
                                        <span className="date">
                                            {dateformat(article.published_at, 'mediumDate')}
                                        </span>
                                    </p>
                                    <div className="subtitle">
                                        <Link to={`/articles/${article.permalink}/${article._id}`}>
                                            {article.title}
                                        </Link>
                                    </div>
                                    <div className="short-intro">
                                        <p>{article.subtitle}</p>
                                    </div>
                                    <div className="cta-wrapper">
                                        <Link to={`/articles/${article.permalink}/${article._id}`} className="read-more-link">
                                            Read more&nbsp;&nbsp;<i className="fas fa-caret-down" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showMore && <Link className="center-block-see-more mt-5" to="/articles/category">See more articles</Link>}
                    {showCategories && categories && categories.length > 0 && <div className="archive-anchors lower mt-5">
                        <nav className="anchors">
                            <ul className="list">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <Link className="title" to={`/articles/category/${category.title}`}>{category.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>}
                </div>
                <div className="col-md-4">
                    <ArticleSidebar
                        categories={categories}
                        showrRecentPopular={true}
                        relatedArticle={null}
                        showPreview={true}
                    />
                </div>
            </div>
        );
    }
}

export default injectIntl(ArticleWrapper);