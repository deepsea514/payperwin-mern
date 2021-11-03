import React from "react";
import { setTitle } from '../libs/documentTitleBuilder';
import Sport from "../components/sport";

export default class SportName extends React.Component {
    componentDidMount() {
        let { sportName } = this.props;
        sportName = sportName.replace("_", " ");
        const title = `Bet on ${sportName}`;
        setTitle({ pageTitle: title })
    }

    render() {
        const { sportName, addBet, removeBet, betSlip } = this.props;
        return (
            <React.Fragment >
                <Sport addBet={addBet} betSlip={betSlip}
                    removeBet={removeBet} sportName={sportName}
                />
            </React.Fragment>
        )
    }
}