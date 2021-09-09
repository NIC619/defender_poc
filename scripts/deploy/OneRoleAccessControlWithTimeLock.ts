import { ethers } from "hardhat"
import { getDeployer, getErrandOperator, getLessSecuredOperator, getMoreSecuredOperator } from "../utils"

async function main() {
    const deployer = getDeployer()
    const moreSecuredOperator = getMoreSecuredOperator()
    const lessSecuredOperator = getLessSecuredOperator()
    const errandOperator = getErrandOperator()

    // Deploying OneRoleAccessControlWithTimeLock
    console.log("Deploying OneRoleAccessControlWithTimeLock...")
    const OneRoleAccessControlWithTimeLock = await (
        await ethers.getContractFactory("OneRoleAccessControlWithTimeLock", deployer)
    ).deploy(
        moreSecuredOperator.address,
        lessSecuredOperator.address,
        errandOperator.address,
    )
    await OneRoleAccessControlWithTimeLock.deployTransaction.wait()
    console.log(`OneRoleAccessControlWithTimeLock contract address: ${OneRoleAccessControlWithTimeLock.address}`)

    const moreSecuredOperatorStored = await OneRoleAccessControlWithTimeLock.connect(deployer).callStatic.moreSecuredOperator()
    if (moreSecuredOperatorStored !== moreSecuredOperator.address) {
        throw new Error(`Wrong moreSecuredOperator: ${moreSecuredOperatorStored}`)
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
