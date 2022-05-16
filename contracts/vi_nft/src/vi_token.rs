#![no_main]
#![no_std]
#[macro_use]
extern crate alloc;

use alloc::{
    boxed::Box,
    collections::{BTreeMap, BTreeSet},
    string::{String, ToString},
    vec::Vec,
};

use casper_contract::{
    contract_api::{
        runtime::{self, revert},
        storage,
    },
    unwrap_or_revert::UnwrapOrRevert,
};

use cep47::{
    contract_utils::{AdminControl, ContractContext, OnChainContractStorage},
    Error, Meta, TokenId, CEP47,
};

use casper_types::{
    runtime_args, ApiError, CLType, CLTyped, CLValue, ContractPackageHash, EntryPoint,
    EntryPointAccess, EntryPointType, EntryPoints, Group, Key, Parameter, RuntimeArgs, URef, U256,
};

mod minters_control;
use minters_control::MinterControl;

mod beneficiaries_control;
use beneficiaries_control::BeneficiaryControl;
// use beneficiaries_control::{Beneficiaries, BeneficiaryControl};

pub type Beneficiary = BTreeMap<String, String>;

mod campaign_data;
use campaign_data::Campaigns;

pub type Campaign = BTreeMap<String, String>;

mod collection_data;
use collection_data::Collections;

pub type Collection = BTreeMap<String, String>;

mod creator_data;
use creator_data::Creators;

pub type Creator = BTreeMap<String, String>;

#[derive(Default)]
struct ViToken(OnChainContractStorage);

impl ContractContext<OnChainContractStorage> for ViToken {
    fn storage(&self) -> &OnChainContractStorage {
        &self.0
    }
}

impl CEP47<OnChainContractStorage> for ViToken {}
impl AdminControl<OnChainContractStorage> for ViToken {}
impl MinterControl<OnChainContractStorage> for ViToken {}
impl BeneficiaryControl<OnChainContractStorage> for ViToken {}

impl ViToken {
    fn constructor(&mut self, name: String, symbol: String, meta: Meta) {
        CEP47::init(self, name, symbol, meta);
        AdminControl::init(self);
        MinterControl::init(self);
        BeneficiaryControl::init(self);
        Collections::init();
        Creators::init();
        Campaigns::init();
        campaign_data::set_total_campaigns(U256::zero());
        creator_data::set_total_creators(U256::zero());
        collection_data::set_total_collections(U256::zero());
        beneficiaries_control::set_total_beneficiaries(U256::zero());
    }

    fn beneficiary_campaign(&self, index: U256) -> Option<Campaign> {
        Campaigns::instance().get(index)
    }

    fn get_creator(&self, index: U256) -> Option<Creator> {
        Creators::instance().get(index)
    }

    fn get_collection(&self, index: U256) -> Option<Collection> {
        Collections::instance().get(index)
    }

    fn get_beneficiary(&self, index: U256) -> Option<Beneficiary> {
        BeneficiaryControl::get_beneficiary(self, index)
    }

    fn total_campaigns(&self) -> U256 {
        campaign_data::total_campaigns()
    }

    fn total_creators(&self) -> U256 {
        creator_data::total_creators()
    }

    fn total_collections(&self) -> U256 {
        collection_data::total_collections()
    }

    fn total_beneficiaries(&self) -> U256 {
        beneficiaries_control::total_beneficiaries()
    }

    fn set_beneficiary_campaign(
        &mut self,
        collection_ids: Vec<TokenId>,
        mode: String,
        name: String,
        description: String,
        wallet_address: String,
        url: String,
        requested_royalty: String,
    ) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_beneficiary() && !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        let campaigns_dict = Campaigns::instance();
        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let new_campaign_count = campaign_data::total_campaigns()
                    .checked_add(U256::one())
                    .unwrap();
                let mut campaign = campaigns_dict.get(new_campaign_count).unwrap_or_default();

                campaign.insert(format!("id: "), new_campaign_count.to_string());
                campaign.insert(format!("name: "), name);
                campaign.insert(format!("description: "), description);
                campaign.insert(format!("url: "), url);
                campaign.insert(
                    format!("collection_ids: "),
                    collection_ids.iter().map(ToString::to_string).collect(),
                );
                campaign.insert(format!("requested_royalty: "), requested_royalty);
                campaign.insert(format!("wallet_address: "), wallet_address);

