import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Text, 
  Searchbar, 
  ActivityIndicator, 
  Surface,
  Button,
  Divider,
} from 'react-native-paper';
import FoodCard from '../components/FoodCard';
import { fetchFoodItems } from '../services/foodService';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../utils/storageService';
import { colors, spacing, typography, commonStyles } from '../styles/common';

const HomeScreen = ({ navigation }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter(food =>
        food.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery, foods]);

  // Reload favorite states when screen is focused
  useFocusEffect(
    useCallback(() => {
      updateFavoriteStates();
    }, [foods])
  );

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
      <View style={commonStyles.safeArea}>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} animating={true} />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading delicious food items...
          </Text>
        </View>
      </View>
    );
  }

  if (error && foods.length === 0) {
    return (
      <View style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={styles.errorText}>❌</Text>
          <Text variant="titleMedium" style={styles.errorMessage}>
            {error}
          </Text>
          <Text variant="bodySmall" style={styles.retryText}>
            Please check your internet connection and try again.
          </Text>
          <Button 
            mode="contained" 
            onPress={loadFoods} 
            style={styles.retryButton}
            icon="refresh"
          >
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  if (foods.length === 0) {
    return (
      <View style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={styles.emptyText}>🍽️</Text>
          <Text variant="titleMedium" style={styles.emptyMessage}>
            No food items found
          </Text>
          <Text variant="bodySmall" style={styles.emptySubtext}>
            Please try refreshing the page
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <Surface style={styles.headerSurface} elevation={2}>
          <Text variant="headlineSmall" style={styles.header}>
            🍕 Food Listings
          </Text>
          <Searchbar
            placeholder="Search food, category, tags..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={colors.textLight}
            elevation={0}
          />
        </Surface>

        <Divider />

        {/* Food Count */}
        <View style={styles.countContainer}>
          <Text variant="bodySmall" style={styles.countText}>
            {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'} found
          </Text>
        </View>

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
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text variant="titleMedium" style={styles.noResultsText}>
                No results for "{searchQuery}"
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSurface: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  searchBar: {
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  countContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  countText: {
    color: colors.textLight,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  loadingText: {
    color: colors.textLight,
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorMessage: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  retryText: {
    color: colors.textLight,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.xl,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyMessage: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  noResultsText: {
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;
