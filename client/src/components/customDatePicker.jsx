import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const years = _.range(1950, (new Date()).getFullYear() + 1, 1);
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export default class CustomDatePicker extends React.Component {
    render() {
        const { years: propsYears } = this.props;
        let displayYears = propsYears ? propsYears : years;

        return (
            <DatePicker
                autoComplete="off"
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {"<"}
                        </button>
                        <select
                            value={(new Date(date)).getFullYear()}
                            onChange={({ target: { value } }) => changeYear(value)}
                        >
                            {displayYears.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={months[(new Date(date)).getMonth()]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {">"}
                        </button>
                    </div>
                )}
                dateFormat={"MMMM d, yyyy"}
                {...this.props}
            />
        )
    }
}
