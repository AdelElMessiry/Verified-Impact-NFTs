use casper_types::{account::AccountHash, Key, U256};
use test_env::TestEnv;

use crate::vi_instance::{CivicInstance, Meta, TokenId, ViInstance};

const NAME: &str = "ViNFT";
const SYMBOL: &str = "VNFT";

mod meta {
    use super::Meta;
    pub fn contract_meta() -> Meta {
        let mut meta = Meta::new();
        meta.insert("origin".to_string(), "small".to_string());
        meta
    }

    pub fn big_vi() -> Meta {
        let mut meta = Meta::new();
        meta.insert("size".to_string(), "big".to_string());
        meta
    }

    pub fn medium_vi() -> Meta {
        let mut meta = Meta::new();
        meta.insert("size".to_string(), "medium".to_string());
        meta
    }
}

fn deploy() -> (TestEnv, CivicInstance, ViInstance, AccountHash) {
    let env = TestEnv::new();
    let owner = env.next_user();
    let (kyc_token, vi_token) = ViInstance::new(
        &env,
        NAME,
        owner,
        NAME,
        SYMBOL,
        meta::contract_meta(),
        Key::Account(owner),
    );
    (env, kyc_token, vi_token, owner)
}

#[test]
fn test_deploy() {
    let (_, _, token, owner) = deploy();
    assert_eq!(token.name(), NAME);
    assert_eq!(token.symbol(), SYMBOL);
    assert_eq!(token.meta(), meta::contract_meta());
    assert_eq!(token.total_supply(), U256::zero());
    assert!(token.is_admin(owner));
}

#[test]
fn test_grant_admin() {
    let (env, _, token, owner) = deploy();
    let user = env.next_user();

    token.grant_admin(owner, user);
    assert!(token.is_admin(user));
}

#[test]
fn test_revoke_admin() {
    let (env, _, token, owner) = deploy();
    let user = env.next_user();

    token.grant_admin(owner, user);
    assert!(token.is_admin(user));

    token.revoke_admin(owner, user);
    assert!(!token.is_admin(user));
}

#[test]
fn test_grant_minter() {
    let (env, _, token, owner) = deploy();
    let alice = env.next_user();
    let bob = env.next_user();

    token.grant_admin(owner, alice);
    token.grant_minter(alice, bob);
    assert!(token.is_minter(bob));
}

#[test]
fn test_revoke_minter() {
    let (env, _, token, owner) = deploy();
    let alice = env.next_user();
    let bob = env.next_user();

    token.grant_minter(owner, bob);
    assert!(token.is_minter(bob));

    token.grant_admin(owner, alice);
    token.revoke_minter(alice, bob);
    assert!(!token.is_minter(bob));
}

#[test]
fn test_burn_from_minter() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, bob, None, token_meta, token_commission, 2);

    token.grant_minter(owner, ali);

    let first_user_token = token.get_token_by_index(Key::Account(bob), U256::from(0));
    let second_user_token = token.get_token_by_index(Key::Account(bob), U256::from(1));
    token.burn(ali, bob, vec![first_user_token.unwrap()]);
    assert_eq!(token.total_supply(), U256::from(1));
    assert_eq!(token.balance_of(Key::Account(bob)), U256::from(1));

    let new_first_user_token = token.get_token_by_index(Key::Account(bob), U256::from(0));
    let new_second_user_token = token.get_token_by_index(Key::Account(bob), U256::from(1));
    assert_eq!(new_first_user_token, second_user_token);
    assert_eq!(new_second_user_token, None);
}

#[test]
#[should_panic = "User(20)"]
fn test_burn_from_non_minter() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, bob, None, token_meta, token_commission, 2);

    let first_user_token = token.get_token_by_index(Key::Account(bob), U256::from(0));
    token.burn(ali, bob, vec![first_user_token.unwrap()]);
}

