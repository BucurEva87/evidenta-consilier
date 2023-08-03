import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// Screen components
import Home from './screens/Home'
import Add from './screens/Add'
import Files from './screens/Files'
import Settings from './screens/Settings'
import CustomBottomTab from './components/bottomTabs/CustomBottomTab'

const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomBottomTab {...props} />}>
      <Tab.Group
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          options={{ tabBarLabel: 'Acasa' }}
          name="Home"
          component={Home}
        />
        <Tab.Screen
          options={{ tabBarLabel: 'Adauga' }}
          name="Add"
          component={Add}
        />
        <Tab.Screen
          options={{ tabBarLabel: 'Dosare' }}
          name="Files"
          component={Files}
        />
        <Tab.Screen
          options={{ tabBarLabel: 'Setari' }}
          name="Settings"
          component={Settings}
        />
      </Tab.Group>
    </Tab.Navigator>
  )
}

export default BottomTabs
