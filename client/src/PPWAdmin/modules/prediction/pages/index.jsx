import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import dateformat from "dateformat";
import sportsData from '../data/sports.json';

class Prediction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sport: '',
            leagueArray: [],
            league: '',
            seasonArray: [],
            season: '',
            seasonData: null,
        }
    }

    componentDidMount() {

    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { seasonData } = this.state;
        if (!seasonData || !seasonData.length) {
            return (
                <tr>
                    <td colSpan="7">
                        <center><h4>No data available.</h4></center>
                    </td>
                </tr>
            )
        }

        let correctCount = 0;
        let totalCount = 0;
        const tableData = seasonData.map((event, index) => {
            const { HomeTeam, AwayTeam, PredScore, RealScore, date, Probability } = event;
            let correct = false;
            if (RealScore) {
                totalCount++;
                const realScores = RealScore.split('-');
                let realResult = 'D';
                if (parseInt(realScores[0]) > parseInt(realScores[1])) {
                    realResult = 'H';
                } else if (parseInt(realScores[0]) < parseInt(realScores[1])) {
                    realResult = 'A';
                }

                const predScores = PredScore.split('-');
                let predResult = 'D';
                if (parseInt(predScores[0]) > parseInt(predScores[1])) {
                    predResult = 'H';
                } else if (parseInt(predScores[0]) < parseInt(predScores[1])) {
                    predResult = 'A';
                }

                if (predResult == realResult) {
                    correct = true;
                    correctCount++;
                }
            }
            return (
                <tr key={`${HomeTeam} vs ${AwayTeam} on ${date}`}>
                    <td>{index + 1}</td>
                    <td>{HomeTeam}</td>
                    <td>{AwayTeam}</td>
                    <td>{this.getDateFormat(date)}</td>
                    <td><span className={correct ? 'text-danger' : ''}>{PredScore}</span></td>
                    <td><span>{Probability}</span></td>
                    <td><span className={correct ? 'text-danger' : ''}>{RealScore}</span></td>
                </tr>
            )
        })
        const correctNess = totalCount > 0 ? ((correctCount / totalCount * 100).toFixed(2)) : 0;
        const accuracyRow = (
            <tr key="accuracy">
                <td colSpan="7">
                    <center><h4>Accuracy {correctCount} / {totalCount} = {correctNess}% </h4></center>
                </td>
            </tr>
        )
        return [accuracyRow, ...tableData];
    }

    onSelectChange = (evt) => {
        const { leagueArray, seasonArray } = this.state;
        const { name, value } = evt.target;
        if (name == 'season') {
            const season = seasonArray.find(season => season.name == value);
            if (season) {
                let seasonData = null;
                try {
                    seasonData = require(`../data/${season.data}`);
                } catch (error) {
                }
                this.setState({ season: value, seasonData: seasonData });
            } else {
                this.setState({ season: '', seasonData: null });
            }
        } else if (name == 'league') {
            const leagueData = leagueArray.find(league => league.shortName == value);
            this.setState({
                league: value,
                season: '',
                seasonArray: leagueData ? leagueData.seasons : [],
                seasonData: null
            })
        } else if (name == 'sport') {
            const sportData = sportsData.find(sport => sport.shortName == value);
            this.setState({
                sport: value,
                league: '',
                season: '',
                leagueArray: sportData ? sportData.leagues : [],
                seasonArray: [],
                seasonData: null
            });
        }
    }

    render() {
        const { sport, league, season, leagueArray, seasonArray, seasonData } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Predictions</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-4 col-md-4">
                                    <select
                                        className="form-control"
                                        value={sport}
                                        name='sport'
                                        onChange={this.onSelectChange}>
                                        <option value="">Choose Sport...</option>
                                        {sportsData.map(sport => (
                                            <option key={sport.shortName} value={sport.shortName}>{sport.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <select
                                        className="form-control"
                                        value={league}
                                        name='league'
                                        onChange={this.onSelectChange}>
                                        <option value="">Choose League...</option>
                                        {leagueArray.map(league => (
                                            <option key={league.shortName} value={league.shortName}>{league.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <select
                                        className="form-control"
                                        value={season}
                                        name='season'
                                        onChange={this.onSelectChange}>
                                        <option value="">Choose Season...</option>
                                        {seasonArray.map(season => (
                                            <option key={season.name} value={season.name}>{season.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Home</th>
                                            <th>Away</th>
                                            <th>Date</th>
                                            <th>Prediction Score</th>
                                            <th>Probability</th>
                                            <th>Real Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Prediction