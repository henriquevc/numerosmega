<template>
  <div class="row justify-end q-pa-md">
    <q-btn icon="brightness_6" flat round  @click="trocarCor()"/>
  </div>
  <h3 class="text-center">Números da mega</h3>
  <div class="row justify-center q-col-gutter-md">
    <div class="col-xs-12 col-lg-10 row q-col-gutter-sm justify-between">
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.primeiro"></q-input>
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.segundo"></q-input>
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.terceiro"></q-input>
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.quarto"></q-input>
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.quinto"></q-input>
      <q-input outlined class="col-2" maxlength="2" v-model="sorteado.sexto"></q-input>
    </div>
    <div class="col-12 row justify-center q-mt-md">
      <q-btn color="primary" @click="comparar">Comparar com os jogos</q-btn>
    </div>
    <div class="col-12 justify-center row items-center q-gutter-sm q-mt-xl">
      <span class="text-h5">Jogos cadastrados</span>
      <q-btn color="positive" icon="add" @click="showNovoJogo = true">adicionar jogo</q-btn>
    </div>
    <q-dialog v-model="showNovoJogo">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">adicionar jogo</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row items-center justify-center q-col-gutter-sm">
            <q-input v-model="novoJogo.nome" outlined label="Nome" class="q-my-md col-12"></q-input>
            <q-input v-for="n in 15" v-model="novoJogo.numeros[n]"
              type="text" :key="n" outlined class="col-4"
              inputmode="numeric" maxlength="2"
              :rules="[ val => (val>= 1 && val <= 60) || 'Números entre 1 e 60']"
              :label="`${n}ª dezena ${n <= 6 ? '(obrigatório)' : ''}`"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="position: sticky; bottom: 0;" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
          <q-btn flat label="cancelar" v-close-popup />
          <q-btn color="positive" label="adicionar" @click="adicionarJogo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-list bordered v-if="listaNumeros && listaNumeros.length" separator class="col-xs-12 col-sm-10 col-md-9 col-lg-6 col-xl-4 q-my-lg" style="max-width: 560px">
      <q-item v-for="(item, index) in listaNumeros" :key="index" class="q-col-4" bordered>
        <q-item-section side>
          {{item.jogador}} - #{{ index + 1 }}
        </q-item-section>
        <q-item-section>
          <div class="row">
            <span class="q-ma-md text-bold" v-for="num in item.numeros" :key="num">{{ num }}</span>
          </div>
        </q-item-section>
        <q-item-section side>
          <q-icon v-if="item.vencedor" name="check_circle" color="positive" />
          <q-icon v-if="!item.vencedor" name="highlight_off" color="negative"></q-icon>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round color="negative" icon="delete" @click="removeItem(index)"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

$q.dark.set('auto')
function trocarCor () {
  $q.dark.toggle()
}

const showNovoJogo = ref(false)
const novoJogo = ref({
  numeros: []
})
const sorteado = ref({
  primeiro: '',
  segundo: '',
  terceiro: '',
  quarto: '',
  quinto: '',
  sexto: ''
})

const listaNumeros = ref([])

onMounted(() => {
  let listaNumsM = JSON.parse(window.localStorage.getItem('listaNumeros'))
  listaNumeros.value = listaNumsM || []
})

function adicionarJogo () {
  if (novoJogo.value.numeros.length < 6) {
    return
  }
  if (novoJogo.value.numeros.some(n => n < 1 || n > 60)) {
    return
  }

  listaNumeros.value.push({
    numeros: novoJogo.value.numeros.filter(n => n).map(n => pad(n)),
    vencedor: false,
    jogador: novoJogo.value.nome
  })

  novoJogo.value = {
    numeros: []
  }
  window.localStorage.setItem('listaNumeros', JSON.stringify(listaNumeros.value))
  showNovoJogo.value = false
}

function removeItem (index) {
  listaNumeros.value.splice(index, 1)
  window.localStorage.setItem('listaNumeros', JSON.stringify(listaNumeros.value))
}

function comparar () {
  listaNumeros.value.forEach(item => {
    item.vencedor = false
  })
  for (let key in sorteado.value) {
    if (!sorteado.value[key]) {
      return
    }
    sorteado.value[key] = pad(sorteado.value[key])
  }
  listaNumeros.value.forEach(item => {
    if (
        item.numeros.includes(sorteado.value.primeiro) &&
        item.numeros.includes(sorteado.value.segundo) &&
        item.numeros.includes(sorteado.value.terceiro) &&
        item.numeros.includes(sorteado.value.quarto) &&
        item.numeros.includes(sorteado.value.quinto) &&
        item.numeros.includes(sorteado.value.sexto)
       ) {
        item.vencedor = true
    }
  })

  if (listaNumeros.value.some(ln => ln.vencedor)) {
    $q.dialog({
      title: 'Ganhou',
      message: 'Você ganhou o premio da mega-sena',
      class: 'bg-positive text-white',
      maximized: true,
      ok: {
        flat: true,
        color: 'white'
      }
    })
  }
  else {
    $q.dialog({
      title: 'Não ganhou',
      message: 'Que pena... Não foi dessa vez',
      class: 'bg-negative text-white',
      ok: {
        flat: true,
        color: 'white'
      }
    })
  }
}

function pad(d) {
    return (d < 10) && (d.length < 2) ? '0' + d.toString() : d.toString();
}

</script>
