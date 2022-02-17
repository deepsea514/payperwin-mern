import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage } from 'react-intl';

class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMobile: null,
        }
    }

    componentDidMount() {
        const title = 'Terms and Conditions';
        setTitle({ pageTitle: title })
    }

    setVisible = (value) => {
        const { showMobile } = this.state;
        if (showMobile == value)
            this.setState({ showMobile: null });
        else
            this.setState({ showMobile: value });
    }

    render() {
        const { showMobile } = this.state;
        return (
            <React.Fragment>
                <div className="content-container">
                    <div className="block help-contact">
                        <h1 className="title-bar background darkblue">Terms and Conditions</h1>
                        <div className="block box">
                            <div className="containerless">
                                <article>
                                    <div className="gray selection-list row">
                                        <ul className="col-6 list">
                                            <li>
                                                <a className="title" href="#title-0">Introduction</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-1">General Terms</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-2">1.Your Obligations</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-3">2. Registration</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-4">3. Restricted Use</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-5">4. Privacy</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-6">5. Your Account</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-7">6. Account Activity</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-8">7. Deposit of Funds</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-9">8. Withdrawal of Funds</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-10">9. Payment Transactions and Processors</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-11">10. Responsible Gaming</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-12">11. Errors and Exceptional Circumstances</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-13">12. General Rules</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-14">13. Communications and Notices</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-15">14. Matters beyond our control</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-16">15. Liability</a>
                                            </li>
                                        </ul>

                                        <ul className="col-6 list">
                                            <li>
                                                <a className="title" href="#title-17">16. Gambling by Those Under Age</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-18">17. Fraud</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-19">18. Intellectual Property</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-20">19. Your Licence</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-21">20. Your Conduct and Safety</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-22">21. Links to Other Websites</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-23">22. Complaints</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-24">23. Registration and Account Security</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-25">24. Assignment</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-26">25. Severability</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-27">26. Breach of These Terms</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-28">27. Governing Law and Jurisdiction</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-29">28. General Provisions</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-30">29. Betting Rules</a>
                                            </li>
                                            <li>
                                                <a className="title" href="#title-31">30. Casino Rules</a>
                                            </li>
                                            <li>
                                                <a className='title' href='#title-32'>31. Bet Cancellation</a>
                                            </li>
                                        </ul>
                                        <div className="clear-both"></div>
                                    </div>
                                    <div className="gray terms-and-conditions">
                                        <h1><a name="_Toc408928304"></a>Terms and Conditions</h1>
                                        <p></p>
                                        <p></p>
                                        <table width="437" height="42">
                                            <tbody>
                                                <tr><th>Date</th><th>Description</th><th>Version</th></tr>
                                                <tr>
                                                    <td>March 10<sup>th</sup>, 2021</td>
                                                    <td><span lang="EN-US">Terms and Conditions replacing version 2.7</span></td>
                                                    <td>2.8</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <br />
                                        <p></p>
                                        <h2 id="title-0" className="privacy-policy-section-title desktop">Introduction</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(1)}>
                                            Introduction
                                            <div className="arrow-up" style={{ display: showMobile == 1 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 1 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 1 ? 'block' : 'none' }}>
                                            <p></p>
                                            <p>
                                                <strong>These terms and conditions and the documents referred and linked to below (the "<em>Terms</em>") set out the basis upon which the website operated under the URL “payperwin.com” (the "Website") and its related or connected services (collectively, the "<em>Service</em>") will be provided to you.</strong>
                                            </p>
                                            <p></p>
                                            <p>
                                                <strong>Please read these Terms very carefully as they form a binding legal agreement between you - our customer (the "<em>Customer</em>") - and us. By opening an account (the "<em>Account</em>") and using the Service you agree to be bound by these Terms, together with any amendment which may be published from time to time. </strong>
                                            </p>
                                            <p></p>
                                            <p>
                                                <strong>If anything is not clear to you please contact us using the contact details below:</strong>
                                            </p>
                                            <p></p>
                                            <p>
                                                The company trades as 'PayPerWin'.
                                            </p>
                                            <p>
                                                Impyrial Holdings Ltd, 8A Pitmans Alley Main Street, Gibraltar GX11 1AA.
                                                <br />
                                                payperwin.com operates with the licence of Ragnarok Corporation N.V., Pletterijweg 43, Willemstad, Curaçao, which is licensed by the government of Curacao under the Licence 8048/JAZ2013-013 issued for the provision of sports betting and casino. PayPerWin will only communicate with Customers by email to their registered email address (the "<em><strong>Registered Email Address</strong></em>") as provided when opening your PayPerWin Account: Communication from PayPerWin will be issued through the following mail only: <a href="mailto:support@payperwin.com"> "support@payperwin.com"</a>.
                                            </p>
                                            <p></p>
                                            <p></p>
                                        </div>


                                        <h2 id="title-1" className="privacy-policy-section-title desktop">General Terms</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(2)}>
                                            General Terms
                                            <div className="arrow-up" style={{ display: showMobile == 2 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 2 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 2 ? 'block' : 'none' }}>
                                            <p></p>
                                            <p>
                                                We reserve the right to amend the Terms (including to any documents referred and linked to below) at any time. When such amendment is not substantial, we may not provide you with prior notice. You will be notified in advance for material changes to the Terms and may require you to re-confirm acceptance to the updated terms before the changes come into effect. If you object to any such changes, you must immediately stop using the Service and the termination provisions below will apply. Continued use of the Service indicates your agreement to be bound by such changes. Any bets not settled prior to the changed Terms taking effect will be subject to the pre-existing Terms.
                                            </p>
                                            <p></p>
                                            <p>
                                                If at any time you are in any doubt about how to place bets or otherwise use the Service you should refer back to these Terms or contact our customer service department (<em><strong>Customer Service Department)</strong></em> at "<a href="mailto:support@payperwin.com">support@payperwin.com</a>".
                                            </p>
                                        </div>

                                        <h2 id="title-2" className="privacy-policy-section-title desktop">1.Your Obligations</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(3)}>
                                            1.Your Obligations
                                            <div className="arrow-up" style={{ display: showMobile == 3 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 3 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 3 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 0" }} start="1">
                                                <li>
                                                    <ol className="sub show-number" style={{ counterReset: "item 0" }} start="1">
                                                        <li>You agree that at all times when using the Service:
                                                            <ol className="sub">
                                                                <li>You are over 18 years of age (or over the age of majority as stipulated in the laws of the jurisdiction applicable to you) and can enter into a binding legal agreement with us. The Company makes no representation as to the legality of its online gambling service in other jurisdictions.</li>
                                                                <li>You are in a country where it is lawful to place bets on the Service (if in doubt, you should seek local legal advice). It is your responsibility to ensure that your use of the service is legal.</li>
                                                                <li>You are not a resident of the following countries:
                                                                    <div className="list-alike">
                                                                        <p><span>I.</span>the United States of America and its territories;</p>
                                                                        <p><span>II.</span>the French Republic and its territories;</p>
                                                                        <p><span>III.</span>United Kingdom;</p>
                                                                        <p><span>IV.</span>Netherlands (including Curacao and other countries and territories that form part of the Kingdom of Netherlands);</p>
                                                                        <p><span>V.</span>Spain;</p>
                                                                        <p><span>VI.</span>Germany;</p>
                                                                        <p><span>VII.</span>Singapore;</p>
                                                                        <p><span>VIII.</span>Democratic People's Republic of Korea;</p>
                                                                        <p><span>IX.</span>Denmark;</p>
                                                                        <p><span>X.</span>Philippines;</p>
                                                                        <p><span>XI.</span>Syria;</p>
                                                                        <p><span>XII.</span>Turkey;</p>
                                                                        <p><span>XIII.</span>Poland;</p>
                                                                        <p><span>XIV.</span>Ireland;</p>
                                                                        <p><span>XV.</span>Czech Republic;</p>
                                                                        <p><span>XVI.</span>Sudan;</p>
                                                                        <p><span>XVII.</span>Australia and its territories</p>
                                                                        <p><span>XVIII.</span>Italy</p>
                                                                        <p><span>XIX.</span>Iran</p>
                                                                        <p><span>XX.</span>Slovenia</p>
                                                                        <p><span>XXI.</span>Sweden</p>
                                                                        <p><span>XXII.</span>Portugal</p>
                                                                        <p><span>XXIII.</span>and any other country which may prohibit the offering on online gambling to its residents or to any person within such country</p>
                                                                    </div>
                                                                </li>
                                                                <li>When sending money to us you are authorised to do so e.g. you are the authorised user of the debit/credit card or other payment method you use.</li>
                                                                <li>You will not, by participating in the Services and/or placing bets be placed in a position of actual, potential or perceived conflict of interest in any manner.</li>
                                                                <li>You have never failed to pay, or attempted to fail to pay a liability on a bet.</li>
                                                                <li>You are acting solely on your own behalf as a private individual in a personal capacity and not on behalf of another party or for any commercial purposes.</li>
                                                                <li>By placing bets you may lose some or all of your money lodged with us in accordance with these Terms and you will be fully responsible for that loss.</li>
                                                                <li>You must use the Service for legitimate betting purposes only and must not nor attempt to manipulate any market or element within the Service in bad faith or in a manner that adversely affects the integrity of the Service or us.</li>
                                                                <li>When placing bets on the Service you must not use any information obtained in breach of any legislation in force in the country in which you were when the bet was placed.</li>
                                                                <li>You must make all payments to us in good faith and not attempt to reverse a payment made or take any action which will cause such payment to be reversed by a third party in order to avoid a liability legitimately incurred.</li>
                                                                <li>You must otherwise generally act in good faith in relation to us of the Service at all times and for all bets made through the Service.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-3" className="privacy-policy-section-title desktop">2. Registration</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(4)}>
                                            2. Registration
                                            <div className="arrow-up" style={{ display: showMobile == 4 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 4 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 4 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 1" }} start="2">
                                                <li>
                                                    <ol className="sub show-number" start="2">
                                                        <li>You agree that at all times when using the Service:
                                                            <ol className="sub show-number" start="2">
                                                                <li>In order to protect the integrity of the Service and for other operational reasons we reserve the right to refuse to accept a registration application from any applicant at our sole discretion and without any obligation to communicate a specific reason.</li>
                                                                <li>Before using the Service, you must personally complete the registration form and read and accept these Terms. In order to start betting on the Service, we will require you to become a verified Customer which includes passing certain checks. You may be required to provide a valid proof of identification and any other document as it may be deemed necessary. This includes but is not limited to, a picture ID (copy of passport, driver's licence or national ID card) and a recent utility bill listing your name and address as proof of residence to the minimum. We reserve the right to suspend wagering or restrict Account options on any Account until the required information is received. This procedure is a statutory requirement and is done in accordance with the applicable gaming regulation and the anti-money laundering legal requirements. Additionally, you will need to fund your payperwin.com Account using the payment methods set out on the payment section of our Website.</li>
                                                                <li>You must provide complete and accurate information about yourself, inclusive of a valid name, surname, address and email address, and update such information in the future to keep it complete and accurate. It is your responsibility to keep your contact details up to date on your Account. Failure to do so may result in you failing to receive important Account related notifications and information from us, including changes we make to these Terms. We identify and communicate with our Customers via their Registered Email Address. It is the responsibility of the Customer to maintain an active and unique email account, to provide us with the correct email address and to advise PayPerWin of any changes in their email address. Each Customer is wholly responsible for maintaining the security of his Registered Email Address to prevent the use of his Registered Email Address by any third party. PayPerWin shall not be responsible for any damages or losses deemed or alleged to have resulted from communications between PayPerWin and the Customer using the Registered Email Address. Any Customer not having an email address reachable by PayPerWin will have his Account suspended until such an address is provided to us. We will immediately suspend your Account upon written notice to you to this effect if you intentionally provide false or inaccurate personal information. We may also take legal action against you for doing so in certain circumstances and/or contact the relevant authorities who may also take action against you.</li>
                                                                <li>You are only allowed to register one Account with the Service. Accounts are subject to immediate closure if it is found that you have multiple Accounts registered with us. This includes the use of representatives, relatives, associates, affiliates, related parties, connected persons and/ or third parties operating on your behalf.</li>
                                                                <li>In order to ensure your financial worthiness and to confirm your identity, we may use any third party information providers we consider necessary.</li>
                                                                <li>You must keep your password for the Service confidential. Provided that the Account information requested has been correctly supplied, we are entitled to assume that bets, deposits and withdrawals have been made by you. We advise you to change your password on a regular basis and never disclose it to any third party. Passwords must contain at least one letter, one number and one special character and must be at least eight characters long. It is your responsibility to protect your password and any failure to do so shall be at your sole risk and expense. You must log out of the Service at the end of each session. If you believe any of your Account information is being misused by a third party, or your Account has been hacked into, or your password has been discovered by a third party, you must notify us immediately by email using your Registered Email Address to <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                                <li>You must notify us if your Registered Email Address has been hacked into, we may, however, require you to provide additional information/ documentation so that we can verify your identity. We will immediately suspend your Account once we are aware of such an incident. In the meantime you are responsible for all activity on your Account including third party access, regardless of whether or not their access was authorised by you. You must not at any time transmit any content or other information on the Service to another Customer or any other party by way of a screen capture (or other similar method), nor display any such information or content in a frame or in any other manner that is different from how it would appear if such Customer or third party had typed the URL for the Service into the browser line.</li>
                                                                <li>When registering, you will be required to choose the currency in which you will operate your Account. This will be the currency of your deposits, withdrawals and bets placed and matched into the Service as set out in these Terms. Some payment methods do not process in all currencies. In such cases a processing currency will be displayed, along with a conversion calculator available on the page.</li>
                                                                <li>We are under no obligation to open an Account for you and our website sign-up page is merely an invitation to treat. It is entirely within our sole discretion whether or not to proceed with the opening of an Account for you and, should we refuse to open an Account for you, we are under no obligation to provide you with a reason for the refusal.</li>
                                                                <li>Upon receipt of your application, we may be in touch to request further information and/ or documentation from you in order for us to comply with our regulatory and legal obligations.</li>
                                                                <li>Customer funds are segregated from corporate/operational funds and the company ensures that sufficient funds are available at all times to meet its obligations to customers.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-4" className="privacy-policy-section-title desktop">3. Restricted Use</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(5)}>
                                            3. Restricted Use
                                            <div className="arrow-up" style={{ display: showMobile == 5 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 5 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 5 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 2" }} start="3">
                                                <li>
                                                    <ol className="sub show-number" start="3">
                                                        <li>You must not use the Service:
                                                            <ol className="sub" start="3">
                                                                <li>if you are under the age of 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you) or if you are not legally able to enter into a binding legal agreement with us;</li>
                                                                <li>to collect nicknames, e-mail addresses and/or other information of other Customers by any means (for example, by sending spam, other types of unsolicited e-mails or the unauthorised framing of, or linking to, the Service);</li>
                                                                <li>to disrupt or unduly affect or influence the activities of other Customers or the operation of the Service generally</li>
                                                                <li>to promote unsolicited commercial advertisements, affiliate links, and other forms of solicitation which may be removed from the Service without notice;.</li>
                                                                <li>in any way which, in our reasonable opinion, could be considered as an attempt to: (i) cheat the Service or another Customer using the Service; or (ii) collude with any other Customer using the Service in order to obtain a dishonest advantage;</li>
                                                                <li>to scrape our odds or violate any of our Intellectual Property Rights; or.</li>
                                                                <li>for any unlawful activity whatsoever.</li>
                                                            </ol>
                                                        </li>
                                                        <li>You cannot sell or transfer your account to third parties, nor can you acquire a player account from a third party.</li>
                                                        <li>You may not, in any manner, transfer funds between player accounts.</li>
                                                        <li>We may immediately terminate your Account upon written notice to you if you use the Service for unauthorised purposes. We may also take legal action against you for doing so in certain circumstances.</li>
                                                        <li>You are not allowed to use any kind of robots and programmed devices to participate in game play which purpose would be to disrupt the service or to commit fraud.</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-5" className="privacy-policy-section-title desktop">4. Privacy</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(6)}>
                                            4. Privacy
                                            <div className="arrow-up" style={{ display: showMobile == 6 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 6 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 6 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 3" }} start="4">
                                                <li>
                                                    <ol className="sub show-number" start="4">
                                                        <li>Any information provided to us by you will be protected and processed in strict accordance with these Terms and our <a href="/en/future/privacy-policy" target="_blank"> Privacy Policy</a>.</li>
                                                        <li>You acknowledge and accept that we collect and use your personal data in order to allow you access and use of the Website and in order to allow you to participate in Games.</li>
                                                        <li>We will not reveal the identity of any person who places bets using the Service unless the information is lawfully required by competent authorities such as Regulators, the Police (e.g. to investigate fraud, money laundering or sports integrity issues), or by Financial Entities such as banks or payment suppliers or as permitted from time to time pursuant to the Privacy Policy.</li>
                                                        <li>Upon registration your information is stored in our database. By agreeing to these Terms you agree to the transfer of your personal information for the purpose of the provision of the Service object of this agreement and as further detailed in our Privacy Policy.</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-6" className="privacy-policy-section-title desktop">5. Your Account</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(7)}>
                                            5. Your Account
                                            <div className="arrow-up" style={{ display: showMobile == 7 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 7 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 7 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 4" }} start="5">
                                                <li>
                                                    <ol className="sub show-number" start="5">
                                                        <li>We accept Accounts in multiple currencies, please refer to <a href="/en/payments">https://www.payperwin.com/en/payment-options</a>. All Account balances and transactions appear in the currency selected when the Account was originally opened. We do not give credit for the use of the Service.</li>
                                                        <li>We may close or suspend an Account and refund any monies held if you are not or we reasonably believe that you are not complying with these Terms, or to ensure the integrity or fairness of the Service or if we have other reasonable grounds to do so. We may not always be able to give you prior notice. In the circumstance where an Account requires closure for any reason and the remaining funds in the Account are insufficient to cover any withdrawal fees associated with sending the money back to the Customer the monies will be forfeited.</li>
                                                        <li>We may forfeit and/or confiscate funds available on your Account and/or refuse to honour a claim, in the event that, directly or indirectly:
                                                            <div className="list-alike">
                                                                <p><span>(i)</span>the Terms have been violated; and/or</p>
                                                                <p><span>(ii)</span>other unauthorised activities have occurred in connection with a betting event and/or the operation of an Account (such as, but not limited to, breach of the law or other regulations, breach of a third party’s rights, fraud, and cheating).</p>
                                                            </div>
                                                        </li>
                                                        <li>Closed inactive accounts will be pseudonymised on a quarterly basis in accordance with the terms set out in the Privacy Policy.</li>
                                                        <li>We may suspend and/or cancel the participation of your Account in the Services, and/or forfeit and/or confiscate funds available on your Account if you are found cheating, or if it is determined by us that you have employed or made use of a system (including machines, robots, computers, software or any other automated system) designed to defeat or capable of defeating our applications and/or software, or if we notice any irregular playing patterns. Your account will be reviewed in the interests of fair gaming for any irregular playing patterns. These irregular playing patterns include, but are not limited to: equal, zero or low margin bets, opposite betting, card counting or hedge betting.</li>
                                                        <li>We reserve the right to suspend an Account without prior notice and return all funds. Contractual obligations already matured will however be honoured.</li>
                                                        <li>We reserve the right to refuse, restrict, cancel or limit any wager at any time for whatever reason, including any bet perceived to be placed in a fraudulent manner in order to circumvent our betting limits and/ or our system regulations.</li>
                                                        <li>If we close or suspend your Account due to you not complying with these Terms, we may cancel and/or void any of your bets.</li>
                                                        <li>If any amount is mistakenly credited to your Account it remains our property and when we become aware of any such mistake, we shall notify you and the amount will be withdrawn from your Account.</li>
                                                        <li>If, for any reason, your Account goes overdrawn, you shall be in debt to us for the amount overdrawn.</li>
                                                        <li>You must inform us as soon as you become aware of any errors with respect to your Account. Customers have the right to self-exclude themselves from payperwin.com. These requests have to be received from the Customer's Registered Email Address and have to be sent to <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                        <li>Customers may set limitations on the amount they may wager and lose. Such request has to be sent from the Customer's Registered Email Address to <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                        <li>Implementation and increasing of limits shall be processed diligently, however, any request for removing or reducing limitations shall be done after a cooling-off period of seven days following your request.</li>
                                                        <li>Should you wish to close your account with us, please send an email from your Registered Email Address to <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-7" className="privacy-policy-section-title desktop">6. Account Activity</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(8)}>
                                            6. Account Activity
                                            <div className="arrow-up" style={{ display: showMobile == 8 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 8 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 8 ? 'block' : 'none' }}>
                                            <ol className="sub hide-number" style={{ counterReset: "item 5" }} start="6">
                                                <li>
                                                    <ol className="sub show-number" start="6">
                                                        <li>Your Account will become inactive if:
                                                            <ol className="sub">
                                                                <li>There has been no successful deposit on your account, and/or your account has not recorded any betting activity for 12 consecutive months or more. This includes no pending and/or graded bets or Casino bets.</li>
                                                                <li>You will be notified on the 11<sup>th</sup> month of inactivity that your account is due to become inactive. When your account becomes inactive PayPerWin will charge an administrative fee of 2% or €5 per month (whichever is greater) on your account. PayPerWin may only charge fees to an inactive account as long as that account does not go into a negative balance.</li>
                                                                <li>Once accounts are deemed closed (after 84 months) accounts will be pseudonymised on a quarterly basis in accordance with the terms set out in the Privacy Policy. Once this action has been performed accounts will no longer be accessible.</li>
                                                            </ol>
                                                        </li>
                                                        <li>If your account has been inactive for 84 months, we will attempt to return to you any remaining balance that remains on your account (assuming there are sufficient funds to cover all fees associated with a withdrawal) and permanently close your account.</li>
                                                        <li>Prior to that we will make every effort to contact you via the contact means that you have provided. However, if we are unable to remit the funds to you and you cannot be contacted based on the information you have provided to us, the funds will be remitted to us. Any funds appropriated by us in this manner will be used to fund responsible gaming endeavours.</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                            <p></p>
                                        </div>

                                        <h2 id="title-8" className="privacy-policy-section-title desktop">7. Deposit of Funds</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(9)}>
                                            7. Deposit of Funds
                                            <div className="arrow-up" style={{ display: showMobile == 9 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 9 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 9 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 6" }} start="7">
                                                        <li>
                                                            <ol className="sub show-number" start="7">
                                                                <li>You may deposit funds into your Account by any of the methods set out on our Website. All deposits should be made in the same currency as your Account and any deposits made in any other currency will be converted using the daily exchange rate obtained from <a title="www.oanda.com" href="http://www.oanda.com" target="_blank" rel="noopener noreferrer"> http://www.oanda.com</a>, or at our own bank's prevailing rate of exchange following which your Account will be deposited accordingly.</li>
                                                                <li>Fees and charges may apply to your deposits and withdrawals. Fee and charge details can be found here: <a href="/en/payments">https://www.payperwin.com/en/payment-options</a>.</li>
                                                                <li>Any deposit made to an account which is not rolled over (risked) at least three times will incur, at company discretion, whichever is greater from a 10% processing fee or USD 20 (or other currency equivalent) and any applicable withdrawal fee on the withdrawal amount. Please note that we reserve the right at our discretion to charge fees or a fee in the event of irregular transaction behavior. We also require at least a one-time rollover of any deposit (a deposit risked at least one time) and may reject withdrawals if this was not completed. You are responsible for your own bank charges that you may incur due to depositing funds with us. Exceptions to this rule are outlined in our "Payment Options" pages.</li>
                                                                <li>PayPerWin is not a financial institution and uses third party electronic payment processors to process credit and debit card deposits; they are not processed directly by us. If you deposit funds by either a credit card or a debit card, your Account will only be credited if we receive an approval and authorisation code from the institution issuing payment. If your card's issuer gives no such authorisation, your Account will not be credited with those funds.</li>
                                                                <li>Your funds are deposited and held in the respective client account based on the currency of your Account.</li>
                                                                <li>If your account balance can already support any subsequent bets then you should not add any more unnecessary deposits that will not be used to bet. Depositing to an account while having a sufficient balance to cover your subsequent bets causes unnecessary transaction fees, which will lead to your account being set to be charged the full fees that we incur on your deposit and withdrawals, and could even lead to account suspension or closure.</li>
                                                                <li>We are not a financial institution and you will not be entitled to any interest on any outstanding account balances and any interest accrued on the client accounts will be paid to us.</li>
                                                                <li>Funds originating from ill-gotten means must not be deposited with us.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-9" className="privacy-policy-section-title desktop">8. Withdrawal of Funds</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(10)}>
                                            8. Withdrawal of Funds
                                            <div className="arrow-up" style={{ display: showMobile == 10 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 10 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 10 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 7" }} start="8">
                                                        <li>
                                                            <ol className="sub show-number" start="8">
                                                                <li>You may withdraw any or all of your Account Balance within the transaction maximums as shown on the Website here: <a href="/en/payments">https://www.payperwin.com/en/payment-option</a>. Note that fees may apply as outlined in 7.2.</li>
                                                                <li>All withdrawals must be made in the currency of your Account, unless otherwise stipulated by us.</li>
                                                                <li>We reserve the right to request documentation for the purpose of identity verification prior to granting any withdrawals from your Account. We also reserve our right to request this documentation at any time during the lifetime of your relationship with us.</li>
                                                                <li>All withdrawals must be made to the original debit card, credit card, bank account, method of payment used to make the payment to your payperwin.com Account. We may, and always at our own discretion, allow you to withdraw to a payment method from which your original deposit did not originate. This will always be subject to additional security checks.</li>
                                                                <li>Should you wish to withdraw funds but your account is either inaccessible, dormant, locked or closed, please contact our Customer Service Department at <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                                <li>PayPerWin reserves the right to carry out additional verification procedures for any withdrawal exceeding the equivalent of €2,000 and reserves the right to carry out such verification procedures in the case of lower withdrawal amounts.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-10" className="privacy-policy-section-title desktop">9. Payment Transactions and Processors</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(11)}>
                                            9. Payment Transactions and Processors
                                            <div className="arrow-up" style={{ display: showMobile == 11 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 11 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 11 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 8" }} start="8">
                                                        <li>
                                                            <ol className="sub show-number" start="8">
                                                                <li>You are fully responsible for paying all monies owed to us. You must make all payments to us in good faith and not attempt to reverse a payment made or take any action which will cause such payment to be reversed by a third party in order to avoid a liability legitimately incurred. You will reimburse us for any charge-backs, denial or reversal of payment you make and any loss suffered by us as a consequence thereof. We reserve the right to also impose an administration fee of €60, or currency equivalent per charge-back, denial or reversal of payment you make.</li>
                                                                <li>We reserve the right to use third party electronic payment processors and or merchant banks to process payments made by you and you agree to be bound by their terms and conditions providing they are made aware to you and those terms do not conflict with these Terms.</li>
                                                                <li>All transactions made on our site might be checked to prevent money laundering or terrorism financing activity. Suspicious transactions will be reported to the relevant authority depending on the jurisdiction governing the transaction.</li>
                                                                <li>PayPerWin may suspend, block or close an Account and withhold funds if requested to do so in accordance with obligations for the Prevention of Money Laundering.</li>
                                                                <li>PayPerWin’s obligations towards responsible gaming and AML legislation trump commercial conditions.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-11" className="privacy-policy-section-title desktop">10. Responsible Gaming</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(12)}>
                                            10. Responsible Gaming
                                            <div className="arrow-up" style={{ display: showMobile == 12 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 12 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 12 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 9" }} start="10">
                                                        <li>
                                                            <ol className="sub show-number" start="10">
                                                                <li>PayPerWin offers a procedure by which you may exclude yourself from gaming. This exclusion shall be offered for all games offered and across all means by which PayPerWin provides its services. An exclusion may only be set:
                                                                    <div className="list-alike">
                                                                        <p><span>i</span>upon the request of the player; or</p>
                                                                        <p><span>ii</span>by PayPerWin if there are sufficient reasons to indicate that you may have a gambling problem.</p>
                                                                    </div>
                                                                </li>
                                                                <li>You may at your discretion choose to limit your ability to access your Account (log in) for indefinite time in which your account will not be accessible again. You may at your discretion choose to limit your ability to access your Account (log in) temporarily, during which your account will not be accessible again.</li>
                                                                <li>You may at your discretion choose to limit the amount you are allowed to bet and you may at your discretion choose to limit the amount you are allowed to loose during a particular period.</li>
                                                                <li>All limitations mentioned above is administered and initiated by contacting the Customer Service Department at <a href="mailto:support@payperwin.com">support@payperwin.com</a>.</li>
                                                                <li>Any exclusion implemented may only be removed:
                                                                    <div className="list-alike">
                                                                        <p><span>a.</span>upon expiry of the set duration.</p>
                                                                        <p><span>b.</span>upon your request.</p>
                                                                    </div>
                                                                </li>
                                                                <li>If you wish to reduce a limit or increase an exclusion, these shall become effective only after the lapse of not less than twenty-four hours (24) upon notification to Customer Service Department.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-12" className="privacy-policy-section-title desktop">11. Errors and Exceptional Circumstances</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(13)}>
                                            11. Errors and Exceptional Circumstances
                                            <div className="arrow-up" style={{ display: showMobile == 13 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 13 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 13 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 10" }} start="11">
                                                        <li>
                                                            <ol className="sub show-number" start="11">
                                                                <li>In the event of an error or malfunction of our system or processes, all bets are rendered void. You are under an obligation to inform us immediately as soon as you become aware of any error with the Service. In the event of communication or system errors or bugs or viruses occurring in connection with the Service and/or payments made to you as a result of a defect or effort in the Service, we will not be liable to you or to any third party for any direct or indirect costs, expenses, losses or claims arising or resulting from such errors, and we reserve the right to void all games/bets in question and take any other action to correct such errors.</li>
                                                                <li>In the event of a casino system malfunction, or disconnection issues, all bets are rendered void. In the event of such error or any system failure or game error that results in an error in any odds calculation, charges, fees, rake, bonuses or payout, or any currency conversion as applicable, or other casino system malfunction (the "<strong><em>Casino Error</em></strong>"), we reserve the right to declare null and void any wagers or bets that were the subject of such Casino Error and to take any money from your Account relating to the relevant bets or wagers.</li>
                                                                <li>We make every effort to ensure that we do not make errors in posting lines. However, if as a result of human error or system problems a bet is accepted at an odd that is: materially different from those available in the general market at the time the bet was made; or clearly incorrect given the chance of the event occurring at the time the bet was made then we reserve the right to cancel or void that wager, or to cancel or void a wager made after an event has started and give refunds to players.</li>
                                                                <li>We have the right to recover from you any amount overpaid and to adjust your Account to rectify any mistake. An example of such a mistake might be where a price is incorrect or where we enter a result of an event incorrectly. If there are insufficient funds in your Account, we may demand that you pay us the relevant outstanding amount relating to any erroneous bets or wagers. Accordingly, we reserve the right to cancel, reduce or delete any pending plays, whether placed with funds resulting from the error or not.</li>
                                                                <li>PayPerWin has the right to limit, cancel and refuse bets in case they are considered to be too large or if we see that the betting pattern of the player takes place in such a way that the system is being abused.</li>
                                                                <li>The Company is not liable for any downtime, server disruptions, lagging, or any technical or political disturbance to the game play. Refunds may be given solely at the discretion of the management.</li>
                                                                <li>The Company shall accept no liability for any damages or losses which are deemed or alleged to have arisen out of or in connection with website or its content; including without limitation, delays or interruptions in operation or transmission, loss or corruption of data, communication or lines failure, any persons’ misuse of the site or its content or any errors or omissions in content.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-13" className="privacy-policy-section-title desktop">12. General Rules</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(14)}>
                                            12. General Rules
                                            <div className="arrow-up" style={{ display: showMobile == 14 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 14 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 14 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 11" }} start="12">
                                                        <li>
                                                            <ol className="sub show-number" start="12">
                                                                <li>If a sport-specific rule contradicts a general rule, then the general rule will not apply. The winner of an event will be determined on the date of the event's settlement; we do not recognise protested or overturned decisions for wagering purposes. The result of an event suspended after the start of competition will be decided according to the wagering rules specified for that sport by us.</li>
                                                                <li>All results posted shall be final after 72 hours and no queries will be entertained after that period of time. Within 72 hours after results are posted, the company will only reset/correct the results due to human error, system error or mistakes made by the referring results source.</li>
                                                                <li>If for any reason the Company is unable to validate the result of an event within 72 hours of its completion, all unsettled bets on markets relating to that event will be void.</li>
                                                                <li>If for any reason a bet is accepted after a fixture has begun (other than clearly indicated Live In-Play betting) bets will have action unless a material advantage has been gained. PayPerWin reserves the right to void the bet if it determines that an advantage has been gained.</li>
                                                                <li>Minimum and maximum wager amounts on all sporting events will be determined by us and are subject to change without prior written notice. We also reserve the right to adjust limits on individual Accounts as well.</li>
                                                                <li>Customers are solely responsible for their own Account transactions. Please be sure to review your wagers for any mistakes before sending them in. Once a transaction is complete, it cannot be changed. We do not take responsibility for missing or duplicate wagers made by the Customer and will not entertain discrepancy requests because a play is missing or duplicated. Customers may review their transactions in the My Account section of the site after each session to ensure all requested wagers were accepted.</li>
                                                                <li>For a wager to have action on any named contestant in a Yes/No Proposition, the contestant must enter and compete in the event.</li>
                                                                <li>We attempt to follow the normal conventions to indicate home and away teams by indicating the home and away team by means of vertical placement on the desktop site version. This means in American Sports we would place the home team on the bottom. For Non-US sports, we would indicate the home team on top. In the case of a neutral venue, we attempt to include the letter "N" next to the team names to indicate this. For the Asian and mobile versions, we do not distinguish between European and American Sports. On the Asian and mobile versions of the site, the home team is always listed first. However, we do not guarantee the accuracy of this information and unless there is an official venue change subsequent to bets being placed, all wagers have action.</li>
                                                                <li>A game/match will have action regardless of the League heading that is associated with the matchup. For example, two teams from the same League are playing in a Cup competition. If the matchup is mistakenly placed in the League offering, the game/match will still have action, as long as the matchup is correct. In other words, a matchup will have action as long as the two teams are correct, and regardless of the League header in which it is placed on our Website.</li>
                                                                <li>If an event is not played on the same date as announced by the governing body, then all wagers on the event have no action. If an event is posted by us, with an incorrect date, all wagers have action based on the date announced by the governing body.</li>
                                                                <li>PayPerWin reserves the right to remove events, markets and any other product from the website.</li>
                                                                <li>PayPerWin reserves the right to restrict the casino access of any player without prior notice.</li>
                                                                <li>In all futures wagering (for example, total season wins, Super Bowl winner, etc.), the winner as determined by the Governing Body will also be declared the winner for betting purposes except when the minimum number of games required for the future to have "action" has not been completed.</li>
                                                                <li>In the event of there being a discrepancy between the English language version of team names or wager descriptions and any other language version, the English language version will be deemed to be correct. The grading of wagers and disputes will be settled based on the English version of team names and wager descriptions.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-14" className="privacy-policy-section-title desktop">13. Communications and Notices</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(15)}>
                                            13. Communications and Notices
                                            <div className="arrow-up" style={{ display: showMobile == 15 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 15 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 15 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 12" }} start="13">
                                                        <li>
                                                            <ol className="sub show-number" start="13">
                                                                <li>All communications and notices to be given under these Terms by you to us shall be sent to <a href="mailto:support@payperwin.com">support@payperwin.com</a></li>
                                                                <li>All communications and notices to be given under these Terms by us to you shall, unless otherwise specified in these Terms, be either posted on the Website and/or sent to the Registered Email Address we hold on our system for the relevant Customer. The method of such communication shall be in our sole and exclusive discretion.</li>
                                                                <li>All communications and notices to be given under these Terms by either you or us shall be in writing in the English language and must be given to and from the Registered Email Address in your Account.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-15" className="privacy-policy-section-title desktop">14. Matters beyond our control</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(16)}>
                                            14. Matters beyond our control
                                            <div className="arrow-up" style={{ display: showMobile == 16 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 16 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 16 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 13" }} start="14">
                                                        <li>
                                                            <ol className="sub show-number" start="14">
                                                                <li>We cannot be held liable for any failure or delay in providing the Service due to an event of Force Majeure which could reasonably be considered to be outside our control despite our execution of reasonable preventative measures such as: an act of God; trade or labour dispute; power cut; act, failure or omission of any government or authority; obstruction or failure of telecommunication services; or any other delay or failure caused by a third party, and we will not be liable for any resulting loss or damage that you may suffer. In such an event, we reserve the right to cancel or suspend the Service without incurring any liability.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-16" className="privacy-policy-section-title desktop">15. Liability</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(17)}>
                                            15. Liability
                                            <div className="arrow-up" style={{ display: showMobile == 17 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 17 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 17 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 14" }} start="15">
                                                        <li>
                                                            <ol className="sub show-number" start="15">
                                                                <li><strong> TO THE EXTENT PERMITTED BY APPLICABLE LAW, WE WILL NOT COMPENSATE YOU FOR ANY REASONABLY FORESEEABLE LOSS OR DAMAGE (EITHER DIRECT OR INDIRECT) YOU MAY SUFFER IF WE FAIL TO CARRY OUT OUR OBLIGATIONS UNDER THESE TERMS UNLESS WE BREACH ANY DUTIES IMPOSED ON US BY LAW (INCLUDING IF WE CAUSE DEATH OR PERSONAL INJURY BY OUR NEGLIGENCE) IN WHICH CASE WE SHALL NOT BE LIABLE TO YOU IF THAT FAILURE IS ATTRIBUTED TO: </strong>
                                                                    <div className="list-alike">
                                                                        <p><span>(i)</span>YOUR OWN FAULT;</p>
                                                                        <p><span>(ii)</span>A THIRD PARTY UNCONNECTED WITH OUR PERFORMANCE OF THESE TERMS (FOR INSTANCE PROBLEMS DUE TO COMMUNICATIONS NETWORK PERFORMANCE, CONGESTION, AND CONNECTIVITY OR THE PERFORMANCE OF YOUR COMPUTER EQUIPMENT); OR</p>
                                                                        <p><span>(iii)</span><strong>ANY OTHER EVENTS WHICH NEITHER WE NOR OUR SUPPLIERS COULD HAVE FORESEEN OR FORESTALLED EVEN IF WE OR THEY HAD TAKEN REASONABLE CARE. AS THIS SERVICE IS FOR CONSUMER USE ONLY WE WILL NOT BE LIABLE FOR ANY BUSINESS LOSSES OF ANY KIND.</strong></p>
                                                                    </div>
                                                                </li>
                                                                <li><strong>IN THE EVENT THAT WE ARE HELD LIABLE FOR ANY EVENT UNDER THESE TERMS, OUR TOTAL AGGREGATE LIABILITY TO YOU UNDER OR IN CONNECTION WITH THESE TERMS SHALL NOT EXCEED:</strong>
                                                                    <div className="list-alike">
                                                                        <p><span>(A)</span>THE VALUE OF THE BETS AND OR WAGERS YOU PLACED VIA YOUR ACCOUNT IN RESPECT OF THE RELEVANT BET/WAGER OR PRODUCT THAT GAVE RISE TO THE RELEVANT LIABILITY, OR</p>
                                                                        <p><span>(B)</span><strong>EUR€500 IN AGGREGATE, WHICHEVER IS LOWER.</strong></p>
                                                                    </div>
                                                                </li>
                                                                <li><strong>WE STRONGLY RECOMMEND THAT YOU:</strong>
                                                                    <div className="list-alike">
                                                                        <p><span>(i)</span>TAKE CARE TO VERIFY THE SUITABILITY AND COMPATIBILITY OF THE SERVICE WITH YOUR OWN COMPUTER EQUIPMENT PRIOR TO USE; AND</p>
                                                                        <p><span>(ii)</span><strong>TAKE REASONABLE PRECAUTIONS TO PROTECT YOURSELF AGAINST HARMFUL PROGRAMS OR DEVICES INCLUDING THROUGH INSTALLATION OF ANTI-VIRUS SOFTWARE.</strong></p>
                                                                    </div>
                                                                </li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-17" className="privacy-policy-section-title desktop">16. Gambling by Those Under Age</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(18)}>
                                            16. Gambling by Those Under Age
                                            <div className="arrow-up" style={{ display: showMobile == 18 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 18 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 18 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 15" }} start="16">
                                                        <li>
                                                            <ol className="sub show-number" start="16">
                                                                <li>If we suspect that you are or receive notification that you are currently under 18 years or were under 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you) when you placed any bets through the Service your Account will be suspended to prevent you placing any further bets or making any withdrawals from your Account. We will then investigate the matter, including whether you have been betting as an agent for, or otherwise on behalf, of a person under 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you). If having found that you:
                                                                    <div className="list-alike">
                                                                        <p><span>(a)</span>are currently;</p>
                                                                        <p><span>(b)</span>were under 18 years or below the majority age which applies to you at the relevant time; or</p>
                                                                        <p><span>(c)</span>have been betting as an agent for or at the behest of a person under 18 years or below the majority age which applies:</p>
                                                                        <p><span style={{ width: '55px' }}>i.</span>all winnings currently or due to be credited to your Account will be retained;</p>
                                                                        <p><span style={{ width: '55px' }}>ii.</span>all winnings gained from betting through the Service whilst under age must be paid to us on demand (if you fail to comply with this provision we will seek to recover all costs associated with recovery of such sums); and/or</p>
                                                                        <p><span style={{ width: '55px' }}>iii.</span>any monies deposited in your payperwin.com Account which are not winnings will be returned to you.</p>
                                                                    </div>
                                                                </li>
                                                                <li>This condition also applies to you if you are over the age of 18 years but you are placing your bets within a jurisdiction which specifies a higher age than 18 years for legal betting and you are below that legal minimum age in that jurisdiction.</li>
                                                                <li>In the event we suspect you are in breach of the provisions of this Clause 16 or are attempting to rely on them for a fraudulent purpose, we reserve the right to take any action necessary in order to investigate the matter, including informing the relevant law enforcement agencies.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-18" className="privacy-policy-section-title desktop">17. Fraud</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(19)}>
                                            17. Fraud
                                            <div className="arrow-up" style={{ display: showMobile == 19 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 19 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 19 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 16" }} start="17">
                                                        <li>
                                                            <ol className="sub show-number" start="17">
                                                                <li>We will seek criminal and contractual sanctions against any Customer involved in fraud, dishonesty or criminal acts. We will withhold payment to any Customer where any of these are suspected. The Customer shall indemnify and shall be liable to pay to us on demand, all costs, charges or losses sustained or incurred by us (including any direct, indirect or consequential losses, loss of profit, loss of business and loss of reputation) arising directly or indirectly from the Customer's fraud, dishonesty or criminal act.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-19" className="privacy-policy-section-title desktop">18. Intellectual Property</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(20)}>
                                            18. Intellectual Property
                                            <div className="arrow-up" style={{ display: showMobile == 20 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 20 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 20 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 17" }} start="18">
                                                        <li>
                                                            <ol className="sub show-number" start="18">
                                                                <li>We trade as PayPerWin and the PAYPERWIN name and logo are registered trademarks. Any unauthorised use of our trademark and logo may result in legal action being taken against you. The www.payperwin.com uniform resource locator (URL) is owned by us and no unauthorised use of the URL is permitted on another website or digital platform without our prior written consent.</li>
                                                                <li>As between us and you, we are the sole owners of the rights in and to the Service, our technology, software and business systems (the "<strong><em>Systems</em></strong>") as well as our odds.
                                                                    <div className="list-alike">
                                                                        <p><span>i.</span>you must not use your personal profile for your own commercial gain (such as selling your status update to an advertiser); and</p>
                                                                        <p><span>ii.</span>when selecting a nickname for your Account we reserve the right to remove or reclaim it if we believe it appropriate.</p>
                                                                    </div>
                                                                </li>
                                                                <li>You may not use our URL, trademarks, trade names and/or trade dress, logos (the "<strong><em>Mark</em></strong>") and/or our odds in connection with any product or service that is not ours, that in any manner is likely to cause confusion among Customers or in the public or that in any manner disparages us.</li>
                                                                <li>Except as expressly provided in these Terms, we and our licensors do not grant you any express or implied rights, licence, title or interest in or to the Systems or the Marks and all such rights, licence, title and interest specifically retained by us and our licensors. You agree not to use any automatic or manual device to monitor or copy web pages or content within the Service. Any unauthorised use or reproduction may result in legal action being taken against you.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-20" className="privacy-policy-section-title desktop">19. Your Licence</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(21)}>
                                            19. Your Licence
                                            <div className="arrow-up" style={{ display: showMobile == 21 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 21 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 21 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 18" }} start="19">
                                                        <li>
                                                            <ol className="sub show-number" start="19">
                                                                <li>Subject to these Terms and your compliance with them, we grant to you a non-exclusive, limited, non transferable and non sub-licensable licence to access and use the Service for your personal non-commercial purposes only. Our licence to you terminates if our agreement with you under these Terms ends.</li>
                                                                <li>Save in respect of your own content, you may not under any circumstances modify, publish, transmit, transfer, sell, reproduce, upload, post, distribute, perform, display, create derivative works from, or in any other manner exploit, the Service and/or any of the content thereon or the software contained therein, except as we expressly permit in these Terms or otherwise on the Website. No information or content on the Service or made available to you in connection with the Service may be modified or altered, merged with other data or published in any form including for example screen or database scraping and any other activity intended to collect, store, reorganise or manipulate such information or content.</li>
                                                                <li>Any non-compliance by you with this Clause may also be a violation of our or third parties' intellectual property and other proprietary rights which may subject you to civil liability and/or criminal prosecution.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-21" className="privacy-policy-section-title desktop">20. Your Conduct and Safety</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(22)}>
                                            20. Your Conduct and Safety
                                            <div className="arrow-up" style={{ display: showMobile == 22 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 22 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 22 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 19" }} start="20">
                                                        <li>
                                                            <ol className="sub show-number" start="20">
                                                                <li>We would like you to enjoy the Service. However, for your protection and that of all Customers, the posting of any content on the Service, as well as conduct in connection therewith and/or the Service, which is in any way unlawful, inappropriate or undesirable is strictly prohibited - it is Prohibited Behaviour. If you engage in Prohibited Behaviour, or we determine in our sole discretion that you are engaging in Prohibited Behaviour, your payperwin.com Account and/or your access to or use of the Service may be terminated immediately without notice to you.</li>
                                                                <li>Legal action may be taken against you by another Customer, other third party, enforcement authorities and/or us with respect to you having engaged in Prohibited Behaviour.</li>
                                                                <li>Prohibited Behaviour includes, but is not limited to, accessing or using the Service to:
                                                                    <ol className="sub">
                                                                        <li>promote or share information that you know is false, misleading or unlawful;</li>
                                                                        <li>conduct any unlawful or illegal activity, such as, but not limited to, any activity that furthers or promotes any criminal activity or enterprise, provides instructional information about making or buying weapons, violates another Customer's or any other third party's privacy or other rights or that creates or spreads computer viruses;</li>
                                                                        <li>harm minors in any way;</li>
                                                                        <li>transmit or make available any content that is unlawful, harmful, threatening, abusive, tortuous, defamatory, vulgar, obscene, lewd, violent, hateful, or racially or ethnically or otherwise objectionable;v. transmit or make available any content that the user does not have a right to make available under any law or contractual or fiduciary relationship, including without limitation, any content that infringes a third party's copyright, trademark or other intellectual property and proprietary rights;</li>
                                                                        <li>transmit or make available any content or material that contains any software virus or other computer or programming code (including HTML) designed to interrupt, destroy or alter the functionality of the Service, its presentation or any other website, computer software or hardware;</li>
                                                                        <li>interfere with, disrupt or reverse engineer the Service in any manner, including, without limitation, intercepting, emulating or redirecting the communication protocols used by us, creating or using cheats, mods or hacks or any other software designed to modify the Service, or using any software that intercepts or collects information from or through the Service;</li>
                                                                        <li>retrieve or index any information from the Service using any robot, spider or other automated mechanism;</li>
                                                                        <li>participate in any activity or action that, in the sole and entire unfettered discretion of us results or may result in another Customer being defrauded or scammed;</li>
                                                                        <li>transmit or make available any unsolicited or unauthorised advertising or mass mailing such as, but not limited to, junk mail, instant messaging, "spim", "spam", chain letters, pyramid schemes or other forms of solicitations;</li>
                                                                        <li>create payperwin.com Accounts by automated means or under false or fraudulent pretences;</li>
                                                                        <li>impersonate another Customer or any other third party, or</li>
                                                                        <li>any other act or thing done that we reasonably consider to be contrary to our business principles.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>The above list of Prohibited Behaviour is not exhaustive and may be modified by us at any time or from time to time. If you become aware of the misuse of the Service by another Customer or any other person, please contact us through the "Contact Us" section of the Website. We reserve the right to investigate and to take all such actions as we in our sole discretion deems appropriate or necessary under the circumstances, including without limitation, deleting the Customer's posting(s) from the Service and/or terminating their Account, and take any action against any Customer or third party who directly or indirectly in, or knowingly permits any third party to directly or indirectly engage in, Prohibited Behaviour, with or without notice to such Customer or third party.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-22" className="privacy-policy-section-title desktop">21. Links to Other Websites</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(23)}>
                                            21. Links to Other Websites
                                            <div className="arrow-up" style={{ display: showMobile == 23 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 23 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 23 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 20" }} start="21">
                                                        <li>
                                                            <ol className="sub show-number" start="21">
                                                                <li>The Service may contain links to third party websites that are not maintained by, or related to, us, and over which we have no control. Links to such websites are provided solely as a convenience to Customers, and are in no way investigated, monitored or checked for accuracy or completeness by us. Links to such websites do not imply any endorsement by us of, and/or any affiliation with, the linked websites or their content or their owner(s). We have no control over or responsibility for the availability nor their accuracy, completeness, accessibility and usefulness. Accordingly, when accessing such websites we recommend that you should take the usual precautions when visiting a new website including reviewing their privacy policy and terms of use.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-23" className="privacy-policy-section-title desktop">22. Complaints</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(24)}>
                                            22. Complaints
                                            <div className="arrow-up" style={{ display: showMobile == 24 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 24 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 24 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 21" }} start="22">
                                                        <li>
                                                            <ol className="sub show-number" start="22">
                                                                <li>If you have any concerns or questions regarding these Terms you should contact our Customer Service Department via email at <a title="Email CSD" href="mailto:support@payperwin.com?subject=Email%20CSD">support@payperwin.com</a>.</li>
                                                                <li><strong>NOTWITHSTANDING THE FOREGOING, WE TAKE NO LIABILITY WHATSOEVER TO YOU OR TO ANY THIRD PARTY WHEN RESPONDING TO ANY COMPLAINT THAT WE RECEIVED OR TOOK ACTION IN CONNECTION THEREWITH.</strong></li>
                                                                <li>Any Customer of the Service who has any concerns or questions regarding these Terms regarding the settlement of any payperwin.com market should contact our Customer Service Department at <a title="Email CSD" href="mailto:support@payperwin.com?subject=Email%20CSD"> support@payperwin.com</a> using their Registered Email Address.</li>
                                                                <li>If a Customer is not satisfied with how a bet has been settled then the Customer should provide details of their grievance to our Customer Service Department via email at <a href="mailto:support@payperwin.com">support@payperwin.com</a>. We shall use our reasonable endeavours to respond to queries of this nature within a few days (and in any event we intend to respond to all such queries within 28 days of receipt).</li>
                                                                <li>Disputes must be lodged within three (3) days from the date the wager in question has been decided. No claims will be honored after this period. The Customer is solely responsible for their Account transactions. Complaints/disputes have to be sent to <a title="Email CSD" href="mailto:support@payperwin.com?subject=Email%20CSD">support@payperwin.com</a> and must be sent from the Customer's Registered Email Address.</li>
                                                                <li>In the event of a dispute arising between you and us our Customer Service Department will attempt to reach an agreed solution. Should our Customer Service Department be unable to reach an agreed solution with you, the matter will be escalated to our management in accordance with our Complaints Procedure (available upon request).</li>
                                                                <li>The Customer has the right to lodge a complaint by email to Antillephone N.V. via <a href="mailto:complaints@gaminglicences.com">complaints@gaminglicences.com</a> should all efforts to resolve a dispute directly with PayPerWin to the Customer's satisfaction have failed.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-24" className="privacy-policy-section-title desktop">23. Registration and Account Security</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(25)}>
                                            23. Registration and Account Security
                                            <div className="arrow-up" style={{ display: showMobile == 25 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 25 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 25 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 22" }} start="23">
                                                        <li>
                                                            <ol className="sub show-number" start="23">
                                                                <li>Customers of the Service must provide their real names and information and, in order to comply with this, all Customers must commit to the following rules when registering &amp; maintaining your Account:
                                                                    <ol className="sub">
                                                                        <li>you must not provide any false personal information on the Service, or create an Account for anyone other than yourself;</li>
                                                                        <li>you must not use your personal profile for your own commercial gain (such as selling your status update to an advertiser); and</li>
                                                                        <li>when selecting a nickname for your Account we reserve the right to remove or reclaim it if we believe appropriate.</li>
                                                                    </ol>
                                                                </li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-25" className="privacy-policy-section-title desktop">24. Assignment</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(26)}>
                                            24. Assignment
                                            <div className="arrow-up" style={{ display: showMobile == 26 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 26 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 26 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 23" }} start="24">
                                                        <li>
                                                            <ol className="sub show-number" start="24">
                                                                <li>Neither these Terms nor any of the rights or obligations hereunder may be assigned by you without the prior written consent of us, which consent will not be unreasonably withheld. We may, without your consent, assign all or any portion of our rights and obligations hereunder to any third party provided such third party is able to provide a service of substantially similar quality to the Service by posting written notice to this effect on the Service.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-26" className="privacy-policy-section-title desktop">25. Severability</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(27)}>
                                            25. Severability
                                            <div className="arrow-up" style={{ display: showMobile == 27 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 27 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 27 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 24" }} start="25">
                                                        <li>
                                                            <ol className="sub show-number" start="25">
                                                                <li>We cannot be held liable for any failure or delay in providing the Service due to an event of Force Majeure which could reasonably be considered to be outside our control despite our execution of reasonable preventative measures such as: an act of God; trade or labour dispute; power cut; act, failure or omission of any government or authority; obstruction or failure of telecommunication services; or any other delay or failure caused by a third party, and we will not be liable for any resulting loss or damage that you may suffer. In such an event, we reserve the right to cancel or suspend the Service without incurring any liability.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-27" className="privacy-policy-section-title desktop">26. Breach of These Terms</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(28)}>
                                            26. Breach of These Terms
                                            <div className="arrow-up" style={{ display: showMobile == 28 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 28 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 28 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 25" }} start="26">
                                                        <li>
                                                            <ol className="sub show-number" start="26">
                                                                <li>Without limiting our other remedies, we may suspend or terminate your Account and refuse to continue to provide you with the Service, in either case without giving you prior notice, if, in our reasonable opinion, you breach any material term of these Terms. Notice of any such action taken will, however, be promptly provided to you.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-28" className="privacy-policy-section-title desktop">27. Governing Law and Jurisdiction</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(29)}>
                                            27. Governing Law and Jurisdiction
                                            <div className="arrow-up" style={{ display: showMobile == 29 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 29 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 29 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 26" }} start="27">
                                                        <li>
                                                            <ol className="sub show-number" start="27">
                                                                <li>The laws of Curacao govern the Services.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-29" className="privacy-policy-section-title desktop">28. General Provisions</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(30)}>
                                            28. General Provisions
                                            <div className="arrow-up" style={{ display: showMobile == 30 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 30 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 30 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 27" }} start="28">
                                                        <li>
                                                            <ol className="sub show-number" start="28">
                                                                <li>Term of agreement
                                                                    <ol className="sub">
                                                                        <li>These Terms shall remain in full force and effect while you access or use the Service or are a Customer of payperwin.com. These Terms will survive the termination of your payperwin.com Account for any reason.</li>
                                                                        <li>Words importing the singular number shall include the plural and vice versa, words importing the masculine gender shall include the feminine and neuter genders and vice versa and words importing persons shall include individuals, partnerships, associations, trusts, unincorporated organisations and corporations.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>Waiver
                                                                    <ol className="sub">
                                                                        <li>No waiver by us, whether by conduct or otherwise, of a breach or threatened breach by you of any term or condition of these Terms shall be effective against, or binding upon, us unless made in writing and duly signed by us, and, unless otherwise provided in the written waiver, shall be limited to the specific breach waived. The failure of us to enforce at any time any term or condition of these Terms shall not be construed to be a waiver of such provision or of the right of us to enforce such provision at any other time.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>Headings
                                                                    <ol className="sub">
                                                                        <li>The division of these Terms into paragraphs and sub-paragraphs and the insertion of headings are for convenience of reference only, and shall not affect or be utilised in the construction or interpretation of these Terms agreement.</li>
                                                                        <li>The terms "these Terms", "hereof", "hereunder" and similar expressions refer to these Terms and not to any particular paragraph or sub-paragraph or other portion hereof and include any agreement supplemental hereto. Unless the subject matter or context is inconsistent therewith, references herein to paragraphs and sub-paragraphs are to paragraphs and sub-paragraphs of these Terms.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>Acknowledgement
                                                                    <ol className="sub">
                                                                        <li>By hereafter accessing or using the Service, you acknowledge having read, understood and agreed to each and every paragraph of these Terms. As a result, you hereby irrevocably waive any future argument, claim, demand or proceeding to the contrary of anything contained in these Terms.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>Language
                                                                    <ol className="sub">
                                                                        <li>These Terms and Conditions may be published in a number of languages, reflecting the same principles, for information purposes and to help players.</li>
                                                                        <li>In the event of there being a discrepancy between the English language version of these rules and any other language version, the English language version will be deemed to be correct.</li>
                                                                    </ol>
                                                                </li>
                                                                <li>Entire agreement
                                                                    <ol className="sub">
                                                                        <li>These Terms constitute the entire agreement between you and us with respect to your access to and use of the Service, and supersedes all other prior agreements and communications, whether oral or written with respect to the subject matter hereof.</li>
                                                                    </ol>
                                                                </li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-30" className="privacy-policy-section-title desktop">29. Betting Rules</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(31)}>
                                            29. Betting Rules
                                            <div className="arrow-up" style={{ display: showMobile == 31 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 31 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 31 ? 'block' : 'none' }}>
                                            <ul>
                                                <ul>
                                                    <ol className="sub hide-number" style={{ counterReset: "item 28" }} start="29">
                                                        <li>
                                                            <ol className="sub show-number" start="29">
                                                                <li>The sports betting product is operated by Ragnarok Corporation N.V., a limited liability company registered in Curaçao with company registration number 79358, with registered address at Pletterijweg 43, Willemstad, Curaçao.PayPerWin is licensed in Curacao under the Licence 8048/JAZ2013-013.</li>
                                                                <li>Any dispute related to the sports betting product shall be emailed to: <a title="Email CSD" href="mailto:support@payperwin.com?subject=Email%20CSD">support@payperwin.com</a>.</li>
                                                                <li>For complete betting rules please <a href="/en/help/betting-rules">click here</a>.</li>
                                                            </ol>
                                                        </li>
                                                    </ol>
                                                </ul>
                                            </ul>
                                            <p></p>
                                        </div>

                                        <h2 id="title-31" className="privacy-policy-section-title desktop">30. Casino Rules</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(32)}>
                                            30. Casino Rules
                                            <div className="arrow-up" style={{ display: showMobile == 32 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 32 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 32 ? 'block' : 'none' }}>
                                            <ul>
                                                <ol className="sub hide-number" style={{ counterReset: "item 29" }} start="30">
                                                    <li>
                                                        <ol className="sub show-number" start="30">
                                                            <li>Casino RNG games are provided by 1X2gaming, Betsoft, Booming Games, Booongo, Endorphina, Evoplay, Genii, Habanero, iSoftBet, Leander, Magnet Gaming, Matchbook, Microgaming Quickfire, Netent, Playson, Pragmatic Play, Realistic, Redrake, Red Tiger Gaming, Spinomenal, Tom Horn, Yggdrasil.</li>
                                                            <li>All bets placed on the Casino RNG games are placed respectively on the servers of 1X2gaming, Betsoft, Booming Games, Booongo, Endorphina, Genii, Habanero, iSoftBet, Leander, Magnet Gaming, Matchbook, Microgaming Quickfire, Netent, Playson, Pragmatic Play, Realistic, Redrake, Red Tiger Gaming, Spinomenal, Tom Horn, Yggdrasil.</li>
                                                            <li>Casino Live games are provided by BetGames TV, Ezugi, Evolution Gaming, Extreme Live Gaming and Netent. All bets placed on the Casino Live games are placed respectively on the servers of BetGames TV, Ezugi, Evolution Gaming, Extreme Live Gaming and Netent.</li>
                                                            <li>Virtual sports are provided by Kiron.</li>
                                                            <li>All bets placed on the Virtual sports are placed respectively on the servers of Kiron.</li>
                                                            <li>The Casino RNG games, the Casino Live games and the Virtual sports are provided with their own terms and conditions which can be accessed to from the casino lobby. In case of conflict between the supplier's terms and conditions and these Terms, suppliers’ terms and conditions shall prevail.</li>
                                                            <li>Access to Casino RNG games, the Casino Live games and the Virtual sports may be restricted in some countries at the supplier's discretion.</li>
                                                            <li>PayPerWin is authorised by the suppliers to represent, promote and market the services of the Casino RNG games, the Casino Live games and the Virtual sports. The Casino RNG games, the Casino Live games and the Virtual sports are operated by Ragnarok Corporation N.V., a limited liability company registered in Curaçao with company registration number 79358, with registered address at Pletterijweg 43, Willemstad, Curaçao. PayPerWin is licensed in Curacao under the Licence 8048/JAZ2013-013 for the provision of the Casino RNG games, the Casino Live games and the Virtual sports product.</li>
                                                            <li>Any dispute related to the casino product shall be emailed to <a href="support@payperwin.com">support@payperwin.com</a>.</li>
                                                        </ol>
                                                    </li>
                                                </ol>
                                            </ul>
                                        </div>

                                        <h2 id="title-32" className="privacy-policy-section-title desktop">31. Bet Cancellation</h2>
                                        <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(33)}>
                                            31. Bet Cancellation
                                            <div className="arrow-up" style={{ display: showMobile == 33 ? 'block' : 'none' }}></div>
                                            <div className="arrow-down" style={{ display: showMobile != 33 ? 'block' : 'none' }}></div>
                                        </h2>
                                        <div className="mobile-container" style={{ display: showMobile == 33 ? 'block' : 'none' }}>
                                            Payper Win reserves the right to not accept all or part of the wager with respect to an opposing or initial peer bet, without providing a reason to customer,. If a bet is not accepted the bet amount will be refunded to the user.

                                            Before an event starts, Payper Win at its own discretion has the right to cancel part of the entire bet even after its acceptance without notice to the user.

                                            After the event has started the Payper Win reserves the right to cancel or void the bet in its entirety or in part, even after its settlement for valid reasons:
                                            <ul>
                                                <li className='ml-4' style={{ listStyleType: 'disc' }}>A mistake in wording , offering wrong or incorrect odds, or event timing</li>
                                                <li className='ml-4' style={{ listStyleType: 'disc' }}>An attempt to bypass site rules and regulations such as but not withstanding, risk management, placing similar bets or opening multiple accounts.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TermsAndConditions;