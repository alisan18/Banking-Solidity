<template>
    <div>
      <q-layout view="lHh Lpr lFf">
        <q-card style="height:500px" class="q-ma-md">
          <q-card-section>
            <div class="row q-ml-sm">
              <div class="col-12 col-md-11 q-mb-sm">
                <span class="text-bold text-grey-8 text-subtitle1">
                  THE VAULT
                </span>
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

  export default defineComponent({

    components: {},

    data() {
      return {
        toggleLeftDrawer: false,
      };
    },
  });
  </script>
