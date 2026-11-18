#![no_std]

use soroban_sdk::{contract, contractimpl, Bytes, BytesN, Env};

#[contract]
pub struct MldsaProof;

#[contractimpl]
impl MldsaProof {
    pub fn verify(env: Env, public_key: BytesN<1312>, message: Bytes, signature: BytesN<2420>, context: Bytes) -> bool {
        env.crypto().ml_dsa_44_verify(&public_key, &message, &signature, &context);
        true
    }
}
