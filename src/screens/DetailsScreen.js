import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../utils/storageService';
import { colors, spacing, borderRadius, typography, commonStyles } from '../styles/common';

const DetailsScreen = ({ route, navigation }) => {
  const { food } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set header title to food name
    navigation.setOptions({
      title: food.name || 'Food Details',
    });
    checkFavoriteStatus();
  }, [food]);

  useFocusEffect(
    React.useCallback(() => {
      checkFavoriteStatus();
    }, [food])
  );

  const checkFavoriteStatus = async () => {
    setLoading(true);
    const isFav = await isFavorite(food.id);
    setIsFavorited(isFav);
    setLoading(false);
  };

  const handleFavoriteToggle = async () => {
    if (isFavorited) {
      const result = await removeFavorite(food.id);
      if (result.success) {
        setIsFavorited(false);
      }
    } else {
      const result = await addFavorite(food);
      if (result.success) {
        setIsFavorited(true);
      }
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: food.image || 'https://via.placeholder.com/300?text=No+Image',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          {/* Title */}
          <Text style={[styles.title, typography.h2]}>
            {food.name || 'Unknown Food'}
          </Text>

          {/* Rating and Category */}
          <View style={styles.metaContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingEmoji}>⭐</Text>
              <Text style={[styles.ratingValue, typography.body1]}>
                {food.rating || 'N/A'} / 5.0
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryLabel, typography.body2]}>
                {food.category || 'General'}
              </Text>
            </View>
          </View>

          {/* Description */}
          {food.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, typography.h3]}>
                Description
              </Text>
              <Text style={[styles.description, typography.body2]}>
                {food.description}
              </Text>
            </View>
          )}

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, typography.h3]}>
                Tags
              </Text>
              <View style={styles.tagsContainer}>
                {food.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Price Section (if available) */}
          {food.price && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, typography.h3]}>
                Price
              </Text>
              <Text style={[styles.priceText, typography.h3]}>
                ${food.price}
              </Text>
            </View>
          )}

          {/* Additional Info */}
          {(food.cuisine || food.servings || food.prepTime) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, typography.h3]}>
                Additional Info
              </Text>
              <View style={styles.infoGrid}>
                {food.cuisine && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Cuisine</Text>
                    <Text style={[styles.infoValue, typography.body2]}>
                      {food.cuisine}
                    </Text>
                  </View>
                )}
                {food.servings && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Servings</Text>
                    <Text style={[styles.infoValue, typography.body2]}>
                      {food.servings}
                    </Text>
                  </View>
                )}
                {food.prepTime && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Prep Time</Text>
                    <Text style={[styles.infoValue, typography.body2]}>
                      {food.prepTime}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorited && styles.favoriteButtonActive,
              ]}
              onPress={handleFavoriteToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.favoriteEmoji}>
                {isFavorited ? '❤️' : '🤍'}
              </Text>
              <Text
                style={[
                  styles.favoriteButtonText,
                  isFavorited && styles.favoriteButtonTextActive,
                ]}
              >
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.sm,
  },
  ratingEmoji: {
    fontSize: 18,
  },
  ratingValue: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  categoryLabel: {
    color: colors.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textLight,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tagText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '500',
  },
  priceText: {
    color: colors.success,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  infoValue: {
    color: colors.text,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  favoriteButton: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  favoriteEmoji: {
    fontSize: 24,
  },
  favoriteButtonText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
  favoriteButtonTextActive: {
    color: colors.white,
  },
});

export default DetailsScreen;
