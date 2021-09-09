import {  ethers } from "hardhat"
import { defaultValidBlacklistTokenAddr, getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, , , errandOperator ] = await getContractAndOperators("OneRoleAccessControlWithTimeLock")

    const tx = await OneRoleAccessControlWithTimeLock.connect(errandOperator).blacklist([defaultValidBlacklistTokenAddr], [true])
    console.log(`blacklist tx sent: ${tx.hash}`)
    await tx.wait()

    const isBlacklistedStored = await OneRoleAccessControlWithTimeLock.callStatic.isBlacklisted(defaultValidBlacklistTokenAddr)
    if (isBlacklistedStored == true) {
        throw new Error(`Wrong isBlacklisted: ${isBlacklistedStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
