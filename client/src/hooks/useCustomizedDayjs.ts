export function useCustomizedDayjs(lang:string = 'ru'){
    const dayjs = require('dayjs')
    const localizedFormat = require('dayjs/plugin/localizedFormat')
    const duration = require('dayjs/plugin/duration')
    require('dayjs/locale/ru')
    require('dayjs/locale/en')

    dayjs.locale(lang)
    dayjs.extend(localizedFormat)
    dayjs.extend(duration)

    return dayjs
}