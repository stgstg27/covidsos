import React, {Component} from 'react';
import {withRouter} from "react-router";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Form, FormGroup, Label, Input, FormText
} from "reactstrap";
import Header from "../components/Headers/Header.js";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import {makeApiCall} from "utils/utils";
import config from 'config/config';

class TaskStatusUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      task: {},
      status: '',
      feedback: ''
    }
  }

  componentDidMount() {
      const {match: {params: {uuid}}} = this.props;

      makeApiCall(config.requestAcceptance, 'GET', {uuid}, (response) => {
        console.log(response);
        this.setState({
          task: response[0]
        })

      }, false, (data) => {
        console.log(data);
      });
  }


  closeTask = () => {
    const {match: {params: {uuid}}} = this.props;
    const { status, feedback } = this.state;

    makeApiCall(config.volUpdateRequest, 'POST', {
      request_uuid: uuid,
      status: status,
      status_message: feedback
    }, (response) => {
      this.props.history.push("/taskboard");
    }, false, (data) => {
      console.log(data);
    });
  }

  render() {
    const { task, step, status, feedback } = this.state;
    const { what, why, request_address, urgent, name } = task;

    return (
        <>
          <Header showCards={false}/>
          {/* Page content */}
          <Container className="mt--7" fluid>
            <Row className="justify-content-center">
              <Col lg="8" md="8">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-3 py-lg-3 text-justify">
                    <div className="text-uppercase text-center mt-2 mb-2">
                      Task Details
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          {
              step == 0 && (
                <Container className="request-card-container" fluid>
                <Row>
                  <Col sm="12">
                    <Card className='task-card task-card-status-update task-container content--center'>
                        <CardBody>
                            <h2>{name} - needs your help!</h2>
                            {
                              urgent == 'yes' && (
                                <Badge color="warning" className="margin-bottom-10">
                                  This is urgent request
                                </Badge>
                              )
                            }

                            <div className='margin-bottom-10'>
                                <p className='no-margin label'>Address</p>
                                <p className='no-margin'>{request_address}</p>
                            </div>
{/*
                            <div className='margin-bottom-10'>
                                <p className='no-margin label'>Mobile Number</p>
                                <p className='no-margin'>+91 - 9550111665</p>
                            </div> */}

                            <div className='margin-bottom-10'>
                                <p className='no-margin label'>Reason</p>
                                <p className='no-margin'>{why}</p>
                            </div>

                            <div className='margin-bottom-10'>
                                <p className='no-margin label'>Help required on</p>
                                <p>{what}</p>
                            </div>

                            <div>
                                <Button color="primary" block onClick={() => this.setState({step: 1}) }>Update Status</Button>
                            </div>
                        </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )
          }

           {
              step == 1 && (
                <Container className="request-card-container" fluid>
                <Row>
                  <Col sm="12">
                    <Card className='task-card task-card-status-update task-container content--center'>
                        <CardBody>
                            <h2>{name} - needs your help!</h2>
                            {
                              urgent == 'yes' && (
                                <Badge color="warning" className="margin-bottom-10">
                                  This is urgent request
                                </Badge>
                              )
                            }

                            <Form>
                                <FormGroup>
                                    <Label>Update Status</Label>
                                    <Button
                                        outline={status != 'completed'}
                                        color={status == 'completed' ? "success" : 'secondary' }
                                        block
                                        onClick={() => this.setState({ status: 'completed' })}
                                    >Yes, Task completed</Button>
                                    <Button
                                        outline={status != 'cancelled'}
                                        color={status == 'cancelled' ? "danger" : 'secondary' }
                                        block
                                        onClick={() => this.setState({ status: 'cancelled' })}
                                    >Can not complete</Button>
                                </FormGroup>

                                <FormGroup>
                                    <Label>What is your feedback for user?</Label>
                                    <Input
                                      autoComplete="off"
                                      type="textarea"
                                      name="feedback"
                                      placeholder="Add your feedback"
                                      value={feedback}
                                      onChange={(event) => this.setState({ feedback: event.target.value })}
                                    />
                                </FormGroup>
                            </Form>


                            <div>
                                <Button color="primary" onClick={() => this.closeTask() }>Close Task</Button>
                            </div>
                        </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )
          }
        </>
    )
  }
}

export default withRouter(TaskStatusUpdate);