
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import ArticleSidebar from "./articlesidebar";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import _env from '../env.json';
const serverUrl = _env.appUrl;

class ArticleWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { showMore, showCategories, categories, articles, title, loading } = this.props;

        return (
            <div className="row article-container">
                <div className="col-lg-8 col-md-8">
                    {title && <h3 className='text-center my-2'>{title}</h3>}
                    {loading && <center className="mt-5">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </center>}
                    {articles && articles.length > 0 && articles.map((article, index) => (
                        <div className={`block feature-articles left ${index == 0 ? '' : 'mt-5'}`} key={article._id}>
                            <div className="item">
                                <Link to={`/articles/${article.permalink}`} className="item-image">
                                    <img src={article.logo.startsWith('data:image/') ? article.logo : serverUrl + article.logo} alt={article.title} style={{ visibility: 'visible' }} />
                                </Link>
                                <div className="text">
                                    <p className="details">
                                        {article.categories.map(caetgory => (<span key={caetgory}>
                                            <Link to={`/articles/category/${caetgory}`} className="detail-info">
                                                {caetgory}
                                            </Link>
                                        </span>))}
                                        <span className="date">
                                            {dateformat(article.posted_at ? article.posted_at : article.published_at, 'mediumDate')}
                                        </span>
                                    </p>
                                    <div className="subtitle">
                                        <Link to={`/articles/${article.permalink}`}>
                                            {article.title}
                                        </Link>
                                    </div>
                                    <div className="short-intro">
                                        <p>{article.subtitle}</p>
                                    </div>
                                    <div className="cta-wrapper">
                                        <Link to={`/articles/${article.permalink}`} className="read-more-link">
                                            <FormattedMessage id="COMPONENTS.ARTICLE.READMORE" />&nbsp;&nbsp;<i className="fas fa-caret-down" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showMore && <Link className="center-block-see-more mt-5" to="/articles/category"><FormattedMessage id="COMPONENTS.ARTICLE.SEEMORE" /></Link>}
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
                        showPreview={false}
                    />
                </div>
            </div>
        );
    }
}

export default injectIntl(ArticleWrapper);