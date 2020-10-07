import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const getSatelliteId = async () => {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites')
    const data = await response.json();
    return data.filter(item => item.name === 'iss').map(item => item.id);
  } catch(error) { console.error(error) };
};

const getSatelliteData = async () => {
  try {
    const id = await getSatelliteId();
    const response = await fetch(`https://api.wheretheiss.at/v1/satellites/${id}`)
    const data = await response.json();
    return await data;
  } catch(error) { console.error(error) };
};

const mapStyles = {
  width: '100%',
  height: '100%',
};

class MapContainer extends Component {
  constructor() {
    super();
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      currentLocation: {
        lat: '',
        lng: ''
      }
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  componentDidMount() {
    const satelliteId = getSatelliteId();
    const issData = getSatelliteData(satelliteId)
    const lng = issData.longitude;
    const lat = issData.latitude;
    // how do I update the Map component's state/props
    // here witht he new coordinates
    this.setState({currentLocation: {
      lat: lat,
      lng: lng,
    }});
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={4}
        style={mapStyles}
        initialCenter={this.state.currentLocation}
      >
        <Marker
          onClick={this.onMarkerClick}
          name='The International Space Station is currently above this location.'
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
};

export default GoogleApiWrapper({
  apiKey: 'YOUR API KEY HERE',
})(MapContainer);
