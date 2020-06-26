import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { calculatePrice, setCart, getCart } from "../utils";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Products extends React.Component {
  state = {
    products: [],
    brand: "",
    cartItems: [],
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
                brand(id: "${this.props.match.params.brandId}") {
                  _id
                  name
                  products {
                    _id
                    name
                    image {
                        url
                    }
                    price
                  }
                }
                }`,
        },
      });
      this.setState({
        products: response.data.brand.products,
        brand: response.data.brand.name,
        cartItems: getCart(),
      });
      // console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  addToCart = (product) => {
    const alreadyInCart = this.state.cartItems.findIndex(
      (item) => item._id === product._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...product,
        quantity: 1,
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = (itemToDeleteId) => {
    const filteredItems = this.state.cartItems.filter(
      (item) => item._id !== itemToDeleteId
    );

    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  render() {
    const { brand, products, cartItems } = this.state;
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col>{brand}</Col>
        </Row>
        <Row>
          <Col style={{ display: "flex" }}>
            {products.map((product) => (
              <Card style={{ width: "24%", margin: "5px" }} key={product._id}>
                <Card.Img
                  height={200}
                  width={200}
                  variant="top"
                  src={`${apiUrl}${product.image.url}`}
                />
                <Card.Body>
                  <Card.Link href={`/${product._id}`}>{product.name}</Card.Link>
                  <Card.Text>${product.price}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => this.addToCart(product)}
                  >
                    Add To Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <Card.Text>{cartItems.length} Items selected</Card.Text>

            {cartItems.map((item) => (
              <Card keys={item._id}>
                <Card.Text>
                  {item.name} x {item.quantity} - $
                  {(item.quantity * item.price).toFixed(2)}
                </Card.Text>
                <Button onClick={() => this.deleteItemFromCart(item._id)}>
                  X
                </Button>
              </Card>
            ))}
            <Card>
              <Card.Body>
                {cartItems.length === 0 && (
                  <Card.Text>No Items Found</Card.Text>
                )}
                <Card.Text>Total: ${calculatePrice(cartItems)}</Card.Text>
                <Card.Link href="/checkout">Checkout</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Products;
