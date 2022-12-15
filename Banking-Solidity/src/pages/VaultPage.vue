<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card class="q-mt-lg q-ml-lg q-mr-lg" style="height: 800px">
        <q-card-section>
          <div class="q-mt-md">
            <q-splitter v-model="splitterModel" style="height: 720px">
              <template v-slot:before>
                <q-tabs
                  v-model="currentTab"
                  vertical
                  active-bg-color="warning"
                  active-color="blue-6"
                  indicator-color="primary"
                  align="center"
                >
                  <q-tab
                    label="ACCOUNTS"
                    name="accounts"
                    icon="manage_accounts"
                  />
                  <q-tab
                    label="TRANSFER LOGS"
                    name="transferLogs"
                    icon="move_up"
                  />
                  <q-tab
                    label="Access History"
                    name="accessHistory"
                    icon="login"
                  />
                  <q-tab label="Settings" name="settings" icon="settings" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="currentTab"
                  animated
                  swipeable
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                >
                  <q-tab-panel name="accounts">
                    <div class="text-h5 q-mb-md">ADMIN ACCOUNTS</div>
                    <div class="q-mt-md q-mb-xl flex flex-center">
                      <q-table
                        :rows="accountRows"
                        :columns="accountColumns"
                        separator="cell"
                        title="Transactions"
                        row-key="to"
                        :visible-columns="['address', 'timeAdded', 'action']"
                        :loading="loading"
                        :pagination="{
                          sortBy: 'enrolledTime',
                          rowsPerPage: 5,
                          page: 1,
                        }"
                        :rows-per-page-options="[5, 10, 15, 20, 0]"
                      >
                        <template #top>
                          <!-- <div class="col-2 q-table__title text-h6">ADMINS</div> -->
                          <q-space />
                          <q-btn
                            no-caps
                            class="text-bold"
                            color="green-8"
                            @click="dialogGrantRole = true"
                          >
                            Grant Role
                          </q-btn>
                        </template>
                        <template #body="props">
                          <q-tr :props="props">
                            <!-- <pre>{{ props }}</pre> -->
                            <q-td key="index" :props="props">
                              {{ props.row.index }}
                            </q-td>
                            <q-td
                              key="address"
                              :props="props"
                              style="font-size: 16px"
                            >
                              {{ props.row.userAddress }}
                            </q-td>
                            <q-td
                              key="timeAdded"
                              :props="props"
                              style="font-size: 16px"
                            >
                              {{
                                new Date(
                                  props.row.timeAdded * 1000
                                ).toLocaleString()
                              }}
                            </q-td>
                            <q-td key="action" :props="props">
                              <q-btn
                                color="red-4"
                                class="text-white"
                                no-caps
                                @click="removeUser(props.row)"
                              >
                                Remove
                              </q-btn>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="transferLogs">
                    <div class="text-h4 q-mb-md">Transfer Logs</div>
                    <p>.</p>
                  </q-tab-panel>

                  <q-tab-panel name="accessHistory">
                    <div class="text-h4 q-mb-md">Access History</div>
                    <div class="q-mt-md q-mb-xl flex flex-center">
                      <q-table
                        :rows="accessRows"
                        :columns="accessColumns"
                        separator="cell"
                        title="Transactions"
                        row-key="to"
                        :visible-columns="['address', 'timeIn', 'timeOut']"
                        :loading="loading"
                        :pagination="{
                          sortBy: 'enrolledTime',
                          rowsPerPage: 5,
                          page: 1,
                        }"
                        :rows-per-page-options="[5, 10, 15, 20, 0]"
                      >
                        <template #top> </template>
                        <template #body="props">
                          <q-tr :props="props">
                            <!-- <pre>{{ props }}</pre> -->
                            <q-td key="index" :props="props">
                              {{ props.row.index }}
                            </q-td>
                            <q-td
                              key="address"
                              :props="props"
                              style="font-size: 16px"
                            >
                              {{ props.row.adminAddress }}
                            </q-td>
                            <q-td
                              key="timeIn"
                              :props="props"
                              style="font-size: 16px"
                            >
                              {{
                                new Date(
                                  props.row.timeIn * 1000
                                ).toLocaleString()
                              }}
                            </q-td>
                            <q-td
                              key="timeOut"
                              :props="props"
                              style="font-size: 16px"
                            >
                              {{
                                new Date(
                                  props.row.timeOut * 1000
                                ).toLocaleString()
                              }}
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="settings">
                    <div class="q-mt-sm q-mb-sm">
                      <span class="text-subtitle1">VAULT BALANCE : </span>
                      <span class="text-subtitle1 text-green text-bold"
                        >{{ vaultBalance }} ETH</span
                      >
                    </div>
                    <div class="q-pa-md" style="max-width: 950px">
                      <q-expansion-item
                        class="shadow-1 overflow-hidden"
                        icon="person_add"
                        label="Whitelist"
                        header-class="bg-primary text-white text-subtitle1"
                        expand-icon-class="text-white"
                      >
                        <q-card>
                          <q-card-section>
                            <!-- <div class="text-h4 q-mb-md">Settings</div> -->
                            <div>
                              <span class="text-subtitle1"
                                >Add address to WhiteList
                              </span>
                            </div>
                            <div class="row q-ml-md q-mt-sm">
                              <div class="col-12 col-md-2 q-mt-sm">
                                <span
                                  class="text-grey-9 text-subtitle1 text-bold"
                                  >Wallet Address :
                                </span>
                              </div>
                              <div class="col-12 col-md-5">
                                <q-input
                                  label="Address"
                                  outlined
                                  dense
                                  placeholder="0x00"
                                  v-model="inputWhiteListAddress"
                                >
                                </q-input>
                              </div>
                              <div class="col-12 col-md-2">
                                <q-btn
                                  no-caps
                                  color="primary"
                                  class="text-bold q-ml-sm"
                                  label="Add"
                                  @click="addToWhiteLlist"
                                />
                              </div>
                            </div>
                            <div class="row q-ml-md q-mt-sm">
                              <div class="col-12 col-md-2 q-mt-sm">
                                <span
                                  class="text-grey-9 text-subtitle1 text-bold"
                                  >Verify Address :
                                </span>
                              </div>
                              <div class="col-12 col-md-5">
                                <q-input
                                  label="Address"
                                  outlined
                                  dense
                                  placeholder="0x00"
                                  v-model="inputVerifyAddress"
                                >
                                </q-input>
                              </div>
                              <div class="col-12 col-md-2">
                                <q-btn
                                  no-caps
                                  color="primary"
                                  class="text-bold q-ml-sm"
                                  label="Verify"
                                  @click="verifyWhiteList"
                                />
                              </div>
                              <div class="col-12 col-md-2">
                                <span class="text-subtitle1 text-bold"
                                  >Result : {{ verifyResult }}</span
                                >
                              </div>
                            </div>
                            <div class="q-mt-lg text-subtitle1">
                              <span>Whitelisted Address</span>
                            </div>
                            <div class="q-mt-sm text-subtitle1">
                              <span
                                >The <strong>BANK</strong> :
                                <span class="text-blue-6 text-bold"
                                  >0x4d63201f95c62966462e121e6Fe61bcca4eCF9D2</span
                                >
                              </span>
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-expansion-item>
                    </div>

                    <div class="q-pa-md q-mt-sm" style="max-width: 950px">
                      <q-expansion-item
                        class="shadow-1 overflow-hidden"
                        icon="lock_open"
                        label="Lock / Unlock Vault"
                        header-class="bg-primary text-white text-subtitle1"
                        expand-icon-class="text-white"
                      >
                        <q-card>
                          <q-card-section>
                            <!-- <div class="text-h4 q-mb-md">Time Lock</div> -->
                            <div>
                              <span class="text-subtitle1">Lock Vault </span>
                            </div>
                            <div class="row q-ml-md q-mt-sm">
                              <div class="col-12 col-md-2">
                                <q-btn
                                  no-caps
                                  color="primary"
                                  class="text-bold q-ml-sm text-subtitle1"
                                  label="Lock Now"
                                  @click="unlockVault"
                                />
                              </div>
                            </div>
                            <div class="q-mt-md">
                              <span class="text-subtitle1">Unlock Vault </span>
                            </div>
                            <div class="row q-ml-md q-mt-sm">
                              <div class="col-12 col-md-2 q-mt-sm">
                                <span
                                  class="text-grey-9 text-subtitle1 text-bold"
                                  >Time (seconds) :
                                </span>
                              </div>
                              <div class="col-12 col-md-5">
                                <q-input
                                  label="seconds"
                                  outlined
                                  dense
                                  placeholder="0"
                                  v-model="inputUnlockTime"
                                >
                                </q-input>
                              </div>
                              <div class="col-12 col-md-2">
                                <q-btn
                                  no-caps
                                  color="primary"
                                  class="text-bold q-ml-sm"
                                  label="Unlock"
                                  @click="unlockVault"
                                />
                              </div>
                            </div>
                            <div class="row q-ml-md q-mt-md">
                              <div class="col-12 col-md-8 q-mt-sm">
                                <span
                                  class="text-grey-9 text-subtitle1 text-bold"
                                  >Check Remaining Time:
                                </span>
                                <q-btn
                                  no-caps
                                  color="primary"
                                  class="text-bold q-ml-sm"
                                  label="Check"
                                  @click="getTimeLeft"
                                />
                                <span
                                  v-if="timeLeft"
                                  class="text-grey-9 text-subtitle1 text-bold q-ml-md"
                                  >Result : {{ timeLeft }}
                                </span>
                                <!-- <span
                                  class="text-grey-9 text-subtitle1 text-bold q-ml-md"
                                  >Result : {{ errorMessage }}
                                </span> -->
                              </div>
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-expansion-item>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </div>
        </q-card-section>
      </q-card>

      <div>
        <q-dialog v-model="dialogGrantRole" persistent>
          <q-card style="width: 800px">
            <q-toolbar class="bg-primary">
              <q-avatar color="warning" icon="how_to_reg" size="45px" />

              <q-toolbar-title class="text-white"
                ><span class="text-weight-bold">Grant</span>
                Role</q-toolbar-title
              >
            </q-toolbar>
            <q-card-section>
              <div class="row q-ml-md q-mt-sm">
                <div class="col-12 col-md-3 q-mt-sm">
                  <span class="text-grey-9 text-subtitle1 text-bold"
                    >Hash Code :
                  </span>
                </div>
                <div class="col-12 col-md-8">
                  <q-input
                    label="hash"
                    outlined
                    dense
                    placeholder="hash code"
                    v-model="hashCode"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row q-ml-md q-mt-sm">
                <div class="col-12 col-md-3 q-mt-sm">
                  <span class="text-grey-9 text-subtitle1 text-bold"
                    >User Address :
                  </span>
                </div>
                <div class="col-12 col-md-8">
                  <q-input
                    label="Address"
                    outlined
                    dense
                    placeholder="0x00"
                    v-model="userAddress"
                  >
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-separator class="q-mt-md" size="2px" color="primary" />

            <q-card-section align="right">
              <div class="q-mt-sm">
                <q-btn
                  :loading="loadingGrantTx"
                  no-caps
                  label
                  color="primary"
                  class="text-bold"
                  @click="grantRole"
                  >Enroll</q-btn
                >
                <q-btn
                  no-caps
                  color="red"
                  class="text-bold q-ml-sm"
                  label="Cancel"
                  v-close-popup
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { isCoreComponent } from "@vue/compiler-core";
import { defineComponent, ref } from "vue";
import Web3 from "web3";
import vaultABI from "./vaultABI.json";

