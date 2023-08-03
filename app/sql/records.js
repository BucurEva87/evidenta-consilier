import * as SQLite from 'expo-sqlite'
import { db } from './constants'

export const createTableRecordsIfNotExists = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          `CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fileNumber TEXT NOT NULL UNIQUE,
            personName TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            prisonTime TEXT NOT NULL,
            punishment TEXT NOT NULL,
            probation TEXT NOT NULL,
            expiration TEXT NOT NULL,
            judicialObligations TEXT,
            civilObligations TEXT
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

export const readAllRecords = async () => {
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

export const readRecord = async (columnName, param) => {
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

export const readCustomQueryRecord = async (query, params) => {
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

export const insertRecord = async (params) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        await tx.executeSql(
          `INSERT INTO records (
            fileNumber, personName, phoneNumber, prisonTime, punishment,
            probation, expiration, judicialObligations, civilObligations
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

export const updateRecord = async (id, columnName, param) => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      try {
        const allowedColumns = [
          'fileNumber', 'personName', 'phoneNumber', 'prisonTime', 'punishment',
          'probation', 'expiration', 'judicialObligations', 'civilObligations']

        if (!allowedColumns.includes(columnName))
          reject({ success: false, error: 'Column name not allowed for selection' })

        await tx.executeSql(
          `UPDATE records SET ${columnName} = ? WHERE id = ?`,
          [param, id],
          (txObj, resultSet) => resolve({ success: true }),
          (txObj, error) => reject({ success: false, error })
        )
      } catch (error) {
        reject({ success: false, error })
      }
    })
  })
}

export const deleteRecord = async (id) => {
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

export const resetTable = async () => {
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
