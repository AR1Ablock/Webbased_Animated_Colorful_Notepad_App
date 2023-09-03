<template>
  <div class="wrapper">
    <div class="searchbar">
      <div @click="showInput()"><img src="../public/search.png" alt=""></div>
      <input class="searchinput" type="text" name="" id="" placeholder="Search Notes" :class="{ 'showinput2': searchinput }"
        v-model.trim="inputData">
    </div>
    <div class="btn-head_con" :class="{ 'active': isAddBtnPressed }">
      <h1 class="notesheading">Notes</h1>
      <button @click="AddNoteBtn" class="addbtn">+</button>
    </div>

    <div class="card_con" :class="{ 'active': isAddBtnPressed }">

      <div class="cards" style="background-color: rgba(0, 119, 255, 0.804);" v-for="(item, index) in data" :key="index"
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
      <textarea name="notewriting" class="model_note" cols="30" rows="10" placeholder="Enter Your Message"
        v-model.trim="CurrentlyWritingMessage"></textarea>
      <p class="error_msg"> {{ NoInputError }}</p>
      <button @click="DoneBtn" class="done">Done</button>
      <button ref="RemoveCloseBtn" @click="CloseBtn" class="close">Close</button>
    </dialog>

    <dialog open="" class="notepage" :class="{ 'active': IsRoViewNoteOpen }">
      <div class="notepag_con">
        <p>{{ SendNoteForView }}</p>
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
let IsRoViewNoteOpen = ref(false);
let EditMode = ref(false);
let NoInputError = ref("");
let receivedData = ref();
let CurrentlyWritingTitle = ref("");
let focusOnInput = ref('');
let searchinput = ref(false);
let inputData = ref('');

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






// .........................................All The Functions ..................................................... 
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
    SendNoteForView.value = data.value[index].userWrote;
    IsRoViewNoteOpen.value = true;
    isAddBtnPressed.value = true;
  } catch (error) {
    console.log(error.message);
  }
};





function EditBtn(index) {
  try {
    EditBtnSound.play();
    EditMode.value = true
    isAddBtnPressed.value = true;
    RemoveCloseBtn.value.remove();
    CurrentlyWritingMessage.value = data.value[index].userWrote;
    CurrentlyWritingTitle.value = data.value[index].title;
    CurrentIndex.value = index;
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
      isAddBtnPressed.value = false;
      CurrentlyWritingMessage.value = "";
      CurrentlyWritingTitle.value = "";
      //Overwriting local storage with new data.
      localStorage.setItem('Notes', JSON.stringify(data.value))
    }
    // .................. function for save data when in new card creating mode ............................
    else {
      if (CurrentlyWritingMessage.value.trim() !== "" && CurrentlyWritingTitle.value.trim() !== "") {
        SaveBtnSound.play();
        let currentDate = new Date();
        let formattedDate = currentDate.toLocaleDateString();
        let gettingColor = generateRandomColor();
        let result = gettingColor.slice(0, -4) + '1.0)';
        console.log('coard cololr', gettingColor, 'title', result)
        //.................................. Object For Array To Make New Cards .................................
        let userinputdata = {
          title: CurrentlyWritingTitle.value,
          userWrote: CurrentlyWritingMessage.value,
          NotesDate: formattedDate,
          isCardGoingDeleted: false,
          color: gettingColor,
          id: Math.floor(Math.random() * 10000),
          CardTitleColor: result
        };
        //.............................................Here Pushing object To Array ................................
        data.value.push(userinputdata);
        CurrentlyWritingMessage.value = "";
        CurrentlyWritingTitle.value = "";
        isAddBtnPressed.value = false;
        //Overwriting local storage with new data.
        localStorage.setItem('Notes', JSON.stringify(data.value))
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





//.................................. A Function To Move Cursor, Enter to Save ...........................................
onMounted(() => {
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
        console.log(data, title, Description);
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
    color: 'rgba(0, 197, 255, 0.6)',
    id: 10102,
    CardTitleColor: 'rgba(0, 197, 255, 1.0)'
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