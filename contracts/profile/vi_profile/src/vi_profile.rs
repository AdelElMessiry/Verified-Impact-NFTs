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

use casper_types::{
    runtime_args, ApiError, CLType, CLTyped, CLValue, ContractPackageHash, EntryPoint,
    EntryPointAccess, EntryPointType, EntryPoints, Group, Key, Parameter, RuntimeArgs, URef, U256,
};

use contract_utils::{AdminControl, ContractContext, OnChainContractStorage};

#[repr(u16)]
pub enum Error {
    PermissionDenied = 1,
    WrongArguments = 2,
}

impl From<Error> for ApiError {
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}

mod profiles_control;
use profiles_control::ProfileControl;

pub type Profile = BTreeMap<String, String>;

#[derive(Default)]
struct ViProfile(OnChainContractStorage);

impl ContractContext<OnChainContractStorage> for ViProfile {
    fn storage(&self) -> &OnChainContractStorage {
        &self.0
    }
}

impl ProfileControl<OnChainContractStorage> for ViProfile {}
impl AdminControl<OnChainContractStorage> for ViProfile {}

impl ViProfile {
    fn constructor(&mut self) {
        AdminControl::init(self);
        ProfileControl::init(self);
        profiles_control::set_total_profiles(U256::zero());
        profiles_control::set_all_profiles(vec![]);
    }

    fn is_existent_profile(&self) -> bool {
        ProfileControl::is_profile(self)
    }

    fn get_profile(&self, address: Key) -> Option<Profile> {
        ProfileControl::get_profile(self, address)
    }

    fn get_all_profiles(&self) -> Vec<Key> {
        profiles_control::get_all_profiles()
    }

    fn set_all_profiles(&mut self, all_profiles: Vec<Key>) {
        profiles_control::set_all_profiles(all_profiles);
    }

    fn total_profiles(&self) -> U256 {
        profiles_control::total_profiles()
    }

    fn set_profile(
        &mut self,
        mode: String,
        address: Key,
        username: String,
        tagline: String,
        img_url: String,
        nft_url: String,
        first_name: String,
        last_name: String,
        bio: String,
        external_link: String,
        phone: String,
        twitter: String,
        instagram: String,
        facebook: String,
        medium: String,
        telegram: String,
        mail: String,
        profile_type: String,
        is_approved: bool,
    ) -> Result<(), Error> {
        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let cloned_mode = mode.clone();
                let new_profile_count = profiles_control::total_profiles()
                    .checked_add(U256::one())
                    .unwrap();

                let mut profile = ProfileControl::get_profile(self, address).unwrap_or_default();

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
                    format!("{}_is_approved", profile_type),
                    is_approved.to_string(),
                );

                ProfileControl::add_profile(self, address, profile);

                if cloned_mode == "ADD" {
                    let profiles: Vec<Key> = self.get_all_profiles();
                    let mut temp_profiles = profiles.clone();
                    // temp_profiles = profiles.clone();
                    // let profile = profiles.last();
                    temp_profiles.push(address);
                    self.set_all_profiles(temp_profiles);
                    profiles_control::set_total_profiles(new_profile_count);
                }
            }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn remove_profile(&mut self, address: Key) -> Result<(), Error> {
        let caller = ViProfile::default().get_caller();

        if !ViProfile::default().is_admin(caller) {
            revert(ApiError::User(20));
        }

        ProfileControl::revoke_profile(self, address);

        Ok(())
    }

    fn create_profile(
        &mut self,
        mode: String,
        address: Key,
        username: String,
        tagline: String,
        img_url: String,
        nft_url: String,
        first_name: String,
        last_name: String,
        bio: String,
        external_link: String,
        phone: String,
        twitter: String,
        instagram: String,
        facebook: String,
        medium: String,
        telegram: String,
        mail: String,
        profile_type: String,
        is_approved: bool,
    ) -> Result<(), Error> {
        self.set_profile(
            mode,
            address,
            username,
            tagline,
            img_url,
            nft_url,
            first_name,
            last_name,
            bio,
            external_link,
            phone,
            twitter,
            instagram,
            facebook,
            medium,
            telegram,
            mail,
            profile_type,
            is_approved,
        )
        .unwrap_or_revert();
        Ok(())
    }

    fn delete_profile(&mut self, address: Key) -> Result<(), Error> {
        self.remove_profile(address).unwrap_or_revert();
        Ok(())
    }

    fn set_is_approved_beneficiary(&mut self, address: Key, status: bool) -> Result<(), Error> {
        let caller = ViProfile::default().get_caller();

        if !ViProfile::default().is_admin(caller) {
            revert(ApiError::User(20));
        }

        let mut profile = ProfileControl::get_profile(self, address).unwrap_or_default();
        profile.insert(
            format!("{}_is_approved", "beneficiary".to_string()),
            status.to_string(),
        );

        ProfileControl::add_profile(self, address, profile);

        Ok(())
    }
}

