import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Articles from "./Articles";
import CreateArticle from "./CreateArticle";
import Categories from "./Categories";
import Authors from "./Authors";

export default class ArticlesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/articles">
                <Switch>
                    <Route path="/create" component={CreateArticle} />
                    <Route path="/edit/:id" component={CreateArticle} />
                    <Route path="/categories" component={Categories} />
                    <Route path="/authors" component={Authors} />
                    <Route exact path="/" component={Articles} />
                </Switch>
            </BrowserRouter>
        )
    }
}