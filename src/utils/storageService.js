import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@FoodListingApp_favorites';

export const addFavorite = async (food) => {
  try {
    const existingFavorites = await getFavorites();
    const foodExists = existingFavorites.some(item => item.id === food.id);
    
    if (!foodExists) {
      existingFavorites.push(food);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(existingFavorites));
      return { success: true };
    }
    
    return { success: false, error: 'Already in favorites' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFavorite = async (foodId) => {
  try {
    const existingFavorites = await getFavorites();
    const filtered = existingFavorites.filter(item => item.id !== foodId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

export const isFavorite = async (foodId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(item => item.id === foodId);
  } catch (error) {
    return false;
  }
};

export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
