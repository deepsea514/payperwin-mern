
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import dateformat from "dateformat";
import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class ArticleSidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            active_tab: 'popular',
            see_more: false,
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
        const { articles, active_tab, see_more } = this.state;
        return (
            <>
                <div className="sidebar-block">
                    <div className="recent-popular-related">
                        <ul className="article-sidebar-tab">
                            <li className={`popular-tab ${active_tab == 'popular' ? 'active' : ''}`}
                                onClick={() => this.setState({ active_tab: 'popular' })}>
                                <span>Popular</span>
                            </li>
                            <li className={`recent-tab ${active_tab == 'recent' ? 'active' : ''}`}
                                onClick={() => this.setState({ active_tab: 'recent' })}>
                                <span>Recent</span>
                            </li>
                        </ul>

                        <div className={`sidebar-tab recent-list ${active_tab == 'recent' ? 'active' : ''}`}>
                            <ul className="hover-li">
                                <li>
                                    <div className="details">
                                        <a className="tag" href="#">Euro 2020</a>
                                        <span className="date">Today</span>
                                    </div>
                                    <h4 className="subtitle">
                                        <a href="#">Euro 2020 predictions</a>
                                    </h4>
                                </li>
                                <li>
                                    <div className="details">
                                        <a className="tag" href="#">Copa America 2021</a>
                                        <span className="date">Today</span>
                                    </div>
                                    <h4 className="subtitle">
                                        <a href="#">Copa America 2021 predictions</a>
                                    </h4>
                                </li>
                                <li>
                                    <div className="details">
                                        <a className="tag" href="#">MMA</a>
                                        <span className="date">This week</span>
                                    </div>
                                    <h4 className="subtitle">
                                        <a href="#">UFC Predictions</a>
                                    </h4>
                                </li>
                                <li>
                                    <div className="details">
                                        <a className="tag" href="#">Boxing</a>
                                        <span className="date">Last week</span>
                                    </div>
                                    <h4 className="subtitle">
                                        <a href="#">Boxing betting predictions</a>
                                    </h4>
                                </li>
                                <li>
                                    <div className="details">
                                        <a className="tag" href="#">Golf</a>
                                        <span className="date">Last week</span>
                                    </div>
                                    <h4 className="subtitle">
                                        <a href="#">John Deere Classic betting preview</a>
                                    </h4>
                                </li>

                                <li className="sidebar-tab-more">
                                    <a href="#">
                                        More articles <i className="fas fa-chevron-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className={`sidebar-tab popular-list ${active_tab == 'popular' ? 'active' : ''}`}>
                            <div className="all-time-list">
                                <ul className="hover-li">
                                    <li>
                                        <div className="details">
                                            <a className="tag" href="#">Soccer</a>
                                            <span className="date">Oct 23, 2018</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <a href="#">How to predict draws in soccer</a>
                                        </h4>
                                    </li>
                                    <li>
                                        <div className="details">
                                            <a className="tag" href="#">Betting Strategy</a>
                                            <span className="date">Nov 7, 2017</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <a href="#">Staking: One method to improve your betting</a>
                                        </h4>
                                    </li>
                                    <li>
                                        <div className="details">
                                            <a className="tag" href="#">Betting Strategy</a>
                                            <span className="date">Sep 1, 2017</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <a href="#">How to calculate Expected Value</a>
                                        </h4>
                                    </li>
                                    <li>
                                        <div className="details">
                                            <a className="tag" href="#">Soccer</a>
                                            <span className="date">Apr 27, 2017</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <a href="#">Poisson Distribution: Predict the score in soccer betting</a>
                                        </h4>
                                    </li>
                                    <li>
                                        <div className="details">
                                            <a className="tag" href="#">Betting Strategy</a>
                                            <span className="date">Mar 6, 2017</span>
                                        </div>
                                        <h4 className="subtitle">
                                            <a href="#">What is handicap soccer betting?</a>
                                        </h4>
                                    </li>

                                    <li className="sidebar-tab-more">
                                        <a href="#">
                                            More articles <i className="fas fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {articles.slice(0, 2).map((article, index) => (
                    <div className={`block feature-articles left mt-2`} key={article._id}>
                        <div className="item pb-0">
                            <a href="#">
                                <img src={article.logo} alt="Euro 2020: Golden Boot betting preview" style={{ visibility: 'visible' }} />
                            </a>
                            <div className="text pt-3 px-3 pb-0  mb-0">
                                <p className="details">
                                    {article.categories.map(caetgory => (<span key={caetgory}>
                                        <a className="detail-info" href="#">
                                            {caetgory}
                                        </a>
                                    </span>))}
                                    <span className="date">
                                        {dateformat(article.published_at, 'mediumDate')}
                                    </span>
                                </p>
                                <div className="subtitle mb-0">
                                    <a href="#">
                                        {article.title}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div class="sidebar-block tags-categories">
                    <h6>Categories</h6>
                    <ul class="hover-li">
                        <li>
                            <a class="title" href="#">Olympics 2020</a>
                        </li>
                        <li>
                            <a class="title" href="#">Copa America 2021</a>
                        </li>
                        <li>
                            <a class="title" href="#">Euro 2020</a>
                        </li>
                        <li>
                            <a class="title" href="#">Winter Olympics</a>
                        </li>
                        <li>
                            <a class="title" href="#">Euro 2016</a>
                        </li>
                        <li>
                            <a class="title" href="#">Educational</a>
                        </li>
                        <li>
                            <a class="title" href="#">Casino</a>
                        </li>
                        <li>
                            <a class="title" href="#">Specials</a>
                        </li>
                        <li>
                            <a class="title" href="#">Betting Psychology</a>
                        </li>
                        <li>
                            <a class="title" href="#">Betting Strategy</a>
                        </li>
                    </ul>

                    {see_more && <ul class="hover-li extra-items">
                        <li>
                            <a class="title" href="#">Social Media</a>
                        </li>
                        <li>
                            <a class="title" href="#">Pinnacle Puzzle</a>
                        </li>
                        <li>
                            <a class="title" href="#">More Sports</a>
                        </li>
                        <li>
                            <a class="title" href="#">Golf</a>
                        </li>
                        <li>
                            <a class="title" href="#">Boxing</a>
                        </li>
                        <li>
                            <a class="title" href="#">Tennis</a>
                        </li>
                        <li>
                            <a class="title" href="#">Soccer</a>
                        </li>
                        <li>
                            <a class="title" href="#">MMA</a>
                        </li>
                        <li>
                            <a class="title" href="#">Baseball</a>
                        </li>
                        <li>
                            <a class="title" href="#">Hockey</a>
                        </li>
                        <li>
                            <a class="title" href="#">Football</a>
                        </li>
                        <li>
                            <a class="title" href="#">Formula 1</a>
                        </li>
                        <li>
                            <a class="title" href="#">World Cup</a>
                        </li>
                        <li>
                            <a class="title" href="#">Basketball</a>
                        </li>
                    </ul>}
                    <div class="see-all">
                        {!see_more && <span onClick={() => this.setState({ see_more: true })}>See all + </span>}
                        {see_more && <span onClick={() => this.setState({ see_more: false })}>See less - </span>}
                    </div>
                </div>
            </>
        );
    }
}

export default injectIntl(ArticleSidebar);