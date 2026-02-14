# Development Guide - Food Listing App

## Getting Started

### 1. First Time Setup

```bash
# Navigate to project directory
cd FoodListingApp

# Install dependencies (if not already done)
npm install

# Start the metro bundler
npm start

# In another terminal, run on Android
npm run android
# OR on iOS
npm run ios
```

### 2. Project Architecture

The project follows a clean, modular architecture:

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── services/        # API clients and external services
├── utils/           # Helper functions and utilities
├── styles/          # Design system and common styles
└── tests/           # Test files
```

## Adding New Features

### Adding a New Screen

1. **Create a new screen component:**
   ```javascript
   // src/screens/NewScreen.js
   import React from 'react';
   import { View, Text, SafeAreaView } from 'react-native';
   import { commonStyles } from '../styles/common';

   const NewScreen = ({ navigation }) => {
     return (
       <SafeAreaView style={commonStyles.safeArea}>
         <View style={commonStyles.container}>
           <Text>New Screen</Text>
         </View>
       </SafeAreaView>
     );
   };

   export default NewScreen;
   ```

2. **Add to navigation:**
   Editor: `src/navigation/RootNavigator.js` and add the new screen to the navigator.

### Adding a New Component

1. **Create component file:**
   ```javascript
   // src/components/NewComponent.js
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   const NewComponent = ({ prop1, prop2 }) => {
     return (
       <View>
         <Text>{prop1}</Text>
       </View>
     );
   };

   export default NewComponent;
   ```

2. **Use in screens:**
   ```javascript
   import NewComponent from '../components/NewComponent';

   // Inside your screen component
   <NewComponent prop1="value" prop2={variable} />
   ```

### Adding API Integration

1. **Create a new service:**
   ```javascript
   // src/services/newService.js
   import axios from 'axios';

   const API_BASE_URL = 'https://api.example.com';

   export const fetchNewData = async () => {
     try {
       const response = await axios.get(`${API_BASE_URL}/endpoint`);
       return {
         success: true,
         data: response.data,
       };
     } catch (error) {
       return {
         success: false,
         error: error.message || 'Failed to fetch data',
       };
     }
   };
   ```

2. **Use in screens:**
   ```javascript
   import { fetchNewData } from '../services/newService';

   const MyScreen = () => {
     useEffect(() => {
       const loadData = async () => {
         const result = await fetchNewData();
         if (result.success) {
           // Handle data
        }
      };
      loadData();
     }, []);
   };
   ```

### Adding Storage Utilities

1. **Create utility functions:**
   ```javascript
   // src/utils/dataStorage.js
   import AsyncStorage from '@react-native-async-storage/async-storage';

   const STORAGE_KEY = '@App_dataKey';

   export const saveData = async (data) => {
     try {
       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
       return { success: true };
     } catch (error) {
       return { success: false, error: error.message };
     }
   };

   export const getData = async () => {
     try {
       const data = await AsyncStorage.getItem(STORAGE_KEY);
       return data ? JSON.parse(data) : null;
     } catch (error) {
       console.error('Error reading data:', error);
       return null;
     }
   };
   ```

2. **Use in components:**
   ```javascript
   import { saveData, getData } from '../utils/dataStorage';

   const MyComponent = () => {
     useEffect(() => {
       const loadData = async () => {
         const data = await getData();
         // Use data
       };
       loadData();
     }, []);
   };
   ```

## Styling Guide

### Using Common Styles

```javascript
import { colors, spacing, borderRadius, typography, commonStyles } from '../styles/common';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
```

### Color Palette
- Primary: #FF6B35 (Orange) - Main actions, highlights
- Secondary: #004E89 (Blue) - Alternative accent
- Background: #F7F7F7 (Light Gray) - Screen backgrounds
- Text: #1A1A1A (Dark) - Main text
- TextLight: #666666 (Gray) - Secondary text
- Success: #10B981 (Green) - Success states
- Error: #EF4444 (Red) - Error states

### Spacing Units
- xs: 4px - Small gaps
- sm: 8px - Minor spacing
- md: 12px - Standard spacing
- lg: 16px - Main padding/margins
- xl: 24px - Larger sections
- xxl: 32px - Section separators

### Typography
- h1: 32px, bold (rarely used)
- h2: 24px, 600 weight (screen titles)
- h3: 20px, 600 weight (section titles)
- body1: 16px, 400 weight (main content)
- body2: 14px, 400 weight (secondary content)
- caption: 12px, 400 weight (helper text)

## Testing Guide

### Writing Unit Tests

```javascript
// src/tests/myFunction.test.js
import { myFunction } from '../utils/myFunction';

