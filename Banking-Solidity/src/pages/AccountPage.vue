<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card class="q-ma-md">
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
          <div class="q-mt-lg q-ml-lg">
            <q-tabs
              v-model="currentTab"
              inline-label
              narrow-indicator
              active-bg-color="warning"
              active-color="dark"
              indicator-color="primary"
            >
              <q-tab label="DEPOSITS" name="deposits" icon="person"></q-tab>
              <q-tab label="WITHDRAWS" name="withdraws" icon="add_card"></q-tab>
              <q-tab label="TRANSFERS" name="transfer" icon="payments"></q-tab>
            </q-tabs>

            <div class="q-mt-md q-ml-md">
              <q-tab-panels
                v-model="currentTab"
                animated
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="deposits">
                  <div class="row q-ml-sm">
                    <div class="col-12 col-md-11 q-mb-sm">
                      <!-- <span class="text-bold text-dark text-subtitle1">
                        ALL DEPOSITS TABLE
                      </span> -->
                    </div>
                  </div>

                  <div class="q-mt-sm q-mb-xl flex flex-center">
                    <q-table
                      :rows="depositsRows"
                      :columns="depositsColumns"
                      separator="cell"
                      title="Transactions"
                      row-key="to"
                      :visible-columns="['amount', 'date']"
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
                          <q-td
                            key="date"
                            :props="props"
                            style="font-size: 16px"
                          >
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
                </q-tab-panel>
              </q-tab-panels>

              <q-tab-panels
                v-model="currentTab"
                animated
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="withdraws">
                  <div class="row q-ml-sm">
                    <div class="col-12 col-md-11 q-mb-sm">
                      <span class="text-bold text-dark text-subtitle1"> </span>
                    </div>
                  </div>

                  <div class="q-mt-sm q-mb-xl flex flex-center">
                    <q-table
                      :rows="withdrawsRows"
                      :columns="withdrawsColumns"
                      separator="cell"
                      title="Transactions"
                      row-key="to"
                      :visible-columns="['amount', 'date']"
                      :loading="loading"
                      :pagination="{
                        sortBy: 'address',
                        rowsPerPage: 5,
                        page: 1,
                      }"
                      :rows-per-page-options="[5, 10, 15, 20, 0]"
                    >
                      <template #top>
                        <div class="col-2 q-table__title text-h6">
                          WITHDRAWALS
                        </div>
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
                          <q-td
                            key="date"
                            :props="props"
                            style="font-size: 16px"
                          >
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
                </q-tab-panel>
              </q-tab-panels>

              <q-tab-panels
                v-model="currentTab"
                animated
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="transfer">
                  <div class="row q-ml-sm">
                    <div class="col-12 col-md-11 q-mb-sm">
                      <span class="text-bold text-dark text-subtitle1"> </span>
                    </div>
                  </div>

                  <div class="q-mt-sm q-mb-xl flex flex-center">
                    <q-table
                      :rows="transferRows"
                      :columns="transferColumns"
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
                        <div class="col-2 q-table__title text-h6">
                          TRANSFERS
                        </div>
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
                            {{ props.row.to }}
                          </q-td>
                          <q-td
                            key="amount"
                            :props="props"
                            style="font-size: 16px"
                          >
                            {{ props.row.amount / 10 ** 18 }}
                          </q-td>
                          <q-td
                            key="date"
                            :props="props"
                            style="font-size: 16px"
                          >
                            {{
                              new Date(
                                props.row.timeTransfers * 1000
                              ).toLocaleString()
                            }}
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
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
      currentTab: "deposits",
      currentAccount: "",
      isConnected: false,
      userEthBalance: "",
      userUsdBalance: "",
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
      transferRows: [],
      transferColumns: [
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
          label: "Receiver Address",
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
    await this.getUserEthBalance();
    await this.getUserUsdBalance();
    await this.getAllDeposits();
    await this.getAllWithdraws();
    await this.getAllTransfers();
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

    async getAllDeposits() {
      console.log("ACCOUNT", this.currentAccount);
      try {
        const res = await bankContract.methods.getAllDeposits().call();
        const filteredItems = res.filter((item) => {
          return item._address == parseInt(this.currentAccount);
        });
        this.depositsRows = filteredItems;
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllWithdraws() {
      try {
        const res = await bankContract.methods.getAllWithdraws().call();
        const filteredItems = res.filter((item) => {
          return item._address == parseInt(this.currentAccount);
        });
        this.withdrawsRows = filteredItems;
        console.log(this.withdrawsRows);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async getAllTransfers() {
      try {
        const res = await bankContract.methods.getAllTransfers().call();
        const filteredItems = res.filter((item) => {
          return item.from == parseInt(this.currentAccount);
        });
        this.transferRows = filteredItems;
        console.log(this.transferRows);
      } catch (error) {
        console.log("ERROR", error);
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
  },
});
</script>
