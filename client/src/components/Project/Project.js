import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import './Project.css';

const cardTitle = <span style={{color: "#FFFFFF"}}>Hotplate Forum</span>;

class Project extends Component {

  render() {
    if (this.props.userToken) {
      return <Redirect to="/" />
    }
    return (
      <Container>
        <Row className="ProjectFormInputRow">
          <Col s={3}/>  
          <Col s={6}>
            <Row>
              <Card className='grey darken-4' textClassName='white-text' title={cardTitle} actions={[<a href='https://github.com/teamhotplate/hotplate-artifacts/archive/master.zip'>Download Project</a>]}>
                A template designed by Hotplate to show how our site works
              </Card>
            </Row>
          </Col>
          <Col s={3}/> 
        </Row>
      </Container>
    );
  }
}

export default Project;