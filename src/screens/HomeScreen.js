import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Text, 
  Searchbar, 
  ActivityIndicator, 
  Button,
  Chip,
} from 'react-native-paper';
import FoodCard from '../components/FoodCard';
import { fetchFoodItems } from '../services/foodService';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../utils/storageService';
import { colors, spacing } from '../styles/common';

const CATEGORIES = ['All', 'Breakfast', 'Main Course', 'Snacks', 'Breads', 'Beverages', 'Desserts'];

const HomeScreen = ({ navigation }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [searchQuery, selectedCategory, foods]);

  useFocusEffect(
    useCallback(() => {
      updateFavoriteStates();
    }, [foods])
  );

  const filterFoods = () => {
    let filtered = foods;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(food => 
        food.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(food =>
        food.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredFoods(filtered);
  };

  const loadFoods = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchFoodItems();

    if (result.success) {
      setFoods(result.data);
      setFilteredFoods(result.data);
      await updateFavoriteStates(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const updateFavoriteStates = async (foodsToCheck = foods) => {
    const states = {};
    for (const food of foodsToCheck) {
      const isFav = await isFavorite(food.id);
      states[food.id] = isFav;
    }
    setFavoriteStates(states);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFoods();
    setRefreshing(false);
  };

  const handleFavoritePress = async (food) => {
    const isFav = favoriteStates[food.id];

    if (isFav) {
      const result = await removeFavorite(food.id);
      if (result.success) {
        setFavoriteStates({ ...favoriteStates, [food.id]: false });
      }
    } else {
      const result = await addFavorite(food);
      if (result.success) {
        setFavoriteStates({ ...favoriteStates, [food.id]: true });
      }
    }
  };

  const handleFoodPress = (food) => {
    navigation.navigate('Details', { food });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Food Listings
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Discover delicious food
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error && foods.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Food Listings
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text variant="titleLarge" style={styles.errorTitle}>
            Oops! Something went wrong
          </Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={loadFoods} 
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Food Listings
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Discover delicious food near you
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search food, category, tags..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          elevation={0}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
              mode={selectedCategory === category ? 'flat' : 'outlined'}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text variant="bodyMedium" style={styles.resultsText}>
          {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FoodCard
            food={item}
            onPress={() => handleFoodPress(item)}
            onFavoritePress={handleFavoritePress}
            isFavoritedProp={favoriteStates[item.id]}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsEmoji}>🔍</Text>
            <Text variant="titleMedium" style={styles.noResultsTitle}>
              No results found
            </Text>
            <Text variant="bodyMedium" style={styles.noResultsText}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header
  header: {
    backgroundColor: colors.primary || '#FF6B6B',
    paddingTop: (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 28,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: -15,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchBar: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    elevation: 0,
  },

  // Categories
  categoryContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },

  // Results
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsText: {
    color: '#666',
    fontWeight: '600',
  },

  // List
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },

  // Error
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 12,
  },

  // No Results
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsTitle: {
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 8,
  },
  noResultsText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
