# Food Listing App - React Native

A mobile application built with React Native that fetches food items from an API, displays them in a list, allows viewing details, and supports adding/removing favorites with local persistence using AsyncStorage.

## Project Structure

```
src/
├── components/
│   └── FoodCard.js          # Reusable food card component
├── screens/
│   ├── HomeScreen.js        # Home screen with food list
│   ├── DetailsScreen.js     # Food details screen
│   └── FavoritesScreen.js   # Favorites list screen
├── navigation/
│   └── RootNavigator.js     # Navigation setup (Stack + Tab navigation)
├── services/
│   └── foodService.js       # API service for fetching food items
├── utils/
│   └── storageService.js    # AsyncStorage utilities for favorites
├── styles/
│   └── common.js            # Common styles, colors, spacing, typography
└── tests/
    ├── favorites.test.js    # Unit tests for storage service
    └── Home.test.js         # Component tests for HomeScreen
```

## Features

### 1. Home Screen
- Fetches and displays food items from the API
- Shows food cards with:
  - Food image
  - Name/title
  - Rating
  - Category
  - Tags
- Loading indicator during data fetch
- Error message if API fails
- Empty state if no items found
- Pull-to-refresh functionality
- Navigate to details by clicking a card

### 2. Details Screen
- Shows full food details:
  - Large image
  - Title and rating
  - Category badge
  - Description
  - Tags
  - Price (if available)
  - Additional info (cuisine, servings, prep time)
- Add/Remove favorite button
- Favorite status persists using AsyncStorage

### 3. Favorites Feature
- Favorite/Unfavorite items from any screen
- Dedicated Favorites screen to view all favorite items
- Local persistence using AsyncStorage
- Favorites synced across all screens
- Clear all favorites option with confirmation

### 4. Navigation
- Stack Navigation: Home → Details
- Bottom Tab Navigation with:
  - Home tab (with nested stack)
  - Favorites tab
- Smooth transitions between screens

## Technical Stack

- **React Native**: Mobile app framework
- **React Navigation**: Navigation library
  - `@react-navigation/native-stack` - Stack navigator
  - `@react-navigation/bottom-tabs` - Bottom tab navigator
- **AsyncStorage**: Local data persistence
- **Axios**: API requests
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing

## Installation

### Prerequisites
- Node.js (v22.11.0 or higher)
- npm or yarn
- Android Studio (for Android) or Xcode (for iOS)
- Java Development Kit (JDK)

### Setup Steps

1. **Navigate to project directory**
```bash
cd FoodListingApp
```

2. **Install dependencies** (already done, but you can reinstall if needed)
```bash
npm install
```

3. **For Android Development**
```bash
npm run android
```
Or use:
```bash
react-native run-android
```

4. **For iOS Development**
```bash
npm run ios
```
Or use:
```bash
react-native run-ios
```

5. **Start Metro Bundler**
```bash
npm start
```

## Usage

### Running the App

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

**Metro Bundler (for development)**
```bash
npm start
```

### Running Tests

**Run all tests**
```bash
npm test
```

**Run tests in watch mode**
```bash
npm test -- --watch
```

**Run tests with coverage**
```bash
npm test -- --coverage
```

**Run specific test file**
```bash
npm test favorites.test.js
```

## API Integration

The app fetches food data from:
```
GET https://api.jsonbin.io/v3/b/698184b543b1c97be96155bf
```

Expected data structure:
```javascript
{
  record: [
    {
      id: 1,
      name: "Pizza",
      rating: 4.5,
      category: "Italian",
      image: "https://...",
      description: "Delicious pizza...",
      tags: ["spicy", "cheese"],
      price: 12.99,
      cuisine: "Italian",
      servings: 2,
      prepTime: "30 min"
    },
    // ... more items
  ]
}
```

## Component Details

### FoodCard Component
```javascript
<FoodCard
  food={foodItem}
  onPress={() => handlePress(foodItem)}
  onFavoritePress={handleFavorite}
  isFavoritedProp={isFavorited}
/>
```

### Storage Service
```javascript
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  clearFavorites
} from '../utils/storageService';

// Add to favorites
await addFavorite(foodItem);

// Check if favorited
const isFav = await isFavorite(foodId);

// Get all favorites
const favorites = await getFavorites();

// Remove from favorites
await removeFavorite(foodId);

// Clear all favorites
await clearFavorites();
```

### Food Service
```javascript
import {
  fetchFoodItems,
  getFoodById
} from '../services/foodService';

// Fetch all foods
const result = await fetchFoodItems();
if (result.success) {
  const foods = result.data;
}

// Get specific food
const food = getFoodById(foods, foodId);
```

## Styling System

The app uses a consistent styling system defined in `src/styles/common.js`:

### Colors
- `primary`: #FF6B35 (Orange)
- `secondary`: #004E89 (Blue)
- `background`: #F7F7F7 (Light Gray)
- `text`: #1A1A1A (Dark)
- `textLight`: #666666 (Gray)
- `white`: #FFFFFF
- `border`: #E0E0E0
- `success`: #10B981 (Green)
- `error`: #EF4444 (Red)

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `xxl`: 32px

### Border Radius
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px

## Testing

### Test Files

**1. favorites.test.js** - Unit Tests
Tests for AsyncStorage utility functions:
- Adding favorites
- Removing favorites
- Getting all favorites
- Checking if item is favorite
- Clearing favorites
- Handling errors

**2. Home.test.js** - Component Tests
Tests for HomeScreen:
- Loading state
- Rendering food list
- Displaying errors
- Empty state
- Navigation functionality

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

## Troubleshooting

### App won't start
1. Clear cache: `npm start -- --reset-cache`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Clear Android build: `cd android && ./gradlew clean && cd ..`

### API fetch fails
1. Check internet connection
2. Verify API URL is accessible
3. Check API response format
4. Use appropriate error handling

### Tests fail
1. Clear Jest cache: `npm test -- --clearCache`
2. Verify all mocks are set up correctly
3. Check for any missing dependencies

## Best Practices Used

✅ **Functional Components**: All components are functional with React Hooks
✅ **Reusable Components**: FoodCard is reused across screens
✅ **Separation of Concerns**: Logic separated into services and utils
✅ **Error Handling**: Proper error states and messages
✅ **Loading States**: User feedback during data fetch
✅ **Empty States**: Handle empty data gracefully
✅ **AsyncStorage**: Persistent local data storage
✅ **Navigation**: Clean navigation flow
✅ **Styling**: Consistent design system
✅ **Testing**: Unit and component tests included
✅ **Performance**: Optimized rendering with FlatList

## Future Enhancements

- Add search and filter functionality
- Implement recipe/ingredient details
- Add user ratings and reviews
- Implement offline mode
- Add sharing functionality
- Implement advanced filtering
- Add animations
- User authentication

## License

MIT

## Support

For issues or questions, please refer to the React Native documentation:
- https://reactnative.dev/
- https://reactnavigation.org/

## Version

- React Native: 0.84.0
- Node.js: >= 22.11.0
