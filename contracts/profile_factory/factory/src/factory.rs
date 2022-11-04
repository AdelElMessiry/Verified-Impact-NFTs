// use crate::alloc::string::ToString;
use crate::data::{self, get_all_profiles, Profiles};
use alloc::collections::BTreeMap;
use alloc::{string::String, vec::Vec};
// use casper_contract::contract_api::runtime;
// use casper_contract::contract_api::storage;
use casper_types::{ContractPackageHash, Key};
use contract_utils::{ContractContext, ContractStorage};

pub type Profile = BTreeMap<String, String>;

pub trait FACTORY<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(
        &mut self,
        all_profiles: Vec<Key>,
        contract_hash: Key,
        package_hash: ContractPackageHash,
    ) {
        data::set_owner(self.get_caller());
        data::set_all_profiles(all_profiles);
        data::set_hash(contract_hash);
        data::set_package_hash(package_hash);
        Profiles::init();
    }

    fn create_profile(&mut self, profile_hash: Key, details: Profile) {
        let mut profiles: Vec<Key> = get_all_profiles();
        profiles.push(profile_hash);
        self.set_profile(&profile_hash, details);
        self.set_all_profiles(profiles);
    }

    fn update_profile(&mut self, profile_hash: Key, details: Profile) {
        self.set_profile(&profile_hash, details);
    }

    fn get_profile(&mut self, address: Key) -> Option<Profile> {
        Profiles::instance().get(&address)
    }

    fn set_profile(&mut self, address: &Key, value: Profile) {
        Profiles::instance().set(address, value);
    }

    fn set_all_profiles(&mut self, all_profiles: Vec<Key>) {
        data::set_all_profiles(all_profiles);
    }

    fn get_all_profiles(&mut self) -> Vec<Key> {
        data::get_all_profiles()
    }

    // fn is_existent_profile(&self) -> bool {
    fn is_existent_profile(&self, address: Key) -> bool {
        Profiles::instance().is_profile(&address)
        // Profiles::instance().is_profile(self.get_caller())
    }

    fn get_package_hash(&mut self) -> ContractPackageHash {
        data::get_package_hash()
    }
}
