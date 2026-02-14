import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Text, 
  Button, 
  Chip, 
  Surface, 
  Divider,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
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
  const [scaleAnim] = useState(new Animated.Value(1));

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
    // Animate button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

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
    <View style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Section with Overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: food.image || 'https://via.placeholder.com/300?text=No+Image',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Floating Rating Badge */}
          <Surface style={styles.floatingRating} elevation={3}>
            <Text style={styles.floatingRatingText}>⭐ {food.rating || 'N/A'}</Text>
          </Surface>
        </View>

        {/* Details Section */}
        <Surface style={styles.detailsContainer} elevation={0}>
          {/* Title and Price Row */}
          <View style={styles.titleRow}>
            <Text variant="headlineMedium" style={styles.title}>
              {food.name || 'Unknown Food'}
            </Text>
            {food.price && (
              <Surface style={styles.priceBadge} elevation={2}>
                <Text variant="titleLarge" style={styles.priceText}>
                  ₹{food.price}
                </Text>
              </Surface>
            )}
          </View>

          {/* Category and Meta Chips */}
          <View style={styles.metaContainer}>
            <Chip 
              icon="food" 
              mode="outlined" 
              style={styles.categoryChip}
              textStyle={styles.chipText}
            >
              {food.category || 'General'}
            </Chip>
            {food.cuisine && (
              <Chip 
                icon="chef-hat" 
                mode="outlined" 
                style={styles.cuisineChip}
                textStyle={styles.chipText}
              >
                {food.cuisine}
              </Chip>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Description */}
          {food.description && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📝 Description
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {food.description}
              </Text>
            </View>
          )}

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🏷️ Tags
              </Text>
              <View style={styles.tagsContainer}>
                {food.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    compact
                    style={styles.tag}
                    textStyle={styles.tagText}
                    mode="flat"
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {/* Additional Info Cards */}
          {(food.servings || food.prepTime) && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ℹ️ Additional Info
              </Text>
              <View style={styles.infoGrid}>
                {food.servings && (
                  <Surface style={styles.infoItem} elevation={1}>
                    <Text style={styles.infoIcon}>🍽️</Text>
                    <Text variant="bodySmall" style={styles.infoLabel}>Servings</Text>
                    <Text variant="titleMedium" style={styles.infoValue}>
                      {food.servings}
                    </Text>
                  </Surface>
                )}
                {food.prepTime && (
                  <Surface style={styles.infoItem} elevation={1}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text variant="bodySmall" style={styles.infoLabel}>Prep Time</Text>
                    <Text variant="titleMedium" style={styles.infoValue}>
                      {food.prepTime}
                    </Text>
                  </Surface>
                )}
              </View>
            </View>
          )}
        </Surface>

        {/* Favorite Button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} animating={true} />
          ) : (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Button
                mode={isFavorited ? 'contained' : 'outlined'}
                onPress={handleFavoriteToggle}
                icon={isFavorited ? 'heart' : 'heart-outline'}
                style={[
                  styles.favoriteButton,
                  isFavorited && styles.favoriteButtonActive,
                ]}
                contentStyle={styles.favoriteButtonContent}
                labelStyle={styles.favoriteButtonLabel}
                buttonColor={isFavorited ? colors.error : undefined}
              >
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.border,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingRating: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  floatingRatingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  detailsContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.md,
  },
  priceBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  priceText: {
    color: colors.success,
    fontWeight: '700',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '30',
  },
  cuisineChip: {
    backgroundColor: colors.secondary + '10',
    borderColor: colors.secondary + '30',
  },
  chipText: {
    fontSize: 12,
  },
  divider: {
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textLight,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  infoLabel: {
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  infoValue: {
    color: colors.text,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
  },
  favoriteButton: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.error,
  },
  favoriteButtonActive: {
    borderColor: colors.error,
  },
  favoriteButtonContent: {
    paddingVertical: spacing.sm,
  },
  favoriteButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailsScreen;
