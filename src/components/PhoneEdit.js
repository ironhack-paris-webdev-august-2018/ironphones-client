import React from "react";
import { Redirect } from "react-router-dom";

import api from "../api.js";

class PhoneEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: "",
      brand: "",
      image: "",
      specs: [],
      isSubmitSuccess: false,
    };
  }

  // called automatically by React when the COMPONENT LOADS
  componentDidMount() {
    const { params } = this.props.match;

    // make the request to the API as soon as the component loads
    api.get(`/phones/${params.phoneId}`)
      .then(response => {
        console.log("Phone EDIT ☎", response.data);
        // when we get the data back setState() to update
        this.setState(response.data);
      })
      .catch(err => {
        console.log(err);
        alert("Sorry! Something went wrong. 💩");
      });
  }

  updateModel(event) {
    const { value } = event.target;
    this.setState({ model: value });
  }

  updateBrand(event) {
    const { value } = event.target;
    this.setState({ brand: value });
  }

  updateImage(event) {
    const { value } = event.target;
    this.setState({ image: value });
  }

  updateSpecs(event, index) {
    const { specs } = this.state;
    const { value } = event.target;
    // update the spec value at the correct index
    specs[index] = value;
    // set the state with the updated specs array
    this.setState({ specs });
  }

  addSpec(event) {
    // stop the "+ Spec" button from accidentally submitting the form
    event.preventDefault();

    const { specs } = this.state;
    // push a new empty spec into the specs array
    specs.push("");
    // set the state with the updated specs array
    this.setState({ specs });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { params } = this.props.match;

    // PUT and POST requests receive a 2nd argument: the data to submit
    // (here we are submitting the state we've gathered in the form)
    api.put(`/phones/${params.phoneId}`, this.state)
      .then(response => {
        console.log("Phone PUT", response.data);
        this.setState({ isSubmitSuccess: true });
      })
      .catch(err => {
        console.log(err);
        alert("Sorry! Something went wrong. 💩");
      });
  }

  render() {
    const { isSubmitSuccess, model, brand, image, specs } = this.state;

    if (isSubmitSuccess) {
      // redirect back to the phone details page if the submission worked!
      const { params } = this.props.match;
      return <Redirect to={`/phone-details/${params.phoneId}`} />
    }

    return (
      <section>
        <h2>Phone Edit</h2>

        <form onSubmit={event => this.handleSubmit(event)}>
          <label>
            Model: <input type="text" value={model}
                onChange={event => this.updateModel(event)} />
          </label>

          <label>
            Brand: <input type="text" value={brand}
                onChange={event => this.updateBrand(event)} />
          </label>

          <label>
            Image URL: <input type="url" value={image}
                onChange={event => this.updateImage(event)}/>
          </label>

          <h3>Specs</h3>
          <p>5 characters or more</p>
          {specs.map((oneSpec, index) =>
            <input key={index} type="text" value={oneSpec}
                onChange={event => this.updateSpecs(event, index)} />
          )}
          <button onClick={event => this.addSpec(event)}>+ Spec</button>

          <button>Save Changes</button>
        </form>
      </section>
    );
  }
}

export default PhoneEdit;
