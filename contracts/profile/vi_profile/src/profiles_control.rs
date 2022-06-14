use crate::Profile;
use alloc::string::ToString;
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const PROFILES_DICT: &str = "profiles";
pub const TOTAL_PROFILES: &str = "total_profiles";
pub const PROFILES_LIST: &str = "profiles_list";
pub trait ProfileControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Profiles::init();
    }

    fn revoke_profile(&mut self, index: U256, address: Key) {
        Profiles::instance().revoke_profile(index, &address);
    }

    fn add_profile(&self, index: U256, value: Profile) {
        Profiles::instance().add_profile(index, value);
    }

    fn is_profile(&self) -> bool {
        let caller = self.get_caller();
        Profiles::instance().is_profile(&caller)
    }

    fn get_profile(&self, index: U256) -> Option<Profile> {
        Profiles::instance().get_profile(index)
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

    pub fn is_profile(&self, key: &Key) -> bool {
        self.dict.get_by_key::<()>(key).is_some()
    }

    pub fn add_profile(&self, index: U256, value: Profile) {
        self.profiles_list_dict.set(&index.to_string(), value);
    }

    pub fn revoke_profile(&self, index: U256, key: &Key) {
        self.dict.remove_by_key::<()>(key);
        self.profiles_list_dict
            .remove::<Profile>(&index.to_string());
    }

    pub fn get_profile(&self, index: U256) -> Option<Profile> {
        self.profiles_list_dict.get(&index.to_string())
    }
}

pub fn total_profiles() -> U256 {
    get_key(TOTAL_PROFILES).unwrap_or_default()
}

pub fn set_total_profiles(profile_counter: U256) {
    set_key(TOTAL_PROFILES, profile_counter);
}
