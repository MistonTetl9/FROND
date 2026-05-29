<script setup lang="ts">
import { ref } from 'vue'

import { ticketSchema } from '@/schemas/ticket'
import { receiptSchema } from '@/schemas/receipt'
import apiClient from '@/api/axios'

const ticketForm = ref({
  ticket: '',
  date: null,
  total: null,
})

const receiptForm = ref({
  person: '',
  rfc: '',
  name: '',
  regimen: '',
  cfdi: '',
  cp: '',
  email: '',
})

const ticketErrors = ref<{ [key: string]: string }>({})

const receiptErros = ref<{ [key: string]: string }>({})

// Captura el evento de cambio del DatePicker
const onDateChange = (event: CustomEvent) => {
  ticketForm.value.date = event.detail.value
}

const onRadioChange = (event: any) => {
  receiptForm.value.person = event.target.value
}

const nextSubmit = () => {
  const result = ticketSchema.safeParse(ticketForm.value)
  if (!result.success) {
    ticketErrors.value = {}
    const formatted = result.error.format()
    ticketErrors.value = {
      ticket: formatted.ticket?._errors[0] as string,
      date: '',
      total: formatted.total?._errors[0] as string,
    }
    toastMsg.value = '⚠️ Campos son incorreptos'
    toastOpened.value.open = true
  } else {
    //apiClient.post()
    toastMsg.value = '✅ Datos de comprobante válido'
    toastOpened.value.open = true
    tabIndex.value = 1
    console.log(result.data)
  }
}

const tabIndex = ref(0)

const loading = ref(false)

const dialogOpened = ref(false)
const dialogHelp = ref(false)
const toastOpened = ref()
const toastMsg = ref('')

// simulate loading
setTimeout(() => {
  loading.value = false
}, 1000)
function onTabSelect(event: CustomEvent) {
  tabIndex.value = event.detail.tabIndex
}

