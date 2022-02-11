export default {
    init_page: [
        {
            active: true,
            content: require('../../../../plugins/mixpanel').default,
            position: 3000
        }
    ],
    actions: [
      {
          active: false,
          content: require('../../../../plugins/mixpanel/action.js').default,
          position: 3000
      }
    ],
}
