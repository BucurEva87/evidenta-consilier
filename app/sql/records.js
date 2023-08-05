import * as SQLite from 'expo-sqlite'
import { db } from './constants'

export const sqlCreateTableRecordsIfNotExists = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fileNumber TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            dateOfBirth INT NOT NULL,
            emailAddress TEXT,
            phoneNumber TEXT,
            minorFellon INT NOT NULL,
            educativeMeasures TEXT,
            prisonTime TEXT,
            punishment TEXT,
            sentenceDate INT NOT NULL,
            probation TEXT NOT NULL,
            expiration INT NOT NULL,
            obligations TEXT,
            civilObligations INT NOT NULL,
            createdAt INT NOT NULL,
            updatedAt INT NOT NULL
          )`,
          null,
          (txObj, resultSet) => resolve({ success: true }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlReadAllRecords = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          'SELECT * FROM records',
          null,
          (txObj, resultSet) => resolve({ success: true, data: resultSet }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlReadRecord = async (columnName, param) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        const allowedColumns = ['id', 'fileNumber', 'personName', 'phoneNumber']

        if (!allowedColumns.includes(columnName))
          reject({ success: false, error: 'Column name not allowed for selection' })

        await tx.executeSql(
          `SELECT * FROM records WHERE ${columnName} = ?`,
          [param],
          (txObj, resultSet) => resolve({ success: true, data: resultSet }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlReadCustomQueryRecord = async (query, params) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          query,
          params,
          (txObj, resultSet) => resolve({ success: true, data: resultSet }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlInsertRecord = async (params) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          `INSERT INTO records (
            fileNumber, name, dateOfBirth, emailAddress, phoneNumber, minorFellon,
            educativeMeasures, prisonTime, punishment, sentenceDate, probation,
            expiration, obligations, civilObligations, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          params,
          (txObj, resultSet) => resolve({ success: true, insertId: resultSet.insertId }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlUpdateRecord = async (id, columnName, param) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        const allowedColumns = [
          'fileNumber', 'name', 'dateOfBirth', 'emailAddress', 'phoneNumber', 'minorFellon',
          'educativeMeasures', 'prisonTime', 'punishment', 'sentenceDate', 'probation', 'expiration',
          'obligations', 'civilObligations', 'updatedAt'
        ]

        if (!allowedColumns.includes(columnName))
          reject({ success: false, error: 'Column name not allowed for selection' })

        await tx.executeSql(
          `UPDATE records SET ${columnName} = ?, updatedAt = ? WHERE id = ?`,
          [param, Number(new Date()), id],
          (txObj, resultSet) => resolve({ success: true }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlDeleteRecord = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          'DELETE FROM records WHERE id = ?',
          [id],
          (txObj, resultSet) => resolve({ success: true }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const sqlResetTable = async () => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(async tx => {
        await tx.executeSql(
          'DROP TABLE IF EXISTS records',
          null,
          (txObj, resultSet) => resolve({ success: true }),
          (txObj, error) => reject({ success: false, error })
        )
      })
    } catch (error) {
      reject({ success: false, error })
    }
  })
}
