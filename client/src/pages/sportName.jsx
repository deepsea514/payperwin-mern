import React from "react";
import { setTitle } from '../libs/documentTitleBuilder';
import Sport from "../components/sport";
import { getSportName } from "../libs/getSportName";

export default class SportName extends React.Component {
    componentDidMount() {
        let { shortName } = this.props;
        const title = `Bet on ${getSportName(shortName)}`;
        setTitle({ pageTitle: title })
    }

    render() {
        const { shortName, addBet, removeBet, betSlip } = this.props;
        return (
            <React.Fragment >
                <Sport addBet={addBet} betSlip={betSlip}
                    removeBet={removeBet} shortName={shortName}
                />
            </React.Fragment>
        )
    }
}