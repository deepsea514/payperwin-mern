/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { forwardRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import dateformat from "dateformat";
import * as dashboard from "../../../../../modules/dashboard/redux/reducers";
import { connect } from "react-redux";

class DatePickerToggle extends React.Component {
    getDateRange = () => {
        const { daterange } = this.props;
        let year, month, day, rangeText, title;
        const nowDate = new Date();
        year = nowDate.getFullYear();
        month = nowDate.getMonth();
        day = nowDate.getDate();

        switch (daterange.selected) {
            case "today":
                rangeText = dateformat(new Date(year, month, day), "mmm d, yyyy");
                title = "Today";
                break;
            case "yesterday":
                rangeText = dateformat(new Date(year, month, day - 1), "mmm d, yyyy");
                title = "Yesterday";
                break;
            case "last7days":
                title = "Last 7 Days";
                break;
            case "last30days":
                title = "Last 30 Days";
                break;
            case "thismonth":
                title = "This Month";
                break;
            case "lastmonth":
                title = "Last Month";
                break;
            case "thisyear":
                title = "This Year";
                break;
            case 'alltime':
                title = "All Time";
                rangeText = 'Until ' + dateformat(daterange.endDate, "mmm d, yyyy");
                break;
            default:
                title = 'Custom';
                break;
        }

        if (!rangeText) {
            rangeText = dateformat(daterange.startDate, "mmm d, yyyy - ") + dateformat(daterange.endDate, "mmm d, yyyy");
        }
        return {
            rangeText,
            title
        }
    }

    render() {
        const { myref, onClick, selectedDate } = this.props;
        return (
            <a
                ref={myref}
                className="btn btn-light btn-sm font-weight-bold"
                data-toggle="tooltip"
                data-placement="left"
                onClick={e => {
                    e.preventDefault();
                    onClick(e);
                }}>
                <span className="text-muted font-weight-bold mr-2">{this.getDateRange().title}</span>
                <span className="text-primary font-weight-bold">{this.getDateRange().rangeText}</span>
            </a>
        )
    }
}

const mapStateToProps = (state) => ({
    daterange: state.dashboard.daterange
})

const DatePickerToggleWithState = connect(mapStateToProps)(DatePickerToggle);

const QuickActionsDropdownToggle = forwardRef((props, ref) => {
    return (
        <DatePickerToggleWithState {...props} myref={ref} />
    );
});

const dateRanges = [
    { key: 'today', title: 'Today' },
    { key: 'yesterday', title: 'Yesterday' },
    { key: 'last7days', title: 'Last 7 Days' },
    { key: 'last30days', title: 'Last 30 Days' },
    { key: 'thismonth', title: 'This Month' },
    { key: 'lastmonth', title: 'Last Month' },
    { key: 'thisyear', title: 'This Year' },
    { key: 'alltime', title: 'All Time' },
]

class DatePicker extends React.Component {
    componentDidMount() {
        const { daterange } = this.props;
        this.changeDateRange(daterange.selected)
    }

    changeDateRange = (selected) => {
        const { changeDateRange } = this.props;

        let year, month, day;
        const nowDate = new Date();
        year = nowDate.getFullYear();
        month = nowDate.getMonth();
        day = nowDate.getDate();
        let startDate = nowDate;
        let endDate = nowDate;
        switch (selected) {
            case "today":
                startDate = new Date(year, month, day);
                endDate = new Date(nowDate);
                break;
            case "yesterday":
                startDate = new Date(year, month, day - 1);
                endDate = new Date(year, month, day);
                break;
            case "last7days":
                startDate = new Date(year, month, day - 6);
                endDate = new Date(nowDate);
                break;
            case "last30days":
                startDate = new Date(year, month, day - 30);
                endDate = new Date(nowDate);
                break;
            case "thismonth":
                startDate = new Date(year, month, 1);
                endDate = new Date(nowDate);
                break;
            case "lastmonth":
                startDate = new Date(year, month - 1, 1);
                endDate = new Date(year, month, 0);
                break;
            case "thisyear":
                startDate = new Date(year, 0, 1);
                endDate = new Date(nowDate);
                break;
            case "alltime":
                startDate = new Date(2020, 1, 1);
                endDate = new Date(nowDate);
                break;
        }
        changeDateRange({ selected, startDate, endDate });
    }

    render() {
        const { daterange } = this.props;
        return (
            <>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Select Date Range</Tooltip>}
                >
                    <Dropdown className="dropdown-inline" drop="down" alignRight>
                        <Dropdown.Toggle as={QuickActionsDropdownToggle} />
                        <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-sm dropdown-menu-right">
                            <ul className="date-range">
                                {dateRanges.map((range) => (
                                    <li key={range.key} onClick={() => this.changeDateRange(range.key)} className={daterange.selected == range.range ? "active" : ""}>
                                        {range.title}
                                    </li>
                                ))}
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </OverlayTrigger>
            </>
        );
    }
}

export default connect(mapStateToProps, dashboard.actions)(DatePicker);