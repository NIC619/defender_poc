import {  ethers } from "hardhat"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()

    let tx
    if (operatorStored == operator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(operator).teardown()
    } else if (operatorStored == subOperator.address) {
        tx = await OneRoleAccessControlWithTimeLock.connect(subOperator).teardown()
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    console.log(`teardown tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
