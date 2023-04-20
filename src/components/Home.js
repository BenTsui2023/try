import React from "react";
import { useState, useEffect } from "react";
import Product from "./Product";
import Filter from './Filter';
import mealData from '../data/mealData.json';

const Home = () => {

  const [allMealData, setAllMealData] = useState([]);
  const [mealDataWithMealInfo, setMealDataWithMealInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //fetches data from the themealdb API 
  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert')
      .then(response => response.json())
      .then(data => {
        const dessertMealPromises = data.meals.slice(0, 10).map(meal =>
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(response => response.json())
            .then(allMealData => {
              const { strMeal, strMealThumb, idMeal } = allMealData.meals[0];
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                if (allMealData.meals[0][`strIngredient${i}`]) {
                  ingredients.push(`${allMealData.meals[0][`strIngredient${i}`]}`);
                }
              }
              const meal = { mealName: strMeal, mealImage: strMealThumb, mealId: idMeal, mealIngredients: ingredients };
              return meal;
            })
        );

        fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef')
          .then(response => response.json())
          .then(data => {
            const beefMealPromises = data.meals.slice(0, 10).map(meal =>
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(response => response.json())
                .then(allMealData => {
                  const { strMeal, strMealThumb, idMeal } = allMealData.meals[0];
                  const ingredients = [];
                  for (let i = 1; i <= 20; i++) {
                    if (allMealData.meals[0][`strIngredient${i}`]) {
                      ingredients.push(`${allMealData.meals[0][`strIngredient${i}`]}`);
                    }
                  }
                  const meal = { mealName: strMeal, mealImage: strMealThumb, mealId: idMeal, mealIngredients: ingredients };
                  return meal;
                })
            );

            fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta')
              .then(response => response.json())
              .then(data => {
                const pastaMealPromises = data.meals.slice(0, 10).map(meal =>
                  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                    .then(response => response.json())
                    .then(allMealData => {
                      const { strMeal, strMealThumb, idMeal } = allMealData.meals[0];
                      const ingredients = [];
                      for (let i = 1; i <= 20; i++) {
                        if (allMealData.meals[0][`strIngredient${i}`]) {
                          ingredients.push(`${allMealData.meals[0][`strIngredient${i}`]}`);
                        }
                      }
                      const meal = { mealName: strMeal, mealImage: strMealThumb, mealId: idMeal, mealIngredients: ingredients };
                      return meal;
                    })
                );

                Promise.all([...dessertMealPromises, ...beefMealPromises, ...pastaMealPromises])
                  .then(data => {
                    setAllMealData(data);
                  })
                  .catch((error) => {
                    console.log('Error occurred while fetching meal data', error);
                  });
              })
              .catch((error) => {
                console.log('Error occurred while fetching Pasta data', error);
              });
          })
          .catch((error) => {
            console.log('Error occurred while fetching Beef data', error);
          });
      })
      .catch((error) => {
        console.log('Error occurred while fetching Dessert data', error);
      });
  }, []);

  useEffect(() => {
    // Combine mealData and mealInfo into a new array of objects
    const newData = allMealData.map((data, index) => ({ ...data, ...mealData.mealData[index] }));
    setMealDataWithMealInfo(newData);
    setFilteredData(newData)
  }, [allMealData]);

  //function for Filter component that filters the meal data
  function handleFilterChange({ name, minPrice, maxPrice }) {
    let newData = [...mealDataWithMealInfo];

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
    setFilteredData(mealDataWithMealInfo);
  }

  return (
    <div className="wrapper">
      <div className="desc">
        <h1>Welcome!</h1>
        <p>Welcome to our online ordering website! We are thrilled to offer you a hassle-free and convenient way to order your favorite meals from the comfort of your home or office. Our menu features a wide range of delicious options, including pasta, beef, and dessert. Whether you're in the mood for a classic steak or a cheesy pasta, we have something for everyone. Our food is always fresh, prepared with high-quality ingredients, and served quickly to ensure that you can enjoy your meal without any delay. So go ahead and browse our menu, customize your order, and get ready to indulge in a tasty and satisfying meal!</p>
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

export default Home;