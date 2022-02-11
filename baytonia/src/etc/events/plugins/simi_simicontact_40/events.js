import Identify from '@helper/Identify';

export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_contact_us',
            route_name: "ContactUs",
            label: Identify.__("Contact Us"),
            icon: 'md-call',
            is_extend: false,
            is_separator: false,
            position: 630
        }
    ],
}