describe('myFunction', () => {
  it('should return true when condition is met', () => {
    const result = myFunction(true);
    expect(result).toBe(true);
  });

  it('should handle errors gracefully', () => {
    const result = myFunction(undefined);
    expect(result).toEqual({ error: 'Invalid input' });
  });
});
```

### Writing Component Tests

```javascript
// src/tests/MyComponent.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent prop="value" />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should call callback when button is pressed', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(
      <MyComponent onPress={mockCallback} testID="button" />
    );

    // Simulate press and verify callback
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific file
npm test favorites.test.js
```

## Performance Optimization

### 1. Use FlatList for Long Lists
```javascript
<FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <ItemComponent item={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### 2. Memoize Components
```javascript
import React, { memo } from 'react';

const MyComponent = memo(({ prop1, prop2 }) => {
  return <View>...</View>;
});

export default MyComponent;
```

### 3. Use useFocusEffect for Screen-Specific Updates
```javascript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    // This runs when screen is focused
    loadData();
  }, [])
);
```

## Common Issues and Solutions

### Issue: App crashes on startup
**Solution:** Check the App.js imports and ensure all required modules are installed.

### Issue: Navigation not working
**Solution:** Verify that all screens are properly registered in RootNavigator.js and that navigation parameters are correct.

### Issue: AsyncStorage data not persisting
**Solution:** Ensure app has proper permissions and try clearing AsyncStorage data:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear(); // Development only
```

### Issue: API calls failing
**Solution:** 
1. Check network connectivity
2. Verify API endpoint is correct
3. Check CORS policies
4. Verify response format matches expected structure

### Issue: Tests failing
**Solution:**
1. Clear Jest cache: `npm test -- --clearCache`
2. Ensure all mocks are properly set up
3. Check for async operations and use waitFor()

## Debugging Tips

### 1. Use React Native Debugger
```bash
npm install --save-dev react-native-debugger
```

### 2. Add Console Logs
```javascript
console.log('Data received:', data);
console.warn('Warning message');
console.error('Error details:', error);
```

### 3. Use React DevTools
```bash
npm install --save-dev @react-devtools/core
```

### 4. Network Request Debugging
Install and use tools like Charles Proxy or Postman to inspect API calls.

## Build and Release

### Android APK
```bash
cd android
./gradlew assembleRelease
cd ..
```
APK will be at: `android/app/build/outputs/apk/release/`

### iOS Build
```bash
cd ios
xcodebuild -scheme FoodListingApp -configuration Release
cd ..
```

## Environment Variables

Create a `.env` file for sensitive data:
```
API_URL=https://api.example.com
API_KEY=your_api_key
```

Use with:
```bash
npm install --save react-native-dotenv
```

## Code Style Guide

### Naming Conventions
- Components: PascalCase (MyComponent.js)
- Functions/variables: camelCase (myFunction, myVariable)
- Constants: UPPER_SNAKE_CASE (API_URL, MAX_ITEMS)
- Styles: camelCase (containerStyle, buttonText)

### File Organization
- One component per file
- Import statements at the top
- Constants next
- Functions/components in the middle
- Styles at the bottom
- Default export at the end

### Comments
```javascript
// Single line comment for quick notes

/**
 * Multi-line comment for function documentation
 * @param {type} paramName - Description
 * @returns {type} Description
 */
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)
- [Jest Testing](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

## Support and Troubleshooting

For common issues:
1. Check GitHub issues
2. Search Stack Overflow
3. Review React Native documentation
4. Ask in React Native community forums
