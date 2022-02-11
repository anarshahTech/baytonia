export default {
    container: {},
    content: {
        default_coupon : {
            active: true,
            sort_order: 2000,
            content: require('../../../../plugins/coupon').default,
            left: false,
            data: {
                is_cart: true
            }
        },
    }
}