                campaigns_dict.set(new_campaign_count, campaign);

                campaign_data::set_total_campaigns(new_campaign_count);
            }
            // "DELETE" => {
            //     let new_campaign_count = campaign_data::total_campaigns()
            //         .checked_sub(U256::one())
            //         .unwrap();
            //     campaigns_dict.remove(caller);
            //     campaign_data::set_total_campaigns(new_campaign_count);
            // }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn set_collection(
        &mut self,
        token_ids: Vec<TokenId>,
        mode: String,
        name: String,
        description: String,
        creator: String,
        url: String,
    ) -> Result<(), Error> {
        let collections_dict = Collections::instance();

        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let new_collection_count = collection_data::total_collections()
                    .checked_add(U256::one())
                    .unwrap();
                let mut collection = collections_dict
                    .get(new_collection_count)
                    .unwrap_or_default();

                collection.insert(
                    format!("token_ids: "),
                    token_ids.iter().map(ToString::to_string).collect(),
                );
                collection.insert(format!("id: "), new_collection_count.to_string());
                collection.insert(format!("name: "), name);
                collection.insert(format!("description: "), description);
                collection.insert(format!("url: "), url);
                collection.insert(format!("creator: "), creator);

                collections_dict.set(new_collection_count, collection);
                collection_data::set_total_collections(new_collection_count);
            }
            // "DELETE" => {
            //     let new_collection_count = collection_data::total_collections()
            //         .checked_sub(U256::one())
            //         .unwrap();
            //     collections_dict.remove(caller);
            //     collection_data::set_total_collections(new_collection_count);
            // }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn set_creator(
        &mut self,
        mode: String,
        name: String,
        description: String,
        address: String,
        url: String,
    ) -> Result<(), Error> {
        let creators_dict = Creators::instance();

        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let new_creator_count = creator_data::total_creators()
                    .checked_add(U256::one())
                    .unwrap();
                let mut creator = creators_dict.get(new_creator_count).unwrap_or_default();

                creator.insert(format!("id: "), new_creator_count.to_string());
                creator.insert(format!("name: "), name);
                creator.insert(format!("description: "), description);
                creator.insert(format!("url: "), url);
                creator.insert(format!("address: "), address);

                creators_dict.set(new_creator_count, creator);
                creator_data::set_total_creators(new_creator_count);
            }
            // "DELETE" => {
            //     let new_creator_count = creator_data::total_creators()
            //         .checked_sub(U256::one())
            //         .unwrap();
            //     creators_dict.remove(caller);
            //     creator_data::set_total_creators(new_creator_count);
            // }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn set_beneficiary(
        &mut self,
        mode: String,
        name: String,
        description: String,
        address: String,
    ) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        // let beneficiaries_dict = Beneficiaries::instance();
        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let new_beneficiary_count = beneficiaries_control::total_beneficiaries()
                    .checked_add(U256::one())
                    .unwrap();

                let mut beneficiary =
                    BeneficiaryControl::get_beneficiary(self, new_beneficiary_count)
                        .unwrap_or_default();

                beneficiary.insert(format!("id: "), new_beneficiary_count.to_string());
                beneficiary.insert(format!("name: "), name);
                beneficiary.insert(format!("description: "), description);
                beneficiary.insert(format!("address: "), address);

                BeneficiaryControl::add_beneficiary(self, new_beneficiary_count, beneficiary);
                beneficiaries_control::set_total_beneficiaries(new_beneficiary_count);
            }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn mint(
        &mut self,
        recipient: Key,
        // token_ids: Vec<TokenId>,
        token_metas: Vec<Meta>,
    ) -> Result<Vec<TokenId>, Error> {
        // let caller = ViToken::default().get_caller();
        // if !ViToken::default().is_minter() && !ViToken::default().is_admin(caller) {
        //     revert(ApiError::User(20));
        // }
        let token_id = vec![ViToken::default()
            .total_supply()
            .checked_add(U256::one())
            .unwrap()];
        let confirmed_token_ids =
            CEP47::mint(self, recipient, token_id, token_metas).unwrap_or_revert();

        Ok(confirmed_token_ids)
    }

    fn mint_copies(
        &mut self,
        recipient: Key,
        token_ids: Vec<TokenId>,
        token_meta: Meta,
        count: u32,
    ) -> Result<Vec<TokenId>, Error> {
        // let caller = ViToken::default().get_caller();
        // if !ViToken::default().is_minter() && !ViToken::default().is_admin(caller) {
        //     revert(ApiError::User(20));
        // }

        let token_metas = vec![token_meta; count as usize];
        let confirmed_token_ids =
            CEP47::mint(self, recipient, token_ids, token_metas).unwrap_or_revert();
        Ok(confirmed_token_ids)
    }

    fn burn(&mut self, owner: Key, token_ids: Vec<TokenId>) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_minter() && !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }

        CEP47::burn_internal(self, owner, token_ids.clone()).unwrap_or_revert();

        Ok(())
    }

    fn set_token_meta(&mut self, token_id: TokenId, token_meta: Meta) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_minter() && !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        CEP47::set_token_meta(self, token_id, token_meta).unwrap_or_revert();
        Ok(())
    }

    fn update_token_meta(
        &mut self,
        token_id: TokenId,
        token_meta_key: String,
        token_meta_value: String,
    ) -> Result<(), Error> {
        // let caller = ViToken::default().get_caller();
        // if !ViToken::default().is_minter() && !ViToken::default().is_admin(caller) {
        //     revert(ApiError::User(20));
        // }
        let mut token_meta = ViToken::default()
            .token_meta(token_id.clone())
            .unwrap_or_revert();
        token_meta.insert(token_meta_key, token_meta_value);
        CEP47::set_token_meta(self, token_id, token_meta).unwrap_or_revert();
        Ok(())
    }

    fn create_campaign(
        &mut self,
        collection_ids: Vec<TokenId>,
        mode: String,
        name: String,
        description: String,
        wallet_address: String,
        url: String,
        requested_royalty: String,
    ) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        self.set_beneficiary_campaign(
            collection_ids,
            mode,
            name,
            description,
            wallet_address,
            url,
            requested_royalty,
        )
        .unwrap_or_revert();
        Ok(())
    }

    fn create_beneficiary(
        &mut self,
        mode: String,
        name: String,
        description: String,
        address: String,
    ) -> Result<(), Error> {
        let caller = ViToken::default().get_caller();
        if !ViToken::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        self.set_beneficiary(mode, name, description, address)
            .unwrap_or_revert();
        Ok(())
    }

    fn add_collection(
        &mut self,
        token_ids: Vec<TokenId>,
        mode: String,
        name: String,
        description: String,
        creator: String,
        url: String,
    ) -> Result<(), Error> {
        self.set_collection(token_ids, mode, name, description, creator, url)
            .unwrap_or_revert();
        Ok(())
    }

    fn add_creator(
        &mut self,
        mode: String,
        name: String,
        description: String,
        address: String,
        url: String,
    ) -> Result<(), Error> {
        self.set_creator(mode, name, description, address, url)
            .unwrap_or_revert();
        Ok(())
    }
}

