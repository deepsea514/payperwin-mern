import React, { PureComponent } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder'

export default class NameComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTitle({ pageTitle: 'Title' });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="content">
        <div className="placeholder-block">
          <div className="placeholder-cover">
            <div className="center">
              Content
            </div>
          </div>
        </div>
      </div>
    );
  }
}
