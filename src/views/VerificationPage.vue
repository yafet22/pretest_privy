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
            min-height="320"
        >
            <div class="card-header">
                <div class="card-title">
                    Enter verification code
                </div>
                <div class="card-body">
                    <div style="display: flex; flex-direction: row;text-align: center;margin-top:40px">
                        <div style="margin:auto">
                            <v-otp-input
                                ref="otpInput1"
                                input-classes="otp-input"
                                separator="-"
                                :num-inputs="4"
                                :should-auto-focus="true"
                                input-type="number"
                                @on-change="handleOnChange"
                                @on-complete="handleOnComplete"
                            />
                            <v-btn depressed color="primary" :loading="loading" @click="verification('otpInput1')" style="margin-top:36px">Verifikasi</v-btn>
                            <div style="margin-top:16px">
                                <v-btn text small color="warning" @click="resendOTP('otpInput1')">Kirim ulang kode verifikasi</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <v-btn depressed color="error" @click="$router.push({ name: 'Home' }).catch(err => {})" style="margin-top:36px">Kembali</v-btn>
                </div>
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
import OtpInput from '../components';
export default {
  name: 'App',
  components: {
    'v-otp-input': OtpInput,
  },
  data:() =>({
    form:{
        user_id: null,
        otp_code: null
    },
    resend: {
        phone : null
    },
    phone : null,
    snackbar: false,
    color: null,
    text: '',
    loading:false
  }),
  methods: {
    handleOnComplete(value) {
      console.log('OTP completed: ', value);
      this.form.otp_code = value
    },
    handleOnChange(value) {
      console.log('OTP changed: ', value);
      this.form.otp_code = value
    },
    handleClearInput(ref) {
      this.$refs[ref].clearInput();
    },
    verification(ref){
        let uri = this.$apiurl+ '/register/otp/match'
        this.loading = true
        this.form.user_id = localStorage.getItem('user_id')
        this.$http
        .post(uri, this.form)
        .then(response => {
            store.commit('loginUser')
            localStorage.removeItem('user_id')
            localStorage.removeItem('phone')
            store.commit('deleteRegister')
            localStorage.setItem('token', response.data.data.user.access_token)
            this.loading = false
            this.$router.push({ name : 'Dashboard'})
            this.$refs[ref].clearInput();
        })
        .catch(error => {
          this.loading = false
          this.snackbar = true
          this.text = error
          this.color = 'red'
          this.load = false
          this.$refs[ref].clearInput();
        })
    },
    resendOTP(ref){
        this.$refs[ref].clearInput();
        let uri = this.$apiurl+ '/register/otp/request'
        this.loading = true
        this.resend.phone = localStorage.getItem('phone')
        this.$http
        .post(uri, this.resend)
        .then(response => {
            this.loading = false
            this.snackbar = true; //mengaktifkan snackbar
            this.color = 'green'; //memberi warna snackbar
            this.text = 'Berhasil mengirim kode OTP baru'; //memasukkan pesan ke snackbar
        })
        .catch(error => {
          this.loading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
          this.load = false
        })
    }
  },
};
</script>

<style lang="scss">
  .otp-input {
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 0 10px;
    font-size: 20px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
    &.error {
      border: 1px solid red !important;
    }
  }
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>