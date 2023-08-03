import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

const circleContainerSize = 50

const AnimatedCircle = ({ circleX }) => {
  const circleContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: circleX.value - circleContainerSize / 2 }]
    }
  }, [])

  return <Animated.View style={[circleContainerStyle, styles.container]} />
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -circleContainerSize / 2.1,
    width: circleContainerSize,
    borderRadius: circleContainerSize,
    height: circleContainerSize,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default AnimatedCircle
