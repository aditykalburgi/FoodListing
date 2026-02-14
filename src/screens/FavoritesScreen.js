import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Text, 
  Button, 
  Surface, 
  Divider,
  IconButton,
} from 'react-native-paper';
import FoodCard from '../components/FoodCard';
import { getFavorites, removeFavorite, clearFavorites } from '../utils/storageService';
import { colors, spacing, borderRadius, typography, commonStyles } from '../styles/common';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const favs = await getFavorites();
    setFavorites(favs);
    setLoading(false);
  };

  const handleFavoritePress = async (food) => {
    const result = await removeFavorite(food.id);
    if (result.success) {
      const updatedFavorites = favorites.filter(item => item.id !== food.id);
      setFavorites(updatedFavorites);
    }
  };

  const handleFoodPress = (food) => {
    navigation.navigate('HomeStack', {
      screen: 'Details',
      params: { food },
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            await clearFavorites();
            setFavorites([]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading && favorites.length === 0) {
    return (
      <View style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={styles.emptyText}>❤️</Text>
          <Text variant="titleMedium" style={styles.emptyMessage}>
            Loading favorites...
          </Text>
        </View>
      </View>
    );
  }

  if (!loading && favorites.length === 0) {
    return (
      <View style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Surface style={styles.emptyIconContainer} elevation={2}>
            <Text style={styles.emptyIcon}>🤍</Text>
          </Surface>
          <Text variant="titleLarge" style={styles.emptyMessage}>
            No favorites yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Tap the heart icon on any food item to add it to your favorites!
          </Text>
          <Button 
            mode="contained" 
            icon="home"
            style={styles.browseButton}
            onPress={() => {}}
          >
            Browse Foods
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <Surface style={styles.headerSurface} elevation={2}>
          <View style={styles.headerContainer}>
            <Text variant="headlineSmall" style={styles.header}>
              ❤️ My Favorites
            </Text>
            {favorites.length > 0 && (
              <Button
                mode="text"
                icon="delete-outline"
                textColor={colors.error}
                onPress={handleClearAll}
                compact
              >
                Clear All
              </Button>
            )}
          </View>
        </Surface>

        <Divider />

        {/* Favorites Count */}
        <View style={styles.countContainer}>
          <Text variant="bodySmall" style={styles.countText}>
            {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
          </Text>
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <FoodCard
              food={item}
              onPress={() => handleFoodPress(item)}
              onFavoritePress={handleFavoritePress}
              isFavoritedProp={true}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingVertical: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    color: colors.text,
    fontWeight: '700',
    flex: 1,
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
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyMessage: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.textLight,
    marginTop: spacing.sm,
    maxWidth: '80%',
    textAlign: 'center',
    lineHeight: 22,
  },
  browseButton: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
  },
});

export default FavoritesScreen;
