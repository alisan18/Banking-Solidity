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
              label="ETH / USD"
              class="text-subtitle1"
              color="primary"
              @click="showEthereum = !showEthereum"
            />
            <q-btn
              label="BITCOIN / USD"
              class="q-ml-lg text-subtitle1"
              color="warning"
            />
            <q-btn
              label="TETHER / USD"
              class="q-ml-lg text-subtitle1"
              color="secondary"
            />
          </div>

          <div class="q-ma-xl text-center">
            <q-slide-transition appear>
              <div v-if="showEthereum" class="row q-ml-md q-mt-sm">
                <div class="col-12 col-md-12 q-mt-sm q-mb-sm">
                  <span class="text-grey-9 text-subtitle1 text-bold"
                    >Exchange ETH to USD
                  </span>
                </div>
                <div class="col-12 col-md-3">
                  <span></span>
                </div>
                <div class="col-12 col-md-2"></div>
                <div class="col-12 col-md-2">
                  <q-input
                    label="amount"
                    outlined
                    dense
                    placeholder="amount"
                    v-model="convertAmount"
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-12 q-mt-md">
                  <q-btn
                    color="green-8"
                    label="Exchange"
                    @click="exchangeCurrency"
                  />
                </div>
                <div class="col-12 col-md-12 q-mt-md">
                  <span class="text-subtitle1 text-bold">NOTE:</span>
                  <span class="text-subtitle1 text-grey-8">
                    Minimun amount to convert is 1 Eth. <br />You may check
                    exchange rate
                    <q-btn
                      flat
                      dense
                      label="HERE"
                      color="green"
                      class="text-bold"
                      @click="dialogPrice = true"
                    />.
                  </span>
                </div>
              </div>
            </q-slide-transition>
          </div>
        </q-card-section>
      </q-card>

      <q-dialog
        v-model="dialogPrice"
        persistent
        transition-show="flip-down"
        transition-hide="flip-up"
      >
        <q-card class="text-white text-bold" style="width: 500px">
          <q-toolbar class="bg-yellow-10">
            <q-icon name="request_quote" size="45px" />
            <div>
              <span class="text-h5 text-bold"> ETH/USD </span>
            </div>

            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-toolbar>

          <q-card-section>
            <div>
              <span class="text-dark text-h6 q-ml-sm">Get Price</span>
            </div>
            <div class="row q-ml-sm q-mb-sm q-mt-sm">
              <div class="col-12 col-md-3">
                <q-btn
                  color="yellow-10"
                  glossy
                  label="Check"
                  @click="getPrice"
                />
              </div>
              <div v-if="price">
                <span class="text-h6 text-bold text-dark"> Price : </span>
                <span class="text-h5 text-bold text-green q-ml-sm">
                  $ {{ price }}</span
                >
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div>
              <span class="text-dark text-h6 q-ml-sm">Conversion Rate</span>
            </div>
            <div class="row q-ml-sm q-mb-sm q-mt-sm">
              <div class="col-12 col-md-2">
                <q-btn
                  color="yellow-10"
                  glossy
                  label="Check"
                  @click="getConversionRate"
                />
              </div>
              <div class="col-12 col-md-5 q-ml-sm">
                <q-input
                  v-model="inputConversionRate"
                  label="Input eth amount"
                  outlined
                  dense
                  placeholder="amount"
                />
              </div>
              <div v-if="conversionRate" class="q-ml-md">
                <span class="text-subtitle1 text-bold text-dark q-mt-sm">
                  Rate :
                </span>
                <span class="text-h5 text-bold text-green q-ml-sm q-mt-sm">
                  $ {{ conversionRate }}</span
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

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
      currentAccount: "",
      isConnected: false,
      currentTab: "",
      userEthBalance: "",
      userUsdBalance: "",
      showEthereum: false,
      convertAmount: "",
      dialogPrice: false,
      price: "",
      inputConversionRate: "",
      conversionRate: "",
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

    async exchangeCurrency() {
      try {
        const res = await bankContract.methods
          .exchangeCurrency(this.convertAmount)
          .send({ from: this.currentAccount });
        console.log(res);
        await this.getUserUsdBalance();
        await this.getUserEthBalance();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getPrice() {
      try {
        const res = await bankContract.methods.getPrice().call();
        const read = parseInt(res) / 10 ** 18;
        this.price = read.toFixed(2);
        console.log(this.price);
      } catch (error) {
        console.log("ERROR", errorr);
      }
    },

    async getConversionRate() {
      const rate = this.inputConversionRate * this.price;
      this.conversionRate = rate.toFixed(2);
      await this.getUserUsdBalance();
      await this.getUserEthBalance();
    },
  },
});
</script>
