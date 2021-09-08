import {  ethers } from "hardhat"
import { default as prompts } from "prompts"
import { getContractAndOperators } from "../utils"

async function main() {
    const [OneRoleAccessControl, , , errandOperator ] = await getContractAndOperators("OneRoleAccessControl")

    const promptErrandParamResult = await prompts(
        {
            type: "number",
            name: "errandParam",
            message: "important param",
        },
        {
            onCancel: async function () {
                console.log("Exit process")
                process.exit(0)
            },
        },
    )
    const newErrandParam = promptErrandParamResult.errandParam

    let tx
    tx = await OneRoleAccessControl.connect(errandOperator).setErrandParam(newErrandParam)
    console.log(`setErrandParam tx sent: ${tx.hash}`)
    await tx.wait()

    const paramStored = await OneRoleAccessControl.callStatic.errandParam()
    if (paramStored != newErrandParam) {
        throw new Error(`Wrong errandParam: ${paramStored}`)
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
