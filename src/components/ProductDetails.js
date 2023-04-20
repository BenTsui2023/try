import React, { useContext, useState } from 'react';
import { useLocation } from "react-router-dom"
import UserContext from '../context/user-context';
import axios from 'axios';
import '../css/ProductDetails.css';


const ProductDetails = () => {
  const context = useContext(UserContext);
  const { state } = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const API_URL = 'http://localhost:4000'
  const RENDER_URL = 'https://csis3380-final-project.onrender.com'

  const SubmitMeal = (e) => {
    //promt the user to enter a valid quantity and login
    if(quantity < 1){
      e.preventDefault();
      setMessage("Please order at least one meal");
    }
    else if (context.loggedInSucceed == false) {
      e.preventDefault();
      setMessage("Please log in to add items to your cart.");
      return;
    }
    //add the meals to the shopping cart and also update the database
    else {
      e.preventDefault();
      setMessage(`Product: ${state.mealName} added to your cart!`)

      //check whether the ordered meal is already ordered or not
      const itemIndex = context.cartItems.findIndex(
        (meal) => meal.mealId === state.mealId
      );

      //add the new meal to the cart if it does't exist in the cart
      if (itemIndex === -1) {
        context.changeCartItems([...context.cartItems, { mealName: state.mealName, quantity: quantity, mealId: state.mealId, price: state.price }]);

        axios.post(`${API_URL}/api/orderedMeals/addNewItem`, {
          mealName: state.mealName,
          quantity,
          mealId: state.mealId,
          price: state.price
        },
          {
            headers: {
              "Authorization": `Bearer ${context.currentToken}`,
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            setMessage(error.response.data.err);
          });
      }
      //only update the quantity of the meal if it exists in the cart
      else {
        const newCart = [...context.cartItems];
        newCart[itemIndex].quantity = newCart[itemIndex].quantity + quantity; 
        context.changeCartItems(newCart);

        axios.post(`${API_URL}/api/orderedMeals/addItem`, {
          quantity: context.cartItems[itemIndex].quantity,
          mealId: state.mealId
        },
          {
            headers: {
              "Authorization": `Bearer ${context.currentToken}`,
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log(response.data);

          })
          .catch((error) => {
            console.log(error);
            setMessage(error.response.data.err);
          });
      }

    }
  }
  const QuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  }

  return (
    <div className='wrapperForProductDetails'>
      <label className="label"><img src={state.mealImage} className="label_image" alt='meal'></img></label>
      <div className='wrapperForProductDetailsDesc'>
        <ul style={{ listStyleType: "none", textIndent: "-3rem" }}>
          <li id='mealName'>{state.mealName}</li>
          <li id='price'>Price: {state.price}</li>
          <li id='desc'>{state.description}</li>
        </ul>
        <div className='ingredients'>
          <p>Ingredients Used</p>
          <ol>
            {state.mealIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ol>
        </div>
        <form onSubmit={SubmitMeal}>
          <label>
            Quantity:{' '}
            <input type="number" min="1" max="10" defaultValue={quantity} onChange={QuantityChange} />
          </label>
          <button type="submit">Add to cart</button>
        </form>
        <div className='message'>
          {message.length > 0 && <p> {message} </p>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;