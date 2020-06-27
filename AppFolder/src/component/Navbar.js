import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { getToken, clearToken, clearCart } from "../utils";
import { withRouter } from "react-router-dom";

class Mynav extends React.Component {
  handleSignout = () => {
    clearCart();
    clearToken();
    this.props.history.push("/");
  };

  render() {
    return getToken() !== null ? (
      <AuthNav handleSignout={this.handleSignout} />
    ) : (
      <UnAuthMynav />
    );
  }
}

const AuthNav = ({ handleSignout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">React-Store</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/checkout">Checkout</Nav.Link>
          <Button onClick={handleSignout}>Sign Out</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const UnAuthMynav = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">React-Store</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/signin">Sign In</Nav.Link>
          <Nav.Link href="/signup">Sign Up</Nav.Link>
          <Nav.Link href="/checkout">Cart</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(Mynav);
