import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import './Project.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      gitUri: "",
      gitBranch: "",
      templates: [],
      params: [],
      status: null
    };
  }
  async componentDidMount() {
    const getUrl = `/api/projects?n=${this.props.match.params.projectName}`;
    try {
      const response = await axios.get(getUrl);
      const projectData = response.data;
      console.log(JSON.stringify(projectData));

      const paramsWithValueField = projectData.params.map((param) => {
        param['value'] = "";
        return param;
      });

      this.setState({
        id: projectData._id,
        name: projectData.name,
        description: projectData.description,
        gitUri: projectData.gitUri,
        gitBranch: projectData.gitBranch,
        params: paramsWithValueField,
        templates: projectData.templates
      });

      console.log(JSON.stringify(this.state));
    } catch(error) {
      console.error(error);
    }
  }

  handleFormUpdate = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    console.log(`Updated state from form: ${JSON.stringify(this.state)}`);
  }

  handleTemplateChange = (idx) => (event) => {
    const newTemplates = this.state.templates.map((template, templateIdx) => {
      if (idx !== templateIdx) return template;
      return { ...template, filePath: event.target.value };
    });

    this.setState({ templates: newTemplates });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Form submitted: ${JSON.stringify(this.state)}`);
  }

  handleAddTemplate = () => {
    this.setState({
      templates: this.state.templates.concat([{ filePath: '' }])
    });
  }

  handleRemoveTemplate = (idx) => () => {
    this.setState({
      templates: this.state.templates.filter((template, templateIdx) => idx !== templateIdx)
    });
  }

  handleProjectParamChange = (idx) => (event) => {
    const newParams = this.state.params.map((projectParam, projectParamIdx) => {
      if (idx !== projectParamIdx) return projectParam;
      return { ...projectParam, value: event.target.value };
    });
    this.setState({ params: newParams });
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const bundleData = {};
    const bundleInputs = this.state.params.map((param) => {
      return {
        inputName: param.name,
        inputValue: param.value,
        inputType: param.paramType
      };
    });
    bundleData['inputs'] = bundleInputs;
    bundleData['project'] = this.state.id;
    console.log(`Submitting bundle request, with bundle data: ${JSON.stringify(bundleData)}`);
    this.setState({
      status: "Building bundle.. please stand by.."
    });
    const newBundleUrl = '/api/bundles';
    const response = await axios.post(newBundleUrl, bundleData);
    this.setState({
      status: <span> Your bundle is ready for download: <a href={response.data.downloadUrl}>Link</a></span>
    });
    console.log(`Got response: ${JSON.stringify(response)}`);
  }

  handleRemoveProjectParam = (idx) => () => {
    this.setState({
      params: this.state.params.filter((projectParam, projectParamIdx) => idx !== projectParamIdx)
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col s={12}>
            <h5>Project Properties</h5>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Row>
              <Col s={2} className="left-align">
                <span>Project name:</span>
              </Col>
              <Col s={8}>
                <span>{this.state.name}</span>
              </Col>
            </Row>
            <Row>
              <Col s={2} className="left-align">
                <span>Description:</span>
              </Col>
              <Col s={8}>
                <span>{this.state.description}</span>
              </Col>
            </Row>
            <Row>
              <Col s={2} className="left-align">
                <span>GIT URI:</span>
              </Col>
              <Col s={8}>
                <span>{this.state.gitUri}</span>
              </Col>
            </Row>
            <Row>
              <Col s={2} className="left-align">
                <span>GIT Branch / Tag:</span>
              </Col>
              <Col s={8}>
                <span>{this.state.gitBranch}</span>
              </Col>
            </Row>
            <Row>

              {/*Parameters Form*/}
              <Col s={4}>
                <Row>
                  <Col s={12}>
                    <h5>Parameters</h5>
                  </Col>
                </Row>
                <form onSubmit={this.handleFormSubmit}>
                  {this.state.params.map((projectParam, idx) => (
                    <Row key={projectParam._id}>
                      <Col s={12} >
                        <div className="projectparam-input" >
                          <label htmlFor={`param-input-${idx}`}>{projectParam.description}</label>
                          <input
                            id={`param-input-${idx}`}
                            type="text"
                            placeholder={projectParam.name}
                            value={projectParam.value}
                            onChange={this.handleProjectParamChange(idx)}
                          />
                        </div>
                      </Col>
                    </Row>
                  ))}
                  <Row>
                    <Col s={12}>
                      <button type="submit" className="small">Make Bundle</button>
                    </Col>
                  </Row>
                </form>
                <Row>
                  <Col s={12}>
                    { this.state.status ? <span className="makebundle-status-msg">{ this.state.status }</span> : ""}
                  </Col>
                </Row>
              </Col>

              <Col s={4} />

              {/* Templates Form */}
              <Col s={4}>
                <Row>
                  <Col s={12}>
                    <h5>Templates</h5>
                  </Col>
                </Row>
                {this.state.templates.map((template, idx) => (
                  <Row key={template._id}>
                    <Col s={12}>
                      <div className="template-detail">
                        <span>-&nbsp;{template.filePath}</span>
                      </div>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Project;