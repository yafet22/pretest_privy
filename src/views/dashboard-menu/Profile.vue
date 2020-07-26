<template>
    <div>
        <v-btn class="ma-2" tile outlined color="pink lighten-2" @click="$router.push({ name: 'Dashboard' }).catch(err => {})">
            <v-icon left>mdi-arrow-left</v-icon> Back
        </v-btn>
        <v-row
            align="center"
            justify="center"
        >
            <v-col
                cols="4"
                md="4"
            >
                <v-row>
                    <v-col cols="12">
                        <div style="text-align:center">
                            <h1>Profile</h1>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.name" outlined label="Nama" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select
                            v-model="choosenGender"
                            :items="gender"
                            label="Gender"
                            outlined
                            light
                        ></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.hometown" outlined label="Tempat Lahir" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                    <v-dialog
                    ref="birthdate"
                    v-model="modalDate"
                    :return-value.sync="form.birthday"
                    persistent
                    width="290px"
                    >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                        v-model="form.birthday"
                        outlined
                        label="Tanggal Lahir"
                        color="indigo"
                        light
                        readonly
                        required
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="form.birthday" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn large text color="primary" @click="modalDate = false">Cancel</v-btn>
                        <v-btn large text color="primary" @click="$refs.birthdate.save(form.birthday)">OK</v-btn>
                    </v-date-picker>
                    </v-dialog>
                </v-col>
                <v-col cols="12">
                    <v-textarea
                        v-model="form.bio"
                        outlined
                        name="bio"
                        label="Bio"
                    ></v-textarea>
                </v-col>
                </v-row>   
                <v-btn large block :loading="loading" outlined @click="updateProfile()" color="cyan lighten-2">Simpan</v-btn>
            </v-col>
        </v-row>
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
let config = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}
export default {
  data () {
    return {
       form : {
           name : null,
           hometown : null,
           birthday : null,
           gender : null,
           bio : null,
       },
       choosenGender : null,
       modalDate : false,
       gender:["Laki-laki","Perempuan"],
       loading:false,
       snackbar: false,
       color: null,
       text: '',
    }
  },
  methods:{
    getProfileData(){
      var uri = this.$apiurl + '/profile/me'
          this.$http.get(uri,config).then(response =>{
            this.form = response.data.data.user
            if(this.form.gender==0){
                this.choosenGender="Laki-laki"
            }else{
                this.choosenGender="Perempuan"
            }
          }
      )
    },
    updateProfile(){
        this.loading=true
        let uri = this.$apiurl+ '/profile'
        if(this.choosenGender=="Laki-laki"){
            this.form.gender=0
        }else{
            this.form.gender=1
        }
        this.$http.post(uri, this.form, config)
        .then(response => {
            this.loading = false
            this.getProfileData()
            this.snackbar = true
            this.text = "Berhasil perbaharui data"
            this.color = 'green'
        })
        .catch(error => {
          this.loading = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
        })
      },
  },
  mounted(){
      this.getProfileData()
  }
}
</script>