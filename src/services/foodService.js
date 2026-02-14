import axios from 'axios';

const API_URL = 'https://api.jsonbin.io/v3/b/698184b543b1c97be96155bf';

export const fetchFoodItems = async () => {
  try {
    const response = await axios.get(API_URL);
    const foods = response.data.record;

    let foodItems = [];
    if (Array.isArray(foods)) {
      foodItems = foods;
    } else if (typeof foods === 'object' && foods !== null) {
      foodItems = Object.keys(foods).map(key => ({
        id: key,
        ...foods[key],
      }));
    }

    return {
      success: true,
      data: foodItems,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch food items',
    };
  }
};

export const getFoodById = (foods, id) => {
  return foods.find(food => food.id === id);
};
