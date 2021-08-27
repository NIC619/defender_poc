import { ethers } from "hardhat"
import { getDeployer, getOperator } from "./utils"

async function main() {
    const deployer = getDeployer()
    const operator = getOperator()

    // Deploying OneRoleAccessControlWithTimeLock
    console.log("Deploying OneRoleAccessControlWithTimeLock...")
    const OneRoleAccessControlWithTimeLock = await (
        await ethers.getContractFactory("OneRoleAccessControlWithTimeLock", deployer)
    ).deploy(
        operator.address
    )
    await OneRoleAccessControlWithTimeLock.deployTransaction.wait()
    console.log(`OneRoleAccessControlWithTimeLock contract address: ${OneRoleAccessControlWithTimeLock.address}`)

    const operatorStored = await OneRoleAccessControlWithTimeLock.connect(deployer).callStatic.operator()
    if (operatorStored !== operator.address) {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    const timelockActivated = await OneRoleAccessControlWithTimeLock.connect(deployer).callStatic.timelockActivated()
    if (timelockActivated !== false) {
        throw new Error(`Wrong timelockActivated: ${timelockActivated}`)
    }
    const contractDeployedTime = await OneRoleAccessControlWithTimeLock.connect(deployer).callStatic.contractDeployedTime()
    if (contractDeployedTime == 0) {
        throw new Error(`Wrong contractDeployedTime: ${contractDeployedTime}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
