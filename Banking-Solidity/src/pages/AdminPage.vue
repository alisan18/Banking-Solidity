<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="drawerMenu = !drawerMenu"
          />

          <q-toolbar-title class="text-weight-bolder text-white">
            <div class="row">
              <div class="col-md-5">
                <span class="text-warning text-h5 text-bold"> The NEXUS </span>
                <q-img :src="url" style="height: 45px; max-width: 55px" />
                <span class="text-subtitle1 text-bold text-dark">
                  Blockchain Technology
                </span>
              </div>
            </div>
          </q-toolbar-title>

          <div>
            <q-btn
              class="text-subtitle2"
              flat
              color="white"
              text-color="white"
              :label="isConnected == true ? 'Connected' : 'Connect Wallet'"
              :disable="isConnected == true"
              @click="connectMetamask"
            />
            <q-btn class="q-ml-md" label="Account" flat>
              <q-menu style="width: 100px">
                <q-list>
                  <q-item v-close-popup clickable>
                    <q-item-section> My Profile </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item v-close-popup clickable to="/">
                    <q-item-section class="text-bold"> Logout </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-page padding>
        <div class="flex flex-center">
          <span class="text-dark text-h1 text-bold text-grey-9">WELCOME!</span>
        </div>
      </q-page>

      <q-drawer
        v-model="drawerMenu"
        show-if-above
        :width="240"
        :breakpoint="700"
        class="bg-grey-4"
      >
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list bordered separator padding class="q-mt-sm">
            <q-item
              exact
              clickable
              active-class="my-menu-link"
              v-ripple
              v-for="item in items"
              :key="item.label"
              :inset-level="item.insetLevel"
              :to="item.to"
            >
              <q-item-section avatar>
                <q-icon
                  active-icon
                  :name="item.icon"
                  :size="item.size"
                  :color="item.color"
                />
              </q-item-section>
              <q-item-section class="text-subtitle1">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top bg-blue-9" style="height: 160px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm q-mt-xl">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold text-white">Andres Bonifactio</div>
            <div class="text-weight-bold text-white">@BonifacioStreet</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <div class="bg-grey-1">
          <div class="text-h2 flex flex-center q-mt-md text-grey-9 text-bold">
            WELCOME
          </div>
          <div class="text-h2 flex flex-center q-mt-md text-grey-9 text-bold">
            ADMINISTRATOR!
          </div>
          <div class="flex flex-center q-mt-md">
            <span class="text-subtitle1 text-bold text-grey-9">Address:</span>
            <span class="text-subtitle1 text-grey-9 q-ml-sm">{{
              currentAccount
            }}</span>
            <span class="text-subtitle1 text-bold text-grey-9 q-ml-lg"
              >Eth Balance:</span
            >
            <span class="text-subtitle1 text-grey-9 q-ml-sm">{{
              ethBalance
            }}</span>
          </div>
        </div>

        <q-separator size="2px" class="q-mt-md" color="light-blue" inset />
        <div
          v-if="this.$route.path != '/vault'"
          class="q-ml-md q-mt-sm bg-grey-1 q-mr-md"
        >
          <span class="text-subtitle1 text-bold text-grey-7"
            >Access Bank :</span
          >
          <q-btn
            @click="accessBank"
            class="q-ml-sm q-mr-sm text-bold text-grey-10"
            color="warning"
            label="Authenticate"
            no-caps
          ></q-btn>
          <span class="text-subtitle1 text-bold text-grey-7">Login Time:</span>
          <span class="text-subtitle1 text-grey-9 q-ml-sm">{{
            bankLoginTime
          }}</span>
        </div>

        <div v-else class="q-ml-md q-mt-sm bg-grey-1 q-mr-md">
          <span class="text-subtitle1 text-bold text-grey-7"
            >Access Vault :</span
          >
          <q-btn
            @click="accessVault"
            class="q-ml-sm q-mr-sm text-bold text-grey-10"
            color="warning"
            label="Authenticate"
            no-caps
          ></q-btn>
          <span class="text-subtitle1 text-bold text-grey-7">Login Time:</span>
          <span class="text-subtitle1 text-grey-9 q-ml-sm">{{
            vaultLoginTime
          }}</span>
        </div>

        <!-- <div class="flex flex-center q-mt-sm">
          <q-img :src="url" alt="" style="height: 60px; width: 60px" />
        </div> -->

        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Web3 from "web3";
import bankABI from "./bankABI.json";
import vaultABI from "./vaultABI.json";

const provider = window.ethereum;
const web3 = new Web3(provider);
const bankContractAbi = bankABI.abi;
const vaultContractAbi = vaultABI.abi;

const bankContract = new web3.eth.Contract(
  bankContractAbi,
  process.env.CONTRACT_ADDRESS_BANK
);

const vaultContract = new web3.eth.Contract(
  vaultContractAbi,
  process.env.CONTRACT_ADDRESS_VAULT
);

export default defineComponent({
  name: "MainLayout",

  components: {},

  data() {
    return {
      url: require("app/src/assets/acnlogo.png"),
      bg1: require("app/src/assets/bg1.jpg"),
      toggleLeftDrawer: false,
      isConnected: false,
      drawerMenu: false,
      currentAccount: "",
      ethBalance: "",
      bankLoginTime: "",
      vaultLoginTime: "",
      items: [
        {
          label: "HOME",
          icon: "home",
          size: "50px",
          color: "primary",
          insetLevel: 0,
          to: "/admin",
          active: false,
        },
        {
          label: "USERS",
          icon: "group",
          size: "50px",
          color: "primary",
          insetLevel: 0,
          to: "/users",
        },
        {
          label: "MULTI-SIG",
          icon: "switch_account",
          size: "50px",
          color: "primary",
          insetLevel: 0,
          to: "/multi-sig",
        },
        {
          label: "VAULT",
          icon: "phonelink_lock",
          size: "50px",
          color: "primary",
          insetLevel: 0,
          to: "/vault",
        },
        {
          label: "BANK",
          icon: "account_balance",
          size: "50px",
          color: "primary",
          insetLevel: 0,
          to: "/others",
        },
      ],
    };
  },

  async created() {
    await this.checkConnection();
    await this.getLoginTime();
  },

  methods: {
    async connectMetamask() {
      if (provider) {
        this.loading = true;
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
        this.checkConnection();
        this.loading = false;
      } else {
        console.log("Please Install Metamask!");
      }
    },

    async getLoginTime() {
      this.loading = true;
      const date = new Date().toLocaleString();
      this.loginTime = date;
      console.log(this.loginTime);

      this.loading = false;
    },

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

    async accessBank() {
      try {
        const res = await bankContract.methods
          .accessBankInAndOut()
          .send({ from: this.currentAccount });
        this.bankLoginTime = new Date().toLocaleString();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async isLoggedBank() {
      try {
        const res = await vaultContract.methods
          .isLoogedIn(this.currentAccount)
          .call();
        this.vaultLoginTime = new Date(res * 1000).toLocaleString();
        console.log(this.bankLoginTime);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async accessVault() {
      try {
        const res = await vaultContract.methods
          .accessVault()
          .send({ from: this.currentAccount });
        this.vaultLoginTime = new Date().toLocaleString();
        console.log(this.vaultLoginTime);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async isLoggedVault() {
      try {
        const res = await vaultContract.methods
          .isLoggedIn(this.currentAccount)
          .call();
        // this.vaultLoginTime = new Date(res * 1000).toLocaleString();
        this.vaultLoginTime = toString(res);
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
});
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037
</style>