#[no_mangle]
fn constructor() {
    let admin = runtime::get_named_arg::<Key>("admin");
    ViProfile::default().constructor();
    ViProfile::default().add_admin_without_checked(admin);
}

#[no_mangle]
fn total_profiles() {
    let ret = ViProfile::default().total_profiles();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_all_profiles() {
    let ret = ViProfile::default().get_all_profiles();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn get_profile() {
    let address = runtime::get_named_arg::<Key>("address");
    let ret = ViProfile::default().get_profile(address);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn is_profile_exist() {
    let ret = ViProfile::default().is_existent_profile();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn add_profile() {
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

    if mode == "beneficiary" {
        is_approved = false;
    } else {
        is_approved = true;
    }

    ViProfile::default()
        .create_profile(
            mode,
            address,
            username,
            tagline,
            img_url,
            nft_url,
            first_name,
            last_name,
            bio,
            external_link,
            phone,
            twitter,
            instagram,
            facebook,
            medium,
            telegram,
            mail,
            profile_type,
            is_approved,
        )
        .unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn approve_beneficiary() {
    let address = runtime::get_named_arg::<Key>("address");
    let status = runtime::get_named_arg::<bool>("status");

    ViProfile::default()
        .set_is_approved_beneficiary(address, status)
        .unwrap_or_revert();
}

#[no_mangle]
fn remove_profile() {
    let address = runtime::get_named_arg::<Key>("address");

    ViProfile::default()
        .delete_profile(address)
        .unwrap_or_revert();
}

#[no_mangle]
fn grant_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    let caller = Key::Account(runtime::get_caller());

    if ViProfile::default().is_admin(caller) {
        revert(ApiError::User(20));
    }

    ViProfile::default().add_admin(admin);
}

#[no_mangle]
fn revoke_admin() {
    let admin = runtime::get_named_arg::<Key>("admin");
    let caller = Key::Account(runtime::get_caller());

    if ViProfile::default().is_admin(caller) {
        revert(ApiError::User(20));
    }
    ViProfile::default().disable_admin(admin);
}

#[no_mangle]
fn call() {
    let admin: Key = runtime::get_named_arg("admin");
    let contract_name: String = runtime::get_named_arg("contract_name");
    let (contract_hash, contract_version) = storage::new_contract(
        get_entry_points(),
        None,
        Some(String::from(&format!(
            "{}_contract_package_hash",
            contract_name
        ))),
        Some(format!("{}_package_access_token", contract_name)),
    );
    let version_uref = storage::new_uref(contract_version);

    let constructor_args = runtime_args! {
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

    runtime::put_key(
        &format!("{}_version_wrapped", contract_name),
        version_uref.into(),
    );
}

fn get_entry_points() -> EntryPoints {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        "constructor",
        vec![Parameter::new("admin", Key::cl_type())],
        <()>::cl_type(),
        EntryPointAccess::Groups(vec![Group::new("constructor")]),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "total_profiles",
        vec![],
        U256::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "get_all_profiles",
        vec![],
        CLType::List(Box::new(Key::cl_type())),
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
        "add_profile",
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
        "remove_profile",
        vec![Parameter::new("address", Key::cl_type())],
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
