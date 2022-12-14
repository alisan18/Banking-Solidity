<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-card style="height: 500px" class="q-ma-md">
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
              :rows="multiSigRows"
              :columns="multiSigcolumns"
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
                    {{ (props.row.value / 10 ** 18).toFixed(4) }}
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
      </q-card>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

  data() {
    return {
      loading: false,
      multiSigRows: [],
      multiSigcolumns: [
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
          style: "width: 150px",
        },
        {
          name: "value",
          label: "Amount",
          field: "value",
          align: "left",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
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
          style: "width: 150px",
        },
        {
          name: "executed",
          label: "Executed",
          field: "executed",
          align: "left",
          sortable: true,
          // style: "border-bottom: 1px solid green",
          headerClasses: "bg-blue-6 text-white",
          headerStyle: "font-size: 1.2em",
          style: "width: 150px",
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
          style: "width: 200px",
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
          style: "width: 200px",
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
          style: "width: 200px",
        },
      ],
    };
  },
});
</script>
