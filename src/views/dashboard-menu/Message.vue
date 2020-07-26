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
                <div style="min-height:400px">
                    <div class="item-top">
                        <span class="item-title">Inbox</span>
                    </div>
                    <div class="item-list">
                        <template v-for="(item, index) in items">
                        <v-list-item :key="index" @click="selectActiveChat(item)" >
                            <v-list-item-icon>
                                <v-icon large color="pink lighten-2">mdi-account circle</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content >
                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ "ID : " + item.id }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                            <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                                <v-btn class="item-add" text icon  v-on="on">
                                <v-icon color="#B0BEC5">mdi-dots-vertical</v-icon>
                                </v-btn>  
                            </template>

                            <v-list>
                                <v-list-item>
                                <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item >
                                <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                            </v-menu>
                        </v-list-item-action>
                        </v-list-item>
                        <hr :key="index+99" class="inbox-border">  
                        </template>
                    </div>
                    <div style="text-align:center">
                        <v-btn class="ma-2" text color="cyan lighten-2" @click="dialog=true">Memulai pesan baru</v-btn>
                    </div>
                </div>
            </v-col>
            <v-col
                cols="6"
                md="6"
            >
                <div style="min-height:400px">
                     <div class="item-top">
                        <span class="item-title">{{ activeChat.name }}</span>
                    </div>
                    <div style="overflow-y: scroll;max-height:200px">
                        <div class="ballon-chat-him">
                            Halo gan
                        </div>
                         <template v-for="(item, index) in chats">
                             <div :key="index">
                                 <div v-if="item.user_sender.sugar_id==mySugarId" class="ballon-chat-me">
                                     {{ item.message }}
                                 </div>
                                 <div v-else class="ballon-chat-him">
                                     {{ item.message }}
                                 </div>
                             </div>
                         </template>
                    </div>
                    <div style="margin-top:28px;display: flex; flex-direction: row;">
                        <v-textarea
                            v-model="newChat.message"
                            filled
                            auto-grow
                            rows="2"
                            row-height="30"
                            shaped
                        ></v-textarea>
                        <v-btn large class="ma-2" style="height:60px" @click="sendChat()" :loading="loadingChat" text color="cyan lighten-2">Send</v-btn>
                    </div>
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
        <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
            <span class="headline">Memulai pesan baru</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-row>
                <v-col cols="12">
                    <v-text-field outlined v-model="formInbox.name" label="Nama" required></v-text-field>
                </v-col>
                 <v-col cols="12">
                    <v-text-field outlined v-model="formInbox.id" label="ID" required></v-text-field>
                </v-col>
                </v-row>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large color="pink lighten-2" text @click="dialog = false">Close</v-btn>
            <v-btn large color="cyan lighten-2" text @click="insertInbox()">Save</v-btn>
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
       items : [
           {
               name : "Cinta Laura",
               id : "e79ad2ff-70cf-46b3-a0bf-fd85b200d1f0"
           }
       ],
       formInbox : {
           name : null,
           id : null,
       },
       activeChat : {
           name : null,
           id : null,
       },
       newChat : {
           user_id : null,
           message : null
       },
       chats :[],
       mySugarId : null,
       dialog : false,
       snackbar: false,
       color: null,
       text: '',
       loadingChat: false
    }
  },
  methods:{
      insertInbox(){
         if(this.formInbox.id!=null && this.formInbox.name!=null){
             this.items.push(this.formInbox)  
             this.dialog = false
             this.selectActiveChat(this.formInbox)
             this.resetFormInbox()
         } 
      },
      resetFormInbox(){
        this.formInbox = {
            name : null,
            id : null,
        }
      },
      selectActiveChat(newInbox){
        this.activeChat = newInbox
        this.chats=[]
        this.loadChat()
      },
      loadChat(){
        this.loadingChat = true
        var uri = this.$apiurl + '/message/'+this.activeChat.id
            this.$http.get(uri,config).then(response =>{
                this.loadingChat = false
                this.chats=response.data.data.chat;
                this.myId=response.data.data.chat[0].user_sender.id;
            }
        ).catch(error => {
          this.loadingChat = false
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
        })
      },
      sendChat(){
        this.loadingChat = true
        let uri = this.$apiurl+ '/message/send'
        this.newChat.user_id = this.activeChat.id
        this.$http
        .post(uri, this.newChat, config)
        .then(response => {
            this.loadingChat = false
            this.newChat = {}
            this.loadChat()
            this.snackbar = true
            this.text = "Berhasil mengirim pesan"
            this.color = 'green'
        })
        .catch(error => {
          this.snackbar = true
          this.text = error.response.data.error.errors[0]
          this.color = 'red'
        })
      },
      async getCredential(){
        var uri = this.$apiurl + '/oauth/credentials?access_token='+localStorage.getItem('token')
            await this.$http.get(uri).then(response =>{
                this.mySugarId=response.data.data.user.id;
            }
        )
      },
  },
  async mounted(){
    await this.getCredential()
    this.activeChat = this.items[0]
    this.loadChat()
  },
}
</script>


<style lang="scss">
.inbox-border{
    margin-top: 6px;
    margin-left: 32px;
    margin-right: 32px;
    border: 1px solid rgb(236, 239, 241); 
}
.ballon-chat-me{
    margin-top: 16px;
    margin-left:auto; margin-right:0;
    width: fit-content;
    max-width: 200px;
    background-color: #4DD0E1;
    color : white;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 40px;
    padding-right: 40px;
    border-radius: 12px 12px 0px 12px;
}
.ballon-chat-him{
    margin-top: 16px;
    margin-left:0; margin-right:auto;
    width: fit-content;
    max-width: 200px;
    background-color: #F06292;
    color : white;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 40px;
    padding-right: 40px;
    border-radius: 12px 12px 12px 0px;
}
</style>