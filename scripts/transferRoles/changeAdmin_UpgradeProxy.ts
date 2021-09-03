import { ethers } from "hardhat"
import { getDeployer, upgradeProxyAddr } from "../utils"

async function main() {
    const deployer = getDeployer()

    const UpgradeProxy = await ethers.getContractAt("TransparentUpgradeableProxy", upgradeProxyAddr)

    let tx
    tx = await UpgradeProxy.connect(deployer).changeAdmin(deployer.address)
    console.log(`changeAdmin tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
