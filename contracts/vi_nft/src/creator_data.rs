use crate::Creator;
use alloc::string::ToString;
use casper_types::U256;
use cep47::contract_utils::{get_key, set_key, Dict};

// use crate::TokenId;

const CREATOR_DICT: &str = "creators";
pub const TOTAL_CREATORS: &str = "total_creators";

pub struct Creators {
    dict: Dict,
}

impl Creators {
    pub fn instance() -> Creators {
        Creators {
            dict: Dict::instance(CREATOR_DICT),
        }
    }

    pub fn init() {
        Dict::init(CREATOR_DICT)
    }

    pub fn get(&self, index: U256) -> Option<Creator> {
        self.dict.get(&index.to_string())
    }

    pub fn set(&self, index: U256, value: Creator) {
        self.dict.set(&index.to_string(), value);
    }

    // pub fn remove(&self, index: U256) {
    //     self.dict.remove::<Creator>(&index.to_string());
    // }
}

pub fn total_creators() -> U256 {
    get_key(TOTAL_CREATORS).unwrap_or_default()
}

pub fn set_total_creators(creator_counter: U256) {
    set_key(TOTAL_CREATORS, creator_counter);
}
