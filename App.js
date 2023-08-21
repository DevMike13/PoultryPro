import { useCallback, useEffect, useState } from "react";
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';

import UserContext from './UserContext';

const App = () => {

  const [userData, setUserData] = useState(null);
  const [loaded] = useFonts({
    "DMBold": require('./assets/fonts/DMSans-Bold.ttf'),
    "DMMedium": require('./assets/fonts/DMSans-Medium.ttf'),
    "DMRegular": require('./assets/fonts/DMSans-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <AppNavigator />
    </UserContext.Provider>
  );
  
};

export default App;
