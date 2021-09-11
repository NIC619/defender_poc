# Test Openzepplin Defender service

## Goals

To test and record the findings of the following:

#### Detection

We use `Sentinel` service to detect anomilies in the system and sent alert to channels like `Slack` or `Telegram`

- Can it detect event emission? What's the success rate? How fast is it?
- Can it detect function call? What's the success rate? How fast is it?
- Can it detect message call (internal function call), i.e., function called by another contract? What's the success rate? How fast is it?
    - Can it detect failed message call or function call?

#### Response

We use `Autotask` service to respond to alert raised by `Sentinel` service

- Cant it respond as instructed? for example, pausing the contract. What's the success rate? How fast is it?

___

## Contracts to test against

- `UpgradeProxy` and `UpgradeProxyImplementation`
    - This pair of contracts are used to test upgrade proxy functionality
        - can upgrade function call/event be detected?
        - can implementation specific function call/event be detected?
- `OneRoleAccessControl`
    - This contract is used to test contract maintenance or allowance setting function calls
- `OneRoleAccessControlWithTimeLock`
    - This contract is used to test function calls like contract maintenance along with actions guarded by time lock

**NOTE**:
- EIP1967 upgrade proxy pattern is used
- `CallProxy` contract is used to invoke message call (internal function call).

### Roles in the contracts

The above three contracts all have a set of operator roles:
- `OneRoleAccessControl` and `OneRoleAccessControlWithTimeLock`
    - Four roles: `moreSecuredOperator`, `lessSecuredOperator`, `errandOperator` and `sentinel`
- `UpgradeProxy` and `UpgradeProxyImplementation`
    - Three roles: `lessSecuredOperator` , `errandOperator` and `sentinel`

Duties of each role:
- `moreSecuredOperator` manages important tasks such as `upgradeImportantDependency` or `teardown`, and also assigning `lessSecuredOperator` and `sentinel`
    - Note that tasks categorized as **important** tasks are tasks that in its worst case jeoperdize users' fund
    - so `moreSecuredOperator` should be the most secured wallet in the system, e.g., a 5-of-5 multisigs
- `lessSecuredOperator` manages less important tasks such as `setAllowance` or `setImportantParam`, and also assigning `errandOperator`
    - Note that tasks categorized as **less important** tasks are tasks that in its worst case halt the system but not jeoperdizing users' fund
        - `setAllowance` or `setImportantParam` function is modified to lower the damage if `lessSecuredOperator` is compromised
            - for example, `setAllowance` can only allow pre-specified actor instead of arbitrary one to spend from the contract
            - for example, `setImportantParam` has a bound on the param so it can't be set to arbitrary value that might endanger users' fund
    - `lessSecuredOperator` should be the second most secured wallet in the system, e.g., a 3-of-5 multisigs
- `errandOperator` manages housekeeping tasks such as `setErrandParam` or `blacklist`
    - Note that tasks categorized as **housekeeping** tasks are tasks that in its worst case halt part of the system but not jeoperdizing users' fund
    - `errandOperator` can be a less secured wallet in the system, e.g., a 2-of-3 multisigs or a hot/cold wallet
- `sentinel`'s only job is to freeze the system by for example, `pause` the contract or stop the staking/borrowing/liquidating functions

**NOTE**:
- Since we use EIP1967 upgrade proxy pattern, `moreSecuredOperator` will be the admin of the proxy which manages the upgrade of implementation
    - and hence `moreSecuredOperator` can not also be an operator in the implementation because admin's call to proxy contract will be intercepted
    - UUPS pattern will not have this problem

## Detect and response conditions

- If `setAllowance` sets allowance of unexpected token(s), `pause` the contract immediately
    - we would have to maintain the expected token(s) in the `Autotask` scritps
        - remeber to update the expected token(s) before doing actual upgrade otherwise it would accidentally `pause` the contract once you upgrade
- If `setImportantParam` is set to unexpected values, `pause` the contract immediately
    - the same as above, we have to maintain the expected values
- If `upgradeChild` upgrade child contract to an unexpected address, `pause` the contract immediately
    - the same as above, we have to maintain the expected address

