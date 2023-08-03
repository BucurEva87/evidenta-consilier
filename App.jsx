import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
// Components
import BottomTabs from './app/BottomTabs'
// Redux
import { Provider } from 'react-redux'
import store from './app/redux/store'
// Styles
import gStyles from './app/styles/global'

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={'dark-content'} />
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App
