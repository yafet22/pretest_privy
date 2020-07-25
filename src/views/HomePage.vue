<template>
  <v-app class="home">
    <v-container
    class="fill-height"
    fluid
    >
    <v-row
        align="center"
        justify="center"
    >
        <v-col
        cols="6"
        md="6"
        >
        <v-card
            class="mx-auto"
            max-width="600"
            min-height="420"
        >
            <div class="card-header">
                <div class="card-title">
                    Register
                </div>
            </div>
            <div class="card-body">
                <v-phone-input @on-change="handleOnChange"></v-phone-input>
                <v-text-field
                    v-model="form.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    placeholder="Password"
                    class="input-group--focused"
                    @click:append="showPassword = !showPassword"
                    outlined
                    dense
                ></v-text-field>
                <v-text-field
                    v-model="form.country"
                    label="Negara"
                    placeholder="Negara"
                    outlined
                    dense
                ></v-text-field>
            </div>
            <div class="card-footer">
                <v-btn depressed large block color="primary" :loading="registerLoading" @click="register()">Register</v-btn>
                <div v-if="isAlreadyRegister" style="margin-top:12px">
                    <v-btn text small color="warning" @click="$router.push({ name: 'Verification' }).catch(err => {})">Masuk ke halaman verifikasi</v-btn>
                </div>
            </div>
        </v-card>
        </v-col>
        <v-col
        cols="6"
        md="6"
        >
        <v-card
            class="mx-auto"
            max-width="600"
            min-height="420"
        >
            <div class="card-header">
                <div class="card-title">
                    Login
                </div>
            </div>
            <div class="card-body">
                <v-phone-input @on-change="handleOnChange"></v-phone-input>
                <v-text-field
                    v-model="formLogin.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    placeholder="Password"
                    class="input-group--focused"
                    @click:append="showPassword = !showPassword"
                    outlined
                    dense
                ></v-text-field>
            </div>
            <div class="card-footer">
                <v-btn depressed large block :loading="loginLoading" @click="login()" color="success">Login</v-btn>
            </div>
        </v-card>
        </v-col>
    </v-row>
    </v-container>
        <v-snackbar
            v-model='snackbar'
            :color='color'
            :multi-line='true'
            :timeout='3000'
        >
            {{ text }}
        <v-btn color='white' text @click='snackbar = false'>Tutup</v-btn>
      </v-snackbar>
  </v-app>
</template>

<script>
import PhoneInput from '../components/PhoneInput';
import store from '../store'
  export default {
    name: 'Home',
    components: {
        'v-phone-input': PhoneInput,
    },
    data:() =>({
      form:{
        phone: null,
        password: null,
        country: null,
        latlong: '',
        device_token: null,
        device_type: null,
      },
      formLogin:{
        phone: null,
        password: null,
        latlong: '',
        device_token: null,
        device_type: null,
      },
      snackbar: false,
      color: null,
      text: '',
      showPassword: false,
      registerLoading: false,
      loginLoading: false,
      isAlreadyRegister: false,
      location:null,
      device_token:null,
      device_type:null,
      phone:null
    }),
    methods:{
      handleOnChange(value) {    
        this.phone = value
      },
      clearInputRegister(){
          this.form = {
            phone: null,
            password: null,
            country: null,
            latlong: '',
            device_token: null,
            device_type: null,
        }
      },
      clearInputLogin(){
          this.formLogin = {
            phone: null,
            password: null,
            latlong: '',
            device_token: null,
            device_type: null,
        }
      },
      getOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return 1;
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 0;
        }

        return 2;
      },
      getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }else {
            return null
        }
      },
      showPosition(position) {
          this.location = position.coords.latitude + "," + position.coords.longitude
        
      },
      register(){
        let uri = this.$apiurl+ '/register'
        this.form.phone = this.phone
        this.form.device_type = this.device_type
        this.form.device_token = this.device_token
        this.form.latlong = this.location
        this.registerLoading = true
        this.$http
        .post(uri, this.form)
        .then(response => {
            store.commit('deleteRegister')
            this.registerLoading = false
            this.snackbar = true; //mengaktifkan snackbar
            this.color = 'green'; //memberi warna snackbar
            this.text = 'Berhasil Login'; //memasukkan pesan ke snackbar
            localStorage.setItem('user_id',response.data.data.user.id)
            localStorage.setItem('phone',response.data.data.user.phone)
            store.commit('storeRegister')
            this.clearInputRegister()
            this.$router.push({ name : 'Verification'})
        })
        .catch(error => {
          this.registerLoading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
          this.load = false
        })
      },
      login(){
        let uri = this.$apiurl+ '/oauth/sign_in'
        this.formLogin.phone = this.phone
        this.formLogin.device_type = this.device_type,
        this.formLogin.device_token = this.device_token,
        this.formLogin.latlong = this.location
        this.loginLoading = true
        this.$http
        .post(uri, this.formLogin)
        .then(response => {
            store.commit('loginUser')
            localStorage.removeItem('user_id')
            localStorage.removeItem('phone')
            store.commit('deleteRegister')
            localStorage.setItem('token', response.data.data.user.access_token)
            this.loginLoading = false
            this.$router.push({ name : 'Dashboard'})
        })
        .catch(error => {
          this.loginLoading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
          this.load = false
        })
      }
    },
    mounted(){
      this.getLocation()
      this.device_type = this.getOperatingSystem(),
      this.device_token = btoa( Math.random() + navigator.userAgent + Date() )
      if(localStorage.getItem('user_id')!=null){
          this.isAlreadyRegister=true
      }
    },
  }
</script>
