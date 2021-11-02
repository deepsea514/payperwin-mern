import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import React, {useEffect} from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from 'react-select/async';

import Select from 'react-select';
import { searchUsers, searchSports } from "../../customers/redux/services";

import { searchAutoBetUsers, searchSportsLeague } from "../redux/services";
import { getInputClasses } from "../../../../helpers/getInputClasses";


import config from "../../../../../../config.json";
const PlaceBetStatus = config.PlaceBetStatus;
const PlaceBetPeorid = config.PlaceBetPeorid;

const sideOptions = [
    { value: 'Underdog', label: 'Underdog' },
    { value: 'Favorite', label: 'Favorite' },
]

const betTypeOptions = [
    { value: 'moneyline', label: 'Moneyline' },
    { value: 'spread', label: 'Spreads' },
    { value: 'total', label: 'Over/Under' },
]

export default class PlaceBetModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initialValues: props.initialValues ? props.initialValues : {
                user: null,
                autoBetUser: null,
                sports: null,
                teamA: '',
                teamB: '',
                betType: null,
                teamAOdds: 0,
                teamBOdds: 0,
                wager: 0,
                maxRisk: 0,
                teamToWin: '',
                registrationDate: '',
                status: PlaceBetStatus.active,
                points: 0,
                placeBetOnTeamB: false
            },
            placebetSchema: Yup.object().shape({
                user: Yup.object()
                    .nullable()
                    .required("Customer field is required."),
               autoBetUser: Yup.object()
                    .nullable()
                    .required("Autobet User field is required."),
                wager: Yup.number()
                    .moreThan(0, "Wager should be more than 0")
                    .required("Wager field is required"),   
                teamA: Yup.string().required("Name of Team A field is required"),
                teamB: Yup.string().required("Name of Team B field is required"),
                betType: Yup.object().nullable().required("Bet type field is required"),
                sports: Yup.object()
                    .nullable()
                    .required("Sports field is required."),
                    teamAOdds: Yup.number()
                    .required("Team A Odds field is required"),
                teamBOdds: Yup.number()
                    .required("Team B Odds field is required"),
                    teamToWin: Yup.string().required("Team to Win field is required"),
                registrationDate: Yup.string().nullable()

            }),
            loadingUser: false,
            loadingAutoBetUser: false,
            loadingSports: false,
            loadingSportsLeague: false,
            selectedSport: '',
            selectedSportLeague: '',
            teamAOddsValue: '',
            leagueEvents: [],
            sportsLeague: [],
        }
    }


    getOptions = (name, cb) => {
        this.setState({ loadingUser: true });
        searchUsers(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingUser: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingUser: false });
        })
    }


    getAutoBetUser = (name, cb) => {
        this.setState({ loadingAutoBetUser: true });
        searchAutoBetUsers(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingAutoBetUser: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingAutoBetUser: false });
        })
    }

    getSports = (name, cb) => {
        this.setState({ loadingSports: true });
        searchSports(name).then(({ data }) => {
            cb(data);
            this.setState({ loadingSports: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingSports: false });
        })
    }

    getTeams = async (name) => {

        const teams = this.state.sportsLeague?.leagues.filter((leagues, key) => leagues.originId == name )[0];
        const result = teams.events.map(event => {
            return {
                value: event.teamA,
                label: event.teamA,
            }
        })

        this.setState({ leagueEvents: result })
    }



    getSportsLeague = (name) => {
        this.setState({ loadingSportsLeague: true });
        searchSportsLeague(name).then(({ data }) => {
            this.setState({ sportsLeague: data });
            this.setState({ loadingSportsLeague: false });
        }).catch(() => {
            cb([]);
            this.setState({ loadingSportsLeague: false });
        })
    }

    renderSportsLeague = () => {
        const leagues = this.state.sportsLeague?.leagues ? this.state.sportsLeague?.leagues : [];
        return Object.keys(leagues).map(function (key, index) {
            return <option key={leagues[key].originId} value={leagues[key].originId}>{leagues[key].name}</option>
        });
    }



    renderStatus = () => {
        return Object.keys(PlaceBetStatus).map(function (key, index) {
            return <option key={PlaceBetStatus[key]} value={PlaceBetStatus[key]}>{PlaceBetStatus[key]}</option>
        });
    }


    renderPeorid = () => {
        return Object.keys(PlaceBetPeorid).map(function (key, index) {
            return <option key={PlaceBetPeorid[key]} value={PlaceBetPeorid[key]}>{PlaceBetPeorid[key]}</option>
        });
    }


    render() {
        const { show, onHide, onSubmit, handleChangeCalcWinAmount, title, edit } = this.props;
        const { initialValues, placebetSchema, loadingUser, loadingAutoBetUser, loadingSports, selectedSport, selectedSportLeague, loadingSportsLeague, leagueEvents } = this.state;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {show && <Formik
                    initialValues={initialValues}
                    validationSchema={placebetSchema}
                    onSubmit={onSubmit}>
                    {
                        (formik) => {
                            return <Form>
                                <Modal.Body>
                                    <div className="form-group">
                                        <label>Customer <span className="text-danger">*</span></label>
                                        {!edit && <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "user")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="user"
                                            loadOptions={this.getOptions}
                                            noOptionsMessage={() => "No Customer"}
                                            value={formik.values.user}
                                            isLoading={loadingUser}
                                            {...formik.getFieldProps("user")}
                                            {...{
                                                onChange: (user) => {
                                                    if (!user) return;
                                                    formik.setFieldValue("user", user);
                                                    formik.setFieldTouched("user", true);
                                                    formik.setFieldError("user", false);
                                                },

                                            }}
                                        />}
                                        {edit && <input name="user"
                                            className={`form-control ${getInputClasses(formik, "user")}`}
                                            readOnly
                                            value={formik.values.user.label}
                                        />}
                                        {formik.touched.user && formik.errors.user ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.user}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="form-group">
                                        <label>AutoBet user <span className="text-danger">*</span></label>
                                        {!edit && <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "autoBetUser")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="autoBetUser"
                                            loadOptions={this.getAutoBetUser}
                                            noOptionsMessage={() => "No Autobet User"}
                                            value={formik.values.autoBetUser}
                                            isLoading={loadingAutoBetUser}
                                            {...formik.getFieldProps("autoBetUser")}
                                            {...{
                                                onChange: (autobetUser) => {
                                                    if (!autobetUser) return;
                                                    formik.setFieldValue("autoBetUser", autobetUser);
                                                    formik.setFieldTouched("autoBetUser", true);
                                                    formik.setFieldError("autoBetUser", false);
                                                },

                                            }}
                                        />}
                                        {edit && <input name="autoBetUser"
                                            className={`form-control ${getInputClasses(formik, "autoBetUser")}`}
                                            readOnly
                                            value={formik.values.autoBetUser.label}
                                        />}
                                        {formik.touched.autoBetUser && formik.errors.autoBetUser ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.autoBetUser}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label>Select Sport<span className="text-danger">*</span></label>
                                        <AsyncSelect
                                            className={`basic-single ${getInputClasses(formik, "sports")}`}
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            name="sports"
                                            loadOptions={this.getSports}
                                            noOptionsMessage={() => "No Sports"}
                                            value={formik.values.sports}
                                            isLoading={loadingSports}
                                            {...formik.getFieldProps("sports")}
                                            {...{
                                                onChange: (sports) => {
                                                    this.setState({ selectedSport: sports.value });

                                                    this.getSportsLeague(sports.value);
                                                    if (!sports) return;
                                                    formik.setFieldValue("sports", sports);
                                                    formik.setFieldTouched("sports", true);
                                                    formik.setFieldError("sports", false);
                                                },

                                            }}
                                        />
                                        {formik.touched.sports && formik.errors.sports ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.sports}
                                            </div>
                                        ) : null}
                                    </div>


                                    {/* <div className="form-group">
                                        <label>Sports League<span className="text-danger">*</span></label>
                                        <select name="sportsLeague" placeholder="Choose Sports League"
                                            className={`form-control ${getInputClasses(formik, "sportsLeague")}`}
                                            {...formik.getFieldProps("sportsLeague")}
                                            onChange={
                                                async (e) => {
                                                    const leagueId = e.target.value;
                                                    this.getTeams(leagueId);
                                                }
                                            }

                                        >
                                            {this.renderSportsLeague()}
                                        </select>
                                        {formik.touched.sportsLeague && formik.errors.sportsLeague ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.sportsLeague}
                                            </div>
                                        ) : null}
                                    </div> */}

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label>Name of Team A<span className="text-danger">*</span></label>

                                            <input name="teamA" placeholder="Name of Team A"
                                                className={`form-control ${getInputClasses(formik, "teamA")}`}
                                                {...formik.getFieldProps("teamA")}
                                            />


                                            {formik.touched.teamA && formik.errors.teamA ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.teamA}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Name of Team B<span className="text-danger">*</span></label>
                                            <input name="teamB" placeholder="Name of Team B"
                                                className={`form-control ${getInputClasses(formik, "teamB")}`}
                                                {...formik.getFieldProps("teamB")}
                                            />
                                            {formik.touched.teamB && formik.errors.teamB ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.teamB}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>



                                    <div className="form-group">
                                        <label>Bet Type<span className="text-danger">*</span></label>
                                        <Select
                                            className={`basic-single ${getInputClasses(formik, "betType")}`}
                                            classNamePrefix="select"
                                            name="betType"
                                            options={betTypeOptions}
                                            value={formik.values.betType}
                                            {...formik.getFieldProps("betType")}
                                            {...{
                                                onChange: (betType) => {
                                                    if (!betType) return;
                                                    formik.setFieldValue("betType", betType);
                                                    formik.setFieldTouched("betType", true);
                                                    formik.setFieldError("betType", false);
                                                },

                                            }}
                                        />
                                        {formik.touched.betType && formik.errors.betType ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.betType}
                                            </div>
                                        ) : null}
                                    </div>
                                    {formik.values.betType?.label != "Moneyline" && formik.values.betType &&  
                                    <div className="form-group">
                                    <label>{formik.values.betType?.label}  Points<span className="text-danger">*</span></label>
                                            <input name="points" placeholder={`Enter ${formik.values.betType?.label} Points` }
                                                className={`form-control ${getInputClasses(formik, "points")}`}
                                                {...formik.getFieldProps("points")}
                                            />
                                            {formik.touched.points && formik.errors.points ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.points}
                                                </div>
                                            ) : null}

                                    </div>
                                    }

                                    <div className="form-row">

                                        <div className="form-group col-md-6">
                                            <label>Team A Odds<span className="text-danger">*</span></label>
                                            <input name="teamAOdds" placeholder="Enter Team A Odds"
                                                className={`form-control ${getInputClasses(formik, "teamAOdds")}`}
                                                {...formik.getFieldProps("teamAOdds")}

                                              

                                            />
                                            {formik.touched.teamAOdds && formik.errors.teamAOdds ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.teamAOdds}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label>Team B Odds<span className="text-danger">*</span></label>
                                            <input name="teamBOdds" placeholder="Enter Team A Odds"
                                                className={`form-control ${getInputClasses(formik, "teamBOdds")}`}
                                                {...formik.getFieldProps("teamBOdds")}
                                            />
                                            {formik.touched.teamBOdds && formik.errors.teamBOdds ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.teamBOdds}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="form-row form-group">
                                        <div className="col-md-12">
                                            <input type="checkbox" id="placeBetOnTeamB" name="placeBetOnTeamB"
                                                {...formik.getFieldProps("placeBetOnTeamB")}
                                                checked={formik.values.placeBetOnTeamB}
                                            />
                                            <label htmlFor="placeBetOnTeamB"> &nbsp;&nbsp; Check to Place bet on Team B</label>
                                            {formik.touched.placeBetOnTeamB && formik.errors.placeBetOnTeamB ? (
                                                <div className="invalid-feedback">
                                                    {formik.errors.placeBetOnTeamB}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="form-group">


                                        <label>Wager<span className="text-danger">*</span></label>
                                      

<input
        id="quaggaFile"
        type="text"
        className={`form-control ${getInputClasses(formik, "wager")}`}
       name="wager"
        onChange={(e) => {
            const stake = e.target.value

            formik.setFieldValue("wager", stake);
            const placeOnTeamB = formik.getFieldProps("placeBetOnTeamB").value;
            const teamAOdd = formik.getFieldProps("teamAOdds").value;
            const teamBOdd = formik.getFieldProps("teamBOdds").value;
            const odd = placeOnTeamB ? teamBOdd : teamAOdd;
            const americanOdds = Math.abs(Number(Number(odd).toFixed(2)));
            const decimalOdds = americanOdds > 0 ? (americanOdds / 100) : -(100 / americanOdds);
            const calculateWin = stake * decimalOdds;
            const roundToPennies = Number((calculateWin).toFixed(2));
            const win = roundToPennies;
            formik.setFieldValue("teamToWin", win);
    
            //formik.setFieldValue("wager", wager.value);
            formik.setFieldTouched("wager", true);
            formik.setFieldError("wager", false);
        }
        } // pass the setFieldValue property from formik 
      />

{formik.touched.wager && formik.errors.wager ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.wager}
                                            </div>
                                        ) : null}

                                    </div>

                                    <div className="form-group">

                                        <label>Team to Win<span className="text-danger">*</span></label>
                                        <input name="teamToWin" placeholder="Enter Team to Win"
                                            className={`form-control ${getInputClasses(formik, "teamToWin")}`}
                                            {...formik.getFieldProps("teamToWin")}
                                        />
                                        {formik.touched.teamToWin && formik.errors.teamToWin ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.teamToWin}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label>Registration Date<span className="text-danger">*</span></label>
                                        <input name="registrationDate" placeholder="Select Registration Date" type="date"
                                            className={`form-control ${getInputClasses(formik, "registrationDate")}`}
                                            {...formik.getFieldProps("registrationDate")}
                                        />
                                        {formik.touched.registrationDate && formik.errors.registrationDate ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.registrationDate}
                                            </div>
                                        ) : null}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="light-primary" onClick={onHide}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        }
                    }
                </Formik>}
            </Modal>
        );
    }

}