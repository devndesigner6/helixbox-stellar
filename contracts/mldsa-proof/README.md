# ML-DSA testnet feasibility experiment

This is a non-financial proof of concept for Stellar Protocol 30. The contract verifies an ML-DSA-44 signature using the Stellar host function. A valid signature returns `true`; an invalid signature traps. It does not store funds, authorize x402 payments, authenticate a Stellar wallet, or make ordinary Stellar transactions post-quantum secure.

The code is experimental and must not be used on mainnet or as a payment-security control. Independent security review and payment integration have not been completed.

## Testnet evidence

On 18 November 2026, the verifier was deployed on Stellar testnet at `CDM5ULTTPRNQEQBTWB6RPIH7SPRKWTPOQUVNZPWVDRDFFF64JQHHFBLU`. The deployment transaction is `b5cf89118593aa9f5099b471c2952ab101ece6ab5b6a94949ad3e768f55bddeb`. A testnet RPC simulation accepted a newly generated valid signature and rejected that signature for an altered message. A separate valid invocation was also submitted successfully in testnet transaction `4c702eb930070a31b18ad49266ed3bead66d3716789c527bb92beb7c12cba6ab`; the altered-message rejection was simulated, not submitted as a transaction.

One successful simulation reported 2,050,028 CPU instructions, zero disk-read bytes, zero write bytes, and a minimum resource fee of 15,293 stroops. These figures are one sample, not a performance guarantee or a mainnet fee quote. They do not establish x402 or wallet compatibility.

The build requires Stellar CLI 30 or later, Rust, the `wasm32v1-none` target, and a working compiler/linker for Rust's host platform. From the repository root:

```sh
stellar contract build --manifest-path contracts/mldsa-proof/Cargo.toml
```

For the local Windows setup used here, with Node.js supporting ML-DSA and manager dependencies installed, run the testnet simulation from the repository root:

```sh
node contracts/mldsa-proof/verify-testnet.mjs CDM5ULTTPRNQEQBTWB6RPIH7SPRKWTPOQUVNZPWVDRDFFF64JQHHFBLU GA5DHZTV22BBFOC4WBLMYB2RLFRSDDSWJKWUAQX35GBSUS3OXPA67UY2
```

The script generates a temporary ML-DSA key in memory and sends only the public key, message, and signature to the testnet simulator. It does not submit an invocation transaction or access a Stellar private key.
