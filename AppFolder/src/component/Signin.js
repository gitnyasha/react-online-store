import React from "react";
import { Container, Box, Button, Heading, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";
import { Row, Col } from "react-bootstrap";
import { setToken } from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337/";
const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false,
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill all fields");
      return;
    }

    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      console.log(response);
      this.redirectUser("/");
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  redirectUser = (path) => this.props.history.push(path);

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
  };

  showToast = (toastMessage) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };

  render() {
    const { toastMessage, toast, loading } = this.state;
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: "#ebe2da",
                },
              }}
              margin={4}
              padding={4}
              shape="rounded"
              display="flex"
              justifyContent="center"
            >
              <form
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450,
                }}
                onSubmit={this.handleSubmit}
              >
                <Box
                  marginBottom={2}
                  display="flex"
                  direction="column"
                  alignItems="center"
                >
                  <Heading>Sign In</Heading>
                  <TextField
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    onChange={this.handleChange}
                  />
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={this.handleChange}
                  />

                  <Button
                    inline
                    disabled={loading}
                    color="blue"
                    text="Submit"
                    type="submit"
                  />
                </Box>
              </form>
            </Box>
          </Col>
        </Row>

        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default Signin;