function submitDialog() {
  const result = receiptSchema.safeParse(receiptForm.value)
  if (!result.success) {
    receiptErros.value = {}
    const formatted = result.error.format()
    receiptErros.value = {
      person: formatted.person?._errors[0] as string,
      rfc: formatted.rfc?._errors[0] as string,
      name: formatted.name?._errors[0] as string,
      regimen: formatted.regimen?._errors[0] as string,
      cfdi: formatted.cfdi?._errors[0] as string,
      cp: formatted.cp?._errors[0] as string,
      email: formatted.email?._errors[0] as string,
    }
    toastMsg.value = '⚠️ Campos son incorreptos'
    toastOpened.value.open = true
    return
  } else {
    toastMsg.value = '✅ Datos fiscales válido'
    toastOpened.value.open = true

    console.log(result.data)

    const regexM = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/
    const regexF = /[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/
    if (receiptForm.value.person === 'm') {
      if (!regexM.test(receiptForm.value.rfc)) {
        toastMsg.value = '❌ RFC invalido persona MORAL'
        toastOpened.value.open = true
        return
      } // true si tiene al menos 3 caracteres
    } else {
      if (!regexF.test(receiptForm.value.rfc)) {
        toastMsg.value = '❌ RFC invalido persona FISICA'
        toastOpened.value.open = true
        return
      }
    }

    loading.value = true
    dialogOpened.value = false
    setTimeout(() => {
      loading.value = false
      toastMsg.value = 'ℹ️ Comprobante fiscal generado correctamente.'
      toastOpened.value.open = true
    }, 3000)
  }
}
</script>

<template>
  <div class="content">
    <div class="content-header">
      <ui5-title level="H3" size="H3">Generar Comprobante Fiscal</ui5-title>
      <ui5-tabcontainer
        style="max-width: 400px"
        id="tabContainerBackgroundDesign"
        header-background-design="Transparent"
        content-background-design="Transparent"
        tab-layout="Inline"
        collapsed
        @tab-select="onTabSelect"
      >
        <ui5-tab icon="sales-document" text="Comprobante" :selected="tabIndex === 0" />
        <ui5-tab icon="customer-briefing" text="Datos Fiscales" :selected="tabIndex === 1" />
      </ui5-tabcontainer>
    </div>

    <!-- Tab content -->
    <ui5-busy-indicator text="Cargando datos..." :active="loading" class="busy-overlay">
    </ui5-busy-indicator>
    <div class="content-card" :class="{ busy: loading }">
      <!-- Form comprobante -->
      <ui5-form v-if="tabIndex === 0" layout="S1 M2 L2 XL2" item-spacing="Large">
        <ui5-bar design="Subheader" :slot="'header'">
          <ui5-title :slot="'startContent'" level="H4">Comprobante</ui5-title>
          <ui5-button :slot="'endContent'" @click="nextSubmit" endIcon="sap-icon://slim-arrow-right"
            >Siguiente</ui5-button
          >
        </ui5-bar>

        <ui5-form-item>
          <ui5-label for="refInp" :slot="'labelContent'" required>Referencía/No. Ticket:</ui5-label>
          <ui5-input
            id="refInp"
            v-model="ticketForm.ticket"
            :value-state="ticketErrors.ticket ? 'Negative' : 'None'"
            placeholder="Ingrese la referencia o número de ticket"
          >
            <div v-if="ticketErrors.ticket" :slot="'valueStateMessage'">
              {{ ticketErrors.ticket }}
            </div>
            <ui5-icon
              id="refInp"
              :slot="'icon'"
              name="sys-help"
              @click="dialogHelp = true"
            ></ui5-icon>
          </ui5-input>
        </ui5-form-item>

        <!-- <ui5-form-item>
          <ui5-label for="tiInp" :slot="'labelContent'" required>No. Ticket:</ui5-label>
          <ui5-input id="tiInp"></ui5-input>
        </ui5-form-item> -->

        <ui5-form-item>
          <ui5-label for="dateDp" :slot="'labelContent'" required>Fecha:</ui5-label>
          <ui5-date-picker
            @change="onDateChange"
            id="dateDp"
            v-model="ticketForm.date"
            :value-state="ticketErrors.ticket ? 'Negative' : 'None'"
            format-pattern="yyyy-MM-dd"
          >
            <div v-if="ticketErrors.date" :slot="'valueStateMessage'">
              {{ ticketErrors.date }}
            </div>
          </ui5-date-picker>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label for="totalInp" :slot="'labelContent'" required>Total:</ui5-label>
          <ui5-input
            id="totalInp"
            :value-state="ticketErrors.total ? 'Negative' : 'None'"
            v-model.number="ticketForm.total"
            type="Number"
          >
            <div v-if="ticketErrors.total" :slot="'valueStateMessage'">
              {{ ticketErrors.total }}
            </div>
            <ui5-icon
              id="refInp"
              :slot="'icon'"
              name="sys-help"
              @click="dialogHelp = true"
            ></ui5-icon>
          </ui5-input>
        </ui5-form-item>
      </ui5-form>

      <!-- Form datos fiscales -->
      <ui5-form v-if="tabIndex === 1" layout="S1 M2 L2 XL2" item-spacing="Large">
        <ui5-bar design="Subheader" :slot="'header'">
          <ui5-title :slot="'startContent'" level="H4">Datos Fiscales</ui5-title>
          <ui5-button
            :slot="'endContent'"
            @click="tabIndex = 0"
            icon="sap-icon://slim-arrow-left"
            style="margin-right: 5px"
            >Atras</ui5-button
          >
          <ui5-button :slot="'endContent'" icon="sap-icon://settings" @click="dialogOpened = true"
            >Generar</ui5-button
          >
        </ui5-bar>

        <ui5-form-item>
          <ui5-label :slot="'labelContent'" required for="rbGroup">Persona:</ui5-label>

          <div role="radiogroup" style="display: flex">
            <ui5-radio-button
              id="rbGroup"
              text="Moral"
              name="per"
              value="m"
              :value-state="receiptErros.person ? 'Negative' : 'None'"
              @change="onRadioChange"
            >
            </ui5-radio-button>
            <ui5-radio-button
              text="Fisica"
              name="per"
              value="f"
              :value-state="receiptErros.person ? 'Negative' : 'None'"
              @change="onRadioChange"
            >
            </ui5-radio-button>
          </div>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label for="rfcInp" :slot="'labelContent'" required>RFC:</ui5-label>
          <ui5-input
            id="rfcInp"
            v-model="receiptForm.rfc"
            :value-state="receiptErros.rfc ? 'Negative' : 'None'"
          >
            <div v-if="receiptErros.rfc" :slot="'valueStateMessage'">
              {{ receiptErros.rfc }}
            </div>
          </ui5-input>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label for="rsInp" :slot="'labelContent'" required>Nombre / Razón Social:</ui5-label>
          <ui5-input id="rsInp"></ui5-input>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label id="rfLbl" for="rfSel" :slot="'labelContent'" required
            >Régimen fiscal:</ui5-label
          >
          <ui5-select id="rfSel" accessible-name-ref="rfLbl">
            <ui5-option>Seleccion</ui5-option>
          </ui5-select>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label id="cfdiLbl" for="cfdiSel" :slot="'labelContent'" required
            >Uso de CFDI:</ui5-label
          >
          <ui5-select id="cfdiSel" accessible-name-ref="cfdiLbl">
            <ui5-option>Seleccion</ui5-option>
          </ui5-select>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label for="cpInp" :slot="'labelContent'" required>Código postal:</ui5-label>
          <ui5-input id="cpInp"></ui5-input>
        </ui5-form-item>

        <ui5-form-item>
          <ui5-label for="emailInp" :slot="'labelContent'" required>Correo:</ui5-label>
          <ui5-input id="emailInp" type="email"></ui5-input>
        </ui5-form-item>
      </ui5-form>
    </div>
  </div>

  <!-- Dialog Ticket -->
  <ui5-dialog :open="dialogHelp" header-text="Ayuda: Ticket">
    <!--Dialog Content -->
    <img src="@/assets/ticket.png" alt="ticket" />

    <!-- Dialog Footer -->
    <ui5-toolbar :slot="'footer'">
      <ui5-toolbar-button design="Transparent" text="Cerrar" @click="dialogHelp = false" />
    </ui5-toolbar>
  </ui5-dialog>

  <!-- Dialog Confirm -->
  <ui5-dialog header-text="Confirmación de Datos" :open="dialogOpened">
    <section>
      <ui5-text>¿Desea generar el comprobante fiscal con los datos proporcionados?</ui5-text>
    </section>
    <ui5-toolbar :slot="'footer'">
      <ui5-toolbar-button design="Emphasized" text="Generar" @click="submitDialog" />
      <ui5-toolbar-button design="Transparent" text="Cancelar" @click="dialogOpened = false" />
    </ui5-toolbar>
  </ui5-dialog>
  <ui5-toast ref="toastOpened">{{ toastMsg }}</ui5-toast>
</template>

<style scoped>
.content {
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-card {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  max-width: 1080px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

ui5-bar {
  box-shadow: none;
}

@media (max-width: 720px) {
  .content-header {
    flex-wrap: wrap;
  }
}
</style>
