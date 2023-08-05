import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
// Redux
import { useDispatch } from 'react-redux'
import { updateKey } from './../redux/fileInProgressSlice'
// Styles
import gStyles from './../styles/global'

const FileNumber = ({ data }) => {
  const dispatch = useDispatch()

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Numar dosar supraveghere</Text>
      <TextInput
        placeholder='Introduceti numar'
        value={data}
        keyboardType='numeric'
        style={styles.textInput}
        onChangeText={(value) => dispatch(updateKey({
          key: 'fileNumber',
          value
        }))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '96%',
    marginHorizontal: 'auto',
    alignItems: 'center'
  },
  label: {
    flex: 1,
    fontSize: gStyles.rem * 1.6,
    fontWeight: 'bold'
  },
  textInput: {
    textAlign: 'right'
  }
})

export default FileNumber