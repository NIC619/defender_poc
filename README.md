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
    - `0x9b8549151C973b4318Bd041d1A31d4C193d5f2CA`
- `UpgradeProxyImplementation`
    - `0x1489a475Bd4132979fB032fD265eE5563570C8F7`
- `OneRoleAccessControl`
    - `0x12b1cCd7323b4333C62fE26667c3594f6F247BbF`
- `OneRoleAccessControlWithTimeLock`
    - `0x45FC0e225E6851629065dD745a1daD8dC7B216DC`