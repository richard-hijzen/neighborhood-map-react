import React, {Component} from 'react';
import './styles/App.css';
import Map from './Components/Map' // import the Map component
import {Locations} from './Components/locations' // import the locations.js file that have the all location data
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import LocationList from './Components/LocationList' // import LocationList Component
import ErrorBoundary from './ErrorBoundary'

class App extends Component {

// create a query, selectedItem for the search
  state = {
    location_query: '',
    item_select: '',
    condition: 'LocationList-container',
    mapCondition: 'map-container'
  }
//  this method will send to locationList Component
  updateQuery = (location_query) => {
    this.setState({location_query: location_query})
  }
//  this method for when the user choose one item from the list
  update_selected_item = (item) => {
    this.setState({item_select: item})
  };

  handleClick = () => {
    this.setState({
      condition: !this.state.condition,
      mapCondition: !this.state.mapCondition
    })
  }


/* ===/ Start Render /=== */
  render() {
    
    let show_locations // this variable is for check if the search is working or not
    // This is for search into the locations list
    if (this.state.location_query) {
      const match = new RegExp(escapeRegExp(this.state.location_query), 'i')
      show_locations = Locations.filter((location) => match.test(location.title))
    } else {
      show_locations = Locations
    }
    show_locations.sort(sortBy('title'))
    return (
      // the app is running
    <div className="App" >
      <header className="App-header" role="banner">
        <a id="menu" className="headerMenu" onClick={this.handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
            </svg>
        </a>
        <h1 className="App-title">My favourite places in Rotterdam</h1>
      </header>
      {
        // Run the  & send informtion to the Components
      }
      <ErrorBoundary>
      <Map 
        Locations={show_locations} 
        item_select={this.state.item_select}
        mapCondition={this.state.mapCondition} />
      </ErrorBoundary>
      <LocationList 
        Locations={show_locations} 
        updateQuery={this.updateQuery} 
        update_selected_item={this.update_selected_item}
        condition={this.state.condition}/>
      </div>);
    }
}

export default App;

