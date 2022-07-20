#![no_std]

extern crate alloc;
use alloc::{collections::BTreeMap, string::String};

pub mod data;
mod factory;

pub use factory::FACTORY;

pub type Profile = BTreeMap<String, String>;
