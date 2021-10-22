import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';


class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMobile: null,
        }
    }

    componentDidMount() {
        const title = 'Privacy Policy';
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
                    <div className="privacy-policy-container">
                        <div className="privacy-policy-page-title">Privacy Policy v.4</div>
                        <div className="privacy-policy-header-text">Last updated on: 1st January 2019</div>

                        <div className="selection-list gray">
                            <ul className="list">
                                <li>
                                    <a className="title " href="#title-0">Who we are</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-1">Changes to the privacy notice and your duty to inform us of changes</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-2">1. How we use your personal data</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-3">Third-party links</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-4">2. The data we collect about you</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-5">If you fail to provide personal data</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-6">3. The purpose for which we collect your personal data</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-7">4. Who we might share your information with</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-8">5. How long we keep your information</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-9">6. Keeping you informed about our products and services</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-10">7. How we secure your information</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-11">8. Your rights</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-12">No fee usually required</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-13">What we may need from you</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-14">Time limit to respond</a>
                                </li>
                                <li>
                                    <a className="title " href="#cookie-policy">9. Cookie Policy</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-16">What is a web cookie?</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-17">Essential Cookies</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#PC">Performance Cookies</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#FC">Functionality Cookies</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#TC">Targeting Cookies</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-21">Manage your cookies</a>
                                </li>
                                <li>
                                    <a className="title subtitle" href="#title-22">Further information</a>
                                </li>
                                <li>
                                    <a className="title " href="#title-23">10. Changes to information</a>
                                </li>
                            </ul>

                            <div className="clear-both"></div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-0">Who we are</div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(1)}>
                            Who we are
                            <div className="arrow-up" style={{ display: showMobile == 1 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 1 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 1 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                PayPerWin (otherwise referred to herein as "we" or "us") adheres to the Personal Data Protection Act of Curacao (2013). This Privacy Policy is issued on behalf of the PayPerWin Group of companies which includes the URL PayPerWin.co.
                            </div>
                            <div className="privacy-policy-paragraph">
                                The data controller for the URL payperwin.com is Ragnarok Corporation N.V., Pletterijweg 43, Willemstad, Curaçao. Our Data Protection Officer (<strong>“DPO”</strong>) can be contacted at dpo@payperwin.bet.
                            </div>
                            <div className="privacy-policy-paragraph">
                                If you have any questions about this Privacy Policy please contact the DPO. We understand that privacy and the security of your personal information is extremely important. This policy sets out what we do with your information and what we will do to keep it secure. It also explains where and how we collect your personal information, as well as your rights over any personal information we hold about you.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-1">
                            Changes to the privacy notice and your duty to inform us of changes
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(2)}>
                            Changes to the privacy notice and your duty to inform us of changes
                            <div className="arrow-up" style={{ display: showMobile == 2 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 2 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 2 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                This version was last updated on 1st January, 2019 and historic versions can be obtained by contacting the DPO.
                        </div>
                            <div className="privacy-policy-paragraph">
                                It is important that the personal data we hold about you is accurate and current. Please keep us informed if your personal data changes during your relationship with us.
                        </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-2">
                            1. How we use your personal data
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(3)}>
                            1. How we use your personal data
                            <div className="arrow-up" style={{ display: showMobile == 3 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 3 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 3 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                <ul>
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                Generally we do not rely on consent as a legal basis for processing your personal data. You have the right to withdraw consent to marketing at any time by contacting us at <a href="mailto:support@payperwin.com">support@payperwin.com</a>.
                            </div>
                            <div className="privacy-policy-paragraph">
                                By providing your personal information and registering with us or logging on with us when you enter our Website, you explicitly consent to us processing and disclosing your personal information in the manner set out in this Privacy Policy, or as otherwise provided in accordance with the Terms & Conditions.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-3">Third-party links</div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(4)}>
                            Third-party links
                            <div className="arrow-up" style={{ display: showMobile == 4 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 4 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 4 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy notice of every website you visit.
                            </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-4">
                            2. The data we collect about you
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(5)}>
                            2. The data we collect about you
                            <div className="arrow-up" style={{ display: showMobile == 5 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 5 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 5 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Personal data (or personal information) means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
                            </div>
                            <div className="privacy-policy-paragraph">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </div>
                            <ul>
                                <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, date of birth and gender.</li>
                                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
                                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, pc tag, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                                <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, correspondence feedback and survey responses.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                            </ul>
                            <p></p>
                            <div className="privacy-policy-paragraph">
                                We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data may be derived from your personal data but is not considered personal data in law as this data does not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy notice.
                            </div>
                            <div className="privacy-policy-paragraph">
                                On rare occasions, we may collect health data from you when you forward us specific medical reports. Outside this scenario, we do not collect any special categories of Personal Data about you (this includes details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your genetic and biometric data). For the avoidance of doubt, data pertaining to self-exclusion requests are not considered to be data related to health.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-5">
                            If you fail to provide personal data
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(6)}>
                            If you fail to provide personal data
                            <div className="arrow-up" style={{ display: showMobile == 6 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 6 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 6 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Where we need to collect personal data by law, or under the terms of a contract we have with you and you fail to provide that data when requested, we may not be able to perform the contract we have or provide you with the service requested.
                            </div>
                            <div className="privacy-policy-paragraph">
                                Please note that any information which you transmit to us by email is not encrypted and is transmitted at your own risk.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-6">
                            3. The purpose for which we collect your personal data
                    </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(7)}>
                            3. The purpose for which we collect your personal data
                            <div className="arrow-up" style={{ display: showMobile == 7 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 7 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 7 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We have set out below, in a table format, a description of the ways we plan to use your personal data and which of the legal bases we rely on to do so. We have also identified what our legitimate interests are where appropriate. Information on the balancing test at the basis of the legitimate interest can be obtained upon request by contacting the DPO at <a href="mailto:dpo@payperwin.com">dpo@payperwin.com</a>.
                            </div>
                            <div className="privacy-policy-paragraph">
                                Note that we may process your personal data for more than one lawful ground depending on the specific purpose for which we are using your data. Please <a href="mailto:support@payperwin.com">contact us</a> if you need details about the specific legal ground we are relying on to process your personal data where more than one ground has been set out in the table below.
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><strong>Purpose/Activity</strong></p>
                                        </td>
                                        <td>
                                            <p><strong>Type of data</strong></p>
                                        </td>
                                        <td>
                                            <p><strong>Lawful basis for processing including the basis of legitimate interest</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To register you as a new customer in order to provide our gaming services.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                        </td>
                                        <td>
                                            <p>Performance of a contract with you.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>(a) Processing and monitoring your bets.</p>
                                            <p>(b) processing card and online payments.</p>
                                            <p>(c) payment processing identification, authorization and/or processing.</p>
                                            <p>(d) collection of debts.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Financial</p>
                                            <p>(d) Transaction</p>
                                            <p>(e) Marketing and Communications</p>
                                        </td>
                                        <td>
                                            <p>(a) Performance of a contract with you.</p>
                                            <p>(b) Necessary for our legitimate interests (to recover debts due to us and fulfil customer payments).</p>
                                            <p>(c) complying with our legal and regulatory obligations.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To manage our relationship with you which will include:</p>
                                            <p>(a) Notifying you about changes to our terms or Privacy Policy.</p>
                                            <p>(b) Asking you to leave a review or take a survey.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Profile</p>
                                            <p>(d) Marketing and Communications</p>
                                        </td>
                                        <td>
                                            <p>(a) Performance of a contract with you.</p>
                                            <p>(b) Necessary to comply with a legal obligation.</p>
                                            <p>(c) Necessary for our legitimate interests (to keep our records updated and to study how customers use our products/services).</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To enable you to partake in a prize draw, competition or complete a survey.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Profile</p>
                                            <p>(d) Usage</p>
                                            <p>(e) Marketing and Communications</p>
                                        </td>
                                        <td>
                                            <p>(a) Performance of a contract with you.</p>
                                            <p>(b) Necessary for our legitimate interests (to study how customers use our products/services, to develop them and grow our business).</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To administer and ensure the security of our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data).</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Technical</p>
                                        </td>
                                        <td>
                                            <p>(a) Necessary for our legitimate interests (for running our business, provision of administration and IT services, network security, to prevent fraud and in the context of a business reorganisation or group restructuring exercise).</p>
                                            <p>(b) Necessary to comply with a legal and regulatory obligation.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Profile</p>
                                            <p>(d) Usage</p>
                                            <p>(e) Marketing and Communications</p>
                                            <p>(f) Technical</p>
                                        </td>
                                        <td>
                                            <p>Necessary for our legitimate interests (to study how customers use our products/services, to develop them, to grow our business and to inform our marketing strategy).</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences.</p>
                                        </td>
                                        <td>
                                            <p>(a) Technical</p>
                                            <p>(b) Usage</p>
                                        </td>
                                        <td>
                                            <p>Necessary for our legitimate interests (to define types of customers for our products and services, to keep our website updated and relevant, to develop our business and to inform our marketing strategy).</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To make suggestions and recommendations to you about goods or services that may be of interest to you.</p>
                                        </td>
                                        <td>
                                            <p>(a) Identity</p>
                                            <p>(b) Contact</p>
                                            <p>(c) Technical</p>
                                            <p>(d) Usage</p>
                                            <p>(e) Profile</p>
                                        </td>
                                        <td>
                                            <p>Necessary for our legitimate interests (to develop our products/services and grow our business).</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>To prevent you from accessing our services when you have disclosed to have gambling addiction sustained by medical evidence such as medical reports.</p>
                                        </td>
                                        <td>
                                            <p>(a) Health</p>
                                        </td>
                                        <td>
                                            <p>Necessary to protect your vital interests (Art. 9 (2) c) of the GDPR.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-7">
                            4. Who we might share your information with
                    </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(8)}>
                            4. Who we might share your information with
                            <div className="arrow-up" style={{ display: showMobile == 8 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 8 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 8 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                a. For anti-money laundering, fraud detection and/or control purposes, PayPerWin has the right to transfer your personal data to third parties, including but not limited to third-party suppliers such as the police, financial integrity units, banks, ID and address verification system providers, payment service providers and financial institutions, however, only where we have assurance that they are meeting the same standards on the processing of data and security. We encourage you to read the privacy policies of our third-party suppliers.
                            </div>
                            <div className="privacy-policy-paragraph">
                                b. Furthermore, we reserve the right to disclose your personal data to relevant third parties, such as other PayPerWin group companies, our regulators, financial integrity units, notably when PayPerWin has reasonable grounds to suspect irregularities involving your account.
                            </div>
                            <div className="privacy-policy-paragraph">
                                c. Your data will also be shared for regular operational purposes with entities such as cloud services, data centres, payment services, banks, ID verification tools, customer communication tools, game suppliers etc.
                            </div>
                            <div className="privacy-policy-paragraph">
                                d. We are entitled to share the information we hold on you which includes personal data and/or betting history with sporting bodies in order to investigate fraud, money laundering or sports integrity issues and to comply with our regulatory duties.
                            </div>
                            <div className="privacy-policy-paragraph">
                                e. We will take all reasonable steps to ensure that your personal data is treated securely and is processed with appropriate care and protection and in line with applicable legal requirements.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-8">
                            5. How long we keep your information
                    </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(9)}>
                            5. How long we keep your information
                            <div className="arrow-up" style={{ display: showMobile == 9 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 9 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 9 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                In order to comply with our legal, financial and regulatory requirements we will maintain your information for the minimum length of time required to meet those requirements. After the minimum amount of time for maintaining your data has elapsed and provided we do not have any other legitimate reason for maintaining your data, your data will be pseudonymised.
                            </div>
                            <div className="privacy-policy-paragraph">
                                The retention period will be implemented in accordance with the applicable requirements of Curacao (10 years minimum).
                            </div>
                            <div className="privacy-policy-paragraph">
                                In the event you make a request for your data to be erased and such request qualifies under our guidelines for erasure, your personal data will be anonymised. Once anonymised it is no longer recognised as personal data.
                            </div>
                            <div className="privacy-policy-paragraph">
                                If there has been no Account Activity (as defined in our <a href="/en/future/termsandconditions" target="_blank">Terms and Conditions</a>) and we have maintained your data for the minimum time required to meet our legal and regulatory requirements, your account will be closed and pseudonymised.
                            </div>
                            <div className="privacy-policy-paragraph">
                                Accounts where there has been an instance of fraud, notification of gambling addiction and/or permanent self-exclusion, will not be anonymised so that we may continue to monitor these customers in adherence to our legal and regulatory requirements.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-9">
                            6. Keeping you informed about our products and services
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(10)}>
                            6. Keeping you informed about our products and services
                            <div className="arrow-up" style={{ display: showMobile == 10 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 10 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 10 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We’d love to send you offers, competitions & exclusive content through our various marketing channels. Your data will not be sold or given to any third parties not affiliated with PayPerWin for marketing purposes without your prior approval.
                            </div>
                            <div className="privacy-policy-paragraph">
                                You can change your marketing preference setting by logging into your PayPerWin account and going to the “Preferences” page where you can change your marketing preference.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-10">
                            7. How we secure your information
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(11)}>
                            7. How we secure your information
                            <div className="arrow-up" style={{ display: showMobile == 11 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 11 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 11 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                a. PayPerWin assures you that your personal data is:
                                <ul>
                                    <li>processed in accordance with your rights;</li>
                                    <li>processed fairly and lawfully;</li>
                                    <li>obtained only for the above purposes;</li>
                                    <li>adequate, relevant and not excessive for its purpose;</li>
                                    <li>kept in a secure manner;</li>
                                    <li>not kept longer than is necessary for its purposes.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                b. PayPerWin shall take all reasonable steps to ensure that your information is kept secure and protected. In this regard, we maintain appropriate technical and organisational measures to protect your data against unauthorised or unlawful processing.
                            </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-11">
                            8. Your rights
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(12)}>
                            8. Your rights
                            <div className="arrow-up" style={{ display: showMobile == 12 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 12 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 12 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Subject to certain limitations on certain rights you have the following rights in relation to your information. You can exercise any of these rights by contacting <a href="mailto:support@payperwin.com">support@payperwin.com</a> naming the right you are exercising along with the reason for your request, if applicable.
                            </div>
                            <div className="right-moved">
                                <div className="privacy-policy-paragraph">
                                    <strong>Right of Access:</strong> you have the right to request access to your personal data and supplementary information.
                                </div>
                                <div className="privacy-policy-paragraph">
                                    <strong>Right to Rectification:</strong> you have the right to request that inaccurate personal data be rectified or completed if incomplete.
                                </div>
                                <div className="privacy-policy-paragraph">
                                    <strong>Right to Erasure:</strong> you have the right to request erasure of your information where there is no longer a good reason for us to continue processing it. Please ensure that you withdraw your Account Balance prior to sending us the request. The rules enacted under the section 8 of our <a href="/en/future/termsandconditions" target="_blank">Terms and Conditions</a> related to the Withdrawal of funds apply. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing (see below), where we may have processed your information unlawfully or where we are required to erase your personal data to comply with local law. It should be noted that this right is not absolute and may be subject to our compelling reasons to maintain that information such as our adherence to legal and regulatory obligations. Please see the section “How long we keep your information” above. In the event we are unable to comply with this request you will be notified.
                                </div>
                                <div className="privacy-policy-paragraph">
                                    <strong>Right to Restrict Processing:</strong> this enables you to ask us to suspend the processing of your personal data in the following scenarios: (a) if you want us to establish the data's accuracy; (b) where our use of the data is unlawful (i.e. where it does not fall under a legal reason for processing as outlined under section 3. or your information has otherwise been obtained illegally by a third party) but you do not want us to erase it; (c) where you need us to hold the data even if we no longer require it as you need it to establish, exercise or defend legal claims; or (d) you have objected to our use of your data but we need to verify whether we have overriding legitimate grounds to use it. Please note that this right is not absolute.
                                </div>
                                <div className="privacy-policy-paragraph">
                                    <strong>Right to Data Portability:</strong> you have the right to request the personal data you have provided to us. You may make a data portability request by contacting <a href="mailto:support@payperwin.com">support@payperwin.com.</a>
                                </div>
                                <div className="privacy-policy-paragraph">
                                    <strong>Right to Object:</strong> you have the right to object to our processing of your data. It should be noted that this right is not absolute and may be subject to any reasons we have to maintain that information such as our adherence to legal and regulatory obligations. If you wish to object to direct marketing please contact <a href="mailto:support@payperwin.com">support@payperwin.com</a> requesting that you no longer wish to receive marketing materials.
                                </div>
                            </div>
                            <div className="privacy-policy-paragraph">
                                It should be noted that the ability to perform our services relies on the processing of certain information, therefore, exercising certain rights may result in a loss of the service or part of it.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-12">
                            No fee usually required
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(13)}>
                            No fee usually required
                            <div className="arrow-up" style={{ display: showMobile == 13 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 13 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 13 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                You will not have to pay a fee to access your personal data (or to exercise any other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
                            </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-13">
                            What we may need from you
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(14)}>
                            What we may need from you
                            <div className="arrow-up" style={{ display: showMobile == 14 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 14 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 14 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We may request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it. In the event you did not provide all your verification information upon registering with us, this information may be requested to complete your profile. We may also contact you to ask you for further information in relation to your request to speed up our response. Please remember to keep your password confidential.
                            </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-14">
                            Time limit to respond
                    </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(15)}>
                            Time limit to respond
                            <div className="arrow-up" style={{ display: showMobile == 15 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 15 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 15 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We try to respond to all legitimate requests within one month. Occasionally it may take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.
                            </div>
                            <div className="privacy-policy-paragraph">
                                It is your responsibility to maintain that your personal information is up to date and accurate.
                            </div>
                            <div className="privacy-policy-paragraph">
                                You have the right to lodge a complaint with a supervisory authority in the location of your habitual residence, place of work or place of the alleged infringement. We would, however, appreciate the chance to deal with your concerns before you approach your local authority so please contact us in the first instance.
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="cookie-policy">
                            9. Cookie Policy
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(16)}>
                            9. Cookie Policy
                            <div className="arrow-up" style={{ display: showMobile == 16 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 16 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 16 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                PayPerWin’s websites (including those optimised for mobile devices) and mobile applications use cookies and similar technologies to manage login sessions, provide personalised web pages and to tailor content to reflect your specific needs and interests. Once you “Accept” our banner on cookies you agree to the use of cookies and similar technologies for the purposes we describe in this policy.
                            </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-16">
                            What is a web cookie?
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(17)}>
                            What is a web cookie?
                            <div className="arrow-up" style={{ display: showMobile == 17 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 17 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 17 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Cookies are text files containing a small amount of information that are downloaded to your device when you visit a website. They are generally used by most websites to improve your online experience and to ensure that content and functions are delivered and used more effectively.
                            </div>
                            <div className="privacy-policy-paragraph">
                                Cookies perform various different functions. For example, some cookies are downloaded to your device temporarily for the period that you browse a particular website; these cookies might allow you to navigate between pages more efficiently or enable websites to remember the preferences you select. Other cookies can be used to help websites remember you as a returning visitor or ensure the online adverts you receive are more relevant to your specific needs and interests.
                            </div>
                            <div className="privacy-policy-paragraph">
                                You can amend your browser settings to block some or all cookies. To do this, follow the instructions provided by your browser provider. Please be aware, if you block cookies from PayPerWin’s website some or all the website's functions may not perform as intended.
                            </div>
                            <div className="privacy-policy-paragraph">
                                For example, you may not actually be able to place any bets. If you would like to amend your browser settings see “manage your cookies”. If you would like more information about cookies see “further information”.
                            </div>
                            <div className="privacy-policy-paragraph">
                                The types of cookies PayPerWin uses are:
                            </div>
                            <div className="privacy-policy-paragraph">
                                Essential Cookies
                            </div>
                            <div className="privacy-policy-paragraph">
                                Performance Cookies
                            </div>
                            <div className="privacy-policy-paragraph">
                                Functionality Cookies
                            </div>
                            <div className="privacy-policy-paragraph">
                                Targeting Cookies
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-17">
                            Essential Cookies
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(18)}>
                            Essential Cookies
                            <div className="arrow-up" style={{ display: showMobile == 18 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 18 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 18 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Essential Cookies are cookies which are necessary in order for a website to function correctly; they enable you to navigate our website and allow you to perform specific functions, such as accessing secure areas, placing bets, depositing funds and managing your account. Without these cookies, it would not be possible to provide our specific online services and functions.
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>We use Essential Cookies to:</strong>
                                <ul>
                                    <li>Maintain your Bet Slip selections as you navigate around the site;</li>
                                    <li>Identify you as being logged on to payperwin.com.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                Cookies we have defined as Essential Cookies will not be used to:
                                <ul>
                                    <li><i li="">Gather information that could be used to advertise products or services to you;</i></li>
                                    <li><i li="">Remember your preferences or username beyond your current visit.</i></li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Some examples of essential cookies that PayPerWin sets:</strong>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><strong>BackURL</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used for navigation purposes.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong>Custid</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used to authenticate the customer's ID.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong>BrowserSessionId</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used in simultaneous logins to track if the user's current session is the latest.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong>UserAccess</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie defines users website access.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="PC">
                            Performance Cookies
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(19)}>
                            Performance Cookies
                            <div className="arrow-up" style={{ display: showMobile == 19 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 19 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 19 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                These cookies collect information about how visitors use a website, for instance, which pages they go to most often and if they get error messages from web pages. These cookies do not collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve a website's performance.
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>We use Performance Cookies to:</strong>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <ul>
                                    <li>Provide statistics on how our website is used;</li>
                                    <li>See how effective our promotions are;</li>
                                    <li>Collect statistics on which markets customers are betting on;</li>
                                    <li>Help us improve the website by measuring any errors that occur;</li>
                                    <li>Test different designs of our website;</li>
                                    <li>Identify your browser or device you are using to access the site.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Cookies we have defined as 'Performance' cookies will not be used to:</strong>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <ul>
                                    <li>Gather information that could be used to advertise products or services to you on other websites;</li>
                                    <li>Remember your preferences or username beyond your current visit;</li>
                                    <li>Store personal information such as email address or name;</li>
                                    <li>Target promotions to you on any other website;</li>
                                    <li>Allow third parties to use the cookies for any purpose other than those listed above.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Example of performance cookies that PayPerWin sets:</strong>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><strong><span>ADRUM</span></strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used to monitor End User experience.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong><span>Webmetrics</span>-RUM</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used for tracking data analytics.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="privacy-policy-paragraph">
                                We use third-party cookies (such as Google Analytics and Silverpop Web Analytics) to gather information on customer interactions with the site so we can develop and improve the customer’s journey and provide them with an optimised service (To opt out of performance cookies, please see below).
                            </div>
                            <div className="privacy-policy-paragraph">
                                Please be aware that opting out of our performance cookies won’t keep you from using our website, however, it will limit us from learning from your experience and may limit our ability to make accurate decisions for improving our website. However, if you wish to opt out of the web analytics that PayPerWin uses, please use the link below:
                            </div>
                            <div className="privacy-policy-paragraph">GoogleAnalytics</div>
                            <div className="privacy-policy-paragraph">
                                <a target="_blank" href="http://tools.google.com/dlpage/gaoptout">http://tools.google.com/dlpage/gaoptout</a>
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="FC">Functionality Cookies</div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(20)}>
                            Functionality Cookies
                            <div className="arrow-up" style={{ display: showMobile == 20 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 20 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 20 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                These cookies allow the website to remember choices you make, such as your username, language, or the region you are in, and provide enhanced, personalised features. For instance, a website may be able to provide you with local weather reports or traffic news by using cookies to store information about the region in which you are located. These cookies can also be used to remember changes you have made to text size, fonts and other parts of web pages that you can customise. They may also be used to provide services you have requested such as watching a video or commenting on a blog. The information these cookies collect may be anonymised and they cannot track your browsing activity on other websites.
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>We use 'Functionality' cookies to:</strong>
                                <ul>
                                    <li>Remember settings you've applied such as layout, preferences, colours and showing/ hiding features;</li>
                                    <li>Remember that you have seen certain content;</li>
                                    <li>Provide proactive live chat sessions to offer you support.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Cookies we have defined as 'Functionality' cookies will not be used to:</strong>
                                <ul>
                                    <li>Target you with adverts on other websites;</li>
                                    <li>Allow third parties to use the cookies for any purpose other than those listed above.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Examples of functionality cookies that PayPerWin sets:</strong>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><strong>UserPrefsCookie</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie saves information about some of the user profile related settings like default odds format, default language, view and time zone.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong>HomePageVisitedTime</strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie gets created so that the site knows if it should redirect you to a page for returning customers.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><strong><span>DestUrl</span></strong></p>
                                        </td>
                                        <td>
                                            <p>This cookie is used to send customer directly to a specific league page on guest site to view lines.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="TC">Targeting Cookies</div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(21)}>
                            Targeting Cookies
                            <div className="arrow-up" style={{ display: showMobile == 21 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 21 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 21 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                These cookies are used to deliver content, such as adverts, that are more relevant to you and your interests. They may also be used to limit the number of times you see an advert or measure the effectiveness of the advertising campaign. These tend to be set by third party advertising agencies with PayPerWin's permission, and may share information about websites that you have visited with other organisations, such as advertisers.
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>We use 'Targeting' cookies to:</strong>
                                <ul>
                                    <li>See what pages a customer is interested in and feed this back to our email tool so we only target customers with information that is relevant to them.</li>
                                    <li>Provide promotions to customers who have registered an account with us whether such account is funded or not.</li>
                                    <li>Provide cross-product promotions to customers based on what markets you have viewed or the value of the bets you have placed.</li>
                                    <li>Provide suggested third parties with information about your visit so that they can present you with adverts that you may be interested in.</li>
                                </ul>
                            </div>
                            <div className="privacy-policy-paragraph">
                                <strong>Some of targeting cookies that PayPerWin uses:</strong>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p>Sidi</p>
                                        </td>
                                        <td>
                                            <p>This cookie is used to gather data on a website visitor’s session activity.</p>
                                            <p>&nbsp;</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>Vidi</p>
                                        </td>
                                        <td>
                                            <p>This cookie is used for visitor identification.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-21">
                            Manage your cookies
                    </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(22)}>
                            Manage your cookies
                            <div className="arrow-up" style={{ display: showMobile == 22 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 22 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 22 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                We recommend you don't change your cookie settings as it may limit your user experience and the performance of the site.
                            </div>
                            <div className="privacy-policy-paragraph">
                                If you do want to change the cookies setting, you can do this through your browser. Different web browsers may use a different way of controlling cookies, so you'll need to use your browser's help section to find out how to do this or you can visit one of the following browser providers’ sites directly.
                        </div>
                            <div className="privacy-policy-paragraph">
                                <ul>
                                    <li><a target="_blank" href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences">Firefox</a></li>
                                    <li><a target="_blank" href="https://support.google.com/chrome/answer/95647?hl=en">Google Chrome</a></li>
                                    <li><a target="_blank" href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies">Microsoft Internet Explorer (IE)</a></li>
                                    <li><a target="_blank" href="https://support.apple.com/kb/ph19214?locale=en_US">Safari</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="privacy-policy-section-title desktop" id="title-22">
                            Further information
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(23)}>
                            Further information
                            <div className="arrow-up" style={{ display: showMobile == 23 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 23 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 23 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                You can find more information about cookies at <a target="_blank" href="https://en.wikipedia.org/wiki/HTTP_cookie">https://en.wikipedia.org/wiki/HTTP_cookie</a>. For a video about cookies visit <a target="_blank" href="https://policies.google.com/technologies/cookies">https://policies.google.com/technologies/cookies</a>.
                        </div>
                        </div>
                        <div className="privacy-policy-section-title desktop" id="title-23">
                            10. Changes to information
                        </div>
                        <div className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(24)}>
                            10. Changes to information
                            <div className="arrow-up" style={{ display: showMobile == 24 ? 'block' : 'none' }}></div>
                            <div className="arrow-down" style={{ display: showMobile != 24 ? 'block' : 'none' }}></div>
                        </div>

                        <div className="mobile-container" style={{ display: showMobile == 24 ? 'block' : 'none' }}>
                            <div className="privacy-policy-paragraph">
                                Any changes to our Privacy Policy shall be posted on this page and any such changes will become effective upon posting the revised Privacy Policy. If we make any material or substantial changes to this Privacy Policy we will use reasonable endeavours to inform you by email, notice on the Website or other agreed communications channels. If we plan to use personal data for a new purpose, we update our Privacy Policy and communicate the changes to individuals before starting any new processing.
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PrivacyPolicy;