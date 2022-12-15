<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card style="height: 500px" class="q-ma-md">
        <q-card-section>
          <div class="row q-ml-sm">
            <div class="col-12 col-md-11 q-mb-sm">
              <span class="text-bold text-grey-8 text-h6">
                CONTRACT FUNCTIONS
              </span>
            </div>
            <div class="col-12 col-md-12 q-mb-sm">
              <span class="text-bold text-grey-8 text-subtitle1">
                ETH/USD Conversion Rate :
              </span>
              <span class="text-bold text-green text-h6 q-ml-sm">
                ${{ conversionRate }}</span
              >
            </div>
            <div class="col-12 col-md-12 q-mb-sm">
              <span class="text-bold text-grey-8 text-subtitle1">
                Total USD Balance :
              </span>
              <span class="text-bold text-green text-h6 q-ml-sm"
                >$ {{ usdBalance }}</span
              >
            </div>
            <div class="col-12 col-md-12 q-mb-sm">
              <span class="text-bold text-grey-8 text-subtitle1">
                Total Contract Balance :
              </span>
              <span class="text-bold text-green text-h6 q-ml-sm"
                >{{ contractEthBalance }} Eth</span
              >
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Web3 from "web3";
import bankABI from "./bankABI.json";

const provider = window.ethereum;
const web3 = new Web3(provider);
const bankContractAbi = bankABI.abi;

const bankContract = new web3.eth.Contract(
  bankContractAbi,
  process.env.CONTRACT_ADDRESS_BANK
);

export default defineComponent({
  components: {},

  data() {
    return {
      toggleLeftDrawer: false,
      conversionRate: "",
      usdBalance: "",
      ethBalance: "",
      contractEthBalance: "",
    };
  },

  async created() {
    await this.checkConnection();
    await this.getPrice();
    await this.getTotalUsdBalance();
    await this.getTotalEthBalance();
  },

  methods: {
    async checkConnection() {
      this.loading = true;
      const res = await ethereum.isConnected();
      this.isConnected = res;
      console.log(this.isConnected);

      if (res == true) {
        const res = await ethereum.request({ method: "eth_requestAccounts" });
        const account = res[0];
        this.currentAccount = account;
        console.log(this.currentAccount);
        let balance = await ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const read = parseInt(balance) / 10 ** 18;
        this.ethBalance = read.toFixed(4);
        this.loading = false;
      } else {
        console.log("Connect Wallet to continue");
      }
    },

    async getPrice() {
      try {
        const res = await bankContract.methods.getPrice().call();
        const read = parseInt(res) / 10 ** 18;
        this.conversionRate = read.toFixed(2);

        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getTotalUsdBalance() {
      try {
        const res = await bankContract.methods.usdAmount().call();
        this.usdBalance = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getTotalEthBalance() {
      try {
        const res = await bankContract.methods
          .getAdminBalance(process.env.CONTRACT_ADDRESS_BANK)
          .call({ from: this.currentAccount });
        const read = parseInt(res) / 10 ** 18;
        this.contractEthBalance = read.toFixed(2);
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
});
</script>
