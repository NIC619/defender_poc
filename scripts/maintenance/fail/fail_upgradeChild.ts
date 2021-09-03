import {  ethers } from "hardhat"
import { getAttacker, upgradeProxyAddr } from "../../utils"

async function main() {
    const attacker = getAttacker()

    const UpgradeProxy = await ethers.getContractAt("UpgradeProxyImplementation", upgradeProxyAddr)

    const newChildAddr = "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead"
    const newChilStatus = true

    const tx = await UpgradeProxy.connect(attacker).upgradeChild(
        newChildAddr,
        newChilStatus,
        {
            gasLimit: 100000,
        }
    )
    console.log(`fail upgradeChild tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
