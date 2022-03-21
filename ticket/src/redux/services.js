import FrontendAPI from "./frontendAPI";

export const getUser = () => {
    return FrontendAPI.get('/user');
}

export const getVenues = (region, locality, query, page) => {
    return FrontendAPI.get('/tickets/venues', { params: { region, locality, query, page } });
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