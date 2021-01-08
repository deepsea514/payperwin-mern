import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null,
      email: false,
      emailSent: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  componentDidMount() {
    setTitle({ pageTitle: 'Profile' });
    // Handle Validation on submit
    const serverUrl = window.apiServer;
    const url = `${serverUrl}/profile`;
    axios({
      method: 'get',
      url,
      withCredentials: true,
    }).then(({ data }) => {
      this.setState({ profileData: data, email: data.email });
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  saveProfile() {
    const { profileData } = this.state;
    const serverUrl = window.apiServer;
    const url = `${serverUrl}/updateProfile`;
    axios(
      {
        method: 'post',
        url,
        data: JSON.stringify(profileData),
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  sendVerificationEmail(email) {
    const serverUrl = window.apiServer;
    const url = `${serverUrl}/sendVerificationEmail`;
    axios(
      {
        method: 'post',
        url,
        data: JSON.stringify({ email }),
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    this.setState({ emailSent: true });
  }

  render() {
    // const { user } = this.props;
    const { profileData, email, emailSent } = this.state;
    if (!profileData) {
      return <div>Loading...</div>;
    }
    const emailVerified = profileData.roles.emailVerified && email === profileData.email;
    return (
      <div className="profile-settings">
        <div className="title">Password and Email</div>
        <ul>
          <li>
            <Link to="/usernameChange">
              Change Username
            </Link>
          </li>
          <li>
            <Link to="/passwordChange">
              Change Password
            </Link>
          </li>
          <li>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              className="change-email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            {!emailVerified ? (
              !emailSent ? (
                <button
                  onClick={() => this.sendVerificationEmail(email)}
                  type="button"
                >
                  Save and Send Email Verification
                </button>
              ) : ' Email sent awaiting verification.'
            ) : <span className="verified"> Verified &#10004;</span> }
          </li>
        </ul>
      </div>
    );
  }
}
