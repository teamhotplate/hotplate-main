import React, { Component } from 'react';
import { Container } from 'react-materialize';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

import './SearchResults.css';
// import '../../css/full-width.css';

class SearchResults extends Component {

  render() {
    let show = "";

    if(!this.props.show) {
      show = null;
    } else {

      show = (
        <div className="search-results search-results-theme">
          <Container>
            <table className="highlight">
              <tbody>
                {this.props.searchResults.map((project) => {
                  return (
                    <tr key={project._id} className="search-results-table-dark">
                      <td className="results-text center-align"><Link to={"/p/" + project.name}>{project.name}</Link></td>
                      <td className="center-align grey-text">{project.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Container>
        </div>
      )
    }

      return (show);
  }
}

SearchResults.propTypes = {
  show: PropTypes.bool,
  children:PropTypes.node
};

export default SearchResults;