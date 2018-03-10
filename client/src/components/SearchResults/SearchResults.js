import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';
import { Link } from 'react-router-dom';

import './SearchResults.css';

class SearchResults extends Component {

  render() {
    return (
      <div className="search-results">
        <Container>
          <Row>
            <Col s={12}>
              <table className="striped">
                <tbody>
                  {this.props.searchResults.map((project) => {
                    return (
                      <tr key={project._id}>
                        <td><Link to={"/p/" + project.name}>{project.name}</Link></td>
                        <td className="center-align">{project.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SearchResults;