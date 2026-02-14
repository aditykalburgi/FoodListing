import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  clearFavorites,
} from '../utils/storageService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Storage Service - Favorites', () => {
  const mockFood = {
    id: 1,
    name: 'Pizza',
    rating: 4.5,
    image: 'https://example.com/pizza.jpg',
  };

  const mockFood2 = {
    id: 2,
    name: 'Burger',
    rating: 4.2,
    image: 'https://example.com/burger.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavorite', () => {
    it('should add a new favorite successfully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

      const result = await addFavorite(mockFood);

      expect(result.success).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining(mockFood.name)
      );
    });

    it('should not add duplicate favorite', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockFood]));

      const result = await addFavorite(mockFood);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already in favorites');
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify([mockFood, mockFood2])
      );

      const result = await removeFavorite(mockFood.id);

      expect(result.success).toBe(true);
    });
  });

  describe('getFavorites', () => {
    it('should return an empty array when no favorites exist', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(null);

      const favorites = await getFavorites();

      expect(Array.isArray(favorites)).toBe(true);
      expect(favorites.length).toBe(0);
    });

    it('should return saved favorites', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockFavorites = [mockFood, mockFood2];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));

      const favorites = await getFavorites();

      expect(favorites).toEqual(mockFavorites);
      expect(favorites.length).toBe(2);
    });
  });

  describe('isFavorite', () => {
    it('should return true if food is in favorites', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockFood]));

      const result = await isFavorite(mockFood.id);

      expect(result).toBe(true);
    });

    it('should return false if food is not in favorites', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockFood]));

      const result = await isFavorite(mockFood2.id);

      expect(result).toBe(false);
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorites', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');

      const result = await clearFavorites();

      expect(result.success).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
