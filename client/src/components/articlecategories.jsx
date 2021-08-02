
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import ArticleWrapper from './articlewrapper';
import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.appUrl;


class ArticleCategories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            articles: [],
        }
    }

    componentDidMount() {
        axios.get(`${serverUrl}/article-category`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })
        axios.get(`${serverUrl}/articles/home`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ articles: data });
            })
            .catch(() => {
                this.setState({ articles: null });
            })
    }

    render() {
        const { intl } = this.props;
        const { categories, articles } = this.state;
        return (
            <div>
                <div className="category-intro-container">
                    <div className="global-width">
                        <h1 className="default">Category</h1>
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