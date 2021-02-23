
import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class Preferences extends Component {
    render() {
        setTitle({ pageTitle: 'Preferences' });
        return (
            <React.Fragment>
                <div className="col-in prfnce">
                    <h1 className="main-heading-in">Preferences</h1>
                    <div className="main-cnt">
                        <form>
                            <h3> DISPLAY PREFERENCES</h3>

                            <div className="form-group">
                                <label>Odds display format</label>
                                <select className="form-control">
                                    <option> American Ods</option>
                                    <option> Decimal Odds</option>
                                </select>
                                <i className="fa fa-info-circle fl-rit"
                                    aria-hidden="true"></i>
                            </div>

                            <div className="form-group">
                                <label>Default date format</label>
                                <select className="form-control">
                                    <option> DD-MM-YYYY</option>
                                    <option> DD-MM-YYYY</option>
                                    <option> DD-MM-YYYY</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Default time zone</label>
                                <select className="form-control">
                                    <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                                    <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                                    <option value="-10:00">(GMT -10:00) Hawaii</option>
                                    <option value="-09:50">(GMT -9:30) Taiohae</option>
                                    <option value="-09:00">(GMT -9:00) Alaska</option>
                                    <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                    <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                    <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                    <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                    <option value="-04:50">(GMT -4:30) Caracas</option>
                                    <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                    <option value="-03:50">(GMT -3:30) Newfoundland</option>
                                    <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                    <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                                    <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                                    <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                    <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                    <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                                    <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                    <option value="+03:50">(GMT +3:30) Tehran</option>
                                    <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                    <option value="+04:50">(GMT +4:30) Kabul</option>
                                    <option value="+05:00">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                    <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                    <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                                    <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                    <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                                    <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                    <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                    <option value="+08:75">(GMT +8:45) Eucla</option>
                                    <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                    <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                                    <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                    <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                                    <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                    <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                                    <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                    <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                                    <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                                    <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                                </select>
                            </div>

                            <div className="form-group mar30">
                                <label>Language</label>
                                <select className="form-control">
                                    <option>English</option>
                                </select>
                            </div>

                            {/* <div className="form-group">
                                <h3>BETTING PREFERENCES</h3>
                                <p> <label className="container-checkbox">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                </label> Always accept better odds <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"></i>
                                </p>

                                <p>
                                    <label className="container-checkbox">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label> Use default stake amount <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"></i>
                                </p>

                                <p>
                                    <label className="container-checkbox">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label> Always bet maximum amount <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"></i>
                                </p>

                                <p>
                                    <label className="container-checkbox">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label> Enable BetNav predictions for
                                                                                live soccer matchups? <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"></i>
                                </p>
                            </div>
                            <br />
                            <div className="form-group">
                                <strong> Default for starting
                                                                                pitchers</strong>
                                <br />
                                <br />
                                <div className="bnt-dsbl">
                                    <a className="lsted" href="#">Listed</a>
                                    <a className="action"
                                        href="#">Action</a>
                                    <div className="clear-fix"></div>
                                </div>
                            </div> */}
                            {/* <div className="prifrn redio-sec">
                                <h4 className="h4">MARKETING PREFERENCES
                                                                            </h4>
                                <strong>Choose how you would prefer to be
                                informed about our promotions and our
                                                                                latest news. </strong>
                                <div
                                    className="rd-d d-flex justify-content-around">
                                    <p>Email</p>
                                    <p>
                                        <input type="radio" id="test1"
                                            name="radio-group" checked="" />
                                        <label for="test1">Yes</label>
                                    </p>
                                    <p>
                                        <input type="radio" id="test2"
                                            name="radio-group" />
                                        <label for="test2">no</label>
                                    </p>
                                </div>
                                <div
                                    className="rd-d d-flex justify-content-around">
                                    <p>Phone</p>
                                    <p>
                                        <input type="radio" id="test3"
                                            name="radio-group" checked="" />
                                        <label for="test3">Yes</label>
                                    </p>
                                    <p>
                                        <input type="radio" id="test4"
                                            name="radio-group" />
                                        <label for="test4">no</label>
                                    </p>
                                </div>
                                <div
                                    className="rd-d d-flex justify-content-around">
                                    <p>Post</p>
                                    <p>
                                        <input type="radio" id="test3"
                                            name="radio-group"
                                            checked="true" />
                                        <label for="test3">Yes</label>
                                    </p>
                                    <p>
                                        <input type="radio" id="test4"
                                            name="radio-group" />
                                        <label for="test4">no</label>
                                    </p>
                                </div>
                            </div> */}
                            <button type="submit"
                                className="clr-blue btn-smt">save </button>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Preferences;