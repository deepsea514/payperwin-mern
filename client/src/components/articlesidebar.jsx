
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import { getArticles, getPopularArticles, getRecentArticles } from '../redux/services';
import _env from '../env.json';
const serverUrl = _env.appUrl;

class ArticleSidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previewArticles: [],
            active_tab: 'popular',
            see_more: false,
            recentArticles: [],
            popularArticles: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { showPreview, showrRecentPopular } = this.props;
        if (showPreview) {
            getArticles()
                .then(({ data }) => {
                    this.setState({ previewArticles: data });
                })
                .catch(() => {
                    this.setState({ previewArticles: null });
                })
        }
        if (showrRecentPopular) {
            getRecentArticles()
                .then(({ data }) => {
                    this.setState({ recentArticles: data });
                })
                .catch(() => {
                    this.setState({ recentArticles: null });
                })

            getPopularArticles()
                .then(({ data }) => {
                    this.setState({ popularArticles: data });
                })
                .catch(() => {
                    this.setState({ popularArticles: null });
                })
        }
    }

    render() {
        const { previewArticles, active_tab, see_more, recentArticles, popularArticles } = this.state;
        const { categories, showPreview, showrRecentPopular } = this.props;

        return (
            <>
                {showrRecentPopular && <div className="sidebar-block">
                    <div className="recent-popular-related">
                        <ul className="article-sidebar-tab">
                            <li className={`popular-tab ${active_tab == 'popular' ? 'active' : ''}`}
                                onClick={() => this.setState({ active_tab: 'popular' })}>
                                <span><FormattedMessage id="COMPONENTS.ARTICLE.POPULAR" /></span>
                            </li>
                            <li className={`recent-tab ${active_tab == 'recent' ? 'active' : ''}`}
                                onClick={() => this.setState({ active_tab: 'recent' })}>
                                <span><FormattedMessage id="COMPONENTS.ARTICLE.RECENT" /></span>
                            </li>
                        </ul>

                        <div className={`sidebar-tab recent-list ${active_tab == 'recent' ? 'active' : ''}`}>
                            <ul className="hover-li">
                                {recentArticles.map(article => (
                                    <li key={article._id}>
                                        <div className="details">
                                            {article.categories.map(category => (
                                                <Link key={category} className="tag" to={`/articles/category/${category}`}>{category}</Link>
                                            ))}
                                            <span className="date">{dateformat(article.posted_at ? article.posted_at : article.published_at, 'mediumDate')}</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <Link to={`/articles/${article.permalink}`}>{article.title}</Link>
                                        </h4>
                                    </li>
                                ))}
                                <li className="sidebar-tab-more">
                                    <Link to={`/articles/category`}>
                                        <FormattedMessage id="COMPONENTS.ARTICLE.MORE" />&nbsp;&nbsp;<i className="fas fa-chevron-right"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className={`sidebar-tab popular-list ${active_tab == 'popular' ? 'active' : ''}`}>
                            <div className="all-time-list">
                                <ul className="hover-li">
                                    {popularArticles.map(article => (
                                        <li key={article._id}>
                                            <div className="details">
                                                {article.categories.map(category => (
                                                    <Link key={category} className="tag" to={`/articles/category/${category}`}>{category}</Link>
                                                ))}
                                                <span className="date">{dateformat(article.posted_at ? article.posted_at : article.published_at, 'mediumDate')}</span>
                                            </div>
                                            <h4 className="subtitle">
                                                <Link to={`/articles/${article.permalink}`}>{article.title}</Link>
                                            </h4>
                                        </li>
                                    ))}

                                    <li className="sidebar-tab-more">
                                        <Link to={`/articles/category`}>
                                            <FormattedMessage id="COMPONENTS.ARTICLE.MORE" />&nbsp;&nbsp;<i className="fas fa-chevron-right"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>}

                {showPreview && previewArticles.slice(0, 2).map((article, index) => (
                    <div className={`sidebar-block block feature-articles left mt-2`} key={article._id}>
                        <div className="item pb-0">
                            <Link to={`/articles/${article.permalink}`}>
                                <img src={article.logo.startsWith('data:image/') ? article.logo : serverUrl + article.logo} alt={article.title} style={{ visibility: 'visible' }} />
                            </Link>
                            <div className="text pt-3 px-3 pb-0  mb-0">
                                <p className="details">
                                    {article.categories.map(category => (<span key={category}>
                                        <Link className="detail-info" to={`/articles/category/${category}`}>
                                            {category}
                                        </Link>
                                    </span>))}
                                    <span className="date">
                                        {dateformat(article.posted_at ? article.posted_at : article.published_at, 'mediumDate')}
                                    </span>
                                </p>
                                <div className="subtitle mb-0">
                                    <Link to={`/articles/${article.permalink}`}>
                                        {article.title}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {categories && <div className="sidebar-block tags-categories">
                    <h6><FormattedMessage id="COMPONENTS.ARTICLE.CATEGORY" /></h6>
                    <ul className="hover-li">
                        {categories.slice(0, 10).map(category => (
                            <li key={category._id}>
                                <Link className="title" to={`/articles/category/${category.title}`}>{category.title}</Link>
                            </li>
                        ))}
                    </ul>

                    {see_more && <ul className="hover-li extra-items">
                        {categories.slice(10, categories.length).map(category => (
                            <li key={category._id}>
                                <Link className="title" to={`/articles/category/${category.title}`}>{category.title}</Link>
                            </li>
                        ))}
                    </ul>}
                    <div className="see-all">
                        {!see_more && <span onClick={() => this.setState({ see_more: true })}><FormattedMessage id="COMPONENTS.ARTICLE.SEEALL" /> + </span>}
                        {see_more && <span onClick={() => this.setState({ see_more: false })}><FormattedMessage id="COMPONENTS.ARTICLE.SEELESS" /> - </span>}
                    </div>
                </div>}
            </>
        );
    }
}

export default injectIntl(ArticleSidebar);