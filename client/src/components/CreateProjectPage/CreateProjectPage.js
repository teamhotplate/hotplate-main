import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import './CreateProjectPage.css';

class CreateProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      gitUri: "",
      gitBranch: "",
      templates: [],
      projectParams: []
    };
  }

  handleFormUpdate = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    console.log(`Updated state from form: ${JSON.stringify(this.state)}`);
  }

  // handleFormUpdate = (event) => {
  //   const { name, value } = event.target;
  //   const newParams = this.state.projectParams.map((param) => {
  //     console.log(`Finding param ${name} in list. Current: ${param.name}`);
  //     if (param.name === name) {
  //       console.log(`Found param ${name} in list. Updating value to ${value}`);
  //       param['value'] = value;
  //     }
  //     return param;
  //   });
  //   console.log(JSON.stringify(newParams));
  //   this.setState({
  //     projectParams: newParams
  //   });
  //   console.log(`New project state: ${JSON.stringify(this.state)}`);
  // }

  // getParamValue = (paramName) => {
  //   console.log(`Getting parameter value for: ${paramName}`);
  //   const targetParam = this.state.projectParams.filter((param) => {
  //     console.log(`Finding param in list. Current: ${JSON.stringify(param)}`);
  //     if (param.name === paramName) {
  //       console.log(`Found param in list.`);
  //       return true;
  //     } else {
  //       console.log(`Not the right param. Filtering.`);
  //       return false;
  //     }
  //   })[0];
  //   console.log(`Target param is now: ${JSON.stringify(targetParam)}`);
  //   const paramValue = targetParam ? targetParam.value : "";
  //   return paramValue;
  // }

  // handleFormSubmit = (event) => {
  //   event.preventDefault();
  //   // this.getBundle();
  // }

  // getBundle = async () => {
  //   const makeBundleUrl = `/api/projects/${this.state.id}?render=true`;
  //   console.log(`Getting bundle. URL: ${makeBundleUrl}`);
  //   try {
  //     const response = await axios.get(makeBundleUrl);
  //     const downloadUrl = response.data.downloadUrl;
  //     setTimeout(() => {
  //       window.open(downloadUrl);
  //     }, 0);
  //     console.log(JSON.stringify(response));
  //   } catch(error) {
  //     console.error(error);
  //   }
  // }


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
    const newProjectParams = this.state.projectParams.map((projectParam, projectParamIdx) => {
      if (idx !== projectParamIdx) return projectParam;
      console.log(`Updating projectparams. event.target.name: ${JSON.stringify(event.target.name)} event.target.value: ${JSON.stringify(event.target.value)}}`);
      switch (event.target.name) {
        case 'paramName':
          projectParam['name'] = event.target.value;
          break;
        case 'paramDescription':
          projectParam['description'] = event.target.value;
          break;
        default:
          console.error('Unrecognized form input.');
      }
      return projectParam;
    });

    this.setState({ projectParams: newProjectParams });
  }

  handleAddProjectParam = () => {
    this.setState({
      projectParams: this.state.projectParams.concat([{ name: '', description: '' }])
    });
  }

  handleRemoveProjectParam = (idx) => () => {
    this.setState({
      projectParams: this.state.projectParams.filter((projectParam, projectParamIdx) => idx !== projectParamIdx)
    });
  }

  render() {
    return (
      <Container>
        <Row className="create-project-title">
          <Col s={12} className="center-align">
            <h4>Create a Project</h4>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <h5>Project Properties</h5>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Col s={12} className="input-field">
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    className="validate"
                    value={this.state.name}
                    onChange={this.handleFormUpdate}
                  />
                  <label htmlFor="name">Project name (required)</label>
                </Col>
              </Row>
              <Row>
                <Col s={12} className="input-field">
                  <input 
                    id="description"
                    name="description"
                    type="text"
                    className="validate"
                    value={this.state.description}
                    onChange={this.handleFormUpdate}
                  />
                  <label htmlFor="description">Project description (required)</label>
                </Col>
              </Row>
              <Row>
                <Col s={12} className="input-field">
                  <input 
                    id="gitUri"
                    name="gitUri"
                    type="text"
                    className="validate"
                    value={this.state.gitUri}
                    onChange={this.handleFormUpdate}
                  />
                  <label htmlFor="gitUri">Git URI (HTTPS) for the project source (required)</label>
                </Col>
              </Row>
              <Row>
                <Col s={12} className="input-field">
                  <input 
                    id="gitBranch"
                    name="gitBranch"
                    type="text"
                    className="validate"
                    value={this.state.gitBranch}
                    onChange={this.handleFormUpdate}
                  />
                  <label htmlFor="gitBranch">Git Branch or Tag name for the project source (required)</label>
                </Col>
              </Row>
              <Row>
                <Col s={6}>
                  <Row>
                    <Col s={12}>
                      <h5>Templates</h5>
                    </Col>
                  </Row>
                {this.state.templates.map((template, idx) => (
                  <Row>
                    <Col s={9}>
                      <div className="template-input">
                        <input
                          type="text"
                          placeholder={`Template #${idx + 1} file path`}
                          value={template.filePath}
                          onChange={this.handleTemplateChange(idx)}
                        />
                      </div>
                    </Col>
                    <Col s={3}>
                      <div className="template-remove-button">
                        <button type="button" onClick={this.handleRemoveTemplate(idx)} className="small">-</button>
                      </div>
                    </Col>
                  </Row>
                ))}
                  <Row>
                    <Col s={12}>
                      <button type="button" onClick={this.handleAddTemplate} className="small">+</button>
                    </Col>
                  </Row>
                </Col>
                <Col s={6}>
                  <Row>
                    <Col s={12}>
                      <h5>Parameters</h5>
                    </Col>
                  </Row>
                  {this.state.projectParams.map((projectParam, idx) => (
                  <Row>
                    <Col s={9}>
                      <div className="projectparam-input">
                        <input
                          name="paramName"
                          type="text"
                          placeholder={`Parameter #${idx + 1} name`}
                          value={projectParam.paramName}
                          onChange={this.handleProjectParamChange(idx)}
                        />
                        <input
                          name="paramDescription"
                          type="text"
                          placeholder={`Parameter #${idx + 1} description`}
                          value={projectParam.paramDescription}
                          onChange={this.handleProjectParamChange(idx)}
                        />
                      </div>
                    </Col>
                    <Col s={3}>
                      <div className="projectparam-remove-button">
                        <button type="button" onClick={this.handleRemoveProjectParam(idx)} className="small">-</button>
                      </div>
                    </Col>
                  </Row>
                ))}
                  <Row>
                    <Col s={12}>
                      <button type="button" onClick={this.handleAddProjectParam} className="small">+</button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col s={12}>
                  <button>Create Project</button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
    )
  }

  // render() {
  //   return (
  //     <Container>

  //       <div className="create-project-form">
  //         <form onSubmit={this.handleFormSubmit}>

  //           <Row>
  //             <Col s={12} className="input-field">
  //               <input 
  //                 id="templateList"
  //                 name="templateList"
  //                 type="text"
  //                 className="validate"
  //                 value={this.getParamValue("templateList")}
  //                 onChange={this.handleFormUpdate}
  //               />
  //               <label htmlFor="templateList">List of template file paths within the repo (comma-separated)</label>
  //             </Col>
  //           </Row>
  //           <Row>
  //             <Col s={12} className="input-field">
  //               <input 
  //                 id="paramList"
  //                 name="paramList"
  //                 type="text"
  //                 className="validate"
  //                 value={this.getParamValue("paramList")}
  //                 onChange={this.handleFormUpdate}
  //               />
  //               <label htmlFor="paramList">List of project parameter names (comma-separated)</label>
  //             </Col>
  //           </Row>
  //           <Row>
  //             <Col s={12}>
  //               <button
  //                 className="btn-small waves-effect waves-light pink lighten-5 black-text"
  //                 type="submit"
  //                 name="action">
  //                 Generate
  //                 <i className="material-icons right" />
  //               </button>
  //             </Col>
  //           </Row>
  //         </form>
  //       </div>
  //     </Container>
  //   );
  // }
}

export default CreateProjectPage;