import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/user-context';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../css/ShoppingCart.css';

const ShoppingCart = () => {
  const context = useContext(UserContext);
  const API_URL = 'https://try-lemon-six.vercel.app/'
  const RENDER_URL = 'https://csis3380-final-project.onrender.com'

  //retrieve the data from database when the user ener the shopping cart
  useEffect(() => {
    axios
      .get(`${API_URL}/api/orderedMeals/`, { params: { username: context.loginUser }, 
        headers: {
          "Authorization": `Bearer ${context.currentToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        context.changeCartItems(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const removeItem = (index) => {
    const newCartItems = [...context.cartItems];
    newCartItems.splice(index, 1);
    context.changeCartItems(newCartItems);

    axios.post(`${API_URL}/api/orderedMeals/updateCart`,
      {
        newCart: newCartItems
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
      });
  };

  const incrementQuantity = (index) => {
    const newCartItems = [...context.cartItems];
    newCartItems[index].quantity++;
    context.changeCartItems(newCartItems);

    axios.post(`${API_URL}/api/orderedMeals/updateCart`,
      {
        newCart: newCartItems
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
      });
  };

  const decrementQuantity = (index) => {
    const newCartItems = [...context.cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity--;
      context.changeCartItems(newCartItems);
    }

    axios.post(`${API_URL}/api/orderedMeals/updateCart`,
      {
        newCart: newCartItems
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
      });
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (let i = 0; i < context.cartItems.length; i++) {
      totalPrice += context.cartItems[i].price * context.cartItems[i].quantity;
    }
    return totalPrice.toFixed(2);
  };

  //if the user confirm the order, empty the cart
  const confirmPayment = () => {
    alert("Thanks for ordering!")

    context.changeCartItems([]);

    axios.delete(`${API_URL}/api/orderedMeals/deleteCart`,
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
      });
}

  return (
    <div className='wrapperForShoppingCart'>
      <h1>Your Shopping Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Meal Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {context.cartItems.map((meal, index) => (
            <tr key={index}>
              <td>{meal.mealName}</td>
              <td>{meal.quantity}</td>
              <td>{meal.price}</td>
              <td>
                <button className='actionBtn'
                  onClick={() =>
                    meal.quantity > 1
                      ? decrementQuantity(index)
                      : removeItem(index)
                  }
                >
                  -
                </button>
                <button className='actionBtn' onClick={() => incrementQuantity(index)}>+</button>
                <button className='actionBtn' onClick={() => removeItem(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className='cartSummary'>Total Price:</td>
            <td colSpan="2" className='cartSummary'>${calculateTotalPrice()}</td>
          </tr>
          <tr>
          <td colSpan="4" className='cartSummary'><NavLink to="/"><button className='actionBtn' onClick={() => confirmPayment()}>Confirm</button></NavLink></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )


}

export default ShoppingCart;