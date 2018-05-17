export const SiteRoutes = {
    path: '/',
    catalog: {
        path: '/catalog'
    },
    presonal: {
        path: '/personal',
        personalData: {
            path: '/personal/personal-data'
        },
        oredersHistory: {
            path: '/personal/orders-history'
        },
        changePassword: {
            path: '/personal/change-password'
        }
    },
    contacts: {
        path: '/contacts'
    },
    company: {
        path: '/company'
    },
    info: {
        title: 'Информация',
        path: '/info',
        faq: {
            title: 'Вопрос-ответ',
            path: '/info/faq'
        }
    },
    help: {
        title: 'Помощь',
        path: '/help',
        payments: {
            title: 'Условия оплаты',
            path: '/help/payments'
        },
        shipping: {
            title: 'Условия доставки',
            path: '/help/shipping'
        },
        warranty: {
            title: 'Гарантия качества',
            path: '/help/warranty'
        }
    }
}

const nodes = {
    'root': { title: '', path: '/' },
    'catalog': { title: 'Каталог', path: '/catalog' },
    'ladies': { title: 'Женщинам', path: '/catalog/ladies' },
    'gents': { title: 'Мужчинам', path: '/catalog/gents' },
    'kids': { title: 'Детям', path: '/catalog/kids' },
    'accessories': { title: 'Аксессуары', path: '/catalog/accessories' },
    'jewelry': { title: 'Бижутерия', path: '/catalog/jewelry' },
    'cart': { title: 'Корзина', path: '/cart' },
    'company': { title: 'Компания', path: '/company' },
    'news': { title: 'Новости', path: '/news' },
    'contacts': { title: 'Контакты', path: '/contacts' },
    'wholesale': { title: 'Опт', path: '/wholesale' },
    'shops': { title: 'Где купить', path: '/contacts/shops' },
    'cashback': { title: 'Програма лояльности', path: '/cashback' },
    'account': { title: 'Аккаунт', path: '/personal' },
    'personal': { title: 'Персональная информация', path: '/personal/personl-data' },
    'history': { title: 'История заказов', path: '/personal/orders-history' },
    'wishlist': { title: 'Список желаний', path: '/personal' },
    'preferences': { title: 'Настройки', path: '/personal' },
    'help': { title: 'Помощь', path: '/help' },
    'payments': { title: 'Условия оплаты', path: '/help/payments' },
    'shipping': { title: 'Условия доставки', path: '/help/shipping' },
    'warranty': { title: 'Гарантия качества', path: '/help/warranty' },
    'info': { title: 'Информация', path: '/info' },
    'faq': { title: 'Вопрос-ответ', path: '/info/faq' },
};

export const Nodes = (keys) => {
    if(_.isArray(keys)) {
        return _.map(keys, key => nodes[key] || nodes['root']);
    }

    return nodes[keys] || nodes['root'];
}