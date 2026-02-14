import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});

  useEffect(() => {
    loadFoods();
  }, []);

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
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, typography.body2]}>
            Loading food items...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && foods.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={[styles.errorText, typography.h3]}>❌</Text>
          <Text
            style={[styles.errorMessage, typography.body1, commonStyles.errorText]}
          >
            {error}
          </Text>
          <Text style={[styles.retryText, typography.caption]}>
            Please check your internet connection and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (foods.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={[styles.emptyText, typography.h3]}>🍽️</Text>
          <Text style={[styles.emptyMessage, typography.body1]}>
            No food items found
          </Text>
          <Text style={[styles.emptySubtext, typography.caption]}>
            Please try refreshing the page
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.header, typography.h2]}>🍕 Food Listings</Text>
        <FlatList
          data={foods}
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
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  loadingText: {
    color: colors.textLight,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  errorMessage: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryText: {
    color: colors.textLight,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  emptyMessage: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.textLight,
    marginTop: spacing.md,
  },
});

export default HomeScreen;
