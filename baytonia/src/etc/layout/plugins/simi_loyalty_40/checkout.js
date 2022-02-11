export default {
    container: {},
    content: {
        simi_spend_point : {
            active: true,
            sort_order: 4001,
            title_content: 'Spend my Points',
            content: require('../../../../plugins/rewardpoint/SpendPoint').default
        },
    }
}