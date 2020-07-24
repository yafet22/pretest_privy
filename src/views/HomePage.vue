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
            min-height="400"
        >
            <div class="card-header">
                <div class="card-title">
                    Register
                </div>
            </div>
            <div class="card-body">
                <v-text-field
                    v-model="form.phone"
                    label="No Telepon"
                    placeholder="No Telepon"
                    outlined
                    dense
                ></v-text-field>
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
                <v-btn depressed large min-width="400" color="primary" :loading="registerLoading" @click="register()">Register</v-btn>
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
            min-height="400"
        >
            <div class="card-header">
                <div class="card-title">
                    Login
                </div>
            </div>
            <div class="card-body">
                <v-text-field
                    label="No Telepon"
                    placeholder="No Telepon"
                    outlined
                    dense
                ></v-text-field>
                    <v-text-field
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
                <v-btn depressed large min-width="400" color="success">Login</v-btn>
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
import store from '../store'
  export default {
    data:() =>({
      form:{
        phone: null,
        password: null,
        country: null,
        latlong: null,
        device_token: 12233,
        device_type: null,
      },
      snackbar: false,
      color: null,
      text: '',
      showPassword: false,
      registerLoading: false
    }),
    methods:{
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
      register(){
        let uri = this.$apiurl+ '/register'
        this.registerLoading = true
        this.$http
        .post(uri, this.form)
        .then(response => {
            this.registerLoading = false
            this.snackbar = true; //mengaktifkan snackbar
            this.color = 'green'; //memberi warna snackbar
            this.text = 'Berhasil Login'; //memasukkan pesan ke snackbar
            localStorage.setItem('user_id',response.data.data.user.id)
            this.$router.push({ name : 'Verification'})
        })
        .catch(error => {
          this.registerLoading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
          this.load = false
        })
      }
    },
    mounted(){
      this.form.device_type=this.getOperatingSystem()
      this.form.device_token=btoa( Math.random() + navigator.userAgent + Date() );
  },
  }
</script>
