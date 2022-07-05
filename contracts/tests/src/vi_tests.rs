use std::collections::BTreeMap;

use casper_types::{account::AccountHash, Key, U256};
use test_env::TestEnv;

use crate::vi_instance::{Meta, TokenId, VIInstance};

const NAME: &str = "VerifiedImpactNFT";
const SYMBOL: &str = "VINFT";

mod meta {
    use super::{BTreeMap, Meta};
    pub fn contract_meta() -> Meta {
        let mut meta = BTreeMap::new();
        meta.insert("origin".to_string(), "fire".to_string());
        meta
    }

    pub fn red_dragon() -> Meta {
        let mut meta = BTreeMap::new();
        meta.insert("color".to_string(), "red".to_string());
        meta
    }

    pub fn gold_dragon() -> Meta {
        let mut meta = BTreeMap::new();
        meta.insert("color".to_string(), "gold".to_string());
        meta
    }
}

fn deploy() -> (TestEnv, VIInstance, AccountHash) {
    let env = TestEnv::new();
    let owner = env.next_user();
    let token = VIInstance::new(
        &env,
        NAME,
        owner,
        NAME,
        SYMBOL,
        meta::contract_meta(),
        Key::Account(owner),
    );
    (env, token, owner)
}

#[test]
fn test_deploy() {
    let (_, token, _) = deploy();
    assert_eq!(token.name(), NAME);
    assert_eq!(token.symbol(), SYMBOL);
    assert_eq!(token.meta(), meta::contract_meta());
    assert_eq!(token.total_supply(), U256::zero());
}

#[test]
fn test_mint_copies() {
    let (env, token, owner) = deploy();
    let user = env.next_user();
    let token_meta = meta::red_dragon();
    let token_ids = vec![TokenId::zero(), TokenId::one()];
    token.mint_copies(owner, user, token_ids.clone(), token_meta, 2);
    let first_user_token = token.get_token_by_index(Key::Account(user), U256::zero());
    let second_user_token = token.get_token_by_index(Key::Account(user), U256::one());

    assert_eq!(
        token.owner_of(first_user_token.unwrap()).unwrap(),
        Key::Account(user)
    );
    assert_eq!(
        token.owner_of(second_user_token.unwrap()).unwrap(),
        Key::Account(user)
    );

    assert_eq!(first_user_token, Some(token_ids[0]));
    assert_eq!(second_user_token, Some(token_ids[1]));
}

#[test]
fn test_burn_one() {
    let (env, token, owner) = deploy();
    let user = env.next_user();
    // let token_metas = vec![meta::red_dragon(), meta::gold_dragon()];
    let token_meta = meta::red_dragon();
    let token_ids = vec![TokenId::zero(), TokenId::one()];
    token.mint_copies(owner, user, token_ids.clone(), token_meta, 2);

    token.burn_one(owner, user, token_ids[0]);
    assert_eq!(token.total_supply(), U256::one());
    assert_eq!(token.balance_of(Key::Account(user)), U256::one());
}

#[test]
fn test_transfer_token() {
    let (env, token, owner) = deploy();
    let ali = env.next_user();
    let bob = env.next_user();
    let token_metas = meta::gold_dragon();
    let token_ids = vec![TokenId::zero(), TokenId::one()];

    token.mint_copies(owner, ali, token_ids.clone(), token_metas, 2);

    // assert_eq!(token.total_supply(), U256::from(2));
    // assert_eq!(token.balance_of(Key::Account(ali)), U256::from(2));
    assert_eq!(token.owner_of(token_ids[0]).unwrap(), Key::Account(ali));
    assert_eq!(token.owner_of(token_ids[1]).unwrap(), Key::Account(ali));

    token.transfer(ali, bob, vec![token_ids[0]]);
    let new_first_ali_token = token.get_token_by_index(Key::Account(ali), U256::zero());
    let new_second_ali_token = token.get_token_by_index(Key::Account(ali), U256::one());
    let new_first_bob_token = token.get_token_by_index(Key::Account(bob), U256::zero());
    let new_second_bob_token = token.get_token_by_index(Key::Account(bob), U256::one());
    println!("{:?}", new_first_ali_token);
    println!("{:?}", new_second_ali_token);
    println!("{:?}", new_first_bob_token);
    println!("{:?}", new_second_bob_token);
    // assert_eq!(token.total_supply(), U256::from(2));
    assert_eq!(token.balance_of(Key::Account(ali)), U256::one());
    assert_eq!(token.balance_of(Key::Account(bob)), U256::one());
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
