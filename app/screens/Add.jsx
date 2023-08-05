import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import CalendarPicker from 'react-native-calendar-picker'
import moment from 'moment'
import 'moment/locale/ro'
// Components
import FileNumber from './../components/FileNumber'
import ConfirmModal from './../components/ConfirmModal'
// SQL
import { sqlInsertRecord } from './../sql/records'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { newFile, updateKey, closeFile } from './../redux/fileInProgressSlice'
import { insertRecord } from './../redux/recordsSlice'
// Utils
import { transformDaysDifferenceInYearsMonthsDays, getBackDaysFromDateDiff } from './../utils/utils'
// Styles
import gStyles from './../styles/global'

const Add = () => {
  const dispatch = useDispatch()
  const file = useSelector(state => state.fileInProgress)
  const [obligations, setObligations] = useState([])
  const [educativeMeasures, setEducativeMeasures] = useState([])
  const [dateOfBirth, setDateOfBirth] = useState(Number(new Date()))
  const [sentenceDate, setSentenceDate] = useState('')
  const [showDateOfBirthCalendar, setShowDateOfBirthCalendar] = useState(false)
  const [showSentenceDateCalendar, setShowSentenceDateCalendar] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [probationInDays, setProbationInDays] = useState('')

  const addFile = async (record) => {
    const required = [
      { key: 'fileNumber', value: 'Numar dosar supraveghere' },
      { key: 'name', value: 'Nume prenume' },
      { key: 'dateOfBirth', value: 'Data nasterii' },
      { key: 'minorFellon', value: 'Fapta in minorat' },
      { key: 'sentenceDate', value: 'Data sentintei definitive' },
      { key: 'probation', value: 'Termen de supraveghere' },
      { key: 'civilObligations', value: 'Obligatii civile' },
      { key: 'createdAt', value: 'Dosar creat la data de' },
      { key: 'updatedAt', value: 'Dosar modificat la data de' }
    ].filter(({ key }) => !file.data[key] && file.data[key] !== 0).map(({ value }) => value)

    if (required.length) {
      alert(`Campurile:\n\n${required.join('\n')}\n\nsunt obligatorii. Te rugam sa le completezi.`)
      return false
    }

    let response = await sqlInsertRecord([
      record.fileNumber, record.name, record.dateOfBirth, record.emailAddress,
      record.phoneNumber, record.minorFellon, record.educativeMeasures,
      record.prisonTime, record.punishment, record.sentenceDate, record.probation,
      record.expiration, record.obligations, record.civilObligations,
      record.createdAt, record.updatedAt
    ])

    if (!response.success) {
      debug(response.error, 'error')
      return false
    }

    dispatch(insertRecord(record))
    dispatch(closeFile())
    setObligations([])
    setEducativeMeasures([])
    setDateOfBirth(Number(new Date()))
    setSentenceDate('')
    setShowDateOfBirthCalendar(false)
    setShowSentenceDateCalendar(false)

    return true
  }

  useEffect(() => {
    dispatch(newFile())
  }, [file.index])

  useEffect(() => {
    setShowDateOfBirthCalendar(false)
    dispatch(updateKey({
      key: 'dateOfBirth',
      value: Number(dateOfBirth)
    }))
    dispatch(updateKey({
      key: 'minorFellon',
      value: Number(moment().diff(new Date(dateOfBirth), 'years') < 18)
    }))
  }, [dateOfBirth])

  useEffect(() => {
    setShowSentenceDateCalendar(false)
    dispatch(updateKey({
      key: 'sentenceDate',
      value: Number(sentenceDate)
    }))
    dispatch(updateKey({
      key: 'expiration',
      value: Number(moment(sentenceDate).add({
        years: file.data.probation?.years || 0,
        months: file.data.probation?.months || 0
      }))
    }))
  }, [sentenceDate])

  useEffect(() => {
    if (file.data.id && file.data.punishment === 'liberare') {
      const daysDifference = getBackDaysFromDateDiff(file.data.createdAt, file.data.expiration)

      console.log('Zilele s-au schimbat in:', daysDifference)

      setProbationInDays(String(daysDifference))
    }
  }, [file.data.punishment, file.data.probation, file.data.expiration])

  // useEffect(() => {
  //   console.log(file.data)
  // }, [file.data])

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Numar dosar supraveghere */}
        <View style={styles.row}>
          <Text style={styles.label}>Numar dosar supraveghere</Text>
          <TextInput
            placeholder='Introduceti numar'
            value={file.data.fileNumber}
            keyboardType='numeric'
            style={styles.textInput}
            onChangeText={(text) => dispatch(updateKey({
              key: 'fileNumber',
              value: text
            }))}
          />
        </View>
        {/* Nume Prenume */}
        <View style={styles.row}>
          <Text style={styles.label}>Nume prenume</Text>
          <TextInput
            placeholder='Introduceti nume beneficiar'
            value={file.data.name}
            style={styles.textInput}
            onChangeText={(text) => dispatch(updateKey({
              key: 'name',
              value: text
            }))}
          />
        </View>
        {/* Data nasterii */}
        <View>
          <View style={styles.row}>
            <Text style={styles.label}>Data nasterii</Text>
            <TouchableOpacity onPress={() => setShowDateOfBirthCalendar(true)}>
              {
                file.data.dateOfBirth
                  ? !showDateOfBirthCalendar && <Text>{moment(file.data.dateOfBirth).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())}</Text>
                  : !showDateOfBirthCalendar && <Text>Selectati data</Text>
              }
            </TouchableOpacity>
          </View>
          { showDateOfBirthCalendar && <CalendarPicker
            onDateChange={setDateOfBirth}
            initialDate={dateOfBirth ? new Date(dateOfBirth) : new Date()}
            months={['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
              'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']}
            weekdays={['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']}
            startFromMonday={true}
            previousTitle="Anterior"
            nextTitle="Urmator"
            disabledDates={(date) => new Date(date) > new Date()}
            // selectedDayTextStyle={{ backgroundColor: '#0ea5e9', color: 'white' }}
            // todayTextStyle={{ color: 'orangered', fontWeight: 'bold' }}
            selectYearTitle="Alege anul"
            selectMonthTitle="Alege luna din anul "
          /> }
        </View>
        {/* Adresa de email */}
        <View style={styles.row}>
          <Text style={styles.label}>Adresa email</Text>
          <TextInput
            placeholder='Introduceti adresa email'
            value={file.data.emailAddress}
            style={styles.textInput}
            onChangeText={(text) => dispatch(updateKey({
              key: 'emailAddress',
              value: text
            }))}
          />
        </View>
        {/* Numar Telefon */}
        <View style={styles.row}>
          <Text style={styles.label}>Numar telefon</Text>
          <TextInput
            placeholder='Introduceti numarul de telefon'
            value={file.data.phoneNumber}
            keyboardType='phone-pad'
            style={styles.textInput}
            onChangeText={(text) => dispatch(updateKey({
              key: 'phoneNumber',
              value: text
            }))}
          />
        </View>
        {/* Fapta in minorat */}
        <View style={styles.row}>
          <Text style={styles.label}>Fapta comisa in minorat</Text>
          {
            file.data.minorFellon
              ? <Text>Da</Text>
              : <SelectList
                  data={[
                    { key: 0, value: 'Nu' },
                    { key: 1, value: 'Da' }
                  ]}
                  search={false}
                  defaultOption={
                    file.data.minorFellon 
                      ? { key: file.data.minorFellon, value: file.data.minorFellon ? 'Da' : 'Nu' }
                      : { key: 0, value: 'Nu' }
                  }
                  setSelected={(p) => dispatch(updateKey({
                    key: 'minorFellon',
                    value: p
                  }))}
                />
          }
        </View>
        {/* Masuri educative */}
        {
          file.data.minorFellon
            ? <>
                <View style={[styles.row, { marginTop: gStyles.rem, marginBottom: -gStyles.rem * 1.6 }]}>
                  <Text style={styles.label}>Masuri educative</Text>
                </View>
                <View style={[styles.row, { marginTop: gStyles.rem * 2}]}>
                  <SelectList styles={{ display: 'flex' }}
                    placeholder='Selectati masurile educative'
                    data={[
                      { key: 'me1', value: 'Stagiu de formare civica' },
                      { key: 'me2', value: 'Supravegherea' },
                      { key: 'me3', value: 'Consemnarea la sfarsit de saptamana' },
                      { key: 'me4', value: 'Asistarea zilnica' }
                    ]}
                    defaultOption={
                      file.data.educativeMeasures ? file.data.educativeMeasures : {}}
                    setSelected={(p) => dispatch(updateKey({
                      key: 'educativeMeasures',
                      value: p
                    }))}
                    search={false}
                  />
                </View>
              </>
            : null
        }
        {/* Pedeapsa inchisorii */}
        {
          !file.data.minorFellon && <>
            <View style={styles.row}>
              <Text style={styles.label}>Pedeapsa inchisorii</Text>
            </View>
            <View style={[styles.row, styles.innerRow]}>
              <SelectList
                data={ Array.from({ length: 31 }, (_, n) => n).map(n => ({ key: n, value: n+'' })) }
                search={false}
                placeholder='Ani'
                setSelected={(p) => dispatch(updateKey({
                  key: 'prisonTime',
                  value: { ...file.data.prisonTime, years: p }
                }))}
              />
              <SelectList
                data={ Array.from({ length: 12 }, (_, n) => n).map(n => ({ key: n, value: n+'' })) }
                search={false}
                placeholder='Luni'
                setSelected={(p) => dispatch(updateKey({
                  key: 'prisonTime',
                  value: { ...file.data.prisonTime, months: p }
                }))}
              />
              <SelectList
                data={ Array.from({ length: 31 }, (_, n) => n).map(n => ({ key: n, value: n+'' })) }
                search={false}
                placeholder='Zile'
                setSelected={(p) => dispatch(updateKey({
                  key: 'prisonTime',
                  value: { ...file.data.prisonTime, days: p }
                }))}
              />
            </View>
          </>
        }
        {/* Supraveghere */}
        {
          !file.data.minorFellon && <View style={styles.row}>
            <Text style={styles.label}>Supraveghere</Text>
            <SelectList
              data={[
                { key: 'suspendare', value: 'Suspendare' },
                { key: 'amanare', value: 'Amanare' },
                { key: 'mfc', value: 'Amenda in MFC'},
                { key: 'liberare', value: 'Liberare conditionata' }
              ]}
              search={false}
              defaultOption={{ key: 'suspendare', value: 'Suspendare' }}
              setSelected={(p) => dispatch(updateKey({
                key: 'punishment',
                value: p
              }))}
            />
          </View>
        }
        {/* Data ramanerii definitive a sentintei */}
        <View>
          <View style={styles.row}>
            <Text style={styles.label}>Data sentintei definitive</Text>
            <TouchableOpacity onPress={() => setShowSentenceDateCalendar(true)}>
              {
                sentenceDate
                  ? !showSentenceDateCalendar && <Text>{moment(sentenceDate).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())}</Text>
                  : !showSentenceDateCalendar && <Text>Selectati data</Text>
              }
            </TouchableOpacity>
          </View>
          { showSentenceDateCalendar && <CalendarPicker
            onDateChange={setSentenceDate}
            initialDate={new Date()}
            months={['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
              'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']}
            weekdays={['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']}
            startFromMonday={true}
            previousTitle="Anterior"
            nextTitle="Urmator"
            // selectedDayStyle={{ backgroundColor: '#0ea5e9', color: 'orangered', fontWeight: 'bold' }}
            // todayTextStyle={{ color: 'orangered', fontWeight: 'bold' }}
            disabledDates={(date) => new Date(date) > new Date()}
            selectYearTitle="Alege anul"
            selectMonthTitle="Alege luna din anul "
          /> }
        </View>
        {/* Termen de supraveghere */}
        <View style={styles.row}>
          <Text style={styles.label}>Termen de supraveghere</Text>
          {
            file.data.punishment === 'liberare' && <TextInput
              placeholder='Introduceti numarul de zile'
              value={String(Number(probationInDays))}
              keyboardType='numeric'
              style={styles.textInput}
              onChangeText={(text) => dispatch(updateKey({
                key: 'probation',
                value: transformDaysDifferenceInYearsMonthsDays(text)
              }))}
            />
          }
        </View>
        {
          file.data.punishment !== 'liberare' && <View style={[styles.row, styles.innerRow]}>
            {
              !file.data.minorFellon && <SelectList
                data={ Array.from({ length: 11 }, (_, n) => n).map(n => ({ key: n, value: n+'' })) }
                search={false}
                placeholder='Ani'
                setSelected={(p) => dispatch(updateKey({
                  key: 'probation',
                  value: { ...file.data.probation, years: p }
                }))}
              />
            }
            <SelectList
              data={ Array.from({ length: file.data.minorFellon ? 7 : 12 }, (_, n) => n).map(n => ({ key: n, value: n+'' })) }
              search={false}
              placeholder='Luni'
              setSelected={(p) => dispatch(updateKey({
                key: 'probation',
                value: { ...file.data.probation, months: p }
              }))}
            />
          </View>
        }
        {/* Finalizare termen */}
        <View style={styles.row}>
          <Text style={styles.label}>Finalizare termen</Text>
          <Text>{
            file.data.sentenceDate && file.data.probation
              ? moment(file.data.sentenceDate).add(file.data.probation).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())
              : 'Stabiliti termenul de supraveghere'
          }</Text>
        </View>
        {/* Obligatii */}
        <View style={[styles.row, { marginTop: gStyles.rem, marginBottom: -gStyles.rem * 1.6 }]}>
          <Text style={styles.label}>Obligatii </Text>
        </View>
        <View style={[styles.row, { marginTop: gStyles.rem * 2}]}>
          <MultipleSelectList styles={{ display: 'flex' }}
            placeholder='Selectati obligatiile'
            data={!file.data.minorFellon ? [
              { key: 'jo1', value: 'Pregatire scolara sau calificare profesionala' },
              { key: 'jo2', value: 'Frecventare programe de reintegrare sociala' },
              { key: 'jo3', value: 'Interdictie parasire teritoriul Romaniei' },
              { key: 'jo4', value: 'Control / Tratament / Ingrijire' },
              { key: 'jo5', value: 'Interdictie intalniri persoane' },
              { key: 'jo6', value: 'Interdictie frecventare locuri' },
              { key: 'jo7', value: 'Interdictie conducere vehicul' },
              { key: 'jo8', value: 'Interdictie detinere si folosire arme' },
              { key: 'jo9', value: 'Prestare munca neremunerata' },
            ] : [
              { key: 'jo1', value: 'Pregatire scolara sau calificare profesionala' },
              { key: 'jo10', value: 'Interdictie depasire limita teritoriala' },
              { key: 'jo5', value: 'Interdictie intalniri persoane' },
              { key: 'jo6', value: 'Interdictie frecventare locuri' },
              { key: 'jo11', value: 'Prezentare la Serviciul de Probatiune' },
              { key: 'jo4', value: 'Control / Tratament / Ingrijire' }
            ]}
            setSelected={(selected) => setObligations(selected)}
            onSelect={() => dispatch(updateKey({
              key: 'obligations',
              value: obligations
            }))}
            save="key"
            search={false}
            labelStyles={{ display: 'none' }}
          />
        </View>
        {/* Obligatii civile */}
        <View style={[styles.row, { marginTop: gStyles.rem }]}>
          <Text style={styles.label}>Obligatii civile</Text>
          <SelectList
            data={[
              { key: 0, value: 'Nu' },
              { key: 1, value: 'Da' }
            ]}
            search={false}
            defaultOption={{ key: 0, value: 'Nu' }}
            setSelected={(p) => dispatch(updateKey({
              key: 'civilObligations',
              value: p
            }))}
          />
        </View>
        {/* Buton Adauga */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>Adauga dosarul</Text>
        </TouchableOpacity>
      </ScrollView>
      { modalVisible && <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        file={file.data}
        addFile={addFile}
      /> }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 30,
    marginBottom: 100,
    paddingBottom: 30
  },
  container: {
    flexGrow: 1,
    alignItems: 'center'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '96%',
    marginHorizontal: 'auto',
    alignItems: 'center'
  },
  innerRow: {
    marginVertical: gStyles.rem,
    justifyContent: 'space-around'
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

export default Add