#[test]
#[should_panic]
fn test_transfer_from_owner() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, ali, None, token_meta, token_commission, 2);
    let first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));

    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(2));
    assert_eq!(
        token.owner_of(first_ali_token.clone().unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(second_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    token.transfer_from(ali, ali, bob, vec![first_ali_token.unwrap()]);
}

#[test]
fn test_transfer_from_admin() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, ali, None, token_meta, token_commission, 2);
    let first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));

    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(2));
    assert_eq!(
        token.owner_of(first_ali_token.clone().unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(second_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    token.transfer_from(owner, ali, bob, vec![first_ali_token.unwrap()]);
    let new_first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let new_second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));
    let new_first_bob_token = token.get_token_by_index(Key::Account(bob), U256::from(0));
    let new_second_bob_token = token.get_token_by_index(Key::Account(bob), U256::from(1));
    println!("{:?}", new_first_ali_token);
    println!("{:?}", new_second_ali_token);
    println!("{:?}", new_first_bob_token);
    println!("{:?}", new_second_bob_token);
    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(1));
    assert_eq!(token.balance_of(Key::Account(bob)), U256::from(1));
    assert_eq!(
        token.owner_of(new_first_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(new_first_bob_token.unwrap()).unwrap(),
        Key::Account(bob)
    );
    assert_eq!(new_second_ali_token, None);
    assert_eq!(new_second_bob_token, None);
}

#[test]
#[should_panic]
fn test_transfer_from_minter() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, ali, None, token_meta, token_commission, 2);
    let first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));

    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(2));
    assert_eq!(
        token.owner_of(first_ali_token.clone().unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(second_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    token.grant_minter(owner, bob);
    token.transfer_from(bob, ali, bob, vec![first_ali_token.unwrap()]);
}

#[test]
fn test_transfer() {
    let (env, kyc, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_meta = meta::big_vi();
    let mut kyc_token_meta = Meta::new();
    kyc_token_meta.insert("status".to_string(), "active".to_string());
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(owner, ali, None, token_meta, token_commission, 2);
    let first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));

    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(2));
    assert_eq!(
        token.owner_of(first_ali_token.clone().unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(second_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    kyc.mint(owner, bob, None, kyc_token_meta);
    token.transfer(ali, bob, vec![first_ali_token.unwrap()]);
    let new_first_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(0));
    let new_second_ali_token = token.get_token_by_index(Key::Account(ali), U256::from(1));
    let new_first_bob_token = token.get_token_by_index(Key::Account(bob), U256::from(0));
    let new_second_bob_token = token.get_token_by_index(Key::Account(bob), U256::from(1));
    println!("{:?}", new_first_ali_token);
    println!("{:?}", new_second_ali_token);
    println!("{:?}", new_first_bob_token);
    println!("{:?}", new_second_bob_token);
    assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::from(1));
    assert_eq!(token.balance_of(Key::Account(bob)), U256::from(1));
    assert_eq!(
        token.owner_of(new_first_ali_token.unwrap()).unwrap(),
        Key::Account(ali)
    );
    assert_eq!(
        token.owner_of(new_first_bob_token.unwrap()).unwrap(),
        Key::Account(bob)
    );
    assert_eq!(new_second_ali_token, None);
    assert_eq!(new_second_bob_token, None);
}

#[test]
fn test_token_meta() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_id = TokenId::from("123456");
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(
        owner,
        ali,
        Some(vec![token_id.clone()]),
        token_meta.clone(),
        token_commission.clone(),
        1,
    );

    let user_token_meta = token.token_meta(token_id.clone());
    assert_eq!(user_token_meta.unwrap(), token_meta);

    let user_token_commission = token.token_commission(token_id.clone());
    assert_eq!(user_token_commission.unwrap(), token_commission);

    let first_user_token = token.get_token_by_index(Key::Account(ali), U256::zero());
    assert_eq!(first_user_token, Some(token_id));
}

#[test]
fn test_token_metadata_set_from_minter() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_id = TokenId::from("123456");
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(
        owner,
        ali,
        Some(vec![token_id.clone()]),
        token_meta,
        token_commission,
        1,
    );
    token.grant_minter(owner, ali);
    token.set_token_meta(ali, token_id.clone(), meta::medium_vi());
    token.update_token_meta(ali, token_id.clone(), "size".to_string(), "big".to_string());
    assert_eq!(token.token_meta(token_id).unwrap(), meta::big_vi());
}

#[test]
#[should_panic]
fn test_token_metadata_set_from_owner() {
    let (env, _, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_id = TokenId::from("123456");
    let token_meta = meta::big_vi();
    let token_commission = commission::commission(
        vec!["artist".to_string(), "broker".to_string()],
        vec![ali.into(), bob.into()],
        vec!["10".to_string(), "12".to_string()],
    );

    token.mint_copies(
        owner,
        ali,
        Some(vec![token_id.clone()]),
        token_meta,
        token_commission,
        1,
    );
    token.set_token_meta(ali, token_id, meta::medium_vi());
}
