import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import dateformat from 'dateformat';
import CustomGoogleMap from '../Common/CustomGoogleMap';
import Tevomaps from '@ticketevolution/seatmaps-client';
import Modal from 'react-awesome-modal';
import Slider from 'rc-slider';
import Select from 'react-select';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';
import { getCountryName } from '../../lib/getCountryName';
import { actions } from '../../redux/reducers';

const customStyles = {
    control: (provided) => {
        return {
            ...provided,
            background: '#FFF4',
            height: '100%',
            borderRadius: 'none',
            border: 'none',
        }
    },
    placeholder: (provided) => {
        return {
            ...provided,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#c7c3c7'
        }
    },
    menu: (provided) => {
        return {
            ...provided,
            color: 'black',
        }
    }
}

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        const { event } = props;
        let initial_ticket_groups = [];
        let min_price = Infinity, max_price = 0;
        if (event.listings && event.listings.ticket_groups && event.listings.ticket_groups.length) {
            initial_ticket_groups = event.listings.ticket_groups;
            initial_ticket_groups.forEach(ticket_group => {
                if (ticket_group.retail_price > max_price) max_price = ticket_group.retail_price;
                if (ticket_group.retail_price < min_price) min_price = ticket_group.retail_price;
            })
        } else {
            min_price = 0;
        }

        let venue_id = null;
        if (event.venue) venue_id = event.venue.id;

        let configuration_id = null;
        if (event.configuration) configuration_id = event.configuration.id;

        const sort_options = [
            { value: 1, label: 'Lowest First' },
            { value: -1, label: 'Highest First' },
        ];
        this.state = {
            seatmapApi: null,
            initial_ticket_groups: initial_ticket_groups,
            ticket_groups: [],
            venue_id: venue_id,
            configuration_id: configuration_id,
            showMapModal: false,
            min_price: min_price,
            max_price: max_price,
            type_options: [
                { value: 'event', label: 'Event' },
                { value: 'parking', label: 'Parking' },
            ],
            format_options: [
                { value: 'Physical', label: 'Physical' },
                { value: 'Eticket', label: 'Eticket' },
                { value: 'TM_mobile', label: 'Mobile Entry' },
                { value: 'Flash_seats', label: 'Flash Seats' },
                { value: 'Paperless', label: 'Paperless' },
                { value: 'Guest_list', label: 'Guest List' },
            ],
            sort_options: sort_options,
            filter_quantity: '',
            filter_price: [min_price, max_price],
            filter_type: [],
            filter_format: [],
            filter_sort: sort_options[0],
            selectedSections: [],
        };
    }

    componentDidMount() {
        const { venue_id, configuration_id } = this.state;

        const seatmap = new Tevomaps({
            venueId: venue_id,
            configurationId: configuration_id,
            ticketGroups: [],
            onSelection: (selectedSections) => this.setState({ selectedSections }, this.updateTicketGroups)
        });

        const seatmapApi = seatmap.build('event-seatmap');
        this.setState({ seatmapApi }, this.updateTicketGroups);
    }

    updateTicketGroups = () => {
        const {
            initial_ticket_groups, seatmapApi, selectedSections,
            filter_quantity, filter_price, filter_sort, filter_format, filter_type
        } = this.state;
        if (!seatmapApi) return;

        let ticket_groups = initial_ticket_groups.filter(ticket_group => {
            if (selectedSections.length) {
                if (selectedSections.includes(ticket_group.tevo_section_name)) return true;
                return false;
            }
            if (filter_quantity && ticket_group.quantity < filter_quantity) {
                return false;
            }
            if (ticket_group.retail_price < filter_price[0] || ticket_group.retail_price > filter_price[1]) {
                return false;
            }
            if (filter_format.length && !filter_format.map(format => format.value).includes(ticket_group.format)) {
                return false;
            }
            if (filter_type.length && !filter_type.map(type => type.value).includes(ticket_group.type)) {
                return false;
            }

            return true;
        });
        ticket_groups.sort((ticket_group1, ticket_group2) => {
            if (Number(ticket_group1.retail_price) < Number(ticket_group2.retail_price)) {
                return -1 * filter_sort.value;
            }
            if (Number(ticket_group1.retail_price) > Number(ticket_group2.retail_price)) {
                return 1 * filter_sort.value;
            }
            return 0;
        });

        this.setState({ ticket_groups: [...ticket_groups] });
        seatmapApi.updateTicketGroups(selectedSections.length ? initial_ticket_groups : ticket_groups);
    }

    highlightTicketGroup = (ticket_group_name) => {
        const { seatmapApi } = this.state;
        if (!seatmapApi) return;
        seatmapApi.highlightSection(ticket_group_name);
    }

    unHighlightTicketGroup = (ticket_group_name) => {
        const { seatmapApi } = this.state;
        if (!seatmapApi) return;
        seatmapApi.unhighlightSection(ticket_group_name);
    }

    onChangeQuantiry = (evt) => {
        this.setState({ filter_quantity: evt.target.value }, this.updateTicketGroups);
    }

    onChangePriceFilter = (filter_price) => {
        this.setState({ filter_price }, this.updateTicketGroups);
    }

    onChangeSort = (filter_sort) => {
        this.setState({ filter_sort }, this.updateTicketGroups);
    }

    onChangeFormat = (filter_format) => {
        this.setState({ filter_format }, this.updateTicketGroups);
    }

    onChangeType = (filter_type) => {
        this.setState({ filter_type }, this.updateTicketGroups);
    }

    formatSectionName = (section_name) => {
        const words = section_name.split(' ');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    changeRate = (usd_price) => {
        const { cad_rate } = this.props;
        return Math.ceil(usd_price * cad_rate * 100) / 100
    }

    onAddTicketGroup = (ticket_group) => {
        const { addToCartAction, history } = this.props;
        addToCartAction(ticket_group);
        history.push('/checkout')
    }

    render() {
        const { event } = this.props;
        const {
            showMapModal, min_price, max_price, type_options, format_options, sort_options, ticket_groups,
            filter_price, filter_format, filter_quantity, filter_sort, filter_type
        } = this.state;

        return (
            <section className="blog-details-area ptb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="blog-details">
                                <h2>{event.name}</h2>
                                <ul className='event-info mt-3'>
                                    <li><i className="icofont-field"></i> <Link to={"/venues/" + event.venue.slug}><span>{event.venue.name}</span></Link></li>
                                    <li>
                                        <i className="icofont-location-pin"></i>&nbsp;
                                        {event.venue.address.street_address},&nbsp;
                                        {event.venue.location},&nbsp;
                                        {getCountryName(event.venue.country_code)}&nbsp;
                                        {event.venue &&
                                            event.venue.address.longitude &&
                                            event.venue.address.latitude &&
                                            <span role="button"
                                                onClick={() => this.setState({ showMapModal: true })}>(View Map)</span>}
                                    </li>
                                    <li><i className="icofont-wall-clock"></i> {dateformat(event.occurs_at, 'ddd mmm dd yyyy HH:MM')}</li>
                                </ul>
                            </div>

                            <div className='event-seatmap mt-4' id='event-seatmap'></div>
                        </div>

                        <div className="col-lg-4">
                            <div className="sidebar">
                                <div className='widget widget_search'>
                                    <div className='form-group'>
                                        <label>Quantity</label>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Minumum Quantity..."
                                            value={filter_quantity}
                                            min={0}
                                            step={1}
                                            onChange={this.onChangeQuantiry} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Min Price: CAD ${this.changeRate(min_price)}</label><br />
                                        <label>Max Price: CAD ${this.changeRate(max_price)}</label>
                                        <Slider range
                                            min={min_price}
                                            max={max_price}
                                            value={filter_price}
                                            allowCross
                                            onChange={this.onChangePriceFilter} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Sort By Price</label>
                                        <Select
                                            isSearchable={false}
                                            className="form-control p-0"
                                            classNamePrefix="select"
                                            options={sort_options}
                                            placeholder="All Types"
                                            value={filter_sort}
                                            onChange={this.onChangeSort}
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Type</label>
                                        <Select
                                            isMulti
                                            className="form-control p-0 form-control-custom"
                                            classNamePrefix="select"
                                            options={type_options}
                                            placeholder="All Types"
                                            value={filter_type}
                                            onChange={this.onChangeType}
                                            styles={customStyles}
                                            isClearable
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Format</label>
                                        <Select
                                            isMulti
                                            className="form-control p-0 form-control-custom"
                                            classNamePrefix="select"
                                            options={format_options}
                                            placeholder="All Formats"
                                            value={filter_format}
                                            onChange={this.onChangeFormat}
                                            styles={customStyles}
                                            isClearable
                                        />
                                    </div>
                                </div>

                                <div className='widget widget_ticket_group'>
                                    {ticket_groups.length === 0 && <p>No Tickets available.</p>}
                                    {ticket_groups.length > 0 && ticket_groups.map((ticket_group, index) => (
                                        <div key={index} className='ticket_row'
                                            onMouseEnter={() => this.highlightTicketGroup(ticket_group.tevo_section_name)}
                                            onMouseLeave={() => this.unHighlightTicketGroup(ticket_group.tevo_section_name)}
                                            onClick={() => this.onAddTicketGroup(ticket_group)}>
                                            <div>
                                                <i className={ticket_group.type === 'parking' ? 'icofont-car-alt-4' : 'icofont-chair'} />&nbsp;
                                                {this.formatSectionName(ticket_group.tevo_section_name)}
                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <b>Sec {ticket_group.section}, Row {ticket_group.row}</b>
                                                </div>
                                                <div>CAD ${this.changeRate(ticket_group.retail_price)}</div>
                                            </div>
                                            Quantity: {ticket_group.quantity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal visible={showMapModal} width="90%" effect="fadeInUp" onClickAway={() => this.setState({ showMapModal: false })}>
                    <div className="widget">
                        <CustomGoogleMap
                            longitude={event.venue.address.longitude}
                            latitude={event.venue.address.latitude}
                        />
                    </div>
                </Modal>
            </section >
        );
    }
}

const mapStateToProps = (state) => ({
    cad_rate: state.cad_rate,
});
export default connect(mapStateToProps, actions)(withRouter(EventDetail));