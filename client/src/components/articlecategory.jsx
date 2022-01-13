
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import ArticleWrapper from './articlewrapper';
import { getArticleCategories, getArticleCategory } from '../redux/services';

class ArticleCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            articles: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { categoryname } } } = this.props;
        const { match: { params: { categoryname: prevCategory } } } = prevProps;
        const categoryChanged = (categoryname !== prevCategory);
        if (categoryChanged) {
            this.getData();
        }
    }

    getData = () => {
        const { match: { params: { categoryname } } } = this.props;
        getArticleCategories()
            .then(({ data }) => {
                this.setState({ categories: data });
            })
            .catch((error) => {
                this.setState({ categories: [] });
            })

        this.setState({ loading: true });
        getArticleCategory(categoryname)
            .then(({ data }) => {
                this.setState({ articles: data, loading: false, });
            })
            .catch((error) => {
                this.setState({ articles: [], loading: false, });
            })
    }

    render() {
        const { intl, match: { params: { categoryname } } } = this.props;
        const { categories, articles, loading } = this.state;
        return (
            <div>
                <div className="category-intro-container">
                    <div className="global-width">
                        <h1 className="default">{categoryname}</h1>
                        <p data-nsfw-filter-status="swf">
                            <FormattedMessage id="COMPONENTS.ARTICLE.EXPLOREPOPULARTAG" values={{
                                search: (<Link to="/articles/category"><FormattedMessage id="COMPONENTS.ARTICLE.SEARCHCATEGORY" /></Link>)
                            }} />
                        </p>
                    </div>
                </div>
                <ArticleWrapper
                    loading={loading}
                    showMore={true}
                    showCategories={true}
                    categories={categories}
                    articles={articles}
                    title={`${categoryname} RESOURCE FEED`} />
            </div>
        );
    }
}

export default injectIntl(ArticleCategory);