import React from "react";
import { useState, useEffect } from "react";
import Filter from './Filter';
import Product from "./Product";
import mealData from '../data/mealData.json';

const Beef = () => {
  const [beefMealsData, setBeefMealsData] = useState([]);
  const [beefMealsDataWithMealInfo, setbeefMealsDataWithMealInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=beef')
      .then(response => response.json())
      .then(data => {
        const beefMealPromises = data.meals.slice(0, 10).map(meal =>
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(response => response.json())
            .then(mealData => {
              const { strMeal, strMealThumb, idMeal } = mealData.meals[0];
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                if (mealData.meals[0][`strIngredient${i}`]) {
                  ingredients.push(`${mealData.meals[0][`strIngredient${i}`]}`);
                }
              }
              const meal = { mealName: strMeal, mealImage: strMealThumb, mealId: idMeal, mealIngredients: ingredients };
              return meal;
            })
        );

        Promise.all(beefMealPromises)
          .then(meals => {
            setBeefMealsData(meals);
          })
          .catch(error => {
            console.log('Error fetching meal details:', error);
          });
      })
      .catch(error => {
        console.log('Error fetching beef meals:', error);
      });
  }, []);

  useEffect(() => {
    // Combine mealData and mealInfo into a new array of objects
    const newData = beefMealsData.map((data, index) => ({ ...data, ...mealData.mealData.slice(10, 19)[index] }));
    setbeefMealsDataWithMealInfo(newData);
    setFilteredData(newData)
  }, [beefMealsData]);

  //function for Filter component that filters the meal data
  function handleFilterChange({ name, minPrice, maxPrice }) {
    let newData = [...beefMealsDataWithMealInfo];

    if (name) {
      newData = newData.filter((item) =>
        item.mealName.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (maxPrice) {
      newData = newData.filter((item) => item.price <= maxPrice);
    }

    if (minPrice) {
      newData = newData.filter((item) => item.price >= minPrice);
    }

    setFilteredData(newData);
  }

  function handleReset() {
    setFilteredData(beefMealsDataWithMealInfo);
  }

    return(
        <div className="wrapper">
            <div className="desc">
                <h1>Beef</h1>
            </div>
        
            <div className='filter'> <Filter onFilterChange={handleFilterChange} onReset={handleReset} /></div>
            <div className='wrapperForProductList'>
                {filteredData.map(menu => (
                    <Product
                        key={menu.mealId}
                        id={menu.mealId}
                        desc={menu.description}
                        image={menu.mealImage}
                        title={menu.mealName}
                        price={menu.price}
                        ingredients={menu.mealIngredients}
                    />
                    ))
                }
            </div>
        </div>
    )
}

export default Beef;