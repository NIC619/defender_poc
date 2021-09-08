import { ethers } from "hardhat"
import { getContractAndOperators, getErrandOperator } from "../utils"

async function main() {
    const errandOperator = getErrandOperator()

    const [UpgradeProxy, , lessSecuredOperator, ] = await getContractAndOperators("UpgradeProxyImplementation")

    const tx = await UpgradeProxy.connect(lessSecuredOperator).transferErrandOperator(errandOperator.address)
    console.log(`transferErrandOperator tx sent: ${tx.hash}`)
    await tx.wait()
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
