import { ethers } from "hardhat"
import { getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, moreSecuredOperator, , ] = await getContractAndOperators("OneRoleAccessControlWithTimeLock")

    const tx = await OneRoleAccessControlWithTimeLock.connect(moreSecuredOperator).setNewMoreSecuredOperator(moreSecuredOperator.address)
    console.log(`setNewMoreSecuredOperator tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
