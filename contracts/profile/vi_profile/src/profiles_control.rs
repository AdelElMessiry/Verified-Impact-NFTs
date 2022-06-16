use crate::Profile;
use alloc::{string::ToString, vec::Vec};
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const PROFILES_DICT: &str = "profiles";
const PROFILES_ADDRESSES_DICT: &str = "profiles_addresses";
pub const TOTAL_PROFILES: &str = "total_profiles";
pub const PROFILES_LIST: &str = "profiles_list";
pub trait ProfileControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Profiles::init();
    }

    fn revoke_profile(&mut self, address: Key) {
        Profiles::instance().revoke_profile(address);
    }

    fn add_profile(&self, address: Key, value: Profile) {
        Profiles::instance().add_profile(address, value);
    }

    fn is_profile(&self) -> bool {
        let caller = self.get_caller();
        Profiles::instance().is_profile(&caller)
    }

    fn get_profile(&self, address: Key) -> Option<Profile> {
        Profiles::instance().get_profile(address)
    }
}

struct Profiles {
    dict: Dict,
    profiles_list_dict: Dict,
}

impl Profiles {
    pub fn instance() -> Profiles {
        Profiles {
            dict: Dict::instance(PROFILES_DICT),
            profiles_list_dict: Dict::instance(PROFILES_LIST),
        }
    }
    pub fn init() {
        storage::new_dictionary(PROFILES_DICT).unwrap_or_revert();
        storage::new_dictionary(PROFILES_LIST).unwrap_or_revert();
    }

    pub fn is_profile(&self, address: &Key) -> bool {
        self.dict.get_by_key::<()>(address).is_some()
    }

    pub fn add_profile(&self, address: Key, value: Profile) {
        self.dict.set_by_key(&address, ());
        self.profiles_list_dict.set(&address.to_string(), value);
    }

    pub fn revoke_profile(&self, address: Key) {
        self.dict.remove_by_key::<()>(&address);
        self.profiles_list_dict
            .remove::<Profile>(&address.to_string());
    }

    pub fn get_profile(&self, address: Key) -> Option<Profile> {
        self.profiles_list_dict.get(&address.to_string())
    }
}

pub fn total_profiles() -> U256 {
    get_key(TOTAL_PROFILES).unwrap_or_default()
}

pub fn set_total_profiles(profile_counter: U256) {
    set_key(TOTAL_PROFILES, profile_counter);
}

pub fn set_all_profiles(all_profiles: Vec<Key>) {
    set_key(PROFILES_ADDRESSES_DICT, all_profiles);
}

pub fn get_all_profiles() -> Vec<Key> {
    get_key(PROFILES_ADDRESSES_DICT).unwrap_or_revert()
}
