#![no_main]
#![no_std]

extern crate alloc;

use alloc::prelude::v1::Box;
use alloc::{
    collections::BTreeSet,
    format,
    string::{String, ToString},
    vec,
    vec::Vec,
};
use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    runtime_args, ApiError, CLType, CLTyped, CLValue, ContractHash, ContractPackageHash,
    EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Group, Key, Parameter, RuntimeArgs,
    URef, U256,
};
use contract_utils::{AdminControl, ContractContext, OnChainContractStorage};
use factory::{self, Profile, FACTORY};

#[repr(u16)]
pub enum Error {
    ProfileZeroAddress = 0,
    ProfileNotInWhiteList = 1,
    ProfileNotOwner = 2,
    ProfileNotAdmin = 3,
}

impl From<Error> for ApiError {
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}

#[derive(Default)]
struct Factory(OnChainContractStorage);

impl ContractContext<OnChainContractStorage> for Factory {
    fn storage(&self) -> &OnChainContractStorage {
        &self.0
    }
}

impl FACTORY<OnChainContractStorage> for Factory {}
impl AdminControl<OnChainContractStorage> for Factory {}

impl Factory {
    fn constructor(
        &mut self,
        all_profiles: Vec<Key>,
        contract_hash: ContractHash,
        package_hash: ContractPackageHash,
    ) {
        AdminControl::init(self);
        FACTORY::init(self, all_profiles, Key::from(contract_hash), package_hash);
    }
}

#[no_mangle]
fn constructor() {
    let all_profiles: Vec<Key> = runtime::get_named_arg("all_profiles");
    let contract_hash: ContractHash = runtime::get_named_arg("contract_hash");
    let package_hash: ContractPackageHash = runtime::get_named_arg("package_hash");
    Factory::default().constructor(all_profiles, contract_hash, package_hash);
    Factory::default().add_admin_without_checked(Key::Account(runtime::get_caller()));
}

/// This function is to return the all Profiles
///

