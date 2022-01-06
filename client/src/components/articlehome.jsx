
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getArticleCategories, getArticleCategory, getArticles } from '../redux/services';
import ArticleWrapper from './articlewrapper';

class ArticleHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            categories: [],
        }
    }

    componentDidMount() {
        getArticles()
            .then(({ data }) => {
                this.setState({ articles: data });
            })
            .catch(() => {
                this.setState({ articles: null });
            })
        getArticleCategories()
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })
    }

    render() {
        const { articles, categories } = this.state;
        return (
            <ArticleWrapper
                showMore={true}
                showCategories={false}
                categories={categories}
                articles={articles}
                title={null} />
        );
    }
}

export default injectIntl(ArticleHome);