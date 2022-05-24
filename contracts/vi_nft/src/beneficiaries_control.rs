use crate::Beneficiary;
use alloc::string::ToString;
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use cep47::contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const BENEFICIARIES_DICT: &str = "beneficiaries";
pub const TOTAL_BENEFICIARIES: &str = "total_beneficiaries";
pub const BENEFICIARIES_LIST: &str = "beneficiaries_list";
pub trait BeneficiaryControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Beneficiaries::init();
    }

    // fn revoke_beneficiary(&mut self, index: U256, address: Key) {
    //     Beneficiaries::instance().revoke_beneficiary(index, &address);
    // }

    fn add_beneficiary(&self, index: U256, value: Beneficiary) {
        Beneficiaries::instance().add_beneficiary(index, value);
    }

    fn is_beneficiary(&self) -> bool {
        let caller = self.get_caller();
        Beneficiaries::instance().is_beneficiary(&caller)
    }

    fn get_beneficiary(&self, index: U256) -> Option<Beneficiary> {
        Beneficiaries::instance().get_beneficiary(index)
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

    pub fn is_beneficiary(&self, key: &Key) -> bool {
        self.dict.get_by_key::<()>(key).is_some()
    }

    pub fn add_beneficiary(&self, index: U256, value: Beneficiary) {
        // self.dict.set_by_key(key, ());
        self.beneficiaries_list_dict.set(&index.to_string(), value);
    }

    // pub fn revoke_beneficiary(&self, index: U256, key: &Key) {
    //     self.dict.remove_by_key::<()>(key);
    //     self.beneficiaries_list_dict
    //         .remove::<Beneficiary>(&index.to_string());
    // }

    pub fn get_beneficiary(&self, index: U256) -> Option<Beneficiary> {
        self.beneficiaries_list_dict.get(&index.to_string())
    }
}

pub fn total_beneficiaries() -> U256 {
    get_key(TOTAL_BENEFICIARIES).unwrap_or_default()
}

pub fn set_total_beneficiaries(beneficiary_counter: U256) {
    set_key(TOTAL_BENEFICIARIES, beneficiary_counter);
}
