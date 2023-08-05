import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import moment from 'moment'
import 'moment/locale/ro'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { openFile, closeFile } from './../redux/fileInProgressSlice'
// Icons
import { AntDesign } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'
// Styles
import gStyles from './../styles/global'
import { SCREEN_WIDTH } from './../constants/Screen'

const Files = ({ navigation }) => {
  const dispatch = useDispatch()
  const records = useSelector(state => state.records.data)
  const [displayRecords, setDisplayRecords] = useState([])

  useEffect(() => {
    setDisplayRecords(records)
  }, [records])

  const search = (value) => {
    if (!value) {
      setDisplayRecords(records)
      return
    }

    setDisplayRecords(records.filter(record => {
      const nameTest = new RegExp(value, 'i').test(record.name)
      const fileNumberTest = new RegExp(value, 'i').test(record.fileNumber)

      return nameTest || fileNumberTest
    }))
  }

  const renderRecord = ({ item: record }) => {
    return <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
      <View style={styles.record}>
        <TouchableOpacity
          onPress={() => handleOpenFile(record)}
        >
          <AntDesign name="folder1" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.textRecordNumber}>#{record.fileNumber}</Text>
        <Text style={styles.textRecordName}>{record.name}</Text>
      </View>
    </View>
  }

  const handleOpenFile = (record) => {
    dispatch(openFile(record))
    navigation.navigate('Add')
  }

  if (records.loading) {
    return (
      <View style={gStyles.container}>
        <Text>Datele se incarca...</Text>
      </View>
    )
  }

  if (records.error) {
    return (
      <View style={gStyles.container}>
        <Text>EROARE: {records.error}</Text>
      </View>
    )
  }

  return (
    <View style={[gStyles.container, styles.mainContainer]}>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder='Cauta dupa nume sau numar dosar...'
          style={styles.searchBarTextInput}
          onChangeText={(text) => search(text)}
        />
        <EvilIcons name="search" size={24} color="black" />
      </View>
      {
        displayRecords.length
          ? <FlatList
              data={displayRecords}
              renderItem={renderRecord}
              keyExtractor={(item, index) => index}
              style={styles.flatList}
              numColumns={2}
            />
          : <Text>Nu exista dosare.</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 30,
    marginBottom: 100,
    paddingBottom: 30,
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  searchBarContainer: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarTextInput: {
    width: '80%'
  },
  flatList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  record: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 2 - 10,
    backgroundColor: 'lightgray'
  },
  textRecordNumber: {
    color: 'gray',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  textRecordName: {
    textAlign: 'center',
    color: '#0ea5e9'
  }
})

export default Files
