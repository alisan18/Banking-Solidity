<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card class="q-mt-lg q-ml-lg q-mr-lg">
        <q-card-section>
          <div class="row q-ml-sm">
            <div class="col-12 col-md-11 q-mb-sm">
              <span class="text-bold text-grey-8 text-subtitle1">
                MULTI-SIGNATURE CONTRACT
              </span>
            </div>
          </div>

          <div class="q-mt-md q-mb-xl flex flex-center">
            <q-table
              :rows="rows"
              :columns="columns"
              separator="cell"
              title="Transactions"
              row-key="to"
              :visible-columns="[
                'to',
                'value',
                'numConfirmations',
                'executed',
                'revoke',
                'confirm',
                'execute',
              ]"
              :loading="loading"
              :pagination="{ sortBy: 'id', rowsPerPage: 5, page: 1 }"
              :rows-per-page-options="[5, 10, 15, 20, 0]"
            >
              <template #top>
                <div class="col-2 q-table__title text-h5">Transactions</div>
                <q-space />
                <q-btn
                  no-caps
                  class="text-bold"
                  color="green-8"
                  @click="dialogSubmit = true"
                >
                  Create Transaction
                </q-btn>
              </template>
              <template #body="props">
                <q-tr
                  :props="props"
                  :class="props.row.executed == true ? 'bg-grey-4' : ''"
                >
                  <!-- <pre>{{ props }}</pre> -->
                  <q-td key="index" :props="props">
                    {{ props.row.index }}
                  </q-td>
                  <q-td key="to" :props="props">
                    {{ props.row.to }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ (props.row.value / 10 ** 18).toFixed(2) }}
                  </q-td>
                  <q-td key="numConfirmations" :props="props">
                    {{ props.row.numConfirmations }}/2
                  </q-td>
                  <q-td key="executed" :props="props">
                    {{ props.row.executed }}
                  </q-td>
                  <q-td key="revoke" :props="props">
                    <q-btn
                      :disable="props.row.executed == true"
                      color="red-4"
                      class="text-white"
                      no-caps
                      @click="revokeConfirmation(props.row)"
                    >
                      Revoke
                    </q-btn>
                  </q-td>
                  <q-td key="confirm" :props="props">
                    <q-btn
                      :disable="props.row.executed == true"
                      color="amber"
                      class="text-black"
                      no-caps
                      @click="confirmTransaction(props.row)"
                    >
                      Confirm
                    </q-btn>
                  </q-td>
                  <q-td key="execute" :props="props">
                    <q-btn
                      :disable="props.row.executed == true"
                      color="green"
                      no-caps
                      @click="executeTransaction(props.row)"
                    >
                      Execute
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
        <div class="row q-ml-lg">
          <div class="col-12 col-md-11">
            <span class="text-bold text-grey-8 text-subtitle1"> Note: </span>
            <span class="text-subtitle2 text-grey-6"
              >Please login first to blockchain to transact.</span
            >
          </div>
        </div>
      </q-card>

      <div>
        <q-dialog v-model="dialogSubmit" persistent>
          <q-card style="width: 600px">
            <q-toolbar class="bg-blue-6">
              <q-avatar color="warning" icon="receipt_long" />

              <q-toolbar-title class="text-white"
                ><span class="text-weight-bold">Create</span>
                Transaction</q-toolbar-title
              >

              <!-- <q-btn flat round dense icon="close" v-close-popup /> -->
            </q-toolbar>
            <q-card-section>
              <div class="row q-ml-md">
                <div class="col-12 col-md-2 q-mt-sm">
                  <span class="text-grey-9 text-subtitle1 text-bold"
                    >Receiver :
                  </span>
                </div>
                <div class="col-12 col-md-8">
                  <q-input
                    label="Address"
                    outlined
                    dense
                    placeholder="0x00"
                    v-model="submitTransactionTo"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row q-ml-md q-mt-md">
                <div class="col-12 col-md-2 q-mt-sm">
                  <span class="text-grey-9 text-subtitle1 text-bold"
                    >Amount :
                  </span>
                </div>
                <div class="col-12 col-md-8">
                  <q-input
                    label="value"
                    outlined
                    dense
                    placeholder="0"
                    v-model="submitTransactionAmount"
                  >
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-separator class="q-mt-md" size="1px" color="teal" />

            <q-card-section align="right">
              <div class="q-mt-sm">
                <q-btn
                  :loading="loadingSubmitTx"
                  no-caps
                  label
                  color="blue-6"
                  class="text-bold"
                  @click="submitTransaction"
                  >Submit</q-btn
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
  name: "MainLayout",

  components: {},

  data() {
    return {
      loading: false,
      isConnected: false,
      dialogSubmit: false,
      loadingSubmitTx: false,
      submitTransactionAmount: "",
      submitTransactionTo: "",
      currentAccount: "",
      rows: [],
      columns: [
        {
          name: "index",
          label: "Index",
          field: "index",
          align: "left",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
        },
        {
          name: "to",
          label: "Receiver",
          field: "to",
          align: "left",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px; font-size: 16px",
        },
        {
          name: "value",
          label: "Amount",
          field: "value",
          align: "center",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 120px; font-size: 16px",
        },
        {
          name: "numConfirmations",
          label: "Confirmations",
          field: "numConfirmations",
          align: "center",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 120px; font-size: 16px",
        },
        {
          name: "executed",
          label: "Executed",
          field: "executed",
          align: "center",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 120px; font-size: 16px",
        },
        {
          name: "revoke",
          label: "Revoke",
          field: "revoke",
          align: "center",
          sortable: false,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
        },
        {
          name: "confirm",
          label: "Confirm",
          field: "confirm",
          align: "center",
          sortable: false,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
        },
        {
          name: "execute",
          label: "Execute",
          field: "execute",
          align: "center",
          sortable: false,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
        },
      ],
    };
  },

  async created() {
    await this.checkConnection();
    await this.getAllTransactions();
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

    async getAllTransactions() {
      try {
        const res = await bankContract.methods.getAllTransactions().call();
        this.rows = res;
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async submitTransaction() {
      try {
        const res = await bankContract.methods
          .submitTransaction(
            this.submitTransactionTo,
            this.submitTransactionAmount
          )
          .send({ from: this.currentAccount });
        this.getAllTransactions();
        console.log(res);
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async confirmTransaction(data) {
      try {
        const res = await bankContract.methods
          .confirmTransaction(data.index)
          .send({ from: this.currentAccount });
        this.getAllTransactions();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async revokeConfirmation(data) {
      try {
        const res = await bankContract.methods
          .revokeConfirmation(data.index)
          .send({ from: this.currentAccount });
        this.getAllTransactions();
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    async executeTransaction(data) {
      try {
        const res = await bankContract.methods
          .executeTransaction(data.index)
          .send({ from: this.currentAccount });
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
});
</script>
