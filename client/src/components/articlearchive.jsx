
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, Switch, Route } from "react-router-dom";
import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

class ArticleArchive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_subjects: null,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get(`${serverUrl}/articles`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({ loading: false, faq_subjects: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_subjects: null });
            })
    }

    render() {
        const { faq_subjects } = this.state;

        return (
            <div className="col-in faq">
                <section className="help-center">
                    <div className="hc-search">
                        <div className="hc-search-c">
                            <div className="heading">
                                <h2>ARTICLES</h2>
                                <p>Find the article you are looking for</p>
                            </div>
                            <center>
                                <form className="hc-search-form" autoComplete="off" id="hc-search-form" action="/faq/search">
                                    <div className="hc-search-input">
                                        <label htmlFor="support-search-input" className="hide">Enter your search term here...</label>
                                        <input placeholder="Enter your search term here..." type="text" name="term" className="special ui-autoComplete-input" rel="page-search" id="support-search-input" autoComplete="off" />
                                    </div>
                                    <div className="hc-search-button" id="help_pages_search_button">
                                        <button className="btn btn-primary" type="submit" autoComplete="off">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </center>
                        </div>
                    </div>

                    <section className="category-container">
                        {faq_subjects && faq_subjects.map(faq_subject => (
                            <div className="categories" key={faq_subject._id}>
                                <Link to={`/faq/subjects/${faq_subject._id}`}>{faq_subject.title}</Link>
                            </div>
                        ))}
                    </section>
                </section>
            </div>
        );
    }
}

export default injectIntl(ArticleArchive);