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
           <div id="cover-photo">
              <img id="profile-picture" src="https://www.kindpng.com/picc/m/453-4535416_isabelle-animal-crossing-drawing-hd-png-download.png"/>  
              <v-btn id="button-update-profile" class="mx-2" fab small color="blue-grey lighten-5">
                <v-icon dark>mdi-camera</v-icon>
              </v-btn>
              <v-btn id="button-update-cover" class="ma-2" depressed color="blue-grey lighten-5">
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
  </v-app>
</template>

<style lang="scss">
#cover-photo{
  width: 100%;
  height: 320px;
  background-image: url('https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&w=1000&q=80');
  background-repeat:no-repeat;
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
</style>