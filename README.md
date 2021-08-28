# Test Openzepplin Defender service

## Goals
### To test and record the findings of the following:
#### Detection
- Can it detect event emission? What's the success rate? How fast is it?
- Can it detect function call? What's the success rate? How fast is it?
- Can it detect message call, i.e., function called by another contract? What's the success rate? How fast is it?
    - Can it detect failed message call or function call?

#### Response
- Cant it respond as instructed? What's the success rate? How fast is it?

## Contracts to test against

## Scripts

### Deploy contracts

- Deploy `UpgradeProxy` and `UpgradeProxyImplementation` contracts
    - `npx hardhat run scripts/deploy_UpgradeProxy_set.ts --network goerli`

## Deployed contract addresses

- `UpgradeProxy`
    - `0x5827B6815Fdb97774Ea31E790c8503e7B9014917`
- `UpgradeProxyImplementation`
    - `0x77a6302d81154603Ac32d031275E9C9103B50D29`
- `OneRoleAccessControl`
    - ``
- `OneRoleAccessControlWithTimeLock`
    - ``