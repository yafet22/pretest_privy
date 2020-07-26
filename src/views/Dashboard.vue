<template>
  <v-app class="home">
    <v-container
      fluid
    >
    <v-row
        align="center"
        justify="center"
    >
        <v-col
        cols="10"
        md="10"
        >
        <v-card
            class="mx-auto"
            min-height="720"
        >
           <div id="cover-photo" v-bind:style="{ 'background-image': 'url(' + currentProfile.coverPhoto + ')' }">
              <img id="profile-picture" src="https://www.kindpng.com/picc/m/453-4535416_isabelle-animal-crossing-drawing-hd-png-download.png"/>  
              <v-btn id="button-update-profile" class="mx-2" fab small color="blue-grey lighten-5">
                <v-icon dark>mdi-camera</v-icon>
              </v-btn>
              <v-btn id="button-update-cover" class="ma-2" @click="dialogCover=true" depressed color="blue-grey lighten-5">
                <v-icon left>mdi-camera</v-icon> Update cover photo
              </v-btn>
           </div>
           <div style="padding:40px;height:100%">
              <router-view></router-view>
           </div>
        </v-card>
        </v-col>
    </v-row>
    </v-container>
    <v-dialog v-model="dialogCover" persistent max-width="600px">
      <v-card>
          <v-card-title>
          <span class="headline">Upload Foto Cover Baru</span>
          </v-card-title>
          <v-card-text>
          <v-container>
              <div id="preview">
                <img id="cover-preview" v-if="urlPreviewCover" :src="urlPreviewCover" />
                <div v-else id="preview-cover-default">
                    PREVIEW COVER
                </div>
              </div>
              <v-row>
              <v-col cols="12">
                <input type="file" class="uploadButton" accept="image/png, image/jpeg, image/gif, image/jpg" @input="onFileChange($event)">
              </v-col>
              </v-row>
          </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large color="pink lighten-2" text @click="dialogCover = false">Close</v-btn>
          <v-btn large color="cyan lighten-2" text :loading="loadingUploadCover" @click="uploadCover()" >Save</v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
  </v-app>
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
       snackbar: false,
       color: null,
       text: '',
       dialogCover: false,
       urlPreviewCover: '',
       imageCover: null,
       loadingUploadCover:null,
       currentProfile:{
         profilePhoto : null,
         coverPhoto : null
       }
    }
  },
  methods:{
    onFileChange(e) {
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.snackbar = true
        this.text = "Anda hanya diperbolehkan mengupload foto/gambar"
        this.color = 'red'
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.urlPreviewCover=data;
      }

      reader.readAsArrayBuffer(file)
      this.imageCover = file
    },
    uploadCover(){
      this.loadingUploadCover = true
      let uri = this.$apiurl+ '/uploads/cover'
      let data = new FormData();
      data.append('image',this.imageCover)
      this.$http.post(uri, data,config)
      .then(response => {
          this.loadingUploadCover = false
          this.snackbar = true
          this.text = "Berhasil mengubah cover"
          this.color = 'red'
          this.getProfileData()
          this.dialogCover=false
      })
      .catch(error => {
        this.loadingUploadCover = false
        this.snackbar = true
        this.text = error.response.data.error.errors[0]
        this.color = 'red'
      })
    },
    getProfileData(){
        var uri = this.$apiurl + '/profile/me'
            this.$http.get(uri,config).then(response =>{
                this.currentProfile.coverPhoto = response.data.data.user.cover_picture.url
            }
        )
      },
  },
  mounted(){
      this.getProfileData()
  },
}
</script>

<style lang="scss">
#cover-photo{
  width: 100%;
  height: 320px;
  background-repeat:no-repeat;
  background-color:#CFD8DC;
  background-size:cover;
  background-position:center;
  position: relative;
  #profile-picture{
      position: absolute;
      height: 180px;
      border: 4px solid #f0eeeb;
      width: 180px;
      border-radius: 120px;
      left: 50%;
      bottom:36px;
      transform: translate(-50%, 0);
  }
  #button-update-cover{
      position: absolute;
      bottom: 20px;
      right: 20px;
  }
  #button-update-profile{
      position: absolute;
      bottom:36px;
      left: 53%;
      transform: translate(-50%, 0);
  }
}
#menu-button{
  padding: 16px;
}
#cover-preview{
  background-color: antiquewhite;
  width: 100%;
}
#preview-cover-default{
  background-color: #CFD8DC;
  font-size: 24px;
  color: white;
  font-weight: bold;
  width: 100%;
  height: 280px;
  line-height: 280px;
  text-align: center
}
</style>