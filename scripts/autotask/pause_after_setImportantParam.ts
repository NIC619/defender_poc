import { ethers } from "ethers"

export async function handler(event) {
    const contractAddr = event.request.body.sentinel.address
    const { alchemyApiToken, sentinelPrivKey } = event.secrets
    const url = `https://eth-kovan.alchemyapi.io/v2/${alchemyApiToken}`
    const provider = new ethers.providers.JsonRpcProvider(url)
    const sentinel = new ethers.Wallet(sentinelPrivKey, provider)

    if (event.request.body.transaction.status == '0x1') {
        const matchReasons = event.request.body.matchReasons
        for (const r of matchReasons) {
            if ((r.type == "function") && (r.signature.startsWith("setImportantParam"))) {
                // Pause the contract if importandParam was set to an unexpected value
                if ((r.params._importantParam < 30) || (r.params._importantParam > 80)) {
                    await sentinel.sendTransaction({
                        to: contractAddr,
                        data: "0x8456cb59" // pause()
                    })
                    break
                }
            }
        }
    }

    return {}
}
