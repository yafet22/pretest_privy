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
              <img id="profile-picture" :src="currentProfile.profilePhoto"/>  
              <v-btn id="button-update-profile" class="mx-2" fab small @click="dialogProfile=true" color="blue-grey lighten-5">
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
                    CLICK TO CHOOSE IMAGE
                </div>
              </div>
              <v-row>
              <v-col cols="12">
                <input type="file" class="uploadButton" accept="image/png, image/jpeg, image/gif, image/jpg" @input="onFileChangeCover($event)">
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
    <v-dialog v-model="dialogProfile" persistent max-width="600px">
      <v-card>
          <v-card-title>
          <span class="headline">Foto Profil</span>
          </v-card-title>
          <v-card-text>
          <v-container>
              <h2>Upload Satu atau Beberapa Foto Baru</h2>
              <v-row
                  align="center"
              >
                <v-col
                  cols="4"
                  md="4"
                  >
                    <div class="box-photo"> 
                        <div class="content-photo">
                            <img :src="require('@/assets/photo-add.svg')" >
                        </div>
                        <input type="file" class="uploadButton" accept="image/png, image/jpeg, image/gif, image/jpg" @input="onFileChangeProfile($event)">
                    </div>
                </v-col>
                <v-col
                  v-for="item in profilePictureDisplays" v-bind:key="item.key"
                  cols="4"
                  md="4"
                  >
                    <div class="box-photo"> 
                        <v-icon dark color="red" class="iconCancel" @click.prevent="clear(item)">mdi-close-circle</v-icon>
                        <img class="content-photo" :src="item.base64" >
                    </div>  
                </v-col>              
              </v-row>
              <div style="margin-bottom:8px">
                  <v-btn large color="cyan lighten-2" outlined :loading="loadingUploadPicture" block @click="multipleUploadProfile()">Upload</v-btn>
              </div>
              <h2>Foto User</h2>
              <v-row
                  align="center"
              >
                 <v-col
                  cols="4"
                  md="4"
                  v-for="(item, index) in user_pictures"
                  :key="index"
                  >
                  <v-card
                      class="mx-auto elevation-1"
                      min-height="160px"
                  >
                    <div style="padding:10px">
                        <img id="profile-picture-album" :src="item.picture.url" />
                        <v-btn large color="pink lighten-2" @click="setProfile(item)" :loading="loadingSetProfile" text block>Set profile</v-btn>
                    </div>
                  </v-card>
                  </v-col>
              </v-row>
          </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large color="pink lighten-2" text @click="dialogProfile = false">Close</v-btn>
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
       dialogProfile: false,
       urlPreviewCover: '',
       imageCover: null,
       loadingUploadCover:false,
       loadingUploadPicture:false,
       loadingSetProfile:false,
       user_pictures:{},
       profilePictureDisplays:[],
       profilePictureUploads:[],
       currentProfile:{
         profilePhoto : null,
         coverPhoto : null
       }
    }
  },
  methods:{
    onFileChangeCover(e) {
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
    onFileChangeProfile(e) {
      var profilePictureDisplay = {
          result:null,
          base64:null
      }
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
        profilePictureDisplay.base64=data;
      }

      reader.readAsArrayBuffer(file)
      profilePictureDisplay.result=file

      this.profilePictureDisplays.push(profilePictureDisplay)
      this.profilePictureUploads.push(file)
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
          this.color = 'green'
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
    async uploadProfile(image){
      this.loadingUploadCover = true
      let uri = this.$apiurl+ '/uploads/profile'
      let data = new FormData();
      data.append('image',image)
      await this.$http.post(uri, data,config)
      .catch(error => {
        this.snackbar = true
        this.text = error.response.data.error.errors[0]
        this.color = 'red'
      })
    },
    async multipleUploadProfile(){
      this.loadingUploadPicture=true
      for( var i = 0; i < this.profilePictureUploads.length; i++){ 
        await this.uploadProfile(this.profilePictureUploads[i])
      }
      this.profilePictureDisplays=[]
      this.profilePictureUploads=[]
      this.loadingUploadPicture=false
      this.getProfileData()
      this.dialogProfile=false
    },
    setProfile(image){
      this.loadingSetProfile = true
      let uri = this.$apiurl+ '/uploads/profile/default'
      var data = {
        id : image.id
      }
      this.$http.post(uri, data,config)
      .then(response => {
          this.loadingSetProfile =false
          this.snackbar = true
          this.text = "Berhasil mengubah profile"
          this.color = 'green'
          this.getProfileData()
          this.dialogProfile=false
      })
      .catch(error => {
        this.snackbar = true
        this.text = error.response.data.error.errors[0]
        this.color = 'red'
      })
    },
    clear (item) {
      var index = this.profilePictureDisplays.indexOf(item.display);
      this.profilePictureDisplays.splice(index, 1);
      var index = this.profilePictureUploads.indexOf(item.base64);
      this.profilePictureUploads.splice(index, 1);
    },
    getProfileData(){
      var uri = this.$apiurl + '/profile/me'
          this.$http.get(uri,config).then(response =>{
              this.currentProfile.coverPhoto = response.data.data.user.cover_picture.url
              this.currentProfile.profilePhoto = response.data.data.user.user_picture.picture.url
              this.user_pictures = response.data.data.user.user_pictures
              localStorage.setItem('cover',response.data.data.user.cover_picture.url)
              localStorage.setItem('profile',response.data.data.user.user_picture.picture.url)
          }
      )
    },
  },
  mounted(){
      this.currentProfile.coverPhoto = localStorage.getItem('cover')
      this.currentProfile.profilePhoto = localStorage.getItem('profile')
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
#profile-picture-album{
  background-color: antiquewhite;
  width: 100%;
  height: 140px;
}
.box-photo{
  position: relative;
  background: #FFFFFF;
  border: 1px solid rgba(165, 165, 165, 0.25);
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-photo{
  width: 100%;
  height: 140px;
  background: #F8F8F8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.uploadButton{
  position:absolute; 
  opacity : 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
}
.iconCancel{
  position: absolute !important;
  right: 0;
  top: 0;
  float: right;
  z-index: 1;
}
</style>