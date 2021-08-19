import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Articles from "./Articles";
import CreateArticle from "./CreateArticle";
import Categories from "./Categories";
import EditArticle from "./EditArticle";

export default class ArticlesModule extends Component {
    render() {
        return (
            <BrowserRouter basename="/RP1021/articles">
                <Switch>
                    <Route path="/create" component={CreateArticle} />
                    <Route path="/edit/:id" component={EditArticle} />
                    <Route path="/categories" component={Categories} />
                    <Route exact path="/" component={Articles} />
                </Switch>
            </BrowserRouter>
        )
    }
}