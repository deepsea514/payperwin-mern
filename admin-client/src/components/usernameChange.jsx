import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import registrationValidation from '../helpers/asyncAwaitRegValidator';
import { setTitle } from '../libs/documentTitleBuilder';

const Form = ({
  username, // eslint-disable-line react/prop-types
  errors, // eslint-disable-line react/prop-types
  handleChange, // eslint-disable-line react/prop-types
  handleSubmit, // eslint-disable-line react/prop-types
  handleDirty, // eslint-disable-line react/prop-types
}) => (
    <Grid container justify="center">
      <Grid item xs={12} sm={7} md={7} lg={7}>
        <Card style={{ backgroundColor: '#e0e0e0' }}>
          <CardHeader
            style={{ textAlign: 'center' }}
            title="Username Change"
          />
          <CardContent style={{ backgroundColor: '#f5f5f5' }}>
            <TextField
              label="Username"
              name="username"
              value={username}
              onChange={handleChange}
              onBlur={handleDirty}
              error={errors.username !== undefined}
              helperText={errors.username}
              margin="normal"
              fullWidth
              variant="outlined"
              autoComplete="off"
              required
            />
            {errors.server ? <div className="form-error">{errors.server}</div> : null}
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Submit
          </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

const initState = {
  username: '',
  errors: {},
};

class UsernameChange extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDirty = this.handleDirty.bind(this);
  }

  componentDidMount() {
    setTitle({ pageTitle: 'Username Change' });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit() {
    const { getUser, history } = this.props;
    const { errors } = this.state;

    registrationValidation.validateFields(this.state, { tags: ['registration'] })
      .then((result) => {
        if (result === true) {
          const { username } = this.state;
          const serverUrl = window.apiServer;
          const url = `${serverUrl}/usernameChange`;
          axios({
            method: 'post',
            url,
            data: {
              username
            },
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }).then((/* { data } */) => {
            getUser();
            history.replace({ pathname: '/' });
          }).catch((err) => {
            if (err.response) {
              const { data } = err.response;
              if (data.error) {
                this.setState({ errors: { ...errors, server: data.error } });
              }
            }
          });
        } else {
          this.setState({
            errors: result,
          });
        }
      })
      .catch((err) => {
        this.setState({ errors: err });
      });
  }

  handleDirty(e) {
    // Handle Validation on touch
    const { errors } = this.state;
    const { name } = e.target;
    registrationValidation.validateField(name, this.state, { tags: ['registration'] }).then((result) => {
      const errorsStateChange = { ...errors, server: undefined };
      if (result === true) {
        errorsStateChange[name] = undefined;
      } else {
        errorsStateChange[name] = result;
      }
      this.setState({ errors: errorsStateChange });
    });
  }

  render() {
    return (
      <div>
        <Form
          {...this.state}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleDirty={this.handleDirty}
        />
      </div>
    );
  }
}

export default withRouter(UsernameChange);

UsernameChange.propTypes = {
  getUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
