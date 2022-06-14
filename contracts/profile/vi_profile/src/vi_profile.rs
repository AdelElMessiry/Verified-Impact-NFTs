#![no_main]
#![no_std]
#[macro_use]
extern crate alloc;

use alloc::{
    boxed::Box,
    collections::{BTreeMap, BTreeSet},
    string::String,
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
    EntryPointAccess, EntryPointType, EntryPoints, Key, Parameter, RuntimeArgs, URef, U256,
};

use contract_utils::{AdminControl, ContractContext, OnChainContractStorage};

#[repr(u16)]
pub enum Error {
    PermissionDenied = 1,
    WrongArguments = 2,
    TokenIdAlreadyExists = 3,
    TokenIdDoesntExist = 4,
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
        ProfileControl::init(self);
        AdminControl::init(self);
        profiles_control::set_total_profiles(U256::zero());
    }

    fn is_existent_profile(&self) -> bool {
        ProfileControl::is_profile(self)
    }

    fn get_profile(&self, index: U256) -> Option<Profile> {
        ProfileControl::get_profile(self, index)
    }

    fn total_profiles(&self) -> U256 {
        profiles_control::total_profiles()
    }

    fn set_profile(
        &mut self,
        mode: String,
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
    ) -> Result<(), Error> {
        let caller = ViProfile::default().get_caller();

        if !ViProfile::default().is_admin(caller) {
            revert(ApiError::User(20));
        }

        match mode.as_str() {
            "ADD" | "UPDATE" => {
                let cloned_mode = mode.clone();
                let new_profile_count = profiles_control::total_profiles()
                    .checked_add(U256::one())
                    .unwrap();

                let mut profile =
                    ProfileControl::get_profile(self, new_profile_count).unwrap_or_default();

                profile.insert(format!("mode"), mode);
                profile.insert(format!("username"), username);
                profile.insert(format!("tagline"), tagline);
                profile.insert(format!("img_url"), img_url);
                profile.insert(format!("nft_url"), nft_url);
                profile.insert(format!("first_name"), first_name);
                profile.insert(format!("last_name"), last_name);
                profile.insert(format!("bio"), bio);
                profile.insert(format!("external_link"), external_link);
                profile.insert(format!("phone"), phone);
                profile.insert(format!("twitter"), twitter);
                profile.insert(format!("instagram"), instagram);
                profile.insert(format!("facebook"), facebook);
                profile.insert(format!("medium"), medium);
                profile.insert(format!("telegram"), telegram);
                profile.insert(format!("mail"), mail);
                profile.insert(format!("profile_type"), profile_type);

                ProfileControl::add_profile(self, new_profile_count, profile);

                if cloned_mode == "ADD" {
                    profiles_control::set_total_profiles(new_profile_count);
                }
            }
            _ => {
                return Err(Error::WrongArguments);
            }
        }
        Ok(())
    }

    fn remove_profile(&mut self, index: U256, address: Key) -> Result<(), Error> {
        let caller = ViProfile::default().get_caller();

        if !ViProfile::default().is_admin(caller) {
            revert(ApiError::User(20));
        }

        ProfileControl::revoke_profile(self, index, address);

        Ok(())
    }

    fn create_profile(
        &mut self,
        mode: String,
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
    ) -> Result<(), Error> {
        let caller = ViProfile::default().get_caller();
        if !ViProfile::default().is_admin(caller) {
            revert(ApiError::User(20));
        }
        self.set_profile(
            mode,
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
        )
        .unwrap_or_revert();
        Ok(())
    }

    fn delete_profile(&mut self, index: U256, address: Key) -> Result<(), Error> {
        self.remove_profile(index, address).unwrap_or_revert();
        Ok(())
    }
}

#[no_mangle]
fn constructor() {
    let admin = runtime::get_named_arg::<Key>("admin");
    ViProfile::default().add_admin_without_checked(admin);
    ViProfile::default().constructor();
}

#[no_mangle]
fn total_profiles() {
    let ret = ViProfile::default().total_profiles();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn get_profile() {
    let index = runtime::get_named_arg::<U256>("index");
    let ret = ViProfile::default().get_profile(index);
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn is_profile_exist() {
    let ret = ViProfile::default().is_existent_profile();
    runtime::ret(CLValue::from_t(ret).unwrap_or_revert());
}

#[no_mangle]
fn add_profile() {
    let mode = runtime::get_named_arg::<String>("mode");
    let username = runtime::get_named_arg::<String>("username");
    let tagline = runtime::get_named_arg::<String>("tagline");
    let img_url = runtime::get_named_arg::<String>("img_url");
    let nft_url = runtime::get_named_arg::<String>("nft_url");
    let first_name = runtime::get_named_arg::<String>("first_name");
    let last_name = runtime::get_named_arg::<String>("last_name");
    let bio = runtime::get_named_arg::<String>("bio");
    let external_link = runtime::get_named_arg::<String>("external_link");
    let phone = runtime::get_named_arg::<String>("phone");
    let twitter = runtime::get_named_arg::<String>("twitter");
    let instagram = runtime::get_named_arg::<String>("instagram");
    let facebook = runtime::get_named_arg::<String>("facebook");
    let medium = runtime::get_named_arg::<String>("medium");
    let telegram = runtime::get_named_arg::<String>("telegram");
    let mail = runtime::get_named_arg::<String>("mail");
    let profile_type = runtime::get_named_arg::<String>("profile_type");

    ViProfile::default()
        .create_profile(
            mode,
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
        )
        .unwrap_or_revert();
}

#[no_mangle]
fn remove_profile() {
    let index = runtime::get_named_arg::<U256>("index");
    let address = runtime::get_named_arg::<Key>("address");

    ViProfile::default()
        .delete_profile(index, address)
        .unwrap_or_revert();
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
        "total_profiles",
        vec![],
        U256::cl_type(),
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
            Parameter::new("name", String::cl_type()),
            Parameter::new("description", String::cl_type()),
            Parameter::new("address", String::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "delete_profile",
        vec![
            Parameter::new("index", U256::cl_type()),
            Parameter::new("address", Key::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points
}