#[no_mangle]
fn constructor() {
    let name = runtime::get_named_arg::<String>("name");
    let symbol = runtime::get_named_arg::<String>("symbol");
    let meta = runtime::get_named_arg::<Meta>("meta");
    let admin = runtime::get_named_arg::<Key>("admin");
    ViToken::default().constructor(name, symbol, meta);
    ViToken::default().add_admin_without_checked(admin);
}

#[no_mangle]
fn name() {
    let ret = ViToken::default().name();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn symbol() {
    let ret = ViToken::default().symbol();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn meta() {
    let ret = ViToken::default().meta();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn total_supply() {
    let ret = ViToken::default().total_supply();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn total_campaigns() {
    let ret = ViToken::default().total_campaigns();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn total_collections() {
    let ret = ViToken::default().total_collections();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn total_creators() {
    let ret = ViToken::default().total_creators();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn total_beneficiaries() {
    let ret = ViToken::default().total_beneficiaries();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_beneficiary() {
    let index = runtime::get_named_arg::<U256>("index");
    let ret = ViToken::default().get_beneficiary(index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn balance_of() {
    let owner = runtime::get_named_arg::<Key>("owner");
    let ret = ViToken::default().balance_of(owner);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn owner_of() {
    let token_id = runtime::get_named_arg::<TokenId>("token_id");
    let ret = ViToken::default().owner_of(token_id);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_token_by_index() {
    let owner = runtime::get_named_arg::<Key>("owner");
    let index = runtime::get_named_arg::<U256>("index");
    let ret = ViToken::default().get_token_by_index(owner, index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn token_meta() {
    let token_id = runtime::get_named_arg::<TokenId>("token_id");
    let ret = ViToken::default().token_meta(token_id);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn beneficiary_campaign() {
    let campaign_index = runtime::get_named_arg::<U256>("index");
    let ret = ViToken::default().beneficiary_campaign(campaign_index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_collection() {
    let index = runtime::get_named_arg::<U256>("index");
    let ret = ViToken::default().get_collection(index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_creator() {
    let index = runtime::get_named_arg::<U256>("index");
    let ret = ViToken::default().get_creator(index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn set_token_meta() {
    let token_id = runtime::get_named_arg::<TokenId>("token_id");
    let token_meta = runtime::get_named_arg::<Meta>("token_meta");
    ViToken::default()
        .set_token_meta(token_id, token_meta)
        .unwrap_or_revert();
}

#[no_mangle]
fn update_token_meta() {
    let token_id = runtime::get_named_arg::<TokenId>("token_id");
    let token_meta_key = runtime::get_named_arg::<String>("token_meta_key");
    let token_meta_value = runtime::get_named_arg::<String>("token_meta_value");
    ViToken::default()
        .update_token_meta(token_id, token_meta_key, token_meta_value)
        .unwrap_or_revert();
}

#[no_mangle]
fn create_campaign() {
    let collection_ids = runtime::get_named_arg::<Vec<TokenId>>("collection_ids");
    let mode = runtime::get_named_arg::<String>("mode");
    let name = runtime::get_named_arg::<String>("name");
    let description = runtime::get_named_arg::<String>("description");
    let wallet_address = runtime::get_named_arg::<String>("wallet_address");
    let url = runtime::get_named_arg::<String>("url");
    let requested_royalty = runtime::get_named_arg::<String>("requested_royalty");
    ViToken::default()
        .create_campaign(
            collection_ids,
            mode,
            name,
            description,
            wallet_address,
            url,
            requested_royalty,
        )
        .unwrap_or_revert();
}

#[no_mangle]
fn add_collection() {
    let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");
    let mode = runtime::get_named_arg::<String>("mode");
    let name = runtime::get_named_arg::<String>("name");
    let description = runtime::get_named_arg::<String>("description");
    let creator = runtime::get_named_arg::<String>("creator");
    let url = runtime::get_named_arg::<String>("url");

    ViToken::default()
        .add_collection(token_ids, mode, name, description, creator, url)
        .unwrap_or_revert();
}

#[no_mangle]
fn add_creator() {
    let mode = runtime::get_named_arg::<String>("mode");
    let name = runtime::get_named_arg::<String>("name");
    let description = runtime::get_named_arg::<String>("description");
    let address = runtime::get_named_arg::<String>("address");
    let url = runtime::get_named_arg::<String>("url");

    ViToken::default()
        .add_creator(mode, name, description, address, url)
        .unwrap_or_revert();
}

#[no_mangle]
fn mint() {
    let recipient = runtime::get_named_arg::<Key>("recipient");
    // let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");
    // let token_id = vec![ViToken::default().total_supply()];
    let token_metas = runtime::get_named_arg::<Vec<Meta>>("token_metas");

    ViToken::default()
        .mint(recipient, token_metas)
        .unwrap_or_revert();
}

#[no_mangle]
fn mint_copies() {
    let recipient = runtime::get_named_arg::<Key>("recipient");
    let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");
    let token_meta = runtime::get_named_arg::<Meta>("token_meta");
    let count = runtime::get_named_arg::<u32>("count");

    ViToken::default()
        .mint_copies(recipient, token_ids, token_meta, count)
        .unwrap_or_revert();
}

#[no_mangle]
fn burn() {
    let owner = runtime::get_named_arg::<Key>("owner");
    let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");
    ViToken::default().burn(owner, token_ids).unwrap_or_revert()
}

#[no_mangle]
fn transfer() {
    let recipient = runtime::get_named_arg::<Key>("recipient");
    let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");

    ViToken::default()
        .transfer(recipient, token_ids)
        .unwrap_or_revert();
}

#[no_mangle]
fn transfer_from() {
    let sender = runtime::get_named_arg::<Key>("sender");
    let recipient = runtime::get_named_arg::<Key>("recipient");
    let token_ids = runtime::get_named_arg::<Vec<TokenId>>("token_ids");
    let caller = ViToken::default().get_caller();
    if !ViToken::default().is_admin(caller) {
        revert(ApiError::User(20));
    }
    ViToken::default()
        .transfer_from_internal(sender, recipient, token_ids)
        .unwrap_or_revert();
}

#[no_mangle]
fn grant_minter() {
    let minter = runtime::get_named_arg::<Key>("minter");
    ViToken::default().assert_caller_is_admin();
    ViToken::default().add_minter(minter);
}

#[no_mangle]
fn revoke_minter() {
    let minter = runtime::get_named_arg::<Key>("minter");
    ViToken::default().assert_caller_is_admin();
    ViToken::default().revoke_minter(minter);
}

#[no_mangle]
fn add_beneficiary() {
    let mode = runtime::get_named_arg::<String>("mode");
    let name = runtime::get_named_arg::<String>("name");
    let description = runtime::get_named_arg::<String>("description");
    let address = runtime::get_named_arg::<String>("address");

    ViToken::default()
        .create_beneficiary(mode, name, description, address)
        .unwrap_or_revert();
}

// #[no_mangle]
// fn remove_beneficiary() {
//     let index = runtime::get_named_arg::<U256>("index");
//     let beneficiary = runtime::get_named_arg::<Key>("beneficiary");
//     ViToken::default().assert_caller_is_admin();
//     ViToken::default().revoke_beneficiary(index, beneficiary);
// }

#[no_mangle]
fn grant_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    ViToken::default().add_admin(admin);
}

#[no_mangle]
fn revoke_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    ViToken::default().disable_admin(admin);
}

#[no_mangle]
fn call() {
    // Read arguments for the constructor call.
    let name: String = runtime::get_named_arg("name");
    let symbol: String = runtime::get_named_arg("symbol");
    let meta: Meta = runtime::get_named_arg("meta");
    let admin: Key = runtime::get_named_arg("admin");
    let contract_name: String = runtime::get_named_arg("contract_name");

    let (contract_hash, _) = storage::new_contract(
        get_entry_points(),
        None,
        Some(String::from(&format!(
            "{}_contract_package_hash",
            contract_name
        ))),
        Some(format!("{}_package_access_token", contract_name)),
    );

    // Prepare constructor args
    let constructor_args = runtime_args! {
        "name" => name,
        "symbol" => symbol,
        "meta" => meta,
        "admin" => admin
    };

    let package_hash = ContractPackageHash::new(
        runtime::get_key(&format!("{}_contract_package_hash", contract_name))
            .unwrap_or_revert()
            .into_hash()
            .unwrap_or_revert(),
    );

    // Add the constructor group to the package hash with a single URef.
    let constructor_access: URef =
        storage::create_contract_user_group(package_hash, "constructor", 1, Default::default())
            .unwrap_or_revert()
            .pop()
            .unwrap_or_revert();

    // Call the constructor entry point
    let _: () = runtime::call_contract(contract_hash, "constructor", constructor_args);

    // Remove all URefs from the constructor group, so no one can call it for the second time.
    let mut urefs = BTreeSet::new();
    urefs.insert(constructor_access);
    storage::remove_contract_user_group_urefs(package_hash, "constructor", urefs)
        .unwrap_or_revert();

    // Store contract in the account's named keys.
    runtime::put_key(
        &format!("{}_contract_hash", contract_name),
        contract_hash.into(),
    );
    runtime::put_key(
        &format!("{}_contract_hash_wrapped", contract_name),
        storage::new_uref(contract_hash).into(),
    );
    runtime::put_key(
        &format!("{}_package_hash_wrapped", contract_name),
        storage::new_uref(package_hash).into(),
    );
}

fn get_entry_points() -> EntryPoints {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        "constructor",
        vec![
            Parameter::new("name", String::cl_type()),
            Parameter::new("symbol", String::cl_type()),
            Parameter::new("meta", Meta::cl_type()),
            Parameter::new("admin", Key::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Groups(vec![Group::new("constructor")]),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "name",
        vec![],
        String::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "symbol",
        vec![],
        String::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "meta",
        vec![],
        Meta::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "total_supply",
        vec![],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "total_campaigns",
        vec![],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "total_collections",
        vec![],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "total_creators",
        vec![],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "balance_of",
        vec![Parameter::new("owner", Key::cl_type())],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "owner_of",
        vec![Parameter::new("token_id", TokenId::cl_type())],
        CLType::Option(Box::new(CLType::Key)),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "get_token_by_index",
        vec![
            Parameter::new("owner", Key::cl_type()),
            Parameter::new("index", U256::cl_type()),
        ],
        CLType::Option(Box::new(TokenId::cl_type())),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "token_meta",
        vec![Parameter::new("token_id", TokenId::cl_type())],
        Meta::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "beneficiary_campaign",
        vec![Parameter::new("beneficiary", Key::cl_type())],
        Campaign::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "get_collection",
        vec![Parameter::new("address", Key::cl_type())],
        Collection::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "get_creator",
        vec![Parameter::new("index", U256::cl_type())],
        Creator::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "set_token_meta",
        vec![
            Parameter::new("token_id", String::cl_type()),
            Parameter::new("token_meta", Meta::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "create_campaign",
        vec![
            Parameter::new("token_ids", CLType::List(Box::new(TokenId::cl_type()))),
            Parameter::new("mode", String::cl_type()),
            Parameter::new("name", String::cl_type()),
            Parameter::new("description", String::cl_type()),
            Parameter::new("wallet_address", Key::cl_type()),
            Parameter::new("url", String::cl_type()),
            Parameter::new("requested_royalty", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "add_collection",
        vec![
            Parameter::new("mode", String::cl_type()),
            Parameter::new("name", String::cl_type()),
            Parameter::new("description", String::cl_type()),
            Parameter::new("creator", Key::cl_type()),
            Parameter::new("url", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "add_creator",
        vec![
            Parameter::new("mode", String::cl_type()),
            Parameter::new("name", String::cl_type()),
            Parameter::new("description", String::cl_type()),
            Parameter::new("address", Key::cl_type()),
            Parameter::new("url", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "update_token_meta",
        vec![
            Parameter::new("token_id", TokenId::cl_type()),
            Parameter::new("token_meta_key", String::cl_type()),
            Parameter::new("token_meta_value", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "mint",
        vec![
            Parameter::new("recipient", Key::cl_type()),
            // Parameter::new("token_ids", CLType::List(Box::new(TokenId::cl_type()))),
            Parameter::new("token_metas", CLType::List(Box::new(Meta::cl_type()))),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "mint_copies",
        vec![
            Parameter::new("recipient", Key::cl_type()),
            Parameter::new(
                "token_ids",
                CLType::Option(Box::new(CLType::List(Box::new(TokenId::cl_type())))),
            ),
            Parameter::new("token_meta", Meta::cl_type()),
            Parameter::new("count", CLType::U32),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "burn",
        vec![
            Parameter::new("owner", Key::cl_type()),
            Parameter::new("token_ids", CLType::List(Box::new(TokenId::cl_type()))),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "transfer",
        vec![
            Parameter::new("recipient", Key::cl_type()),
            Parameter::new("token_ids", CLType::List(Box::new(TokenId::cl_type()))),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "transfer_from",
        vec![
            Parameter::new("sender", Key::cl_type()),
            Parameter::new("recipient", Key::cl_type()),
            Parameter::new("token_ids", CLType::List(Box::new(TokenId::cl_type()))),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "grant_minter",
        vec![Parameter::new("minter", Key::cl_type())],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "revoke_minter",
        vec![Parameter::new("minter", Key::cl_type())],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "add_beneficiary",
        vec![
            Parameter::new("mode", String::cl_type()),
            Parameter::new("name", String::cl_type()),
            Parameter::new("description", String::cl_type()),
            Parameter::new("address", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    // entry_points.add_entry_point(EntryPoint::new(
    //     "remove_beneficiary",
    //     vec![
    //         Parameter::new("index", U256::cl_type()),
    //         Parameter::new("beneficiary", Key::cl_type()),
    //     ],
    //     <()>::cl_type(),
    //     EntryPointAccess::Public,
    //     EntryPointType::Contract,
    // ));
    entry_points.add_entry_point(EntryPoint::new(
        "grant_admin",
        vec![Parameter::new("admin", Key::cl_type())],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "revoke_admin",
        vec![Parameter::new("admin", Key::cl_type())],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points
}
