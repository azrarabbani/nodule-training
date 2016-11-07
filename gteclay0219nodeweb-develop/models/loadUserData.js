'use strict';


module.exports = function LoadUserDataModel(actor) {
    return {
        include_inactive: false,
        account_load: {
            account_criteria: {
                load_account: true,
                account_property_criteria: {

                },
                account_relationship_criteria: {
                    load_account_rel: true,
                    this_account_is: 3,
                    rel_type: 0
                }
            },
            account_number: [ actor.account_number ]
        },
        party_load: {
            party_id: [ actor.account_number ],
            party_criteria: {
                load_party: true,
                name_criteria: {
                    load_name: true
                },
                email_criteria: {
                    load_email: true
                },
                public_credential_criteria: {
                    domains_to_load_as_enum: [ 'PPALIAS' ]
                }
            }
        }
    };
};