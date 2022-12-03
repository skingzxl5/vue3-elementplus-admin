import { createI18n } from 'vue-i18n'
import storage from '@/utils/storage'

import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

import en from './locales/en'
import zh from './locales/zh-cn'

const messages = {
    [enLocale.name]:{
        el: enLocale.el,
        ...en
    },
    [zhLocale.name]:{
        el: zhLocale.el,
        ...zh
    }
}

export const getLocale = () => {
    const cookieLanguage = storage.get('language')
    if (cookieLanguage) {
        return cookieLanguage
    }
    const language = navigator.language.toLowerCase()
    const locales = Object.keys(messages)
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale
        }
    }

    // Default language is zh-cn
    return zhLocale.name
}

const i18n = createI18n({
    legacy:false,
    locale: getLocale(),
    messages: messages
})

export function loadI18n(app) {
    app.use(i18n);
}

export function useI18n(){
    return i18n;
}