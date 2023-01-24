use crate::Collection;
use alloc::string::ToString;
use casper_contract::{contract_api::storage, unwrap_or_revert::UnwrapOrRevert};
use casper_types::U256;
use cep47::contract_utils::{get_key, set_key, ContractContext, ContractStorage, Dict};

const COLLECTIONS_DICT: &str = "collections";
pub const TOTAL_COLLECTIONS: &str = "total_collections";
pub const COLLECTIONS_LIST: &str = "collections_list";
// pub const COLLECTIONS_KEYS &str = "collections_keys";
pub trait CollectionControl<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(&mut self) {
        Collections::init();
    }

    fn add_collection(&self, index: U256, value: Collection) {
        Collections::instance().add_collection(index, value);
    }

    fn is_collection(&self, index: U256) -> bool {
        Collections::instance().is_collection(&index)
    }

    fn remove_collection(&self, index: U256) {
        Collections::instance().remove_collection(index)
    }

    fn get_collection(&self, index: U256) -> Option<Collection> {
        Collections::instance().get_collection(index)
    }
}

struct Collections {
    // dict: Dict,
    collections_list_dict: Dict,
}

impl Collections {
    pub fn instance() -> Collections {
        Collections {
            // dict: Dict::instance(COLLECTIONS_DICT),
            collections_list_dict: Dict::instance(COLLECTIONS_LIST),
        }
    }
    pub fn init() {
        storage::new_dictionary(COLLECTIONS_DICT).unwrap_or_revert();
        storage::new_dictionary(COLLECTIONS_LIST).unwrap_or_revert();
    }

    pub fn is_collection(&self, index: &U256) -> bool {
        get_key::<()>(&index.to_string()).is_some()
    }

    pub fn add_collection(&self, index: U256, value: Collection) {
        set_key(&index.to_string(), ());
        // set_key(COLLECTIONS_KEYS, &index.to_string());
        self.collections_list_dict.set(&index.to_string(), value);
    }

    pub fn get_collection(&self, index: U256) -> Option<Collection> {
        self.collections_list_dict.get(&index.to_string())
    }

    pub fn remove_collection(&self, index: U256) {
        self.collections_list_dict
            .remove::<U256>(&index.to_string())
    }
}

pub fn total_collections() -> U256 {
    get_key(TOTAL_COLLECTIONS).unwrap_or_default()
}

pub fn set_total_collections(collection_counter: U256) {
    set_key(TOTAL_COLLECTIONS, collection_counter);
}
