use crate::Creator;
use alloc::string::ToString;
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use cep47::contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const CREATORS_DICT: &str = "creators";
pub const TOTAL_CREATORS: &str = "total_creators";
pub const CREATORS_LIST: &str = "creators_list";
pub trait CreatorControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Creators::init();
    }

    // fn add_creator(&self, index: U256, address: String, value: Creator) {
    fn add_creator(&self, index: U256, address: Key, value: Creator) {
        Creators::instance().add_creator(index, &address, value);
    }

    fn is_creator(&mut self, address: Key) -> bool {
        Creators::instance().is_creator(&address)
    }

    fn get_creator(&self, index: U256) -> Option<Creator> {
        Creators::instance().get_creator(index)
    }
}

struct Creators {
    dict: Dict,
    creators_list_dict: Dict,
}

impl Creators {
    pub fn instance() -> Creators {
        Creators {
            dict: Dict::instance(CREATORS_DICT),
            creators_list_dict: Dict::instance(CREATORS_LIST),
        }
    }
    pub fn init() {
        storage::new_dictionary(CREATORS_DICT).unwrap_or_revert();
        storage::new_dictionary(CREATORS_LIST).unwrap_or_revert();
    }

    // pub fn is_creator(&self, key: &String) -> bool {
    pub fn is_creator(&self, key: &Key) -> bool {
        self.dict.get_by_key::<()>(key).is_some()
    }

    pub fn add_creator(&self, index: U256, key: &Key, value: Creator) {
        // set_key(key, ());
        self.dict.set_by_key(key, ());
        self.creators_list_dict.set(&index.to_string(), value);
    }

    pub fn get_creator(&self, index: U256) -> Option<Creator> {
        self.creators_list_dict.get(&index.to_string())
    }
}

pub fn total_creators() -> U256 {
    get_key(TOTAL_CREATORS).unwrap_or_default()
}

pub fn set_total_creators(creator_counter: U256) {
    set_key(TOTAL_CREATORS, creator_counter);
}
