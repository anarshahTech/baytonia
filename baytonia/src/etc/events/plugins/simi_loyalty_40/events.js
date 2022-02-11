import Identify from '@helper/Identify';

export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_loyalty',
            route_name: "MyReward",
            label: Identify.__("My Rewards"),
            icon: 'md-medal',
            require_logged_in: true,
            is_extend: false,
            is_separator: false,
            position: 410
        }
    ],
}