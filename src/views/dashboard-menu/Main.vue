<template>
    <div style="text-align:center">
        <div id="menu-button">
            <v-btn x-large color="blue-grey lighten-5" min-width="280" depressed>Profile</v-btn>
        </div>
        <div id="menu-button">
            <v-btn x-large color="blue-grey lighten-5" min-width="280" depressed @click="$router.push({ name: 'CarrerEdu' }).catch(err => {})">Carrer & Education</v-btn>
        </div>
        <div id="menu-button">
            <v-btn x-large color="blue-grey lighten-5" min-width="280" depressed @click="$router.push({ name: 'Message' }).catch(err => {})">Message</v-btn>
        </div>
        <div id="menu-button">
            <v-btn x-large color="red lighten-1" min-width="280" depressed dark @click="logout()">Logout</v-btn>
        </div>
        <v-snackbar
            v-model='snackbar'
            :color='color'
            :multi-line='true'
            :timeout='3000'
        >
                {{ text }}
            <v-btn color='white' text @click='snackbar = false'>Tutup</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import store from '../../store'
export default {
  data () {
    return {
       form : {
           access_token : null,
           confirm : 1
       },
       snackbar: false,
       color: null,
       text: '',
    }
  },
  methods:{
      logout(){
        let uri = this.$apiurl+ '/oauth/revoke'
        this.form.access_token = localStorage.getItem('token')
        this.$http
        .post(uri, this.form)
        .then(response => {
            //ada error dari server
        })
        .catch(error => {
          this.loading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
          this.load = false
        })
        localStorage.removeItem('token')
        store.commit('logoutUser')
        this.$router.push({ name: 'Home' })
      }
  },
}
</script>
