use crate::Collection;
use alloc::string::ToString;
use casper_types::U256;
use cep47::contract_utils::{get_key, set_key, Dict};

const COLLECTIONS_DICT: &str = "collections";
pub const TOTAL_COLLECTIONS: &str = "total_collections";

pub struct Collections {
    dict: Dict,
}

impl Collections {
    pub fn instance() -> Collections {
        Collections {
            dict: Dict::instance(COLLECTIONS_DICT),
        }
    }

    pub fn init() {
        Dict::init(COLLECTIONS_DICT)
    }

    pub fn get(&self, index: U256) -> Option<Collection> {
        self.dict.get(&index.to_string())
    }

    pub fn is_collection(&self, index: U256) -> bool {
        self.get(index).is_some()
    }

    pub fn set(&self, index: U256, value: Collection) {
        self.dict.set(&index.to_string(), value);
    }
}

pub fn total_collections() -> U256 {
    get_key(TOTAL_COLLECTIONS).unwrap_or_default()
}

pub fn set_total_collections(collection_counter: U256) {
    set_key(TOTAL_COLLECTIONS, collection_counter);
}
