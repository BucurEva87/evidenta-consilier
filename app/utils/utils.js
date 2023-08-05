import moment from 'moment'
import 'moment/locale/ro'

const debugFlag = true

export const debug = (message, level = 'log') => {
  if (!debugFlag) return

  console[level](message)
}

export const transformDaysDifferenceInYearsMonthsDays = (days) => {
  const now = moment()
  const then = moment().add(days)

  return {
    years: then.diff(now, 'years'),
    months: then.diff(now, 'months'),
    days: then.diff(now, 'days')
  }
}

export const getBackDaysFromDateDiff = (creation, expiration) => {
  return moment(expiration).diff(moment(creation), 'days')
}
