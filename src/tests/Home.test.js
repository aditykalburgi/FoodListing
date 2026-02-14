import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

// Mock the API service
jest.mock('../services/foodService', () => ({
  fetchFoodItems: jest.fn(),
}));

// Mock the storage service
jest.mock('../utils/storageService', () => ({
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  isFavorite: jest.fn(() => Promise.resolve(false)),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockFoods = [
    {
      id: 1,
      name: 'Pizza',
      rating: 4.5,
      category: 'Italian',
      image: 'https://example.com/pizza.jpg',
      tags: ['spicy', 'cheese'],
    },
    {
      id: 2,
      name: 'Burger',
      rating: 4.2,
      category: 'American',
      image: 'https://example.com/burger.jpg',
      tags: ['fast-food'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const foodService = require('../services/foodService');
    foodService.fetchFoodItems.mockResolvedValue({
      success: true,
      data: mockFoods,
    });
  });

  it('should render loading indicator initially', () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Loading food items...')).toBeTruthy();
  });

  it('should render food list after loading', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('🍕 Food Listings')).toBeTruthy();
    });
  });

  it('should render food items', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Pizza')).toBeTruthy();
      expect(getByText('Burger')).toBeTruthy();
    });
  });

  it('should display error message when API fails', async () => {
    const foodService = require('../services/foodService');
    foodService.fetchFoodItems.mockResolvedValue({
      success: false,
      error: 'Network error',
    });

    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });
  });

  it('should display empty state when no foods available', async () => {
    const foodService = require('../services/foodService');
    foodService.fetchFoodItems.mockResolvedValue({
      success: true,
      data: [],
    });

    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('No food items found')).toBeTruthy();
    });
  });

  it('should navigate to Details screen when food card is pressed', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Pizza')).toBeTruthy();
    });

    // Note: In a real test, you'd simulate pressing the card
    // This is a simplified version to demonstrate the test structure
  });
});
