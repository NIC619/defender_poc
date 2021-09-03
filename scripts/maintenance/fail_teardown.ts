import {  ethers } from "hardhat"
import { getAttacker, getContractAndOperator } from "../utils"

async function main() {
    const attacker = getAttacker()
    const [OneRoleAccessControlWithTimeLock, ] = await getContractAndOperator("OneRoleAccessControlWithTimeLock")

    let tx
    tx = await OneRoleAccessControlWithTimeLock.connect(attacker).teardown(
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail teardown tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
