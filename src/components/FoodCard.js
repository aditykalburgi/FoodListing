import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { colors, spacing } from '../styles/common';
import { isFavorite } from '../utils/storageService';

const FoodCard = ({ food, onPress, onFavoritePress, isFavoritedProp }) => {
  const [isLocal_Favorited, setIsLocal_Favorited] = useState(false);

  useEffect(() => {
    if (!food) return;
    if (isFavoritedProp !== undefined) {
      setIsLocal_Favorited(isFavoritedProp);
    } else {
      checkFavoriteStatus();
    }
  }, [isFavoritedProp, food]);

  const checkFavoriteStatus = async () => {
    if (!food) return;
    const fav = await isFavorite(food.id);
    setIsLocal_Favorited(fav);
  };

  const handleFavoritePress = () => {
    if (!food) return;
    if (onFavoritePress) {
      onFavoritePress(food);
    }
  };

  // Safety check after hooks
  if (!food) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <Card style={styles.card} mode="elevated" elevation={0}>
        <View style={styles.imageContainer}>
          <Card.Cover
            source={{
              uri: food.image || 'https://via.placeholder.com/200?text=No+Image',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Dark gradient overlay */}
          <View style={styles.gradientOverlay} pointerEvents="none" />

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <View style={styles.glassContainer}>
              <Text style={styles.ratingText}>⭐ {food.rating || 'N/A'}</Text>
            </View>
          </View>

          {/* Favorite Button */}
          <View style={styles.favoriteButton}>
            <TouchableOpacity onPress={handleFavoritePress}>
              <View style={styles.favoriteGlass}>
                <IconButton
                  icon={isLocal_Favorited ? 'heart' : 'heart-outline'}
                  iconColor={isLocal_Favorited ? '#FF4B6E' : '#fff'}
                  size={22}
                  style={styles.favoriteIconButton}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Card.Content style={styles.content}>
          {/* Title */}
          <Text variant="titleLarge" style={styles.title} numberOfLines={2}>
            {food.name || 'Unknown Food'}
          </Text>

          {/* Category and Price Row */}
          <View style={styles.metaRow}>
            <View style={styles.categoryWrapper}>
              <View style={styles.categoryDot} />
              <Text style={styles.categoryText}>
                {food.category || 'General'}
              </Text>
            </View>
            
            {food.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  ${food.price}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {food.tags && food.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {food.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {food.tags.length > 3 && (
                <View style={[styles.tag, styles.moreTag]}>
                  <Text style={styles.tagText}>+{food.tags.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm || 8,
    marginHorizontal: spacing.xs || 4,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  // Rating Badge
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  
  // Favorite Button
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  favoriteGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  favoriteIconButton: {
    margin: 0,
  },
  
  // Content Styles
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: {
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  
  // Meta Row (Category + Price)
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary || '#FF6B6B',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4A4A',
    letterSpacing: 0.2,
  },
  priceContainer: {
    backgroundColor: colors.primary ? `${colors.primary}15` : '#4CAF5015',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  priceText: {
    color: colors.primary || '#4CAF50',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: -0.3,
  },
  
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginRight: 7,
    marginBottom: 7,
  },
  moreTag: {
    backgroundColor: '#F0F0F0',
  },
  tagText: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default FoodCard;