#[no_mangle]
fn all_profiles() {
    let ret: Vec<Key> = Factory::default().get_all_profiles();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn is_profile_exist() {
    let ret = Factory::default().is_existent_profile();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

/// This function is to return the total length of Profiles
///

#[no_mangle]
fn all_profiles_length() {
    let ret: Vec<Key> = Factory::default().get_all_profiles();
    runtime::ret(CLValue::from_t(U256::from(ret.len())).unwrap_or_revert());
}

/// This function is to create profile of tokens provided by user agains the profile hash provided by user
///
/// # Parameters
///
/// * `profile_hash` - A Key that holds the Hash of Profile Contract
///

#[no_mangle]
fn create_profile() {
    let mode = runtime::get_named_arg::<String>("mode");
    let address = runtime::get_named_arg::<Key>("address");
    let username = runtime::get_named_arg::<String>("username");
    let tagline = runtime::get_named_arg::<String>("tagline");
    let img_url = runtime::get_named_arg::<String>("imgUrl");
    let nft_url = runtime::get_named_arg::<String>("nftUrl");
    let first_name = runtime::get_named_arg::<String>("firstName");
    let last_name = runtime::get_named_arg::<String>("lastName");
    let bio = runtime::get_named_arg::<String>("bio");
    let external_link = runtime::get_named_arg::<String>("externalLink");
    let phone = runtime::get_named_arg::<String>("phone");
    let twitter = runtime::get_named_arg::<String>("twitter");
    let instagram = runtime::get_named_arg::<String>("instagram");
    let facebook = runtime::get_named_arg::<String>("facebook");
    let medium = runtime::get_named_arg::<String>("medium");
    let telegram = runtime::get_named_arg::<String>("telegram");
    let mail = runtime::get_named_arg::<String>("mail");
    let profile_type = runtime::get_named_arg::<String>("profileType");
    let is_approved;

    if profile_type == "beneficiary" {
        is_approved = false;
    } else {
        is_approved = true;
    }

    let mut profile = Factory::default().get_profile(address).unwrap_or_default();

    profile.insert(format!("{}_address", profile_type), address.to_string());
    profile.insert(format!("{}_username", profile_type), username);
    profile.insert(format!("{}_tagline", profile_type), tagline);
    profile.insert(format!("{}_imgUrl", profile_type), img_url);
    profile.insert(format!("{}_nftUrl", profile_type), nft_url);
    profile.insert(format!("{}_firstName", profile_type), first_name);
    profile.insert(format!("{}_lastName", profile_type), last_name);
    profile.insert(format!("{}_bio", profile_type), bio);
    profile.insert(format!("{}_externalLink", profile_type), external_link);
    profile.insert(format!("{}_phone", profile_type), phone);
    profile.insert(format!("{}_twitter", profile_type), twitter);
    profile.insert(format!("{}_instagram", profile_type), instagram);
    profile.insert(format!("{}_facebook", profile_type), facebook);
    profile.insert(format!("{}_medium", profile_type), medium);
    profile.insert(format!("{}_telegram", profile_type), telegram);
    profile.insert(format!("{}_mail", profile_type), mail);
    profile.insert(
        format!("{}_isApproved", profile_type),
        is_approved.to_string(),
    );

    if mode.clone() == "ADD" {
        Factory::default().create_profile(address, profile);
    } else {
        Factory::default().update_profile(address, profile);
    }
}

/// This function is to return the the profile against tokens provided by user. If profile not found it will return hash-0000000000000000000000000000000000000000000000000000000000000000
///
/// # Parameters
///
/// * `address` - A Key that holds the Hash of address
///

#[no_mangle]
fn get_profile() {
    let address = runtime::get_named_arg::<Key>("address");
    let ret = Factory::default().get_profile(address);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn approve_beneficiary() {
    let address = runtime::get_named_arg::<Key>("address");
    let status = runtime::get_named_arg::<bool>("status");
    let caller = Key::Account(runtime::get_caller());

    if !Factory::default().is_admin(caller) {
        runtime::revert(Error::ProfileNotAdmin);
    }

    let mut profile = Factory::default().get_profile(address).unwrap_or_default();
    profile.insert(
        format!("{}_isApproved", "beneficiary".to_string()),
        status.to_string(),
    );

    Factory::default().update_profile(address, profile);
}

#[no_mangle]
fn grant_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    let caller = Key::Account(runtime::get_caller());

    if Factory::default().is_admin(caller) {
        runtime::revert(Error::ProfileNotAdmin);
    }

    Factory::default().add_admin(admin);
}

#[no_mangle]
fn revoke_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    let caller = Key::Account(runtime::get_caller());

    if Factory::default().is_admin(caller) {
        runtime::revert(Error::ProfileNotAdmin);
    }
    Factory::default().disable_admin(admin);
}

/// This function is to fetch a Contract Package Hash
///

#[no_mangle]
fn package_hash() {
    let ret: ContractPackageHash = Factory::default().get_package_hash();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

fn get_entry_points() -> EntryPoints {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        "constructor",
        vec![
            Parameter::new("all_profiles", CLType::List(Box::new(Key::cl_type()))),
            Parameter::new("contract_hash", ContractHash::cl_type()),
            Parameter::new("package_hash", ContractPackageHash::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Groups(vec![Group::new("constructor")]),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "create_profile",
        vec![
            Parameter::new("mode", String::cl_type()),
            Parameter::new("address", Key::cl_type()),
            Parameter::new("username", String::cl_type()),
            Parameter::new("tagline", String::cl_type()),
            Parameter::new("imgUrl", String::cl_type()),
            Parameter::new("nftUrl", String::cl_type()),
            Parameter::new("firstName", String::cl_type()),
            Parameter::new("lastName", String::cl_type()),
            Parameter::new("bio", String::cl_type()),
            Parameter::new("externalLink", String::cl_type()),
            Parameter::new("phone", String::cl_type()),
            Parameter::new("twitter", String::cl_type()),
            Parameter::new("instagram", String::cl_type()),
            Parameter::new("facebook", String::cl_type()),
            Parameter::new("medium", String::cl_type()),
            Parameter::new("telegram", String::cl_type()),
            Parameter::new("mail", String::cl_type()),
            Parameter::new("profileType", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "approve_beneficiary",
        vec![
            Parameter::new("address", Key::cl_type()),
            Parameter::new("status", bool::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "get_profile",
        vec![Parameter::new("address", Key::cl_type())],
        Profile::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "all_profiles",
        vec![],
        CLType::List(Box::new(Key::cl_type())),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "all_profiles_length",
        vec![],
        CLType::U256,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "is_profile_exist",
        vec![],
        CLType::Option(Box::new(CLType::Bool)),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
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
    entry_points.add_entry_point(EntryPoint::new(
        "package_hash",
        vec![],
        ContractPackageHash::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points
}

#[no_mangle]
fn call() {
    // Contract name must be same for all new versions of the contracts
    let contract_name: alloc::string::String = runtime::get_named_arg("contract_name");

    // If this is the first deployment
    if !runtime::has_key(&format!("{}_package_hash", contract_name)) {
        // Build new package with initial a first version of the contract.
        let (package_hash, access_token) = storage::create_contract_package_at_hash();
        let (contract_hash, _) =
            storage::add_contract_version(package_hash, get_entry_points(), Default::default());

        let all_profiles: Vec<Key> = Vec::new();

        // Prepare constructor args
        let constructor_args = runtime_args! {
            "all_profiles" => all_profiles,
            "contract_hash" => contract_hash,
            "package_hash"=> package_hash
        };

        // Add the constructor group to the package hash with a single URef.
        let constructor_access: URef =
            storage::create_contract_user_group(package_hash, "constructor", 1, Default::default())
                .unwrap_or_revert()
                .pop()
                .unwrap_or_revert();

        // Call the constructor entry point
        let _: () =
            runtime::call_versioned_contract(package_hash, None, "constructor", constructor_args);

        // Remove all URefs from the constructor group, so no one can call it for the second time.
        let mut urefs = BTreeSet::new();
        urefs.insert(constructor_access);
        storage::remove_contract_user_group_urefs(package_hash, "constructor", urefs)
            .unwrap_or_revert();

        // Store contract in the account's named keys.
        runtime::put_key(
            &format!("{}_package_hash", contract_name),
            package_hash.into(),
        );
        runtime::put_key(
            &format!("{}_package_hash_wrapped", contract_name),
            storage::new_uref(package_hash).into(),
        );
        runtime::put_key(
            &format!("{}_contract_hash", contract_name),
            contract_hash.into(),
        );
        runtime::put_key(
            &format!("{}_contract_hash_wrapped", contract_name),
            storage::new_uref(contract_hash).into(),
        );
        runtime::put_key(
            &format!("{}_package_access_token", contract_name),
            access_token.into(),
        );
    } else {
        // this is a contract upgrade

        let package_hash: ContractPackageHash =
            runtime::get_key(&format!("{}_package_hash", contract_name))
                .unwrap_or_revert()
                .into_hash()
                .unwrap()
                .into();

        let (contract_hash, _): (ContractHash, _) =
            storage::add_contract_version(package_hash, get_entry_points(), Default::default());

        // update contract hash
        runtime::put_key(
            &format!("{}_contract_hash", contract_name),
            contract_hash.into(),
        );
        runtime::put_key(
            &format!("{}_contract_hash_wrapped", contract_name),
            storage::new_uref(contract_hash).into(),
        );
    }
}
