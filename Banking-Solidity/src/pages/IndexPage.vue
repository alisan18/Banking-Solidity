<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-image">
        <q-card>
          <div class="row">
            <div
              style="height: 600px"
              class="col-0 col-sm-5 bg-primary rounded-left-borders xs-hide"
            >
              <div class="row q-ml-xl q-mt-sm flex">
                <div class="col-12 fredoka text-subtitle1">
                  <span class="text-white text-h4">The</span>
                  <span class="q-ml-sm text-h3 text-warning">NEXUS</span>
                </div>
              </div>
              <div
                class="row full-width q-px-xl q-pb-xl full-height flex flex-center"
              >
                <div class="">
                  <div
                    class="text-h4 text-uppercase text-white fredoka"
                    style="min-width: 220px"
                  >
                    WELCOME!
                  </div>
                  <div class="text-white q-my-sm text-subtitle1">
                    The most awaited blockchain Dapp is here!
                  </div>
                  <div class="text-white q-my-xl text-subtitle1">
                    <router-link class="text-white" to="/"> </router-link>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-7" style="width: 500px">
              <div class="row q-ml-sm q-mt-sm sm-and-up-hide">
                <div class="col-12 fredoka text-subtitle1">
                  <router-link
                    class="text-primary"
                    style="text-decoration: none"
                    to="/"
                  >
                  </router-link>
                </div>
              </div>
              <div class="row q-pa-sm-sm q-pa-md">
                <div class="col-12">
                  <q-card-section>
                    <div class="q-mb-xl">
                      <div class="flex justify-center">
                        <div
                          class="text-h4 text-uppercase q-my-none text-weight-bold text-primary fredoka"
                        >
                          Login
                        </div>
                      </div>
                    </div>
                    <q-form class="q-gutter-md q-mt-xl">
                      <q-input
                        v-model="user.username"
                        label="Username"
                        lazy-rules
                        name="username"
                      />
                      <q-input
                        v-model="user.password"
                        label="Password"
                        lazy-rules
                        name="password"
                        type="password"
                      />
                      <div>
                        <q-btn
                          class="full-width fredoka q-mt-md"
                          color="primary"
                          label="Submit"
                          rounded
                          @click="this.dialog1 = true"
                        ></q-btn>
                        <!-- type="submit" -->
                        <div class="q-mt-lg">
                          <div class="q-mt-sm">
                            Forgot your username or password?
                            <router-link class="text-primary" to="/login"
                              >Reset</router-link
                            >
                          </div>
                          <div class="q-mt-sm">
                            Sign up here
                            <router-link
                              class="text-primary"
                              to="/forgot-password"
                              >Register!</router-link
                            >
                          </div>
                        </div>
                      </div>
                    </q-form>
                  </q-card-section>
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <div>
          <q-dialog v-model="dialog1" persistent>
            <q-card style="width: 500px">
              <q-bar
                class="bg-primary text-h6 text-white flex flex-center"
                style="height: 40px"
              >
                Account Verified
                <q-space />
                <q-btn
                  flat
                  label="x"
                  class="text-white q-ml-md"
                  v-close-popup
                />
              </q-bar>
              <q-card-section>
                <div class="text-subtitle1 text-center text-grey-8 text-bold">
                  Please connect crypto wallet to continue.
                </div>
              </q-card-section>
              <q-card-actions align="center" class="bg-white text-teal">
                <div class="text-center">
                  <div class="col-12 col-md-4 q-mb-md">
                    <q-btn
                      style="width: 230px"
                      :loading="loading"
                      @click="connectMetamask"
                      color="orange-7"
                      rounded
                      class="text-bold"
                      >Connect Crypto Wallet
                      <template v-slot:loading>
                        CONNECTING
                        <q-spinner-dots
                          class="q-ml-sm"
                          color="white"
                          size="1em"
                        />
                      </template>
                    </q-btn>
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-page>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
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
  name: "IndexPage",

  components: {},

  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      loading: false,
      dialog1: false,
      isAdmin: false,
    };
  },

  async created() {},

  methods: {
    async connectMetamask() {
      this.loading = true;
      if (provider) {
        const res = await ethereum.request({ method: "eth_requestAccounts" });
        const account = res[0];
        this.currentAccount = account;
        console.log(this.currentAccount);
        await this.checkisOwner();
        this.loading = false;
      } else {
        console.log("Please Install Metamask!");
        this.loading = false;
      }

      if (this.isAdmin != true) {
        this.$router.push({ path: "/client" });
      } else {
        this.$router.push({ path: "/admin" });
      }
    },

    async checkisOwner() {
      try {
        const res = await bankContract.methods
          .isOwner(this.currentAccount)
          .call();
        console.log(res);
        this.isAdmin = res;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>

<style scoped>
.bg-image {
  background-image: url(app/src/assets/bg2.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
