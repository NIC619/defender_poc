import { ethers } from "ethers"

export const expectedChild = "0x0000000000000000000000000000000000000bbb"
export const expectedChildStatus = true

export async function handler(event) {
    const contractAddr = event.request.body.sentinel.address
    const { alchemyApiToken, sentinelPrivKey } = event.secrets
    const url = `https://eth-kovan.alchemyapi.io/v2/${alchemyApiToken}`
    const provider = new ethers.providers.JsonRpcProvider(url)
    const sentinel = new ethers.Wallet(sentinelPrivKey, provider)

    const pauseFuncSig = "0x8456cb59"

    if (event.request.body.transaction.status == '0x1') {
        const matchReasons = event.request.body.matchReasons
        for (const r of matchReasons) {
            if ((r.type == "event") && (r.signature.startsWith("SetChildStatus"))) {
                // Pause the contract if child status set to an unexpected status
                if (r.params.enable != expectedChildStatus) {
                    await sentinel.sendTransaction({
                        to: contractAddr,
                        data: pauseFuncSig
                    })
                }
            }
            if ((r.type == "function") && (r.signature.startsWith("upgradeChild"))) {
                // Pause the contract if child set to an unexpected addresses
                if (r.params._newChildAddr != expectedChild) {
                    await sentinel.sendTransaction({
                        to: contractAddr,
                        data: pauseFuncSig
                    })
                }
            }
        }
    }

    return {}
}
