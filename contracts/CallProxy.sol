// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CallProxy {
    receive() external payable {}

    function proxy(address destination, bytes calldata data) external payable {
        (bool callSucceed, ) = destination.call{value: msg.value}(data);
        if (!callSucceed) {
            // Get the error message returned
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }
    }
}
