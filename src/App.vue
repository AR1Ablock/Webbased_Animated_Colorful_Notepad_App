<template>
  <div class="wrapper">

    <div class="loading" v-if="Loading">
      <h1>Notes</h1>
      <p></p>
    </div>

    <div class="searchbar" :class="{ 'active': isAddBtnPressed }">
      <div @click="showInput()"><img src="../public/search.png" alt=""></div>
      <input class="searchinput" type="text" name="" id="" placeholder="Search Notes"
        :class="{ 'showinput2': searchinput }" v-model.trim="inputData">
      <button @click="AddNoteBtn" class="addbtn">+</button>
    </div>

    <div class="card_con" :class="{ 'active': isAddBtnPressed }">
      <div class="cards" v-for="(item, index) in data" :key="index"
        :class="{ 'smoothhide': IsCardDeletedBtnPressed === data[index].isCardGoingDeleted }"
        :style="{ 'background-color': data[index].color }">
        <div class="Title_Con" :style="{ 'background-color': data[index].CardTitleColor }">
          <p class="Card_Title"> {{ item.title }}</p>
        </div>
        <div class="Para_Con">
          <p class="Card_Para" @click="RO_ViewNotePage(index)"> {{ item.userWrote }} </p>
        </div>
        <div class="extra">
          <h4> {{ item.NotesDate }} </h4>
          <button @click="EditBtn(index)" class="edit">Edit</button>
          <button @click="DeleteCard(index)" class="delete">X</button>
        </div>
      </div>
    </div>

    <dialog open="" class="dialog" :class="{ 'active': isAddBtnPressed }">
      <h3 class="model_h3">Write Your Note Here!</h3>
      <input ref="focusOnInput" type="text" class="title" placeholder="Notes Title" v-model.trim="CurrentlyWritingTitle">
      <div class="itemDeletePanel">
        <button @click="ShowManageItemButtons">Delete</button>
        <div class="parent">
          <button @click="ShowAudioItems = !ShowAudioItems">Audios</button>
          <div class="itemShowCon">
            <div v-for="(item, index) in AudioStorage" :key="index" v-if="ShowAudioItems">
              <div @click="DeleteAudioMedia(index)" class="itemsShow">{{ item.name }}</div>
            </div>
          </div>
          <button @click="ShowVideoItems = !ShowVideoItems">Videos</button>
          <div class="itemShowCon">
            <div v-for="(item, index) in VideoStorage" :key="index" v-if="ShowVideoItems">
              <div @click="DeleteVideoMedia(index)" class="itemsShow">{{ item.name }}</div>
            </div>
          </div>
          <button @click="ShowImagesItems = !ShowImagesItems">Images</button>
          <div class="itemShowCon">
            <div v-for="(item, index) in images" :key="index" v-if="ShowImagesItems">
              <div @click="DeleteImageMedia(index)" class="itemsShow">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <textarea name="notewriting" class="model_note" cols="30" rows="10" placeholder="Enter Your Thought"
        v-model.trim="CurrentlyWritingMessage"></textarea>
      <div class="attachmentBtns">
        <label for="fileInput" class="custom_Choose_file">Choose File</label>
        <input type="file" id="fileInput" @change="manageMedia"/>
        <button @click="Record('audio')" ref="AudioRecordBtn">Start Audio Rec</button>
        <button @click="Record('video')" ref="VideoRecordBtn">Start Video Rec</button>
      </div>
      <p class="error_msg"> {{ NoInputError }}</p>
      <button @click="DoneBtn" class="done">Done</button>
      <button ref="RemoveCloseBtn" @click="CloseBtn" class="close">Close</button>
    </dialog>

    <dialog open="" class="notepage" :class="{ 'active': IsRoViewNoteOpen }">
      <div class="notepag_con">
        <p>{{ SendNoteForView }}</p>
        <div class="img" v-for="(item, index) in SendImageForView" :key="index">
          <img :src="item.Data" alt="" srcset="">
        </div>
        <div class="audio" v-for="(item, index) in SendAudioForView" :key="index">
          <audio :src="item.Data" controls muted autoplay></audio>
        </div>
        <div class="video" v-for="(item, index) in SendVideoForView" :key="index">
          <video :src="item.Data" controls muted autoplay></video>
        </div>
        <button @click="CloseBtn" class="exit">Close</button>
      </div>
    </dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// .................................... All Variables .........................................
