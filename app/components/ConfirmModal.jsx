import React from 'react'
import { ScrollView, View, Text, Modal, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment'
import 'moment/locale/ro'
// Redux
import { useDispatch } from 'react-redux'
// Styles
import gStyles from './../styles/global'

const ConfirmModal = ({ modalVisible, setModalVisible, file, addFile }) => {
  const obligations = [
    { key: 'o1', value: 'Pregatire scolara sau calificare profesionala' },
    { key: 'o2', value: 'Frecventare programe de reintegrare sociala' },
    { key: 'o3', value: 'Interdictie parasire teritoriul Romaniei' },
    { key: 'o4', value: 'Control / Tratament / Ingrijire' },
    { key: 'o5', value: 'Interdictie intalniri persoane' },
    { key: 'o6', value: 'Interdictie frecventare locuri' },
    { key: 'o7', value: 'Interdictie conducere vehicul' },
    { key: 'o8', value: 'Interdictie detinere si folosire arme' },
    { key: 'o9', value: 'Prestare munca neremunerata' },
    { key: 'o10', value: 'Interdictie depasire limita teritoriala' },
    { key: 'o11', value: 'Prezentare la Serviciul de Probatiune' }
  ]

  return <Modal
    animationType='slide'
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <ScrollView style={styles.modal}>
      {/* Numar dosar supraveghere */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Numar dosar supraveghere</Text>
        <Text>{file.fileNumber ? file.fileNumber : 'Neintrodus'}</Text>
      </View>
      {/* Nume Prenume */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Nume prenume</Text>
        <Text>{file.name ? file.name : 'Neintrodus'}</Text>
      </View>
      {/* Data nastere */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Data nasterii</Text>
        <Text>
          {
            file.dateOfBirth
              ? moment(file.dateOfBirth).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())
              : 'Neintrodus'
          }
        </Text>
      </View>
      {/* Adresa de email */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Adresa email</Text>
        <Text>{file.emailAddress ? file.emailAddress : 'Neintrodus'}</Text>
      </View>
      {/* Numar Telefon */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Numar telefon</Text>
        <Text>{file.phoneNumber ? file.phoneNumber : 'Neintrodus'}</Text>
      </View>
      {/* Fapta in minorat */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Fapta in minorat</Text>
        <Text>{file.minorFellon ? 'Da' : 'Nu'}</Text>
      </View>
      {/* Masuri educative */}
      {
        file.educativeMeasures && <View style={styles.modalColumn}>
          <Text style={styles.modalLabel}>Masuri educative</Text>
          <Text style={styles.modalColumnContent}>file.educativeMeasures</Text>
        </View>
      }
      {/* Pedeapsa inchisorii */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Pedeapsa inchisorii</Text>
        <Text>
          {
            `${file.prisonTime.years} ${file.prisonTime.years === 1 ? 'an' : 'ani'}, `
            +
            `${file.prisonTime.months} ${file.prisonTime.months === 1 ? 'luna' : 'luni'}, `
            +
            `${file.prisonTime.days} ${file.prisonTime.days === 1 ? 'zi' : 'zile'}`
          }
        </Text>
      </View>
      {/* Condamnare */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Condamnare</Text>
        <Text>{file.punishment}</Text>
      </View>
      {/* Data ramanerii definitive a sentintei */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Data sentintei definitive</Text>
        <Text>
          {
            file.sentenceDate
              ? moment(file.sentenceDate).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())
              : 'Neintrodus'
          }
        </Text>
      </View>
      {/* Termen de supraveghere */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Termen de supraveghere</Text>
        <Text>
          {
            `${file.probation.years} ${file.probation.years === 1 ? 'an' : 'ani'}, `
            +
            `${file.probation.months} ${file.probation.months === 1 ? 'luna' : 'luni'}`
            +
            `${file.probation.days ? `${file.probation.days} ${file.probation.days === 1 ? 'zi' : 'zile'}` : ''}`
          }
        </Text>
      </View>
      {/* Finalizare termen */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Finalizare termen</Text>
        <Text>
          {
            file.expiration
              ? moment(file.expiration).format('LL').replace(/([a-z])/, (v) => v.toUpperCase())
              : 'Stabiliti termenul de supraveghere'
          }
        </Text>
      </View>
      {/* Obligatii */}
      <View style={styles.modalColumn}>
        <Text style={styles.modalLabel}>Obligatii</Text>
        <Text style={styles.modalColumnContent}>
          {
            file.obligations.map(jo => {
              return `- ${obligations.find(measure => measure.key === jo).value}`
            }).join('\n')
          }
        </Text>
      </View>
      {/* Obligatii civile */}
      <View style={styles.modalRow}>
        <Text style={styles.modalLabel}>Obligatii civile</Text>
        <Text>{file.civilObligations ? 'Da' : 'Nu'}</Text>
      </View>
      <View style={styles.modalRowSubmit}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.submitButton}
          onPress={async () => {
            const record = {
              fileNumber: file.fileNumber,
              name: file.name.trim(),
              dateOfBirth: file.dateOfBirth,
              emailAddress: file.emailAddress,
              phoneNumber : file.phoneNumber,
              minorFellon: file.minorFellon,
              educativeMeasures: JSON.stringify(file.educativeMeasures),
              prisonTime: JSON.stringify(file.prisonTime),
              punishment: file.punishment,
              sentenceDate: file.sentenceDate,
              probation: JSON.stringify(file.probation),
              expiration: JSON.stringify(file.expiration),
              obligations: JSON.stringify(file.obligations),
              civilObligations: file.civilObligations
            }

            const response = await addFile(record)

            if (!response) return

            Alert.alert(`Cazul cu numarul ${file.fileNumber} a fost salvat pe disc`)
            setModalVisible(false)
          }}
        >
          <Text style={styles.submitButtonText}>Confirma</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.modalCancelButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.submitButtonText}>Efectueaza modificari</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </Modal>
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    position: 'absolute',
    width: '90%',
    height: '90%',
    top: '5%',
    left: '5%',
    padding: gStyles.rem,
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: gStyles.rem * 1.5
  },
  modalColumn: {
    flexDirection: 'column',
    marginBottom: gStyles.rem * 1.5
  },
  modalColumnContent: {
    marginTop: 20,
    paddingLeft: 10
  },
  modalRowSubmit: {
    flexDirection: 'row',
    marginTop: gStyles.rem * 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20
  },
  modalCancelButton: {
    backgroundColor: 'lightred',
    paddingVertical: gStyles.rem * 0.6,
    paddingHorizontal: gStyles.rem * 1.2,
    borderRadius: gStyles.rem * 0.5,
  },
  modalLabel: {
    flex: 1,
    fontSize: gStyles.rem * 1.6,
    fontWeight: 'bold',
    marginBottom: -2 * gStyles.rem
  }
})

export default ConfirmModal
