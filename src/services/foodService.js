import axios from 'axios';

const API_URL = 'https://api.jsonbin.io/v3/b/698184b543b1c97be96155bf';

export const fetchFoodItems = async () => {
  try {
    const response = await axios.get(API_URL);
    // The API returns data in a 'record' field
    const foods = response.data.record;
    return {
      success: true,
      data: Array.isArray(foods) ? foods : Object.values(foods),
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
