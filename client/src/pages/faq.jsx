
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage, injectIntl } from 'react-intl';

class Faq extends Component {
    render() {
        const { intl } = this.props;
        setTitle({ pageTitle: 'Frequently Asked Questions' });
        return (
            <div className="col-in faq">
                <center>
                    <h2>Frequently Asked Questions</h2>
                </center>

                <h2>My Account</h2>

                <h5>Username and password</h5>
                <p>If you have forgotten your login details, please do the following:</p>
                <ul>
                    <li>1. Click the LOGIN button to bring up the “Forgot your username / password?” option.</li>
                    <li>2. To retrieve your Username, enter the email address associated with your account and it will be sent to you there.</li>
                    <li>3. To reset your password, enter your Username and a link will be sent to the email address associated with your account. Click on the link in the email to be brought to the password reset page.</li>
                </ul>

                <p>
                    If your account has been suspended due to multiple failed login attempts, please contact
                    Customer Service. For the quickest resolution, please also include your username and the
                    answer to your security question (ex. Mother's maiden name, Name of Pet, Favorite city,
                    Favorite team, etc.)
                </p>

                <h5>Security Questions</h5>
                <p>
                    If you have forgotten your security question or password or would like to update any
                    of these please go to settings and password and security
                </p>

                <h5>Email / Address</h5>
                <p>
                    How do I update my email or address, click on my account and personal details?
                </p>

                <h2>Deposits or Withdrawals</h2>

                <h5>Deposits</h5>
                <p>
                    Deposits can be done under my account and deposit
                    section. Your account will be credited as soon as we
                    receive the funds. You will receive an email
                    notification and your mailbox in your PAYPER WIN
                    account. PAY PER WIN does not charge any fees for credit card deposits.
                </p>

                <h5>Withdrawals</h5>
                <p>
                    Withdrawals can be made under my account and withdrawal
                    section. Withdrawal requests for registered accounts
                    received before 12am ET will be processed the following business day.
                </p>
                <p>
                    Withdrawal requests for Registered Accounts that are
                    received before 12 a.m. Eastern Time will be processed
                    the following business day (Monday to Friday only, not
                    including weekends or holidays). For first time
                    withdrawals this will need to be cleared by our Security
                    Team. This process can take up to 3 business days. To
                    cancel a withdrawal, click on the withdrawal and select
                    cancel, and the money will be refunded back to your account.
                </p>

                <h2>Registration</h2>
                <p>
                    Our License Agreement requires us to adhere to rules
                    regarding customer security and identification.
                    Documentation is required for every account holder. We
                    request to confirm age, address and deposit and withdrawal information.
                </p>

                <h5>Register my account</h5>
                <p>
                    The sooner you register your account, the sooner you may
                    enjoy higher deposit limits and quicker payouts
                </p>
                <p>
                    {intl.formatMessage(
                        { id: "PAGE.FAQ.REGISTRATION.2.2" },
                        { email: <b>registrations@payperwin.co</b> }
                    )}
                </p>

                <h5>Registration process</h5>
                <p>
                    Usually this process takes up to 3 days. Our team will
                    review the documents and once reviewed a registration
                    representative will contact you to confirm your account.
                </p>

                <h5>Sending registration documents</h5>
                <p>
                    You can upload your documents directly to our website.
                    Click here to upload your images now, or alternatively
                    paste the following link:
                    <a href="httpS://www.payperwin.co/uploadmydocuments">http://www.payperwin.co/uploadmydocuments</a>
                    You can also
                    email digital photo of your documents and email them to
                    us: <b>registrations@payperwin.co</b> Acceptable forms of
                    documentation are government issued identification.
                    Please make sure all documents are clear and readable. A
                    confirmation email will be sent once we have received
                    and reviewed them.
                </p>
                <p>
                    We are committed to protecting the privacy and security
                    of your personal information. In this respect we have
                    invested heavily in world class information management
                    systems to keep your details encrypted and secure. Click
                    here to read more about our Privacy Policy. You can also
                    click here to read about how we keep your personal and
                    financial information safe.
                </p>
                <p>
                    We take your online security seriously, and know the
                    safety of your information is important to you. With
                    this in mind, we may ask you for additional
                    identification to confirm requests originate with you.
                </p>
                <p>
                    Sports Interaction recognizes that online security is an
                    area of vital importance to all players. To this end,
                    players will be asked to provide identification and
                    proof of address for security purposes to ensure the
                    validity of any transaction conducted on their account.
                    A player's registered address should match that
                    registered with their method of payment, eg. billing
                    address for credit card payments. Failure to provide
                    sufficient documentation as requested will result in
                    that player's account transactions being held or
                    suspended until such time as identification and proof of
                    address is received and authenticated.
                </p>

                <h2>Managing Bets</h2>

                <h5>Bet Minimum</h5>
                <ul>
                    <li>The bet minimum is $1 dollar.</li>
                    <li>The wallet minimum is $25 dollars.</li>
                    <li>The minimum balance to maintain an active account is $5 dollars.</li>
                </ul>
                <h5>Bet Process Time</h5>
                <p>
                    <strong>Pending:</strong> your bet is awaiting
                    acceptance from an opposing Bettor. You bet could remain
                    in this state up to game start time, if the bet is not
                    accepted, your funds will be returned back to you
                    immediately and available to bet again with. In some
                    cases, a portion of your bet will be accepted and will
                    leave a portion as pending. If the pending amount is
                    matched at a later time prior to event start time then
                    the bet will be accepted. If the no opposing bettor bets
                    against you for the remaining pending amount prior to
                    the start time of the event, the remainder will be
                    cancelled and returned to you.
                </p>
                <p>
                    <strong>Accepted:</strong> Your bet is now accepted;
                    this means someone has bet against you. The winner is
                    paid once the score or event is finalized.
                </p>
                <p>
                    <strong>Cancelled:</strong> Your bet is cancelled if the
                    event is cancelled, if the event is postponed then your
                    bet will be rescheduled. Another chance of cancellation
                    of your bet is if no opposing bettor bets against you,
                    in this case your money will be returned to your
                    account.
                </p>
                <p>
                    <strong>Cancelling a Bet:</strong> Bets cannot be
                    altered or cancelled. Please ensure that all of your bet
                    details are correct, each Bettor may not change or
                    cancel a bet. Every user must ensure that all details of
                    their bets are correct.
                </p>

                <h5>Odds and Prices</h5>
                <p>American Odds</p>
                <p>
                    A price listed as +200 means that the bettor will return
                    $200 profit on every $100 bet, in addition to the
                    original staked amount. +300 will return $300 profit for
                    every $100 bet, in addition to the original staked
                    amount.
                </p>
                <p>
                    A price listed as -200 means that the bettor must bet
                    $200 in order to have a profit of $100, in addition to
                    the original staked amount. -300 would mean for every
                    $300 bet $100 profit would be made, in addition to the
                    original staked amount.
                </p>
                <p>Decimal</p>
                <p>
                    A price listed at 3.00 means that the bet will return
                    $300 for every $100 bet, including the staked amount. A
                    price listed at 3.00 means that the bet will return $300
                    for every $100 bet, including the original staked amount
                </p>

                <h5>Bet Status</h5>
                <p>Win: your bet has won</p>
                <p>Loss: your bet has loss</p>
                <p>Cancelled: your bet is cancelled</p>

                <h5>Fees</h5>
                <p>
                    To place a bet online is free, only a winner is charged
                    3% transaction fee for facilitating payment from the
                    opposing bettor.
                </p>
            </div>
        );
    }
}

export default injectIntl(Faq);