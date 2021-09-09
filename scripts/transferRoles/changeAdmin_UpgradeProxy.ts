import { ethers } from "hardhat"
import { getMoreSecuredOperator, upgradeProxyAddr } from "../utils"

async function main() {
    const moreSecuredOperator = getMoreSecuredOperator()

    const UpgradeProxy = await ethers.getContractAt("TransparentUpgradeableProxy", upgradeProxyAddr)

    let tx
    tx = await UpgradeProxy.connect(moreSecuredOperator).changeAdmin(moreSecuredOperator.address)
    console.log(`changeAdmin tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
