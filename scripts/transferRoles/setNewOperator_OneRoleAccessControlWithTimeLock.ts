import { ethers } from "hardhat"
import { getOperator, getSubOperator, oneRoleAccessControlWithTimeLockAddr } from "../utils"

async function main() {
    const operator = getOperator()
    const subOperator = getSubOperator()

    const OneRoleAccessControlWithTimeLock = await ethers.getContractAt("OneRoleAccessControlWithTimeLock", oneRoleAccessControlWithTimeLockAddr)
    const operatorStored = await OneRoleAccessControlWithTimeLock.callStatic.operator()

    let tx, actualOperator, newOperatorAddr
    if (operatorStored == operator.address) {
        actualOperator = operator
        newOperatorAddr = subOperator.address
    } else if (operatorStored == subOperator.address) {
        actualOperator = subOperator
        newOperatorAddr = operator.address
    } else {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    tx = await OneRoleAccessControlWithTimeLock.connect(actualOperator).setNewOperator(newOperatorAddr)
    console.log(`setNewOperator tx sent: ${tx.hash}`)
    await tx.wait()

    const pendingOperatorStored = await OneRoleAccessControlWithTimeLock.callStatic.pendingOperator()
    if (pendingOperatorStored != newOperatorAddr) {
        throw new Error(`Wrong pendingOperator: ${pendingOperatorStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
