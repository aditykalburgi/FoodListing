# Food Listing App - Quick Start Guide

## 🚀 Ready to Run!

Your React Native Food Listing App is fully configured and ready to launch.

### Prerequisites
- Node.js (v22.11.0+)
- Android Studio with Android SDK 34+ (for Android)
- Xcode (for iOS)
- USB device or emulator

---

## 📱 Running the App

### Starting Metro Bundler
```bash
npm start
```

### Running on Android
```bash
# In another terminal
npm run android
```

Or with more options:
```bash
npx react-native run-android --variant=debug
```

### Running on iOS
```bash
npm run ios
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Tests Include:
- ✅ **favorites.test.js** - AsyncStorage utility unit tests
- ✅ **Home.test.js** - HomeScreen component tests

### Run Specific Test
```bash
npm test favorites.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode (auto-rerun on changes)
```bash
npm test -- --watch
```

---

## 📁 Project Structure

```
FoodListingApp/
├── src/
│   ├── components/
│   │   └── FoodCard.js              # Food item card component
│   ├── screens/
│   │   ├── HomeScreen.js            # Food list with search & refresh
│   │   ├── DetailsScreen.js         # Food item details
│   │   └── FavoritesScreen.js       # Saved favorites
│   ├── navigation/
│   │   └── RootNavigator.js         # Tab + Stack navigation
│   ├── services/
│   │   └── foodService.js           # API calls
│   ├── utils/
│   │   └── storageService.js        # AsyncStorage management
│   ├── styles/
│   │   └── common.js                # Design system & colors
│   └── tests/
│       ├── favorites.test.js        # Unit tests
│       └── Home.test.js             # Component tests
├── App.js                           # Main app entry point
├── index.js                         # React Native entry point
└── package.json                     # Dependencies
```

---

## 🎨 Features Overview

### Home Screen 🏠
- **API Integration**: Fetches food items from public API
- **Loading State**: Activity indicator while loading
- **Error Handling**: Shows error message if API fails
- **Empty State**: Displays when no items found
- **Pull-to-Refresh**: SwipeRefresh to reload
- **Food Cards**: Shows image, name, rating, category, tags
- **Navigation**: Tap card to view details

### Details Screen 📖
- **Large Image**: Full-screen food photo
- **Complete Info**: Name, rating, category, description
- **Extra Details**: Price, cuisine, servings, prep time (if available)
- **Favorite Button**: Toggle favorite status
- **Persistent State**: Favorites saved locally

### Favorites Screen ❤️
- **Saved Items**: View all favorite foods
- **Local Storage**: Favorites persist after app restart
- **Remove Items**: Swipe or tap to remove
- **Clear All**: Remove all favorites at once
- **Counter**: Shows total favorites

### Navigation 🧭
- **Bottom Tab Navigation**: Home & Favorites tabs
- **Stack Navigator**: Home → Details flow
- **Smooth Transitions**: Professional navigation feel

---

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: #FF6B35 (Warm Orange)
- **Secondary**: #004E89 (Professional Blue)
- **Background**: #F7F7F7 (Light, Clean)
- **Text**: #1A1A1A (Dark, Readable)

### Design Elements
- ✨ Rounded corners (8-24px border radius)
- 🎯 Consistent spacing (4px grid system)
- 🕶️ Subtle shadows for depth
- 📱 Responsive layouts
- 🔘 Large touch targets (48px min)

### Interactions
- Smooth button animations
- Tap feedback on cards
- Pull-to-refresh
- Heart emoji favorites
- Loading indicators

---

## 🔌 API Integration

### Endpoint
```
GET https://api.jsonbin.io/v3/b/698184b543b1c97be96155bf
```

### Data Structure
```javascript
{
  record: [
    {
      id: 1,
      name: "Pizza",
      rating: 4.8,
      category: "Italian",
      image: "https://...",
      description: "...",
      tags: ["vegetarian", "cheese"],
      price: 14.99,
      cuisine: "Italian",
      servings: 2,
      prepTime: "20 min"
    },
    // ... more items
  ]
}
```

---

## 💾 Local Storage

### AsyncStorage Setup
- **Key**: `@FoodListingApp_favorites`
- **Persistence**: Survives app restart
- **Sync**: Updates across all screens

### Storage Methods (in `storageService.js`)
```javascript
// Add to favorites
await addFavorite(foodItem);

// Check if favorited
const isFav = await isFavorite(foodId);

// Get all favorites
const favorites = await getFavorites();

// Remove from favorites
await removeFavorite(foodId);

// Clear all
await clearFavorites();
```

---

## 🛠️ Technical Stack

| Technology | Purpose |
|-----------|---------|
| React Native | Mobile Framework |
| React Navigation | Navigation (Tabs + Stack) |
| AsyncStorage | Local Persistence |
| Axios | API Requests |
| Jest | Testing Framework |
| RTL | Component Testing |

---

## 📝 Scripts

| Command | What It Does |
|---------|------------|
| `npm start` | Start Metro bundler |
| `npm run android` | Launch Android app |
| `npm run ios` | Launch iOS app |
| `npm test` | Run all tests |
| `npm test -- --coverage` | Tests with coverage report |
| `npm test -- --watch` | Watch mode for tests |
| `npm lint` | Check code style |

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache
npm start -- --reset-cache

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

### Android emulator issues?
```bash
# List available emulators
$ANDROID_HOME/emulator/emulator -list-avds

# Start emulator
$ANDROID_HOME/emulator/emulator -avd YourEmulatorName
```

### Tests not running?
```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

---

## 📚 Documentation

- **PROJECT_DOCUMENTATION.md** - Full project documentation
- **DEVELOPMENT_GUIDE.md** - How to add features & extend
- **EXAMPLE_API_RESPONSE.json** - Sample API data

---

## ✅ Quality Checklist

- ✅ Functional components with React Hooks
- ✅ Reusable FoodCard component
- ✅ Separated concerns (services, utils, screens)
- ✅ Error handling & loading states
- ✅ Empty state handling
- ✅ Pull-to-refresh functionality
- ✅ AsyncStorage persistence
- ✅ Tests included (unit + component)
- ✅ Clean design system
- ✅ Responsive layouts
- ✅ Professional UI/UX

---

## 🎯 Next Steps

1. **Start Metro Bundler**
   ```bash
   npm start
   ```

2. **Launch App**
   ```bash
   # Choose one:
   npm run android    # Android
   npm run ios        # iOS
   ```

3. **Test the App**
   - Browse food listings on Home tab
   - Click a card to view details
   - Click heart to favorite
   - Check Favorites tab for saved items
   - Pull down to refresh

4. **Run Tests**
   ```bash
   npm test
   ```

---

## 📞 Support

Refer to the full documentation files:
- React Native: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- AsyncStorage: https://react-native-async-storage.github.io/
- Jest: https://jestjs.io/

---

**Happy Coding! 🚀**
