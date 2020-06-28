import React from "react";
import "./App.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import Loader from "./Loader";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends React.Component {
  state = {
    brands: [],
    // cartItems: [],
    loadingBrands: true,
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
            }
          `,
        },
      });
      this.setState({ brands: response.data.brands, loadingBrands: false });
      // console.log(response);
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrands: false });
    }
  }

  handleChange = (event) => {
    console.log(event);
  };

  render() {
    const { brands, loadingBrands } = this.state;

    return (
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col>1 of 3</Col>
          <Col xs={6}>
            <Form inline>
              <FormControl
                id="searchField"
                accessibilitylabel="Brands Search Field"
                onChange={this.handleChange}
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Col>
          <Col>3 of 3</Col>
        </Row>
        <Row>
          <Col sm={3}>Catgories</Col>
          <Col sm={9} style={{ display: "flex" }}>
            {brands.map((brand) => (
              <Card style={{ width: "24%", margin: "5px" }} key={brand._id}>
                <Card.Img
                  height={200}
                  width={200}
                  variant="top"
                  src={`${apiUrl}${brand.image.url}`}
                />
                <Card.Body>
                  <Card.Link href={`/${brand._id}`}>{brand.name}</Card.Link>
                  <Card.Text>{brand.descriptipn}</Card.Text>
                  <Button variant="primary">Add To Cart</Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        {/* <Spinner show={loadingBrands} accessibilitylabel="Loading Spinner" /> */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
