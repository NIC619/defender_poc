import { ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getDeployer, testConditionAddr } from "../utils"

async function main() {
    const deployer = await getDeployer()
    const TestCondition = await ethers.getContractAt("TestCondition", testConditionAddr)

    // const promptErrandParamResult = await prompts(
    //     {
    //         type: "number",
    //         name: "errandParam",
    //         message: "important param",
    //     },
    //     {
    //         onCancel: async function () {
    //             console.log("Exit process")
    //             process.exit(0)
    //         },
    //     },
    // )
    // const newErrandParam = promptErrandParamResult.errandParam

    const tx = await TestCondition.connect(deployer).transfer(
        ["0x000000000000000000000000000000000000beef", "0x000000000000000000000000000000000000abcd", 10],
        "0x1234"
    )
    console.log(`transfer tx sent: ${tx.hash}`)
    await tx.wait()

    // const paramStored = await TestCondition.callStatic.errandParam()
    // if (paramStored != newErrandParam) {
    //     throw new Error(`Wrong errandParam: ${paramStored}`)
    // }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
