import React from "react";
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

const CustomGoogleMap = compose(
    withProps(ownerProps => ({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAVgPB3gCN9rLm5-P9oOHfASeD7FoVuNts&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: ownerProps.containerElement ? ownerProps.containerElement : <div style={{ height: `80vh` }} />,
        mapElement: <div style={{ height: `100%` }} />
    })),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap defaultZoom={12} defaultCenter={{ lat: props.latitude, lng: props.longitude }}>
        <Marker position={{ lat: props.latitude, lng: props.longitude }} />
    </GoogleMap>
)
);

export default CustomGoogleMap