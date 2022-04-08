import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const login = (values) => {
    return FrontendAPI.post('/login', values);
}

export const logout = () => {
    return FrontendAPI.get('/logout');
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

export const getPerformers = (filter, page) => {
    return FrontendAPI.get('/tickets/performers', { params: { ...filter, page } });
}

export const getPerformerDetail = (performer_slug) => {
    return FrontendAPI.get(`/tickets/performers/${performer_slug}`,);
}

export const checkoutSubmit = (values) => {
    return FrontendAPI.post('/tickets/checkout', values);
}

export const getOrders = (filter) => {
    return FrontendAPI.get('/tickets/orders', { params: filter });
}