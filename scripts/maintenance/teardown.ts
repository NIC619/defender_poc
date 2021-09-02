import {  ethers } from "hardhat"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()

    let tx, actualOperator
    if (operatorStored == operator.address) {
        actualOperator = operator
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await OneRoleAccessControlWithTimeLock.connect(actualOperator).teardown()
    console.log(`teardown tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
