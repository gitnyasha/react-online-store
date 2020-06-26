import React from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    toast: false,
    toastMessage: "",
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all fields");
    }
  };

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  showToast = (toastMessage) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            Sign Up
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Control
                  id="username"
                  name="username"
                  type="username"
                  placeholder="username"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Signup;
