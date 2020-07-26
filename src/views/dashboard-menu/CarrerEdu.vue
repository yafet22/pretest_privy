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
                cols="6"
                md="6"
            >
                <div class="item-list">
                    <v-card
                        class="mx-auto"
                        color="pink lighten-2"
                        dark
                        min-height="260"
                    >
                        <v-card-title>
                        <v-icon
                            large
                            left
                        >
                            mdi-school
                        </v-icon>
                        <span class="title font-weight-light">Education</span>
                        </v-card-title>

                        <div v-if="data.user.education.school_name!=null && data.user.education.graduation_time!=null" class="card-body-center">
                            <h1>{{ data.user.education.school_name }}</h1>
                            <p>{{ "Lulus : " + data.user.education.graduation_time }}</p>
                            <v-btn large depressed color="pink lighten-5" light @click="openEducationDialog()">Update</v-btn>
                        </div>
                        <div v-else class="card-body-center">
                            <p>Belum terdapat data</p>
                            <v-btn large depressed color="pink lighten-5" light @click="openEducationDialog()">Update</v-btn>
                        </div>
                    </v-card>
                </div>
            </v-col>
            <v-col
                cols="6"
                md="6"
            >
                <div class="item-list">
                    <v-card
                        class="mx-auto"
                        color="cyan lighten-2"
                        dark
                        min-height="260"
                    >
                        <v-card-title>
                        <v-icon
                            large
                            left
                        >
                            mdi-laptop
                        </v-icon>
                        <span class="title font-weight-light">Career</span>
                        </v-card-title>

                        <div v-if="data.user.career.company_name!=null && data.user.career.starting_from!=null" class="card-body-center">
                            <h1>{{ data.user.career.company_name }}</h1>
                            <h2>{{ data.user.career.position }}</h2>
                            <p>{{ "Mulai : "  + data.user.career.starting_from + " | " + "Akhir : " + data.user.career.ending_in }}</p>
                            <v-btn large depressed color="cyan lighten-5" light @click="openCareerDialog()">Update</v-btn>
                        </div>
                        <div v-else class="card-body-center">
                            <p>Belum terdapat data</p>
                            <v-btn large depressed color="cyan lighten-5" light @click="openCareerDialog()">Update</v-btn>
                        </div>
                    </v-card>
                </div>
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
        <v-dialog v-model="dialogEducation" persistent max-width="600px">
        <v-card>
            <v-card-title>
            <span class="headline">Education</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="12">
                    <v-text-field outlined v-model="formEdu.school_name" label="Nama Sekolah" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="formEdu.graduation_time"
                    persistent
                    width="290px"
                    >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                        v-model="formEdu.graduation_time"
                        outlined
                        label="Tanggal Kelulusan"
                        color="indigo"
                        light
                        readonly
                        required
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="formEdu.graduation_time" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(formEdu.graduation_time)">OK</v-btn>
                    </v-date-picker>
                    </v-dialog>
                </v-col>
                </v-row>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large color="pink lighten-2" text @click="dialogEducation = false">Close</v-btn>
            <v-btn large color="cyan lighten-2" text @click="insertEducation()">Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCareer" persistent max-width="600px">
        <v-card>
            <v-card-title>
            <span class="headline">Career</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="12">
                    <v-text-field outlined v-model="formCareer.company_name" label="Nama Perusahaan" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field outlined v-model="formCareer.position" label="Posisi" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="formCareer.starting_from"
                    persistent
                    width="290px"
                    >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                        v-model="formCareer.starting_from"
                        outlined
                        label="Tanggal Mulai"
                        color="indigo"
                        light
                        readonly
                        required
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="formCareer.starting_from" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog.save(formCareer.starting_from)">OK</v-btn>
                    </v-date-picker>
                    </v-dialog>
                </v-col>
                <v-col cols="12">
                    <v-dialog
                    ref="dialog2"
                    v-model="modal2"
                    :return-value.sync="formCareer.ending_in"
                    persistent
                    width="290px"
                    >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                        v-model="formCareer.ending_in"
                        outlined
                        label="Tanggal Selesai"
                        color="indigo"
                        light
                        readonly
                        required
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="formCareer.ending_in" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn large text color="primary" @click="modal2 = false">Cancel</v-btn>
                        <v-btn large text color="primary" @click="$refs.dialog2.save(formCareer.ending_in)">OK</v-btn>
                    </v-date-picker>
                    </v-dialog>
                </v-col>
                </v-row>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large color="pink lihten-2" text @click="dialogCareer = false">Close</v-btn>
            <v-btn large color="cyan lighten-2" text @click="insertCareer()">Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
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
       formEdu : {
           school_name : null,
           graduation_time : null
       },
       formCareer : {
            company_name: null,
            starting_from: null,
            ending_in: null,
            position: null
       },
       education :{},
       data : {
           user : {
            education :{
                school_name : null,
                graduation_time : null
            },
            career :{
                company_name: null,
                starting_from: null,
                ending_in: null
            }
           }
       },
       snackbar: false,
       color: null,
       text: '',
       dialogEducation: false,
       dialogCareer: false,
       modal: false,
       modal2: false
    }
  },
  methods:{
      getData(){
        var uri = this.$apiurl + '/profile/me'
            this.$http.get(uri,config).then(response =>{
                this.data=response.data.data;
            }
        )
      },
      openEducationDialog(){
          this.formEdu=this.data.user.education
          this.dialogEducation = true
      },
      openCareerDialog(){
          this.formCareer=this.data.user.career
          this.dialogCareer = true
      },
      insertEducation(){
        let uri = this.$apiurl+ '/profile/education'
        this.$http
        .post(uri, this.formEdu, config)
        .then(response => {
            this.getData()
            this.dialogEducation=false
            this.snackbar = true
            this.text = "Berhasil perbaharui data"
            this.color = 'green'
        })
        .catch(error => {
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
        })
      },
      insertCareer(){
        let uri = this.$apiurl+ '/profile/career'
        this.$http
        .post(uri, this.formCareer, config)
        .then(response => {
            this.getData()
            this.dialogCareer=false
            this.snackbar = true
            this.text = "Berhasil perbaharui data"
            this.color = 'green'
        })
        .catch(error => {
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
        })
      }
  },
  mounted(){
      this.getData();
  }
}
</script>

<style lang="scss">
    .card-body-center{
        padding: 20px;
        text-align:center;
    }
</style>