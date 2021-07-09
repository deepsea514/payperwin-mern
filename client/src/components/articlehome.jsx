
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import axios from 'axios';
import ArticleSidebar from "./articlesidebar";

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class ArticleHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get(`${serverUrl}/articles/home`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ loading: false, articles: data });
            })
            .catch(() => {
                this.setState({ loading: false, articles: null });
            })
    }

    render() {
        const { articles } = this.state;
        return (
            <div className="col-in row mx-5">
                <div className="col-lg-8 col-md-8">
                    {articles.map((article, index) => (
                        <div className={`block feature-articles left ${index == 0 ? '' : 'mt-5'}`} key={article._id}>
                            <div className="item">
                                <a href="/en/betting-articles/euro-2020/euro-2020-golden-boot-betting-preview/dda2vdf8fadsfh6p">
                                    <img src={article.logo} alt="Euro 2020: Golden Boot betting preview" style={{ visibility: 'visible' }} />
                                </a>
                                <div className="text">
                                    <p className="details">
                                        {article.categories.map(caetgory => (<span key={caetgory}>
                                            <a className="detail-info" href="/en/betting-resources/author/sam-pearce">
                                                {caetgory}
                                            </a>
                                        </span>))}
                                        <span className="date">
                                            {dateformat(article.published_at, 'mediumDate')}
                                        </span>
                                    </p>
                                    <div className="subtitle">
                                        <a href="/en/betting-articles/euro-2020/euro-2020-predictions/4qmjduaxccblxtgx" >
                                            {article.title}
                                        </a>
                                    </div>
                                    <div className="short-intro">
                                        <p>{article.subtitle}</p>
                                    </div>
                                    <div className="cta-wrapper">
                                        <a href="/en/betting-articles/euro-2020/euro-2020-predictions/4qmjduaxccblxtgx" className="read-more-link">
                                            Read more <i className="fas fa-caret-down" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <a className="center-block-see-more mt-5" href="/en/betting-resources/category">See more articles</a>
                </div>
                <div className="col-md-4">
                    <ArticleSidebar />
                </div>
            </div>
        );
    }
}

export default injectIntl(ArticleHome);