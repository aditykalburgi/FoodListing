import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography, commonStyles } from '../styles/common';
import { isFavorite } from '../utils/storageService';

const FoodCard = ({ food, onPress, onFavoritePress, isFavoritedProp }) => {
  const [isLocal_Favorited, setIsLocal_Favorited] = useState(false);

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
    e.preventDefault();
    if (onFavoritePress) {
      onFavoritePress(food);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, commonStyles.shadowContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: food.image || 'https://via.placeholder.com/200?text=No+Image',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.favoriteIcon}>
            {isLocal_Favorited ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, typography.h3]}
          numberOfLines={2}
        >
          {food.name || 'Unknown Food'}
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {food.rating || 'N/A'}</Text>
          <Text style={styles.categoryText}>{food.category || 'General'}</Text>
        </View>

        {food.tags && food.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {food.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  ratingText: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
  },
  categoryText: {
    ...typography.body2,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default FoodCard;
