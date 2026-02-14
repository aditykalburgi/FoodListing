import axios from 'axios';

const API_URL = 'https://api.jsonbin.io/v3/b/698184b543b1c97be96155bf';

export const fetchFoodItems = async () => {
  try {
    const response = await axios.get(API_URL);
    // API structure: response.data.record.data contains the array
    const foods = response.data.record?.data || response.data.record;

    let foodItems = [];
    if (Array.isArray(foods)) {
      // Map API fields to app fields
      foodItems = foods.map(item => ({
        id: item.id,
        name: item.title || item.name,
        rating: item.rating,
        category: item.category,
        cuisine: item.cuisine,
        image: item.mainImage || item.thumbNailImage || item.image,
        description: item.description,
        tags: item.tags || [],
        price: item.price,
        prepTime: item.prepTimeMins ? `${item.prepTimeMins} min` : item.prepTime,
        isVeg: item.isVeg,
        servings: item.servings,
      }));
    } else if (typeof foods === 'object' && foods !== null) {
      foodItems = Object.keys(foods).map(key => ({
        id: key,
        name: foods[key].title || foods[key].name,
        rating: foods[key].rating,
        category: foods[key].category,
        cuisine: foods[key].cuisine,
        image: foods[key].mainImage || foods[key].thumbNailImage || foods[key].image,
        description: foods[key].description,
        tags: foods[key].tags || [],
        price: foods[key].price,
        prepTime: foods[key].prepTimeMins ? `${foods[key].prepTimeMins} min` : foods[key].prepTime,
        isVeg: foods[key].isVeg,
        servings: foods[key].servings,
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
