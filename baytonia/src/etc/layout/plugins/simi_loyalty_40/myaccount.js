import Identify from '@helper/Identify';

export default {
    container: {

    },
    content: {
        simi_my_reward: {
            active: true,
            sort_order: 3001,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'my_rewardpoint',
                iconName: 'md-medal',
                label: Identify.__('My Rewards'),
                extendable: true
            }
        },
    }
}