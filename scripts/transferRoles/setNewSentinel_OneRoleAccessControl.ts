import { ethers } from "hardhat"
import { getContractAndOperators, getSentinelAddr } from "../utils"


async function main() {
    const [OneRoleAccessControl, moreSecuredOperator, , ] = await getContractAndOperators("OneRoleAccessControl")

    const tx = await OneRoleAccessControl.connect(moreSecuredOperator).setNewSentinel(getSentinelAddr())
    console.log(`setNewSentinel tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
