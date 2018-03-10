import axios from 'axios';
import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

import './ParamsForm.css';

class ParamsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: ""
    };
  }
  componentDidMount() {
    this.setState({
      projectId: this.props.projectId
    });
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const getUrl = `/api/projects/${this.state.projectId}`;
    const response = await axios.get(getUrl);
    console.log(JSON.stringify(response));
  }

  render() {
    return (
      
    );
  }
}

export default ParamsForm;