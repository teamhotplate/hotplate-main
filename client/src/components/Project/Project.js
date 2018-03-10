import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import './Project.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      gitUri: "",
      gitBranch: "",
      projectParams: []
    };
  }

  async componentDidMount() {
    const getUrl = `/api/projects?n=${this.props.match.params.projectName}`;
    try {
      const response = await axios.get(getUrl);
      const projectData = response.data;
      console.log(JSON.stringify(projectData));
      this.setState({
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        gitUri: projectData.gitUri,
        gitBranch: projectData.gitBranch,
        projectParams: projectData.params
      });
      console.log(JSON.stringify(this.state));
    } catch(error) {
      console.error(error);
    }
  }

  render() {
    return (
      <Container>
        <Row className="project-title">
          <Col s={12} className="center-align">
            <h4>Project Detail</h4>
          </Col>
        </Row>
        <Row className="project-info">
          <Col s={12}>
            <Row>
              <Col s={6} className="center-align">
                <span>Project name</span>
              </Col>
              <Col s={6}>
                <span>{this.state.name}</span>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col s={6} className="center-align">
                <span>Description</span>
              </Col>
              <Col s={6}>
                <span>{this.state.description}</span>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col s={6} className="center-align">
                <span>GIT URI</span>
              </Col>
              <Col s={6}>
                <span>{this.state.gitUri}</span>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col s={6} className="center-align">
                <span>GIT Branch / Tag</span>
              </Col>
              <Col s={6}>
                <span>{this.state.gitBranch}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="project-params">
          <Col s={12} className="center-align">
            <h4>Project Parameters</h4>
          </Col>
        </Row>
        <div className="params-form">
          <form onSubmit={this.handleFormSubmit}>
            <Row>
              <Col s={12} className="input-field">
                <input 
                  id="primaryColor"
                  name="primaryColor"
                  type="text"
                  className="validate"
                  value=""
                  onChange=""
                />
                <label htmlFor="primaryColor">Primary Color (HTML Color Code)</label>
              </Col>
            </Row>
            <Row>
              <Col s={12}>
                <button
                  className="btn-small waves-effect waves-light red darken-4"
                  type="submit"
                  name="action">
                  Render
                  <i className="material-icons right" />
                </button>
              </Col>
            </Row>
          </form>
        </div>
      </Container>
    );
  }
}

export default Project;