// Import necessary libraries
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.js';
import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { bsc, mode } from '@reown/appkit/networks';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

// Smart contract details
const contractAddress = "Your-contract-address"; // Replace with your smart contract address
const contractABI = [];
// Initialize Ethers.js provider and contract variables
let ethersProvider;
let userAccount;
let contract;
let signer;

// AppKit Setup
const projectId = 'Your-project id'; // Replace with your Reown Project ID
const metadata = {
    name: 'AI Trading Platform',
    description: 'AI Trading Platform Example',
    url: 'https://example.com/',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Create AppKit Instance
const modal = createAppKit({
    adapters: [new EthersAdapter()],
    networks: [bsc],
    metadata,
    projectId,
    features: {
        analytics: true
    }
});

// Connect wallet and initialize Ethers.js provider and contract
async function initWeb3() {

  if (!window.ethereum) {
    alert('MetaMask is not installed or not available.');
    return;
}

try {
  ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  await ethersProvider.send("eth_requestAccounts", []); // Request wallet access

  signer = ethersProvider.getSigner();
  userAccount = await signer.getAddress();
  console.log('Connected to MetaMask:', userAccount);

  const { chainId } = await ethersProvider.getNetwork();
  if (chainId !== 56) { // Ensure BSC Mainnet
      alert('Please connect to Binance Smart Chain (Mainnet).');
      return;
  }

  contract = new ethers.Contract(contractAddress, contractABI, signer);
  document.getElementById('connectWalletBtn').innerText = 'Connected';
} catch (error) {
  console.error('Error initializing web3:', error);
  alert('Failed to initialize web3. Check the console for details.');
}
    // const appkitProvider = modal.getIsConnectedState // Get provider from AppKit modal
    // if (appkitProvider) {
    //     try {
    //         // Use the AppKit provider for BSC (via AppKit)
    //         ethersProvider = new ethers.providers.Web3Provider(appkitProvider);
    //         signer = ethersProvider.getSigner();
    //         userAccount = await signer.getAddress();
    //         console.log('Connected to wallet (BSC):', userAccount);

    //         // Connect to your BSC-based smart contract
    //         contract = new ethers.Contract(contractAddress, contractABI, signer);

    //         document.getElementById('connectWalletBtn').innerText = 'Connected';
    //     } catch (error) {
    //         console.error('Error connecting to wallet:', error);
    //         document.getElementById('profitResult').innerText = 'Failed to connect wallet. Please try again.';
    //     }
    // } else {
    //     alert('Please install MetaMask or connect your wallet.');
    // }
}

// Deposit funds to the smart contract using Ethers.js
async function depositAmount() {
    const depositAmount = document.getElementById('depositAmount').value;
    if (!depositAmount) {
        document.getElementById('profitResult').innerText = 'Please enter an amount';
        return;
    }

    try {
        const amountInWei = ethers.utils.parseUnits(depositAmount, 'ether');
        const tx = await contract.deposit({ value: amountInWei, gasLimit: 21000 });
        await tx.wait();
        document.getElementById('profitResult').innerText = 'Deposit successful!';
    } catch (error) {
        console.error('Error depositing funds:', error);
        document.getElementById('profitResult').innerText = `Deposit failed: ${error.message}`;
    }
}

// Withdraw funds from the smart contract
async function withdrawFunds() {
    const withdrawAmount = document.getElementById('withdrawAmount').value;

    if (!withdrawAmount) {
        document.getElementById('profitResult').innerText = 'Please enter an amount';
        return;
    }

    try {
        const amountInWei = ethers.utils.parseUnits(withdrawAmount, 'ether');
        const gasLimit = 21000; // Set an estimated or higher gas limit
        const tx = await contract.withdraw(amountInWei, { gasLimit });
        await tx.wait();
        document.getElementById('profitResult').innerText = 'Withdrawal successful!';
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        document.getElementById('profitResult').innerText = `Withdrawal failed: ${error.message}`;
    }
}

// Check profit using Ethers.js
// async function checkProfit() {
//     try {
//         if (!contract || !userAccount) {
//             document.getElementById('profitResult').innerText = "Please connect your wallet first.";
//             return;
//         }
//         const gasLimit = 21000;
//         const profit = await contract.checkProfit(userAccount, { gasLimit });
//         const profitInEther = ethers.utils.formatUnits(profit, 'ether');
//         console.log('Profit in Ether:', profitInEther);

//         if (parseFloat(profitInEther) > 0) {
//             document.getElementById('profitResult').innerText = `Your profit is: ${profitInEther} BNB`;
//         } else {
//             document.getElementById('profitResult').innerText = 'No Deposit';
//         }

//     } catch (error) {
//         console.error("Error fetching profit:", error);
//         document.getElementById('profitResult').innerText = `Failed to fetch profit: ${error.message}`;
//     }
// }
async function checkProfit() {
  try {
      if (!contract || !userAccount) {
          document.getElementById('profitResult').innerText = "Please connect your wallet first.";
          return;
      }

      // Manually setting a higher gas limit
      const gasLimit = 21000; // Adjust the limit based on your contract's complexity

      // Call checkProfit function with a manual gas limit
      const profit = await contract.checkProfit(userAccount, {
          gasLimit: gasLimit
      });

      const profitInEther = ethers.utils.formatUnits(profit, 'ether');
      console.log('Profit in Ether:', profitInEther);

      if (parseFloat(profitInEther) > 0) {
      //     document.getElementById('profitResult').innerText = `Your profit is: ${profitInEther} BNB`;
      // } else {
          document.getElementById('profitResult').innerText = 'No Deposit :0 BNB';
      }

  } catch (error) {
      console.error("Error fetching profit:", error);
      // document.getElementById('profitResult').innerText = `Failed to fetch profit: ${error.message}`;
      document.getElementById('profitResult').innerText = 'No Deposit :0 BNB';
  }
}


// Claim profit using Ethers.js
async function claimProfit() {
    try {
        if (!contract || !userAccount) {
            document.getElementById('profitResult').innerText = "Please connect your wallet first.";
            return;
        }
        const gasLimit = 21000; // Set a proper gas limit
        const tx = await contract.claimProfit({ gasLimit });
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        document.getElementById('profitResult').innerText = 'Profit claimed successfully!';
    } catch (error) {
        console.error("Error claiming profit:", error);
        document.getElementById('profitResult').innerText = `Failed to claim profit: ${error.message}`;
    }
}

// Event listeners for buttons
document.getElementById('connectWalletBtn').addEventListener('click', initWeb3);
document.getElementById('depositBtn').addEventListener('click', depositAmount);
document.getElementById('withdrawBtn').addEventListener('click', withdrawFunds);
document.getElementById('checkProfitBtn').addEventListener('click', checkProfit);
document.getElementById('claimProfitBtn').addEventListener('click', claimProfit);

// AppKit Modal Button Listeners
const openConnectModalBtn = document.getElementById('open-connect-modal');
const openNetworkModalBtn = document.getElementById('open-network-modal');

openConnectModalBtn.addEventListener('click', () => modal.open());
openNetworkModalBtn.addEventListener('click', () => modal.open({ view: 'Networks' }));
