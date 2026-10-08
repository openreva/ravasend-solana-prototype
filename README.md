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

TypeScript check passed. APK/device test and transaction evidence remain outstanding. npm reported 39 dependency vulnerabilities (15 moderate, 24 high); review before distribution. No claim of production security or hackathon eligibility is made.
