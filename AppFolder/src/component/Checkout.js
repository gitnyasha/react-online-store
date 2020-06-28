import React from "react";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe,
} from "react-stripe-elements";
import {
  Container,
  Box,
  Heading,
  TextField,
  Text,
  Modal,
  Spinner,
  Button,
} from "gestalt";
import { withRouter } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { getCart, calculatePrice, clearCart, calculateAmount } from "../utils";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    orderProcessing: false,
    modal: false,
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async (event) => {
    event.preventDefault();
    if (this.isFormEmpty(this.state)) {
      return;
    }

    this.setState({ modal: true });
  };

  handleSubmitOrder = async () => {
    const { cartItems, city, address, postalCode } = this.state;

    const amount = calculateAmount(cartItems);

    this.setState({ orderProcessing: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      await Strapi.createEntry("orders", {
        amount,
        products: cartItems,
        city,
        postalCode,
        address,
        token,
      });
      this.setState({ orderProcessing: false, modal: false });
      clearCart();
      this.showToast("Your order has been successfully submitted");
    } catch (err) {
      this.setState({ orderProcessing: false, modal: false });
      this.showToast(err.message);
    }
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
  };

  closeModal = () => this.setState({ modal: false });

  render() {
    const { cartItems, modal, orderProcessing } = this.state;

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
              <Heading>Checkout</Heading>

              {cartItems.length > 0 ? (
                <React.Fragment>
                  <Box
                    marginBottom={6}
                    display="flex"
                    direction="column"
                    alignItems="center"
                  >
                    <Text>{cartItems.length} items for Checkout</Text>
                  </Box>
                  <Box>
                    {cartItems.map((item) => (
                      <Card key={item._id}>
                        <Card.Text>
                          {item.name} x {item.quantity} - $
                          {(item.quantity * item.price).toFixed(2)}
                        </Card.Text>
                      </Card>
                    ))}
                    <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
                  </Box>
                  <form
                    style={{
                      display: "inlineBlock",
                      textAlign: "center",
                      maxWidth: 450,
                    }}
                    onSubmit={this.handleConfirmOrder}
                  >
                    <Box
                      marginBottom={2}
                      display="flex"
                      direction="column"
                      alignItems="center"
                    >
                      <TextField
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Shipping Address"
                        onChange={this.handleChange}
                      />
                      <TextField
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        placeholder="Postal Code"
                        onChange={this.handleChange}
                      />
                      <TextField
                        id="city"
                        name="city"
                        type="text"
                        placeholder="City"
                        onChange={this.handleChange}
                      />

                      <TextField
                        id="confirmationEmailAddress"
                        name="confirmationEmailAddress"
                        type="email"
                        placeholder="Confirm Email"
                        onChange={this.handleChange}
                      />
                      <CardElement
                        id="stripe__input"
                        onReady={(input) => input.focus()}
                      />
                      <button id="stripe__button" type="submit">
                        Submit
                      </button>
                    </Box>
                  </form>
                </React.Fragment>
              ) : (
                <Box>
                  <Heading>No items in Cart</Heading>
                </Box>
              )}
            </Box>
          </Col>
        </Row>
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
      </Container>
    );
  }
}

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder,
}) => {
  return (
    <Modal
      accessibilityModalLabel="Confirm Your Order"
      accessibilityCloseLabel="close"
      heading="Confirm Your Order"
      onDismiss={closeModal}
      footer={
        <Box
          display="flex"
          marginRight={-1}
          marginLeft={-1}
          justifyContent="center"
        >
          <Button
            color="blue"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
            text="Submit"
          />

          <Button
            color="red"
            disabled={orderProcessing}
            onClick={closeModal}
            text="Cancel"
          />
        </Box>
      }
      role="alertdialog"
      size="sm"
    >
      {!orderProcessing && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
          padding={1}
        >
          {cartItems.map((item) => (
            <Card key={item._id}>
              <Card.Text>
                {item.name} x {item.quantity} - $
                {(item.quantity * item.price).toFixed(2)}
              </Card.Text>
            </Card>
          ))}
          <Card.Text>Total: ${calculatePrice(cartItems)}</Card.Text>
        </Box>
      )}

      <Spinner
        show={orderProcessing}
        accessibilityLabel="Order Processing Spinner"
      />
      {orderProcessing && <Text align="center">Submitting Order..</Text>}
    </Modal>
  );
};

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => {
  return (
    <StripeProvider apiKey="pk_test_InYvJtAT8cHEkDvBeuLy1Fxm005kPv2ALh">
      <Elements>
        <CheckoutForm />
      </Elements>
    </StripeProvider>
  );
};

export default Checkout;
