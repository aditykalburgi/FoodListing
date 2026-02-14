import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FoodCard from '../components/FoodCard';
import { getFavorites, removeFavorite, clearFavorites } from '../utils/storageService';
import { colors, spacing, typography, commonStyles } from '../styles/common';

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
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={[styles.emptyText, typography.h3]}>❤️</Text>
          <Text style={[styles.emptyMessage, typography.body1]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtext, typography.caption]}>
            Add your favorite foods by clicking the heart icon!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && favorites.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={commonStyles.centerContainer}>
          <Text style={[styles.emptyText, typography.h3]}>🤍</Text>
          <Text style={[styles.emptyMessage, typography.body1]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtext, typography.caption]}>
            Add your favorite foods by clicking the heart icon!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, typography.h2]}>❤️ My Favorites</Text>
          {favorites.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
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
        />

        {favorites.length > 0 && (
          <View style={styles.footerInfo}>
            <Text style={[styles.footerText, typography.caption]}>
              {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    color: colors.text,
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.error + '20',
    borderRadius: 6,
  },
  clearButtonText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
    maxWidth: '80%',
    textAlign: 'center',
  },
  footerInfo: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textLight,
  },
});

export default FavoritesScreen;
