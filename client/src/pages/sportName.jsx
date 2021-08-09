import React from "react";
import { setTitle } from '../libs/documentTitleBuilder';
import Sport from "../components/sport";

export default class SportName extends React.Component {
    componentDidMount() {
        const { sportName } = this.props;
        const title = `Bet on ${sportName}`;
        setTitle({ pageTitle: title })
    }

    render() {
        const { sportName, addBet, removeBet, betSlip } = this.props;
        return (
            <React.Fragment >
                <h3>{sportName}</h3>
                <Sport addBet={addBet} betSlip={betSlip}
                    removeBet={removeBet} sportName={sportName}
                />
            </React.Fragment>
        )
    }
}