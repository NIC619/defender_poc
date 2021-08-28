import { ethers } from "hardhat"
import { defaultImportantDependency, defaultParam, getDeployer, getOperator } from "../utils"

async function main() {
    const deployer = getDeployer()
    const operator = getOperator()

    // Deploying OneRoleAccessControl
    console.log("Deploying OneRoleAccessControl...")
    const OneRoleAccessControl = await (
        await ethers.getContractFactory("OneRoleAccessControl", deployer)
    ).deploy(
        operator.address,
        defaultParam,
        defaultImportantDependency
    )
    await OneRoleAccessControl.deployTransaction.wait()
    console.log(`OneRoleAccessControl contract address: ${OneRoleAccessControl.address}`)

    const operatorStored = await OneRoleAccessControl.connect(deployer).callStatic.operator()
    if (operatorStored !== operator.address) {
        throw new Error(`Wrong operator: ${operatorStored}`)
    }
    const param = await OneRoleAccessControl.connect(deployer).callStatic.someParam()
    if (param !== defaultParam) {
        throw new Error(`Wrong param: ${param}`)
    }
    const dependency = await OneRoleAccessControl.connect(deployer).callStatic.importantDepedency()
    if (dependency !== defaultImportantDependency) {
        throw new Error(`Wrong dependency: ${dependency}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
