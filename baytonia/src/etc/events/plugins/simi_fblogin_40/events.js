export default {
    product_buttons: [
        {
            active: true,
            content: require('../../../../plugins/facebook/share').default,
            position: 400
        }
    ],
    app_link: [
        {
            active: true,
            action: require('../../../../plugins/facebook/applink'),
        }
    ],
    init_page: [
        {
            active: true,
            content: require('../../../../plugins/facebook/analytics').default,
            position: 2000
        }
    ],
    actions: [
      {
          active: true,
          content: require('../../../../plugins/facebook/analytics/action').default,
          position: 2000
      }
    ]
}