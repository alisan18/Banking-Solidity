<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card style="height: 500px" class="q-ma-md">
        <q-card-section>
          <div>
            <span class="text-subtitle1 text-bold"
              >MY TOTAL ETH BALANCE :
              <span class="text-blue text-subtitle1 text-bold"
                >{{ userEthBalance }} ETH</span
              >
            </span>
          </div>
          <div>
            <span class="text-subtitle1 text-bold"
              >MY TOTAL USD BALANCE :
              <span class="text-blue text-subtitle1 text-bold"
                >{{ userUsdBalance }} USD</span
              >
            </span>
          </div>
          <div class="flex flex-center">
            <q-btn
              label="ETHEREUM"
              class="text-subtitle1"
              color="primary"
              @click="showEthereum = !showEthereum"
            />
            <q-btn
              label="BITCOIN"
              class="q-ml-lg text-subtitle1"
              color="warning"
            />
            <q-btn
              label="TETHER"
              class="q-ml-lg text-subtitle1"
              color="secondary"
            />
          </div>

          <div class="q-ma-xl text-center">
            <q-slide-transition appear>
              <q-card v-if="showEthereum" class="flex flex-center">
                <q-card-section>
                  <div class="row q-ml-md q-mt-sm">
                    <div class="col-12 col-md-12 q-mt-sm">
                      <span class="text-grey-9 text-subtitle1 text-bold"
                        >Deposit Amount :
                      </span>
                    </div>
                    <div class="col-12 col-md-12">
                      <q-input
                        label="amount"
                        outlined
                        dense
                        placeholder="0x00"
                        v-model="depositAmount"
                      >
                      </q-input>
                    </div>
                    <div class="col-12 col-md-12 q-mt-sm">
                      <q-btn
                        color="green-8"
                        label="Deposit"
                        @click="userDeposit"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-slide-transition>
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
      url: require("app/src/assets/acnlogo.png"),
      currentAccount: "",
      isConnected: false,
      currentTab: "",
      userEthBalance: "",
      userUsdBalance: "",
      showEthereum: false,
      depositAmount: "",
    };
  },

  async created() {
    await this.checkConnection();
    await this.getUserEthBalance();
    await this.getUserUsdBalance();
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

    async getUserEthBalance() {
      try {
        const res = await bankContract.methods
          .userEthBalance(this.currentAccount)
          .call();
        const read = parseInt(res) / 10 ** 18;
        this.userEthBalance = read.toFixed(2);
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getUserUsdBalance() {
      try {
        const res = await bankContract.methods
          .userUsdBalance(this.currentAccount)
          .call();
        this.userUsdBalance = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async userDeposit() {
      try {
        const res = await bankContract.methods
          .deposit()
          .send({ value: this.depositAmount, from: this.currentAccount });
        this.etUserEthBalance();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