let isAddBtnPressed = ref(false);
let CurrentlyWritingMessage = ref("");
let RemoveCloseBtn = ref();
let CurrentIndex = ref(null);
// card will delete when this val match with array isCardGoingDeleted value, card value will become true when btn is pressed.
let IsCardDeletedBtnPressed = ref(true);
let SendNoteForView = ref("");
let SendImageForView = ref([]);
let SendAudioForView = ref([]);
let SendVideoForView = ref([]);
let IsRoViewNoteOpen = ref(false);
let EditMode = ref(false);
let NoInputError = ref("");
let receivedData = ref();
let CurrentlyWritingTitle = ref("");
let focusOnInput = ref('');
let searchinput = ref(false);
let inputData = ref('');
let Loading = ref(true);
let images = ref([]);
let AudioStorage = ref([]);
let VideoStorage = ref([]);
let userinputdata = {};
let SupportedMedia = ref(["video/mp4", "image/jpeg", "image/png", "audio/x-m4a", "audio/x-mp3", "audio/wav", "audio/aac", "audio/wma", "audio/mpeg", "audio/aac", "audio/wma", "audio/x-m4a", "audio/x-mp3", "audio/ogg", "audio/flac", "audio/wav", "audio/aac", "audio/wma", "audio/mpeg", "text/plain", "application/x-shellscript", "text/html", "text/markdown"]);
let SupportedAudios = ref(["audio/x-m4a", "audio/x-mp3", "audio/ogg", "audio/flac", "audio/wav", "audio/aac", "audio/wma", "audio/mpeg"]);
let SupportedText = ref(["text/plain", "application/x-shellscript", "text/html", "text/markdown"]);
/* ............................. Sounds ............................ */
import addbtn from '../public/effects/addbtn.mp3';
import Delbtn from '../public/effects/deleteNote.mp3';
import editbtn from '../public/effects/editbtn.mp3';
import viewbtn from '../public/effects/viewpage.mp3';
import savebtn from '../public/effects/savebtn.mp3';
import closebtn from '../public/effects/closebtn.mp3';
import Searchbtn from '../public/effects/Search.mp3';
let AddBtnAudio = new Audio(addbtn);
let DelBtnSound = new Audio(Delbtn);
let EditBtnSound = new Audio(editbtn);
let ViewBtnSound = new Audio(viewbtn);
let SaveBtnSound = new Audio(savebtn);
let CloseBtnSound = new Audio(closebtn);
let SearchBtnSound = new Audio(Searchbtn);
let ShowAudioItems = ref(false);
let ShowVideoItems = ref(false);
let ShowImagesItems = ref(false);
// Recording
let DataChunks = ref([]);
let AudioRecordBtn = ref('');
let VideoRecordBtn = ref('');
let Situation = ref(false);
let recorder = '';
let i = 0;
let j = 0;

// .........................................All The Functions ..................................................... 
function ShowManageItemButtons(){
  document.querySelector('.parent').classList.toggle('ShowBtns');
  document.querySelector('.itemDeletePanel button').style.transform = 'scale(.9) translateX(.5vmin)';
}




