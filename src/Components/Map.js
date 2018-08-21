import React, {Component} from 'react';
import scriptLoader from 'react-async-script-loader';
import mapConfig from '../mapConfig'

class Map extends Component {

  state = {
    map: {},
    successfulMapLoaded: true,
    markers: [],
    allInfoWindow: []
  }
  /* ====/ Google API Map/====*/
  /* In componentWillReceiveProps: recive the google map API & check if  was Succeed then setting and load the map*/
  componentWillReceiveProps = ({isScriptLoaded, isScriptLoadSucceed}) => {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        this.google_map_api_load();
      } else {
        this.google_map_api_Not_loading();
      }
    }
  }

  google_map_api_load = ()=>{
    console.log("map has been load"); // message for check if the map is work
    // create a map & location (on that location is Jeddah City)
    const map_load = new window.google.maps.Map(document.getElementById('map'), {
      initialCenter: {
        lat: 51.9225,
        lng: 4.47917
      },
        zoom: mapConfig.zoom,
        styles: mapConfig.styles,
        mapTypeControl: mapConfig.mapTypeControl
    });
    this.setState({map: map_load});
  }

  google_map_api_Not_loading=()=>{
    console.log("erorr when map is load"); // message for check if the map is not loading
    this.setState({successfulMapLoaded: false});
  }
  /* ============/ MARKER /============*/
  /* In componentDidUpdate: I create markers & information window for the location */
  componentDidUpdate = (successfulMapLoaded) => {
    if(successfulMapLoaded) {
      this.CreateMarker();
    }
  }

  CreateMarker =()=>{
    let position,title,marker;
    let self = this; // ?
    const Locations = this.props.Locations; // recive the all locations properties
    let infoWindow = new window.google.maps.InfoWindow({
      maxWidth: 300
    }); // information window when the user press to the place icon in the map
    var bounds = new window.google.maps.LatLngBounds(); // ?


    if (this.state.successfulMapLoaded) {
      this.clearLocationMarker(); // clear the marker function
      this.clearInfoWindow(); // clear the inforwindo function
      // loop that show the marker into the map
      for (let i = 0; i < Locations.length; i++) {
        let myIcon = require('../mapsicon.png');
        position = Locations[i].coordinates;
        title = Locations[i].title;

        const pref = {
          map: this.state.map, 
          position: position, 
          title: title, 
          animation: window.google.maps.Animation.DROP,
          id: i,
          icon: myIcon,
        }

        marker = new window.google.maps.Marker(pref);

        // here for showing the places information when the user press the icon
        marker.addListener('click', function() {
          var data =  Locations[i].infoWindowData ? Locations[i].infoWindowData : "sorry there are no data";
          self.markerInfoWindow(this, infoWindow, data);
        });

        this.state.markers.push(marker); // push marker icon into the place
        bounds.extend(marker.position);
      }

      this.state.map.fitBounds(bounds); // ?

      if (this.props.item_select) {
        this.openSelectedInfoWindow(infoWindow);
      }
    }
  }

  /* in markerInfoWidow set infowindow and data for specific marker */
  markerInfoWindow = (marker, infoWindow, data) => {
    this.clearInfoWindow();
    this.markerAnimation(marker);
    this.setContentInfoWindow(marker, infoWindow, data);
  }


  /* make marker animation */
  markerAnimation = (marker) => {
    if (marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        // set the animtion
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 2000);
      }
    }
  }

  /* ====/ Search /==== */
  clearSearchArray = (array) => {
    while (array.length > 0) {
      array.pop();
    }
  }

  /* close all opened InfoWindow and clear the InfoWindow array */
  clearInfoWindow = () => {
    for (let infoWindow of this.state.allInfoWindow) {
      infoWindow.close();
    }
    this.clearSearchArray(this.state.allInfoWindow)
  }

  clearLocationMarker = () => {
  for (let marker of this.state.markers) {
    marker.setMap(null);
  }
  this.clearSearchArray(this.state.markers)
}


  /* make the content of the InfoWindow */
  setContentInfoWindow = (marker, infoWindow) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker !== marker) {

      let { map } = this.state;
      infoWindow.marker = marker;
      infoWindow.setContent('Loading...');
      //Request related TIPs and Photos by Foursquare API
      let venueId = null;
      let tipsList = null;
      fetch(`https://api.foursquare.com/v2/venues/search?ll=51.9225,4.47917&v=20180518&query=${infoWindow.marker.title}&limit=1&client_id=U4YUOYV0A5WWXFYZ3TC5GJNB5ZSWFZZOOAPM5NDHKARURQKF&client_secret=1H0YT33Z3NLJZC0BYNHM3FY35TYKI5NDZN2GBW2AG3CC5BRS`)
          .then(response => response.json())
          .then(data => {
            venueId = data.response.venues[0].id;
            return fetch(`https://api.foursquare.com/v2/venues/${venueId}/tips?v=20180518&limit=4&client_id=U4YUOYV0A5WWXFYZ3TC5GJNB5ZSWFZZOOAPM5NDHKARURQKF&client_secret=1H0YT33Z3NLJZC0BYNHM3FY35TYKI5NDZN2GBW2AG3CC5BRS`);
          })
          .then(response => response.json())
          .then(dataTips => {
            tipsList = dataTips;
            return fetch(`https://api.foursquare.com/v2/venues/${venueId}/photos?v=20180518&limit=2&client_id=U4YUOYV0A5WWXFYZ3TC5GJNB5ZSWFZZOOAPM5NDHKARURQKF&client_secret=1H0YT33Z3NLJZC0BYNHM3FY35TYKI5NDZN2GBW2AG3CC5BRS`);
          })
          .then(response => response.json())
          .then(dataPhotos => addVenuesInfos(tipsList, dataPhotos))
          .catch(err => requestError(err, 'Foursquare'));

          //if sucess in Request
          function addVenuesInfos(tipsList, dataPhotos) {
            let htmlResult = '';
            
            if (tipsList && tipsList.response.tips.items) {
              const tipsData = tipsList.response.tips.items;
              const photosData = dataPhotos.response.photos.items;
                htmlResult = '<div class="infowindow-content"><h4>' + marker.title + '</h4>';
                
                //Photos
                htmlResult += '<h6> Some Photos </h6> <div id="photos-places">';
                for(let i = 0; i < photosData.length; i++) {
                  const photo = photosData[i];
                  htmlResult += `<img alt="${marker.title}, photo ${i + 1} by a visitor" style="width: 30%; margin-right: 5px;" src="${photo.prefix}150x150${photo.suffix}" />`;
                }

                //Tips
                htmlResult += '</div><h6> Some Tips </h6> <ul id="tips-places">';
                tipsData.forEach( tip => {
                  htmlResult += '<li>' + tip.text + ' - ♥ ' + tip.likes.count + ' </li>';
                })
                htmlResult += '</ul><p style="float: right; padding-right: 10px;"><i><small>provided by Foursquare</small></i></p> </div>';
            } else {
                htmlResult = '<p class="network-warning">Unfortunately, no <i>TIPs</i> was returned for your search.</p>';
            }
            infoWindow.setContent(htmlResult);
          }
          //if Error in Request
          function requestError(err, part) {
            console.log(err);
            infoWindow.setContent(`<p class="network-warning">Oeps! There was an error making a request for the ${part}.</p>`);
          }            


    // Open the infowindow on the correct marker.
    
    infoWindow.open(map, marker);
    map.panTo(marker.getPosition());

  }
    this.state.allInfoWindow.push(infoWindow);
  }
  /*  open the Infowindow window when click on the list view */
    openSelectedInfoWindow = (infoWindow) => {
      // filter between the selectedItem
      let selectedMarker =  this.state.markers.filter((marker)=>{
          return marker.title === this.props.item_select
      })

      // filter between the locations
      let selectedLocation =  this.props.Locations.filter((location)=>{
        return location.title === this.props.item_select
      })
      // check the marker and location value
      if(selectedMarker && selectedMarker[0] && selectedLocation && selectedLocation[0]){
        var data =  selectedLocation[0].infoWindowData ? selectedLocation[0].infoWindowData :"sorry there are no data";
        this.markerInfoWindow(selectedMarker[0], infoWindow, data);
        selectedMarker[0].setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          selectedMarker[0].setAnimation(null);
        }, 2000);
      }
    }

  render() {
    return (
      this.state.successfulMapLoaded
      ? (<div className={this.props.mapCondition ? "map-container" : "mapToggled" } id="map" role="application" tabIndex="-1" > </div>)
       : (<div className="mapError-container" role="application" tabIndex="-1" >Error  in loading map</div>))
  }
}

export default scriptLoader(["https://maps.googleapis.com/maps/api/js?key=AIzaSyAjxo5-hmmR5YxGHsZxCZR2ud3vNeZ_y-k&v=3"])(Map)
