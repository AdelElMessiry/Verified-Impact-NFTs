use crate::Beneficiary;
use alloc::vec::Vec;
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const BENEFICIARIES_DICT: &str = "beneficiaries";
const BENEFICIARIES_ADDRESSES_DICT: &str = "beneficiaries_addresses";
pub const TOTAL_BENEFICIARIES: &str = "total_beneficiaries";
pub const BENEFICIARIES_LIST: &str = "beneficiaries_list";
pub trait BeneficiaryControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Beneficiaries::init();
    }

    fn revoke_beneficiary(&mut self, address: Key) {
        Beneficiaries::instance().revoke_beneficiary(address);
    }

    fn add_beneficiary(&self, address: Key, value: Beneficiary) {
        Beneficiaries::instance().add_beneficiary(address, value);
    }

    fn is_beneficiary(&self) -> bool {
        let caller = self.get_caller();
        Beneficiaries::instance().is_beneficiary(&caller)
    }

    fn get_beneficiary(&self, address: Key) -> Option<Beneficiary> {
        Beneficiaries::instance().get_beneficiary(address)
    }
}

struct Beneficiaries {
    dict: Dict,
    beneficiaries_list_dict: Dict,
}

impl Beneficiaries {
    pub fn instance() -> Beneficiaries {
        Beneficiaries {
            dict: Dict::instance(BENEFICIARIES_DICT),
            beneficiaries_list_dict: Dict::instance(BENEFICIARIES_LIST),
        }
    }
    pub fn init() {
        storage::new_dictionary(BENEFICIARIES_DICT).unwrap_or_revert();
        storage::new_dictionary(BENEFICIARIES_LIST).unwrap_or_revert();
    }

    pub fn is_beneficiary(&self, address: &Key) -> bool {
        self.dict.get_by_key::<()>(address).is_some()
    }

    pub fn add_beneficiary(&self, address: Key, value: Beneficiary) {
        self.dict.set_by_key(&address, ());
        self.beneficiaries_list_dict.set_by_key(&address, value);
    }

    pub fn revoke_beneficiary(&self, address: Key) {
        self.dict.remove_by_key::<()>(&address);
        self.beneficiaries_list_dict
            .remove_by_key::<Beneficiary>(&address);
    }

    pub fn get_beneficiary(&self, address: Key) -> Option<Beneficiary> {
        self.beneficiaries_list_dict.get_by_key(&address)
    }
}

pub fn total_beneficiaries() -> U256 {
    get_key(TOTAL_BENEFICIARIES).unwrap_or_default()
}

pub fn set_total_beneficiaries(beneficiary_counter: U256) {
    set_key(TOTAL_BENEFICIARIES, beneficiary_counter);
}

pub fn set_all_beneficiaries(all_beneficiaries: Vec<Key>) {
    set_key(BENEFICIARIES_ADDRESSES_DICT, all_beneficiaries);
}

pub fn get_all_beneficiaries() -> Vec<Key> {
    get_key(BENEFICIARIES_ADDRESSES_DICT).unwrap_or_revert()
}
