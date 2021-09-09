import {  ethers } from "hardhat"
import { defaultValidSpenderAddr, getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, , lessSecuredOperator, ] = await getContractAndOperators("OneRoleAccessControlWithTimeLock")

    const timelockActivatedStored = await OneRoleAccessControlWithTimeLock.callStatic.timelockActivated()

    const tx = await OneRoleAccessControlWithTimeLock.connect(lessSecuredOperator).authorize([defaultValidSpenderAddr])
    console.log(`authorize tx sent: ${tx.hash}`)
    await tx.wait()

    if (timelockActivatedStored != true) {
        console.log("No timelock, should completed authorize")
        const isAuthorizedStored = await OneRoleAccessControlWithTimeLock.callStatic.isAuthorized(defaultValidSpenderAddr)
        if (isAuthorizedStored != true) {
            throw new Error(`Wrong isAuthorized: ${isAuthorizedStored}`)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
