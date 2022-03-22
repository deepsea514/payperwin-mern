import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const getHomeData = () => {
    return FrontendAPI.get('/tickets/homedata');
}

export const getVenues = (filter, page) => {
    return FrontendAPI.get('/tickets/venues', { params: { ...filter, page } });
}

export const getVenueDetail = (venue_slug) => {
    return FrontendAPI.get(`/tickets/venues/${venue_slug}`,);
}

export const getEvents = (filter, page) => {
    return FrontendAPI.get('/tickets/events', {
        params: { ...filter, page }
    })
}

export const getEventDetail = (event_id) => {
    return FrontendAPI.get(`/tickets/events/${event_id}`);
}

export const getCADRate = () => {
    return FrontendAPI.get('/tickets/cad_rate');
}