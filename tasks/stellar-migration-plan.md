# Stellar migration plan

Work only in this copy; leave the Solana projects and their task history untouched.

1. Disable legacy Solana payment entry points and avoid using the existing live backend. Keep workspace and catalog accessible; test disabled paths.
2. Limit the live catalog to the 40 most popular distinct models according to the provider's documented ordering, with no invented availability or prices; test ordering, cap and failures.
3. Add Stellar x402 and non-custodial mobile-wallet signing. Each payment requires explicit human approval; verify network, asset, recipient, amount and expiry. Verify actual React Native wallet compatibility on device.
4. Implement durable purchase IDs and settlement/fulfillment recovery; test rejection, duplicate calls, timeout, unknown settlement and paid-but-failed service. No unattended or delegated spending.
5. Add a separate ML-DSA Soroban testnet verifier proof and resource measurements. It does not secure ordinary transactions or authorize payments.
6. Replace remaining Solana UI, configuration, docs and release claims only as their Stellar equivalents are implemented. Run app, CLI and manager checks and test the mobile flow.
7. Review secrets and configuration before pushing a dedicated public repository; set up a separate Render deployment only after the user requests deployment. No real-money payment without explicit approval.

Current blocker: MetaMask's Stellar adapter documents mainnet only and its React Native auth-entry signing needs real-device verification. Testnet verifier work does not depend on using MetaMask. Existing copied task lists describe Solana and are retained.
