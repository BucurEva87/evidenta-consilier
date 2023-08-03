import * as SQLite from 'expo-sqlite'

const DB_NAME = 'evidentaConsilier'

export const db = SQLite.openDatabase(`${DB_NAME}.db`)