function Record(type) {
  try {
    Situation.value = !Situation.value;
    if (Situation.value) {
      navigator.mediaDevices.getUserMedia({ [type]: true })
        .then(function (startingStreaming) {
          recorder = new MediaRecorder(startingStreaming);
          recorder.start();
          DataChunks.value.splice(0, DataChunks.value.length);
          if (type == 'audio') {
            AudioRecordBtn.value.textContent = 'Stop Rec';
          }
          else if (type == 'video') {
            VideoRecordBtn.value.textContent = 'Stop Rec';
          }
          recorder.ondataavailable = function (event) {
            DataChunks.value.push(event.data);
          }
          recorder.onstop = function () {

            let blob = new Blob(DataChunks.value);
            let Source = URL.createObjectURL(blob);
            if (type == 'audio') {
              let obj = { name: `AudioRec_${i++}_Attached`, Data: Source }
              AudioStorage.value.push(obj);
              CurrentlyWritingMessage.value += `\n${obj.name}`;
            }
            else if (type == 'video') {
              let obj = { name: `VideoRec_${j++}_Attached`, Data: Source }
              VideoStorage.value.push(obj);
              CurrentlyWritingMessage.value += `\n${obj.name}`;
            }
          }
        });
    }
    else {
      recorder.stop();
      if (type == 'audio') {
        AudioRecordBtn.value.textContent = 'Start Audio Rec';
      }
      else if (type == 'video') {
        VideoRecordBtn.value.textContent = 'Start Video Rec';
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}




function Cleaning(name) {
  try {
    let pattern = new RegExp(name, 'g');
    return CurrentlyWritingMessage.value.replace(pattern, '');
  } catch (error) {
    console.log(error.message);
  }
}




function DeleteAudioMedia(index) {
  try {
    let name = AudioStorage.value[index].name;
    AudioStorage.value.splice(index, 1);
    CurrentlyWritingMessage.value = Cleaning(name);
  } catch (error) {
    console.log(error.message);
  }
}

function DeleteVideoMedia(index) {
  try {
    let name = VideoStorage.value[index].name;
    VideoStorage.value.splice(index, 1);
    CurrentlyWritingMessage.value = Cleaning(name);
  } catch (error) {
    console.log(error.message);
  }
}

function DeleteImageMedia(index) {
  try {
    let name = images.value[index].name;
    images.value.splice(index, 1);
    CurrentlyWritingMessage.value = Cleaning(name);
  } catch (error) {
    console.log(error.message);
  }
}




function manageMedia(file) {
  try {
    if (!(file.target.files[0].size >= 10 * 1024 * 1024)) {
      if (SupportedMedia.value.includes(file.target.files[0].type)) {
        let rawfile = new FileReader();
        if (SupportedText.value.includes(file.target.files[0].type)) {
          rawfile.readAsText(file.target.files[0]);
        }
        else {
          rawfile.readAsDataURL(file.target.files[0]);
        }
        rawfile.onloadend = () => {
          if (SupportedText.value.includes(file.target.files[0].type)) {
            CurrentlyWritingMessage.value += rawfile.result;
          }
          if (file.target.files[0].type == "image/jpeg" || file.target.files[0].type == "image/png") {
            let obj = { name: file.target.files[0].name, Data: rawfile.result, Type: file.target.files[0].type };
            images.value.push(obj);
            CurrentlyWritingMessage.value += `\n${obj.name}`;
          }
          if (file.target.files[0].type == "video/mp4") {
            let obj = { name: file.target.files[0].name, Data: rawfile.result, Type: file.target.files[0].type };
            VideoStorage.value.push(obj);
            CurrentlyWritingMessage.value += `\n${obj.name}`;
          }
          if (SupportedAudios.value.includes(file.target.files[0].type)) {
            let obj = { name: file.target.files[0].name, Data: rawfile.result, Type: file.target.files[0].type };
            AudioStorage.value.push(obj);
            CurrentlyWritingMessage.value += `\n${obj.name}`;
          }
        }
      }
      else {
        NoInputError.value = 'File Not Supported!';
        setTimeout(() => {
          NoInputError.value = '';
        }, 1500);
      }
    }
    else {
      NoInputError.value = 'File is Should Be Less Than 10MB!';
      setTimeout(() => {
        NoInputError.value = '';
      }, 1500);
    }
  }
  catch (error) {
    console.log(error.message);
  }

}




function showInput() {
  try {
    SearchBtnSound.play();
    searchinput.value = !searchinput.value
    if (searchinput.value) {
      setTimeout(() => {
        document.querySelector('.searchinput').classList.add('showinput');
      }, 50);
    }
    else {
      document.querySelector('.searchinput').classList.remove('showinput');
    }
  } catch (error) {
    console.log(error.message);
  }
}




setTimeout(() => {
  document.querySelector('.loading').classList.add('active');
}, 800);

setTimeout(() => {
  Loading.value = false;
}, 1300);




function generateRandomColor() {
  try {
    let letters = '0123456789ABCDEF';
    let minBrightness = 0; // Minimum brightness value (0-255) for RGB components
    let maxBrightness = 200; // Maximum brightness value (0-255) for RGB components
    let opacity = 0.6; // Opacity value (0-1)
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      const component = Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) + minBrightness;
      color += component.toString() + ',';
    }
    color += opacity + ')';
    return color;
  } catch (error) {
    console.log(error.message);
  }
};




// ..... Generate same but deep color for card title this CardTitleColor also give color to card itself .......
function AddNoteBtn() {
  try {
    searchinput.value = false
    inputData.value = '';
    document.querySelector('.model_h3').textContent = 'Write Your Note Here!';
    AddBtnAudio.play();
    EditMode.value = false;
    isAddBtnPressed.value = true;
    document.querySelector(".dialog").appendChild(RemoveCloseBtn.value);
  } catch (error) {
    console.log(error.message);
  }
};




function RO_ViewNotePage(index) {
  try {
    ViewBtnSound.play();
    document.querySelector('.dialog').style.display = 'none';
    SendNoteForView.value = data.value[index].userWrote
    SendImageForView.value = data.value[index].ImageFile;
    SendAudioForView.value = data.value[index].AudioFiles;
    SendVideoForView.value = data.value[index].VideoFiles;
    isAddBtnPressed.value = true;
    IsRoViewNoteOpen.value = true;
    searchinput.value = false
    inputData.value = '';
  } catch (error) {
    console.log(error.message);
  }
};




function EditBtn(index) {
  try {
    EditBtnSound.play();
    document.querySelector('.model_h3').textContent = 'Edit Your Note Here!';
    searchinput.value = false
    inputData.value = '';
    EditMode.value = true
    isAddBtnPressed.value = true;
    RemoveCloseBtn.value.remove();
    CurrentlyWritingMessage.value = data.value[index].userWrote;
    CurrentlyWritingTitle.value = data.value[index].title;
    CurrentIndex.value = index;
    /* Useful for edit mode like send all note data to array se delete buttons can acees it then modify & send it back to note*/
    if (EditMode.value) {
      ////////////
      data.value[CurrentIndex.value].ImageFile.forEach((element) => {
        images.value.push(element);
      });
      data.value[CurrentIndex.value].ImageFile.splice(0, data.value[CurrentIndex.value].ImageFile.length);
      ////////////
      data.value[CurrentIndex.value].AudioFiles.forEach((element) => {
        AudioStorage.value.push(element);
      });
      data.value[CurrentIndex.value].AudioFiles.splice(0, data.value[CurrentIndex.value].AudioFiles.length);
      ///////////
      data.value[CurrentIndex.value].VideoFiles.forEach((element) => {
        VideoStorage.value.push(element)
      });
      data.value[CurrentIndex.value].VideoFiles.splice(0, data.value[CurrentIndex.value].VideoFiles.length);
      //////////
    }
  } catch (error) {
    console.log(error.message);
  }
};




function DeleteCard(index) {
  try {
    DelBtnSound.play();
    data.value[index].isCardGoingDeleted = true;
    setTimeout(() => {
      data.value.splice(index, 1);
      //Overwriting local storage with new data.
      localStorage.setItem('Notes', JSON.stringify(data.value));
    }, 300);
  } catch (error) {
    console.log(error.message);
  }
};




function CloseBtn() {
  try {
    CloseBtnSound.play();
    IsRoViewNoteOpen.value = false;
    isAddBtnPressed.value = false;
    document.querySelector('.dialog').style.display = 'flex';
  } catch (error) {
    console.log(error.message);
  }
};




// ........................ This Big function for save data when save or done buton pressed ..........................
function DoneBtn() {
  try {
    // ......................... function for save data when in editing mode ..............................
    if (EditMode.value) {
      SaveBtnSound.play();
      data.value[CurrentIndex.value].userWrote = CurrentlyWritingMessage.value;
      data.value[CurrentIndex.value].title = CurrentlyWritingTitle.value;
      WorkingWithDoneButton();
      isAddBtnPressed.value = false;
      CurrentlyWritingMessage.value = "";
      CurrentlyWritingTitle.value = "";
      //Overwriting local storage with new data.
      localStorage.setItem('Notes', JSON.stringify(data.value));
    }
    // .................. function for save data when in new card creating mode ............................
    else {
      if (CurrentlyWritingMessage.value.trim() !== "" && CurrentlyWritingTitle.value.trim() !== "") {
        SaveBtnSound.play();

        let currentDate = new Date();
        let formattedDate = currentDate.toLocaleDateString();
        let gettingColor = generateRandomColor();
        let result = gettingColor.slice(0, -4) + '1.0)';
        //.................................. Object For Array To Make New Cards .................................
        userinputdata = {
          title: CurrentlyWritingTitle.value,
          userWrote: CurrentlyWritingMessage.value,
          NotesDate: formattedDate,
          isCardGoingDeleted: false,
          color: gettingColor,
          id: Math.floor(Math.random() * 10000),
          CardTitleColor: result,
          ImageFile: [],
          AudioFiles: [],
          VideoFiles: []
        };
        WorkingWithDoneButton();
        //.............................................Here Pushing object To Array ................................
        CurrentlyWritingMessage.value = "";
        CurrentlyWritingTitle.value = "";
        isAddBtnPressed.value = false;
        //Overwriting local storage with new data.
        localStorage.setItem('Notes', JSON.stringify(data.value));
      }
      //..............................Error If It Found Inputs Fields Are Empty .....................................
      else {
        NoInputError.value = "Error! Please Fill Both Boxes (Don't Let Anyone Empty).";
        setTimeout(() => {
          NoInputError.value = ""
        }, 2500);
      };
    };
  } catch (error) {
    console.log(error.message);
  }
};




function WorkingWithDoneButton() {
  try {
    images.value.forEach((image) => {
      if (EditMode.value) {
        data.value[CurrentIndex.value].ImageFile.push(image);
      }
      else if (!EditMode.value) {
        userinputdata.ImageFile.push(image);
      }
    });
    AudioStorage.value.forEach((audio) => {
      if (EditMode.value) {
        data.value[CurrentIndex.value].AudioFiles.push(audio);
      }
      else if (!EditMode.value) {
        userinputdata.AudioFiles.push(audio);
      }
    });
    VideoStorage.value.forEach((video) => {
      if (EditMode.value) {
        data.value[CurrentIndex.value].VideoFiles.push(video);
      }
      else if (!EditMode.value) {
        userinputdata.VideoFiles.push(video);
      }
    });
    if (!EditMode.value) {
      data.value.push(userinputdata);
    }
    images.value.splice(0, images.value.length);
    AudioStorage.value.splice(0, AudioStorage.value.length);
    VideoStorage.value.splice(0, VideoStorage.value.length);
  } catch (error) {
    console.log(error.message);
  }
}




//.................................. A Function To Move Cursor, Enter to Save ...........................................
onMounted(() => {
  try {
    document.querySelector('.title').addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        document.querySelector('.model_note').focus(); // Shift focus to the note input box
      }
      else if (event.key == 'Enter' && event.shiftKey) {
        DoneBtn();
      }
    });
    document.querySelector('.model_note').addEventListener("keyup", (event) => {
      if (event.key == 'Enter' && event.shiftKey) {
        DoneBtn();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});




watch(isAddBtnPressed, (newval) => {
  try {
    if (newval && focusOnInput.value)
      setTimeout(() => {
        focusOnInput.value.focus();
      }, 100);
  } catch (error) {
    console.log(error.message);
  }
});




watch(searchinput, (newval) => {
  try {
    if (newval && document.querySelector('.searchinput'))
      setTimeout(() => {
        document.querySelector('.searchinput').focus();
      }, 100);
  } catch (error) {
    console.log(error.message);
  }
});




document.addEventListener('DOMContentLoaded', () => {
  try {
    document.querySelector('.searchinput').addEventListener('keyup', (e) => {
      let data = inputData.value.toLowerCase();
      document.querySelectorAll('.cards').forEach((card) => {
        let title = card.querySelector('.Card_Title').textContent.toLowerCase().trim();
        let Description = card.querySelector('.Card_Para').textContent.toLowerCase().trim();
        if (title.includes(data) || Description.includes(data) || inputData.value == '') {
          card.classList.remove('searchItemSmoothlyHide');
          card.style.display = 'flex';
        }
        else {
          card.classList.add('searchItemSmoothlyHide');
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
        if (e.key == 'Delete') {
          inputData.value = '';
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});




// User Data.
let data = ref([
  {
    title: "MY Note",
    userWrote: "Hello There, Welcome To Simple Colorful Notes Making Web App.",
    NotesDate: "2/07/2023",
    isCardGoingDeleted: false,
    color: 'rgba(17, 0, 255, 0.6)',
    id: 10102,
    CardTitleColor: 'rgba(17, 0, 255, 1.0)'
  }
]);




// getting data from localstorage, making new array witout this above object,passing each obj of new arr in data arr.
receivedData.value = JSON.parse(localStorage.getItem('Notes'));
if (receivedData.value !== null) {
  let newArray = receivedData.value.filter(item => item.id !== 10102);
  newArray.forEach(element => {
    data.value.push(element);
  });
}
else {
  console.log("No data retrived From Storage");
}
</script>