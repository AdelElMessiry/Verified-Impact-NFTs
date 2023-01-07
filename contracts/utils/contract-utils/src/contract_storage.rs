use alloc::vec::Vec;
use once_cell::unsync::OnceCell;

use casper_contract::contract_api::runtime;
use casper_types::system::CallStackElement;

pub trait ContractStorage {
    fn call_stack(&self) -> &[CallStackElement];
}

#[derive(Default)]
pub struct OnChainContractStorage {
    call_stack: OnceCell<Vec<CallStackElement>>,
}

impl ContractStorage for OnChainContractStorage {
    fn call_stack(&self) -> &[CallStackElement] {
        let call_stack = self.call_stack.get_or_init(runtime::get_call_stack);
        call_stack.as_slice()
    }
}
