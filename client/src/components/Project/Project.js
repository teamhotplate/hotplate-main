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
        id: projectData._id,
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

  handleParamUpdate = (event) => {
    const { name, value } = event.target;
    const newParams = this.state.projectParams.map((param) => {
      console.log(`Finding param ${name} in list. Current: ${param.name}`);
      if (param.name === name) {
        console.log(`Found param ${name} in list. Updating value to ${value}`);
        param['value'] = value;
      }
      return param;
    });
    console.log(JSON.stringify(newParams));
    this.setState({
      projectParams: newParams
    });
    console.log(`New project state: ${JSON.stringify(this.state)}`);
  }

  getParamValue = (paramName) => {
    console.log(`Getting parameter value for: ${paramName}`);
    const targetParam = this.state.projectParams.filter((param) => {
      console.log(`Finding param in list. Current: ${JSON.stringify(param)}`);
      if (param.name === paramName) {
        console.log(`Found param in list.`);
        return true;
      } else {
        console.log(`Not the right param. Filtering.`);
        return false;
      }
    })[0];
    console.log(`Target param is now: ${JSON.stringify(targetParam)}`);
    const paramValue = targetParam ? targetParam.value : "";
    return paramValue;
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.getBundle();
  }

  getBundle = async () => {
    const makeBundleUrl = `/api/projects/${this.state.id}?render=true`;
    console.log(`Getting bundle. URL: ${makeBundleUrl}`);
    try {
      const response = await axios.get(makeBundleUrl);
      const downloadUrl = response.data.downloadUrl;
      setTimeout(() => {
        window.open(downloadUrl);
      }, 0);
      console.log(JSON.stringify(response));
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
                  id="primarycolor"
                  name="primarycolor"
                  type="text"
                  className="validate"
                  value={this.getParamValue("primarycolor")}
                  onChange={this.handleParamUpdate}
                />
                <label htmlFor="primarycolor">Primary Color (HTML Color Code)</label>
              </Col>
            </Row>
            <Row>
              <Col s={12}>
                <button
                  className="btn-small waves-effect waves-light pink lighten-5 black-text"
                  type="submit"
                  name="action">
                  Generate
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