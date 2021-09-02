import {  ethers } from "hardhat"
import { getContractAndOperator } from "../utils"

async function main() {
    const [OneRoleAccessControlWithTimeLock, contractOperator] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

    let tx
    tx = await OneRoleAccessControlWithTimeLock.connect(contractOperator).teardown()
    console.log(`teardown tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