const provider = window.ethereum;
const web3 = new Web3(provider);
const vaultContractAbi = vaultABI.abi;

const vaultContract = new web3.eth.Contract(
  vaultContractAbi,
  process.env.CONTRACT_ADDRESS_VAULT
);

export default defineComponent({
  components: {},

  data() {
    return {
      currentTab: "accounts",
      loading: false,
      loadingGrantTx: false,
      dialogGrantRole: false,
      isConnected: false,
      splitterModel: 10,
      currentAccount: "",
      inputWhiteListAddress: "",
      hashCode: "",
      userAddress: "",
      inputUnlockTime: "",
      inputVerifyAddress: "",
      verifyResult: "",
      timeLeft: "",
      errorMessage: "",
      vaultBalance: "",
      accountRows: [],
      accountColumns: [
        {
          name: "index",
          label: "Index",
          field: "index",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 100px",
        },
        {
          name: "address",
          label: "Address",
          field: "address",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 550px",
        },
        {
          name: "timeAdded",
          label: "Time Added",
          field: "timeAdded",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "center",
          sortable: false,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 200px",
        },
      ],
      accessRows: [],
      accessColumns: [
        {
          name: "index",
          label: "Index",
          field: "index",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 100px",
        },
        {
          name: "address",
          label: "Address",
          field: "address",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 550px",
        },
        {
          name: "timeIn",
          label: "Time In",
          field: "timeIn",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
        },
        {
          name: "timeOut",
          label: "Time Out",
          field: "timeOut",
          align: "center",
          sortable: false,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 200px",
        },
      ],
    };
  },

  async created() {
    await this.checkConnection();
    await this.getAllAccounts();
    await this.getAccessHistory();
    await this.getVaultBalance();
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

    async grantRole() {
      try {
        const res = await vaultContract.methods
          .grantRole(this.hashCode, this.userAddress)
          .send({ from: this.currentAccount });
        console.log(res);
        this.getAllAccounts();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllAccounts() {
      try {
        const res = await vaultContract.methods.getAllAccounts().call();
        this.accountRows = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async addToWhiteLlist() {
      try {
        const res = await vaultContract.methods
          .addToWhitelist(this.inputWhiteListAddress)
          .send({ from: this.currentAccount });
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async verifyWhiteList() {
      try {
        const res = await vaultContract.methods
          .verifyWhitelistedAddress(this.inputVerifyAddress)
          .call({ from: this.currentAccount });
        this.verifyResult = res;
        console.log(this.verifyResult);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async unlockVault() {
      try {
        const res = await vaultContract.methods
          .unlockVault(this.inputUnlockTime)
          .send({ from: this.currentAccount });
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getTimeLeft() {
      try {
        const res = await vaultContract.methods
          .getOpenTimeLeft()
          .call({ from: this.currentAccount });
        this.timeLeft = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAccessHistory() {
      try {
        const res = await vaultContract.methods.getAccessHistory().call();
        this.accessRows = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getVaultBalance() {
      try {
        const res = await vaultContract.methods
          .getVaultBalance()
          .call({ from: this.currentAccount });
        const read = parseInt(res) / 10 ** 18;
        this.vaultBalance = read.toFixed(2);
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async transferEthToBank() {
      try {
        const res = await vaultContract.methods
          .transferEthToBank()
          .send({ from: this.currentAccount });
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
});
</script>
