export default {
    container: {},
    content: {
        plugins_coupon : {
            active: true,
            sort_order: 5100,
            content: require('../../../../plugins/coupon').default,
            data: {
                is_cart: false
            }
        },
    }
}