import React, {Component} from 'react';
import '../styles/App.css';

class NavSearch extends Component {
    render() {
        return(
            <div className="search-bar">
            <input type="text" tabIndex="0" placeholder="search" aria-label="search"
             onChange={(event) => this.props.updateQuery(event.target.value.trim())}/>
            </div>
        )
    }
}

export default NavSearch;