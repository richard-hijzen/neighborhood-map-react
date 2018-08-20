import React, {Component} from 'react';
import '../styles/App.css';
import NavSearch from './NavSearch'

class LocationList extends Component {
  /* handleKeyPress when the user press enter in the list view location */
  handleKeyPress(event) {
    if (event.charCode === 13) {
      this.props.update_selected_item(event.target.textContent.trim())
    }
  }
/* ====/ Render start /====*/
  render() {
    return (
      
      <div className={this.props.condition ? "LocationList-container" : "toggled" } role="main">

      <NavSearch updateQuery={this.props.updateQuery} />
       
      <ul className="locationList" tabIndex="0" aria-label="location list"> {
        this.props.Locations.map((location, index) => (
          <li 
            tabIndex="0" 
            aria-label={"View Details for " + location.title}
            key={index}
            onClick = {(event) => this.props.update_selected_item(event.target.textContent.trim())}
            onKeyPress = { (event) => this.handleKeyPress(event)}>
            {location.title} 
          </li>))}
        </ul >
      </div>
    )
    }
}
export default LocationList;
