# Ravasend Solana devnet prototype

Isolated Android prototype created 7 October 2026. No changes were pushed to openreva/mobile.

This is NOT the production app, a fiat off-ramp, or a mainnet deployment. It connects to an Android MWA wallet, reads a devnet balance, and requests a wallet-approved test-SOL transfer. No private keys are collected. Existing Ravasend customer APIs, analytics, OTA updates and balances are not imported.

## Run

`npm ci --ignore-scripts`, then `npm run typecheck`.

With Android SDK/JDK and a device/emulator containing an MWA-compatible wallet: `npm run android`.

For EAS: sign into your Expo account, create a NEW project for this prototype (never attach the production project), then `eas build --platform android --profile preview`. Confirm any build charges first.

## Required acceptance tests before submission

- Wallet connection, cancellation, disconnect and reconnect on Android.
- Devnet balance read against the connected account.
- Invalid recipient, zero, negative, excessive and malformed amounts rejected.
- Test-only funded devnet wallet signs a small transfer; explorer verifies confirmation and recipient balance change.
- Wallet rejection, insufficient balance and RPC failure do not show success.
- Install signed APK on a fresh Android device and repeat.
- Record this prototype's actual demo; do not reuse production footage as Solana integration evidence.

## Current verification status

TypeScript check passed. An initial signed APK was built, but device tests and transaction evidence remain outstanding. On 8 October, the three portal-flagged dependencies were patched: image-size 2.0.4, postcss 8.5.29 and uuid 11.1.1. The local npm audit still reports 26 findings (5 moderate, 21 high), including transitive build-tool advisories with no available patched versions for braces, node-forge and sprintf-js. This is not a clean security audit. No claim of production security or hackathon eligibility is made.

The lockfile is authoritative for reproducibility. `.npmrc` preserves the peer-resolution mode used to generate it; nanostores is explicitly installed for the wallet UI runtime. Do not use `npm audit fix --force`: its proposed Expo downgrade is incompatible with this SDK.
