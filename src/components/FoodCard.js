import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { Card, Text, Chip, IconButton, Surface } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../styles/common';
import { isFavorite } from '../utils/storageService';

const FoodCard = ({ food, onPress, onFavoritePress, isFavoritedProp }) => {
  const [isLocal_Favorited, setIsLocal_Favorited] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isFavoritedProp !== undefined) {
      setIsLocal_Favorited(isFavoritedProp);
    } else {
      checkFavoriteStatus();
    }
  }, [isFavoritedProp]);

  const checkFavoriteStatus = async () => {
    const fav = await isFavorite(food.id);
    setIsLocal_Favorited(fav);
  };

  const handleFavoritePress = (e) => {
    // Animate heart button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (onFavoritePress) {
      onFavoritePress(food);
    }
  };

  return (
    <Card 
      style={styles.card} 
      onPress={onPress}
      mode="elevated"
      elevation={3}
    >
      <View style={styles.imageContainer}>
        <Card.Cover
          source={{
            uri: food.image || 'https://via.placeholder.com/200?text=No+Image',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Surface style={styles.ratingSurface} elevation={2}>
            <Text style={styles.ratingText}>⭐ {food.rating || 'N/A'}</Text>
          </Surface>
        </View>
        <Animated.View style={[styles.favoriteButton, { transform: [{ scale: scaleAnim }] }]}>
          <IconButton
            icon={isLocal_Favorited ? 'heart' : 'heart-outline'}
            iconColor={isLocal_Favorited ? colors.error : colors.textLight}
            size={28}
            onPress={handleFavoritePress}
            style={styles.favoriteIconButton}
            mode="contained"
            containerColor={colors.white}
          />
        </Animated.View>
      </View>

      <Card.Content style={styles.content}>
        <Text 
          variant="titleMedium" 
          style={styles.title}
          numberOfLines={2}
        >
          {food.name || 'Unknown Food'}
        </Text>

        <View style={styles.categoryContainer}>
          <Chip 
            icon="food" 
            mode="outlined" 
            compact 
            style={styles.categoryChip}
            textStyle={styles.categoryChipText}
          >
            {food.category || 'General'}
          </Chip>
          {food.price && (
            <Text variant="titleMedium" style={styles.priceText}>
              ${food.price}
            </Text>
          )}
        </View>

        {food.tags && food.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {food.tags.slice(0, 3).map((tag, index) => (
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
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    height: 180,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
  },
  ratingSurface: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  favoriteIconButton: {
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.secondary + '15',
    borderColor: colors.secondary + '30',
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.secondary,
  },
  priceText: {
    color: colors.primary,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default FoodCard;
