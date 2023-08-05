import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
// SQL
import {
  sqlCreateTableRecordsIfNotExists,
  sqlReadAllRecords,
  sqlResetTable
} from './../sql/records'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { startLoading, endLoading, endLoadingWithError, insertRecord } from './../redux/recordsSlice'
// Utils
import { debug } from './../utils/utils'
// Icons
import Logo from './../../assets/logo.svg'
// Styles
import gStyles from './../styles/global'

const Home = () => {
  const dispatch = useDispatch()
  const records = useSelector(state => state.records)

  useEffect(() => {
    const doWork = async () => {
      dispatch(startLoading())

      let response = await sqlCreateTableRecordsIfNotExists()

      if (!response.success) {
        debug(response.error, 'error')
        return
      }

      response = await sqlReadAllRecords()

      if (!response.success) {
        debug(response.error, 'error')
        dispatch(endLoadingWithError(response.error))
        return
      }

      response.data.rows._array.forEach(record => {
        dispatch(insertRecord(record))
      })

      dispatch(endLoading())

      // console.log(response.data)
    }

    doWork()
  }, [])

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
    <View style={gStyles.container}>
      <Logo
        width={140}
        height={140}
        fill="#0ea5e9"
      />
      <Text>Numar dosare: {records.data.length}</Text>
      <Button title="Reset Table" onPress={async () => {
        const response = await sqlResetTable()

        response.success ? debug('Table has been dropped') : debug(response.error, 'error')
      }} />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Home
