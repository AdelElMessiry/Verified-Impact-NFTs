use crate::Profile;
use alloc::vec::Vec;
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{ContractPackageHash, Key};
use contract_utils::{get_key, set_key, Dict};

pub const PROFILES_DICT: &str = "profiles";
pub const ALL_PROFILES: &str = "all_profiles";
pub const OWNER: &str = "owner";
pub const CONTRACT_PACKAGE_HASH: &str = "contract_package_hash";
pub const SELF_CONTRACT_HASH: &str = "self_contract_hash";

pub struct Profiles {
    dict: Dict,
}

impl Profiles {
    pub fn instance() -> Profiles {
        Profiles {
            dict: Dict::instance(PROFILES_DICT),
        }
    }

    pub fn init() {
        Dict::init(PROFILES_DICT)
    }

    pub fn get(&self, address: &Key) -> Option<Profile> {
        self.dict.get_by_key(address)
    }

    pub fn set(&self, address: &Key, value: Profile) {
        self.dict.set_by_key(address, value);
    }

    pub fn is_profile(&self, caller: &Key) -> bool {
        self.dict.get_by_key::<()>(caller).is_some()
    }
}

pub fn set_hash(contract_hash: Key) {
    set_key(SELF_CONTRACT_HASH, contract_hash);
}

pub fn get_hash() -> Key {
    get_key(SELF_CONTRACT_HASH).unwrap_or_revert()
}

pub fn set_all_profiles(all_profiles: Vec<Key>) {
    set_key(ALL_PROFILES, all_profiles);
}

pub fn get_all_profiles() -> Vec<Key> {
    get_key(ALL_PROFILES).unwrap_or_revert()
}

pub fn set_package_hash(package_hash: ContractPackageHash) {
    set_key(CONTRACT_PACKAGE_HASH, package_hash);
}

pub fn get_package_hash() -> ContractPackageHash {
    get_key(CONTRACT_PACKAGE_HASH).unwrap_or_revert()
}

pub fn set_owner(owner: Key) {
    set_key(OWNER, owner);
}

pub fn get_owner() -> Key {
    match get_key(OWNER) {
        Some(owner) => owner,
        None => Key::from_formatted_str(
            "account-hash-0000000000000000000000000000000000000000000000000000000000000000",
        )
        .unwrap(),
    }
}
