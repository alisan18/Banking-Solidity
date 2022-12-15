<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <div class="q-mt-lg q-ml-lg">
        <q-tabs
          v-model="currentTab"
          inline-label
          narrow-indicator
          active-bg-color="warning"
          active-color="dark"
          indicator-color="primary"
        >
          <q-tab label="USERS" name="usersList" icon="person"></q-tab>
          <q-tab label="DEPOSITS" name="depositList" icon="add_card"></q-tab>
          <q-tab label="WITHDRAWS" name="withdrawList" icon="payments"></q-tab>
        </q-tabs>
      </div>

      <div class="q-mt-md q-ml-md">
        <q-tab-panels
          v-model="currentTab"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="usersList">
            <q-card>
              <q-card-section>
                <div class="row q-ml-sm">
                  <div class="col-12 col-md-11 q-mb-sm">
                    <span class="text-bold text-dark text-subtitle1">
                      ENROLLED USERS TABLE
                    </span>
                  </div>
                </div>

                <div class="q-mt-md q-mb-xl flex flex-center">
                  <q-table
                    :rows="userRows"
                    :columns="userColumns"
                    separator="cell"
                    title="Transactions"
                    row-key="to"
                    :visible-columns="['address', 'enrolledTime', 'action']"
                    :loading="loading"
                    :pagination="{
                      sortBy: 'enrolledTime',
                      rowsPerPage: 5,
                      page: 1,
                    }"
                    :rows-per-page-options="[5, 10, 15, 20, 0]"
                  >
                    <template #top>
                      <div class="col-2 q-table__title text-h6">USERS</div>
                      <q-space />
                      <q-btn
                        no-caps
                        class="text-bold"
                        color="green-8"
                        @click="dialogEnroll = true"
                      >
                        Enroll User
                      </q-btn>
                    </template>
                    <template #body="props">
                      <q-tr
                        :props="props"
                        :class="props.row.enrolled == true ? 'bg-grey-4' : ''"
                      >
                        <!-- <pre>{{ props }}</pre> -->
                        <q-td key="index" :props="props">
                          {{ props.row.index }}
                        </q-td>
                        <q-td
                          key="address"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{ props.row._address }}
                        </q-td>
                        <q-td
                          key="enrolledTime"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{
                            new Date(
                              props.row.enrolledTime * 1000
                            ).toLocaleString()
                          }}
                        </q-td>
                        <q-td key="status" :props="props">
                          {{ props.row.status }}
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
              </q-card-section>
              <div class="row q-ml-lg">
                <div class="col-12 col-md-11 q-mb-sm">
                  <span class="text-bold text-grey-8 text-subtitle1">
                    Note:
                  </span>
                  <span class="text-subtitle2 text-grey-6"
                    >Please login first to blockchain to transact.</span
                  >
                </div>
              </div>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="depositList">
            <q-card>
              <q-card-section>
                <div class="row q-ml-sm">
                  <div class="col-12 col-md-11 q-mb-sm">
                    <span class="text-bold text-dark text-subtitle1">
                      ALL DEPOSITS TABLE
                    </span>
                  </div>
                </div>

                <div class="q-mt-md q-mb-xl flex flex-center">
                  <q-table
                    :rows="depositsRows"
                    :columns="depositsColumns"
                    separator="cell"
                    title="Transactions"
                    row-key="to"
                    :visible-columns="['address', 'amount', 'date']"
                    :loading="loading"
                    :pagination="{
                      sortBy: 'address',
                      rowsPerPage: 5,
                      page: 1,
                    }"
                    :rows-per-page-options="[5, 10, 15, 20, 0]"
                  >
                    <template #top>
                      <div class="col-2 q-table__title text-h6">DEPOSITS</div>
                      <q-space />
                    </template>
                    <template #body="props">
                      <q-tr
                        :props="props"
                        :class="props.row.enrolled == true ? 'bg-grey-4' : ''"
                      >
                        <q-td key="index" :props="props">
                          {{ props.row.index }}
                        </q-td>
                        <q-td
                          key="address"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{ props.row._address }}
                        </q-td>
                        <q-td
                          key="amount"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{ props.row.amount / 10 ** 18 }}
                        </q-td>
                        <q-td key="date" :props="props" style="font-size: 16px">
                          {{
                            new Date(
                              props.row.timeDeposit * 1000
                            ).toLocaleString()
                          }}
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="withdrawList">
            <q-card>
              <q-card-section>
                <div class="row q-ml-sm">
                  <div class="col-12 col-md-11 q-mb-sm">
                    <span class="text-bold text-dark text-subtitle1">
                      ALL WITHDRAWS TABLE
                    </span>
                  </div>
                </div>

                <div class="q-mt-md q-mb-xl flex flex-center">
                  <q-table
                    :rows="withdrawsRows"
                    :columns="withdrawsColumns"
                    separator="cell"
                    title="Transactions"
                    row-key="to"
                    :visible-columns="['address', 'amount', 'date']"
                    :loading="loading"
                    :pagination="{
                      sortBy: 'address',
                      rowsPerPage: 5,
                      page: 1,
                    }"
                    :rows-per-page-options="[5, 10, 15, 20, 0]"
                  >
                    <template #top>
                      <div class="col-2 q-table__title text-h6">WITHDRAWS</div>
                      <q-space />
                    </template>
                    <template #body="props">
                      <q-tr
                        :props="props"
                        :class="props.row.enrolled == true ? 'bg-grey-4' : ''"
                      >
                        <q-td key="index" :props="props">
                          {{ props.row.index }}
                        </q-td>
                        <q-td
                          key="address"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{ props.row._address }}
                        </q-td>
                        <q-td
                          key="amount"
                          :props="props"
                          style="font-size: 16px"
                        >
                          {{ props.row.amount / 10 ** 18 }}
                        </q-td>
                        <q-td key="date" :props="props" style="font-size: 16px">
                          {{
                            new Date(
                              props.row.timeWithdraws * 1000
                            ).toLocaleString()
                          }}
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <div>
        <q-dialog v-model="dialogEnroll" persistent>
          <q-card style="width: 800px">
            <q-toolbar class="bg-primary">
              <q-avatar color="warning" icon="how_to_reg" size="45px" />

              <q-toolbar-title class="text-white"
                ><span class="text-weight-bold">Enroll</span>
                User</q-toolbar-title
              >
            </q-toolbar>
            <q-card-section>
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
                  :loading="loadingEnrollTx"
                  no-caps
                  label
                  color="primary"
                  class="text-bold"
                  @click="enrollUser"
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
      currentTab: "usersList",
      loading: false,
      dialogEnroll: false,
      loadingEnrollTx: false,
      isConnected: false,
      currentAccount: "",
      userAddress: "",
      userRows: [],
      userColumns: [
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
          name: "enrolledTime",
          label: "Time of Enrollment",
          field: "enrolledTime",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 200px",
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
      depositsRows: [],
      depositsColumns: [
        {
          name: "index",
          label: "Index",
          field: "index",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
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
          name: "amount",
          label: "Amount (Eth)",
          field: "amount",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 120px",
        },
        {
          name: "date",
          label: "Date",
          field: "date",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
        },
      ],
      withdrawsRows: [],
      withdrawsColumns: [
        {
          name: "index",
          label: "Index",
          field: "index",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
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
          name: "amount",
          label: "Amount (Eth)",
          field: "amount",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 120px",
        },
        {
          name: "date",
          label: "Date",
          field: "date",
          align: "center",
          sortable: true,
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 300px",
        },
      ],
    };
  },

  async created() {
    await this.checkConnection();
    await this.getAllUsers();
    await this.getAllDeposits();
    await this.getAllWithdraws();
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

    async enrollUser() {
      try {
        const res = await bankContract.methods
          .enrollUser(this.userAddress)
          .send({ from: this.currentAccount });
        this.getAllUsers();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async removeUser(data) {
      console.log(data);
      try {
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllUsers() {
      try {
        const res = await bankContract.methods.getAllUsers().call();
        this.userRows = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllDeposits() {
      try {
        const res = await bankContract.methods.getAllDeposits().call();
        this.depositsRows = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllWithdraws() {
      try {
        const res = await bankContract.methods.getAllWithdraws().call();
        this.withdrawsRows = res;
        console.log(this.withdrawsRows);
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
});
</script>
