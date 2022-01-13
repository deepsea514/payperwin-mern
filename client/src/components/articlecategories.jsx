
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import ArticleWrapper from './articlewrapper';
import { getArticleCategories, getArticles } from '../redux/services';

class ArticleCategories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            articles: [],
            loading: false,
        }
    }

    componentDidMount() {
        getArticleCategories()
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })
        this.setState({ loading: true });
        getArticles()
            .then(({ data }) => {
                this.setState({ articles: data, loading: false, });
            })
            .catch(() => {
                this.setState({ articles: null, loading: false, });
            })
    }

    render() {
        const { intl } = this.props;
        const { categories, articles, loading } = this.state;
        return (
            <div>
                <div className="category-intro-container">
                    <div className="global-width">
                        <h1 className="default"><FormattedMessage id="COMPONENTS.ARTICLE.CATEGORY" /></h1>
                        <div className="archive-anchors">
                            <nav className="anchors">
                                <ul className="list">
                                    {categories.map((category, index) => (
                                        <li key={index}>
                                            <Link to={`/articles/category/${category.title}`}>{category.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <ArticleWrapper
                    loading={loading}
                    showMore={false}
                    showCategories={true}
                    categories={categories}
                    articles={articles}
                    title={'CATEGORY RESOURCE FEED'} />
            </div>
        );
    }
}

export default injectIntl(ArticleCategories);