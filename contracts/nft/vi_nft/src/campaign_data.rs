use crate::Campaign;
use alloc::string::ToString;
use casper_types::U256;
use cep47::contract_utils::{get_key, set_key, Dict};

const CAMPAIGNS_DICT: &str = "campaigns";
pub const TOTAL_CAMPAIGNS: &str = "total_campaigns";

pub struct Campaigns {
    dict: Dict,
}

impl Campaigns {
    pub fn instance() -> Campaigns {
        Campaigns {
            dict: Dict::instance(CAMPAIGNS_DICT),
        }
    }

    pub fn init() {
        Dict::init(CAMPAIGNS_DICT)
    }

    pub fn get(&self, index: U256) -> Option<Campaign> {
        self.dict.get(&index.to_string())
    }

    pub fn set(&self, index: U256, value: Campaign) {
        self.dict.set(&index.to_string(), value);
    }

    // pub fn remove(&self, index: String) {
    //     self.dict.remove::<Campaign>(&index);
    // }
}

pub fn total_campaigns() -> U256 {
    get_key(TOTAL_CAMPAIGNS).unwrap_or_default()
}

pub fn set_total_campaigns(campaign_counter: U256) {
    set_key(TOTAL_CAMPAIGNS, campaign_counter);
}
