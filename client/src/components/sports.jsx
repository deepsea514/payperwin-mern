import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder'
import sportsData from '../../public/data/sports.json';
import SportsList from './sportsList';

export default class Sports extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTitle({ pageTitle: 'Sports' });
  }

  render() {
    return (
      <SportsList />
    );
  }
}