**NOTE**:
- The above conditions are transactions that succeed and changed the state of the contract, we do not respond to failed transactions
    - So remember to watch for succeeded transactions in `Sentinel` service or filter out failed transactions in `Autotask` scripts

___
## Scripts

### 1. Deploy contracts

- Deploy `CallProxy` contract
    - `npx hardhat run scripts/deploy/CallProxy.ts --network kovan`
- Deploy `UpgradeProxy` and `UpgradeProxyImplementation` contracts
    - `npx hardhat run scripts/deploy/UpgradeProxy_set.ts --network kovan`
- Deploy `OneRoleAccessControl` contract
    - `npx hardhat run scripts/deploy/OneRoleAccessControl.ts --network kovan`
- Deploy `OneRoleAccessControlWithTimeLock` contract
    - `npx hardhat run scripts/deploy/OneRoleAccessControlWithTimeLock.ts --network kovan`

**NOTE**: if you deploy new contract instances, remeber to update the contract addresses in `READEME.md` and `./scripts/utils.ts`

### 2. Set up Sentinel and Autotask

After contracts are deployed, go set up `Sentinel` and `Autotask` instances.
- [set up Sentinel](./setupSentinel.md)
- [set up Autotask](./setupAutotask.md)

### 3. Run scripts to invoke targeted functions

- Transfer ownership, for example
    - `OneRoleAccessControl.transferOwner`
        - `npx hardhat run scripts/transferRoles/transferOwner_OneRoleAccessControl.ts --network kovan`
        - invoke failed function call
            - `npx hardhat run scripts/transferRoles/fail/fail_transferOwner_OneRoleAccessControl.ts  --network kovan`
    - `OneRoleAccessControlWithTimeLock.setNewOperator`
        - `npx hardhat run scripts/transferRoles/setNewOperator_OneRoleAccessControlWithTimeLock.ts --network kovan`
        - invoke failed internal function call
            - `npx hardhat run scripts/transferRoles/fail/fail_internal_setNewOperator_OneRoleAccessControlWithTimeLock.ts  --network kovan`
- Contract maintenance, for example
    - `OneRoleAccessControlWithTimeLock.blacklist`
        - `npx hardhat run scripts/maintenance/blacklist.ts --network kovan`
        - invoke failed function call
            - `npx hardhat run scripts/maintenance/fail/fail_blacklist.ts --network kovan`
- Approving spender, for example
    - `OneRoleAccessControlWithTimeLock.authorize`
        - `npx hardhat run scripts/allowance/authorize.ts --network kovan`
        - invoke failed internal function call
            - `npx hardhat run scripts/allowance/fail/fail_authorize.ts --network kovan`
- Upgrade proxy implementation, for example
    - `TransparentUpgradeableProxy.upgradeTo`
        - `npx hardhat run scripts/upgradeProxyImpl/upgradeTo_UpgradeProxyImplementation.ts --network kovan`
        - invoke failed internal function call
            - `npx hardhat run scripts/upgradeProxyImpl/fail/fail_internal_upgrade_UpgradeProxyImplementation.ts --network kovan`
- Scripts to trigger sentinel, for example
    - trigger by `setAllowance` of unexpected token(s)
        - `npx hardhat run scripts/allowance/trigger_sentinel/invalid_token_addr_setAllowance.ts --network kovan`
    - trigger by `upgradeChild` to unexpected address(es)
        - `npx hardhat run scripts/maintenance/trigger_sentinel/invalid_child_upgradeChild.ts --network kovan`
___

## Deployed contract addresses

- `CallProxy`
    - `0x1E8b65D0562f89A1Bd951ADD5354d9a374dfe550`
- `UpgradeProxy`
    - `0xd4c037782a1D181701e697ad80aB56A40c6be9Bb`
- `UpgradeProxyImplementation`
    - `0x1E0D76E9556a8089cdb3822436104378E3572103`
- `OneRoleAccessControl`
    - `0xa88efB15C2980f5eC7a189C2CcdEC3cf3d3BBb1c`
- `OneRoleAccessControlWithTimeLock`
    - `0x0d975AEB0ee9EFd0682A303987aF2018e2917189`
