export default {
    simi_simivideo_40 : {
product: require('./plugins/simi_simivideo_40/product').default,
},
simi_loyalty_40 : {
cart: require('./plugins/simi_loyalty_40/cart').default,
checkout: require('./plugins/simi_loyalty_40/checkout').default,
myaccount: require('./plugins/simi_loyalty_40/myaccount').default,
product: require('./plugins/simi_loyalty_40/product').default,
},
simi_simicouponcode_40 : {
cart: require('./plugins/simi_simicouponcode_40/cart').default,
checkout: require('./plugins/simi_simicouponcode_40/checkout').default,
},
simi_fblogin_40 : {
login: require('./plugins/simi_fblogin_40/login').default,
},

}
