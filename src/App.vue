<template>
  <div class="wrapper">
    <div
      class="loading"
      v-if="Remove_Loading_Screen"
      :class="{ active: !Loading }"
    >
      <h1>Notes</h1>
      <p></p>
    </div>

    <div class="searchbar" :class="{ active: isAddBtnPressed }">
      <div @click="showInput()">
        <img src="./assets/Icons/search.png" alt="" />
      </div>
      <input
        class="searchinput"
        type="text"
        name=""
        id=""
        placeholder="Search Notes"
        :class="{ showinput2: searchinput }"
        v-model.trim="inputData"
      />
      <button @click="AddNoteBtn" class="addbtn">+</button>
    </div>

    <div class="card_con" :class="{ active: isAddBtnPressed }">
      <!-- Message to display when no notes are found -->
      <div class="no_notes_message">No Notes Found</div>

      <!-- Cards -->
      <div
        class="cards"
        v-for="(item, index) in data"
        :key="index"
        :class="{ smoothhide: data[index].isCardGoingDeleted }"
        :style="{ 'background-color': data[index].color }"
      >
        <div
          class="Title_Con"
          :style="{ 'background-color': data[index].CardTitleColor }"
        >
          <p class="Card_Title">{{ item.title }}</p>
        </div>
        <div class="Para_Con" @click="RO_ViewNotePage(index)">
          <p class="Card_Para">{{ item.userWrote }}</p>
        </div>
        <div class="Upload_Loader"></div>
        <div class="extra">
          <h4>{{ item.NotesDate }}</h4>
          <button @click="EditBtn(index)" class="edit">Edit</button>
          <button @click="DeleteCard(index)" class="delete">X</button>
        </div>
      </div>
    </div>

    <dialog
      open=""
      class="dialog"
      :class="{
        active: isAddBtnPressed,
        dialog_full_screen: NoteWriter_Form_Full_Screen,
      }"
    >
      <h3 class="model_h3">Write Your Note Here!</h3>

      <!-- Edit Mode -->
      <div
        class="Video_Audio_Preview_Container"
        v-if="Edit_Mode_Toggle_Video_Preview && EditMode"
      >
        <span
          class="Close_Video_Audio_Preview_Btn"
          @click="
            Edit_Mode_Toggle_Video_Preview = !Edit_Mode_Toggle_Video_Preview
          "
          >X</span
        >
        <video
          class="Video_Audio_Preview"
          ref="Edit_Mode_Video_Preview_Element"
          controls
          autoplay
          preload="auto"
        ></video>
      </div>

      <!-- Done Mode -->
      <div
        class="Video_Audio_Preview_Container"
        v-if="Done_Mode_Toggle_Video_Preview && !EditMode"
      >
        <span
          class="Close_Video_Audio_Preview_Btn"
          @click="
            Done_Mode_Toggle_Video_Preview = !Done_Mode_Toggle_Video_Preview
          "
          >X</span
        >
        <video
          class="Video_Audio_Preview"
          ref="Done_Mode_Video_Preview_Element"
          controls
          autoplay
          preload="auto"
        ></video>
      </div>

      <button class="View_Full_Screen" @click="Toggle_Note_Form_Full_Screen">
        <span
          ><img
            src="./assets/Icons/shrink.png"
            alt=""
            v-if="NoteWriter_Form_Full_Screen"
        /></span>
        <span
          ><img
            src="./assets/Icons/maximize.png"
            alt=""
            v-if="!NoteWriter_Form_Full_Screen"
        /></span>
      </button>
      <input
        ref="focusOnInput"
        type="text"
        class="title"
        placeholder="Note Title"
        v-model.trim="CurrentlyWritingTitle"
      />

      <!-- Edit Mode -->
      <div class="itemDeletePanel" v-if="EditMode">
        <button @click="ShowManageItemButtons">Delete</button>
        <div class="parent">
          <button @click="ShowAudioItems = !ShowAudioItems">Audios</button>
          <div class="itemShowCon">
            <div v-if="ShowAudioItems">
              <div v-for="(item, index) in Edit_Mode_AudioStorage" :key="index">
                <div @click="DeleteAudioMedia(index, true)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowVideoItems = !ShowVideoItems">Videos</button>
          <div class="itemShowCon">
            <div v-if="ShowVideoItems">
              <div v-for="(item, index) in Edit_Mode_VideoStorage" :key="index">
                <div @click="DeleteVideoMedia(index, true)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowImagesItems = !ShowImagesItems">Images</button>
          <div class="itemShowCon">
            <div v-if="ShowImagesItems">
              <div v-for="(item, index) in Edit_Mode_images" :key="index">
                <div @click="DeleteImageMedia(index, true)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowDocumentsItems = !ShowDocumentsItems">
            Docs
          </button>
          <div class="itemShowCon">
            <div v-if="ShowDocumentsItems">
              <div
                v-for="(item, index) in Edit_Mode_DocumentStorage"
                :key="index"
              >
                <div
                  @click="DeleteDocumentMedia(index, true)"
                  class="itemsShow"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Mode -->
      <div class="itemDeletePanel" v-if="!EditMode">
        <button @click="ShowManageItemButtons">Delete</button>
        <div class="parent">
          <button @click="ShowAudioItems = !ShowAudioItems">Audios</button>
          <div class="itemShowCon">
            <div v-if="ShowAudioItems">
              <div v-for="(item, index) in AudioStorage" :key="index">
                <div @click="DeleteAudioMedia(index, false)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowVideoItems = !ShowVideoItems">Videos</button>
          <div class="itemShowCon">
            <div v-if="ShowVideoItems">
              <div v-for="(item, index) in VideoStorage" :key="index">
                <div @click="DeleteVideoMedia(index, false)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowImagesItems = !ShowImagesItems">Images</button>
          <div class="itemShowCon">
            <div v-if="ShowImagesItems">
              <div v-for="(item, index) in images" :key="index">
                <div @click="DeleteImageMedia(index, false)" class="itemsShow">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <button @click="ShowDocumentsItems = !ShowDocumentsItems">
            Docs
          </button>
          <div class="itemShowCon">
            <div v-if="ShowDocumentsItems">
              <div v-for="(item, index) in DocumentStorage" :key="index">
                <div
                  @click="DeleteDocumentMedia(index, false)"
                  class="itemsShow"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="notes_Writing_Area_Wrapper">
        <textarea
          name="notewriting"
          class="model_note"
          ref="TextAreaElement"
          cols="30"
          rows="10"
          placeholder="Write Your Thoughts"
          v-model.trim="CurrentlyWritingMessage"
        >
        </textarea>
        <video class="vid" ref="videoPreview" autoplay muted></video>
      </div>

      <!-- Overlay for Audio Recording -->
      <div id="overlay" ref="overlayElement">
        <div class="sound-bars">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div class="attachmentBtns">
        <label for="fileInput" class="custom_Choose_file">Choose File</label>
        <input type="file" id="fileInput" @change="manageMedia" />

        <button ref="recordAudioButton" @click="AudioRec">Audio Rec</button>
        <button
          ref="recordVideoButton"
          v-if="!Front_Back_Camera"
          @click="VideoRec"
        >
          Video Rec
        </button>

        <button
          id="useFrontCamera"
          v-if="Front_Back_Camera"
          @click="FrontCamVideoRec"
        >
          Front Camera
        </button>
        <button
          id="useBackCamera"
          v-if="Front_Back_Camera"
          @click="BackCamVideoRec"
        >
          Back Camera
        </button>
      </div>

      <p class="error_msg">{{ NoInputError }}</p>
      <button @click="DoneBtn" ref="DisableDoneBtnElement" class="done">
        Done
      </button>
      <button ref="RemoveCloseBtnElement" @click="CloseBtn" class="close">
        Close
      </button>
    </dialog>

    <dialog
      open=""
      class="notepage"
      :class="{
        active: IsRoViewNoteOpen,
        notepage_full_screen: Toggle_Reading_Form_Full_Screen,
      }"
      :style="boxStyle"
    >
      <div
        class="notepag_con"
        ref="View_Note_Page_UI"
        :class="{ notepag_con_full_screen: Toggle_Reading_Form_Full_Screen }"
      >
        <section class="Notepage_View_Full_Screen_And_Change_Color_Container">
          <div
            class="View_Full_Screen View_Notepage_Full_Screen"
            @click="
              Toggle_Reading_Form_Full_Screen = !Toggle_Reading_Form_Full_Screen
            "
          >
            <span
              ><img
                src="./assets/Icons/shrink.png"
                alt=""
                v-if="Toggle_Reading_Form_Full_Screen"
            /></span>
            <span
              ><img
                src="./assets/Icons/maximize.png"
                alt=""
                v-if="!Toggle_Reading_Form_Full_Screen"
            /></span>
          </div>

          <div
            class="Change_Note_View_Reading_Color"
            :style="buttonStyle"
            @click="changeColor"
          >
            <img src="./assets/Icons/reading-mode.png" alt="" />
          </div>
        </section>

        <p>{{ SendNoteForView }}</p>

        <div
          class="img"
          v-for="item in SendImageForView"
          :key="`${item.id}-${refreshKey}`"
        >
          <div class="Upload_Loader Upload_Loader_active_media"></div>
          <img v-loader="item.Data" alt="" srcset="" />
        </div>

        <div
          class="audio"
          v-for="item in SendAudioForView"
          :key="`${item.id}-${refreshKey}`"
        >
          <div class="Upload_Loader Upload_Loader_active_media"></div>
          <audio
            ref="media"
            preload="auto"
            v-loader="item.Data"
            controls
            muted
          ></audio>
        </div>

        <div
          class="video"
          v-for="item in SendVideoForView"
          :key="`${item.id}-${refreshKey}`"
        >
          <div class="Upload_Loader Upload_Loader_active_media"></div>
          <video
            ref="media"
            preload="auto"
            v-loader="item.Data"
            controls
            muted
          ></video>
        </div>

        <div class="wrapper">
          <div
            class="document"
            v-for="item in SendDocumentForView"
            :key="`${item.id}-${refreshKey}`"
          >
            <img src="./assets/Icons/document-file.png" alt="document" />
            <a :href="item.Data" :download="item.name">{{ item.name }}</a>
          </div>
        </div>

        <button @click="CloseBtn" class="exit">Close</button>
      </div>
    </dialog>
    <div class="overlayer" v-if="IsRoViewNoteOpen" @click="CloseBtn"></div>
  </div>

  <div
    class="Critical_Error"
    :class="{ Critical_Error_Active: Toggle_Critical_Error }"
  >
    <p ref="Critical_Error_Message">Something Went Wrong</p>
    <button @click="Toggle_Critical_Error = false">X</button>
  </div>

  <div class="load_more_notes">
    <div class="storage_capacity">
      <span class="used_capacity" ref="Used_Storage_Capacity_Element">
        <span
          >{{ Used_Storage_Capacity }}G / {{ Total_Storage_Capacity }}G</span
        >
      </span>
    </div>

    <button @click="fetchAllNotes">
      <div
        class="Upload_Loader More_Notes_Loader"
        v-if="More_Notes_Are_Coming"
      ></div>
      <span v-else-if="!More_Notes_Are_Coming">Load More</span>
    </button>

    <button class="sortbtn" @click="sorting">
      Sort: {{ sort_order == "asc" ? "desc" : "asc" }}
    </button>
  </div>

  <div
    class="All_Notes_Loaded_Container"
    v-if="All_Notes_Loaded_Message_Container_Element"
  >
    <span
      class="Close_All_Notes_Loaded_Message_Btn"
      @click="All_Notes_Loaded_Message_Container_Element = false"
      >X</span
    >
    <p class="All_Notes_Loaded_Message">All Notes Are Loaded!</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import * as tus from "tus-js-client";
import Dexie from "dexie";
// .................................... All Variables .........................................
let isAddBtnPressed = ref(false);
let CurrentlyWritingMessage = ref("");
let TextAreaElement = ref();
let RemoveCloseBtnElement = ref();
let DisableDoneBtnElement = ref();
let CurrentIndex = ref();
let SendNoteForView = ref("");
let SendImageForView = ref([]);
let SendAudioForView = ref([]);
let SendVideoForView = ref([]);
let SendDocumentForView = ref([]);
let IsRoViewNoteOpen = ref(false);
let EditMode = ref(false);
let NoInputError = ref("");
let CurrentlyWritingTitle = ref("");
let focusOnInput = ref("");
let searchinput = ref(false);
let inputData = ref("");
let Loading = ref(true); // loading animation
let images = ref([]);
let AudioStorage = ref([]);
let VideoStorage = ref([]);
let DocumentStorage = ref([]); // New storage for documents
let Edit_Mode_images = ref([]);
let Edit_Mode_AudioStorage = ref([]);
let Edit_Mode_VideoStorage = ref([]);
let Edit_Mode_DocumentStorage = ref([]); // New storage for documents
let userinputdata = {};
let SupportedMedia = ref([
  // Video formats
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/x-matroska",
  "video/avi",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-flv",
  "video/x-ms-wmv",

  // Image formats
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml",
  "image/apng",
  "image/heic",
  "image/heif",

  // Audio formats
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/flac",
  "audio/aac",
  "audio/x-m4a",
  "audio/webm",
  "audio/x-wav",
  "audio/x-aiff",
  "audio/x-ms-wma",

  // Text and document formats
  "text/plain",
  "text/html",
  "text/css",
  "application/javascript",
  "text/javascript",
  "application/json",
  "application/xml",
  "application/xhtml+xml",
  "text/markdown",
  "application/x-shellscript",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

let SupportedAudios = ref([
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/flac",
  "audio/aac",
  "audio/x-m4a",
  "audio/webm",
  "audio/x-wav",
  "audio/x-aiff",
  "audio/x-ms-wma",
]);

let SupportedText = ref([
  "text/plain",
  "text/html",
  "text/css",
  "application/javascript",
  "text/javascript",
  "application/json",
  "text/markdown",
  "application/x-shellscript",
  "application/xml",
]);

/* ............................. Sounds ............................ */
import addbtn from "./assets/effects/addbtn.mp3";
import Delbtn from "./assets/effects/deleteNote.mp3";
import editbtn from "./assets/effects/editbtn.mp3";
import viewbtn from "./assets/effects/viewpage.mp3";
import savebtn from "./assets/effects/savebtn.mp3";
import closebtn from "./assets/effects/closebtn.mp3";
import Searchbtn from "./assets/effects/Search.mp3";
let AddBtnAudio = new Audio(addbtn);
let DelBtnSound = new Audio(Delbtn);
let EditBtnSound = new Audio(editbtn);
let ViewBtnSound = new Audio(viewbtn);
let SaveBtnSound = new Audio(savebtn);
let CloseBtnSound = new Audio(closebtn);
let SearchBtnSound = new Audio(Searchbtn);
let media = ref();
let ShowAudioItems = ref(false);
let ShowVideoItems = ref(false);
let ShowImagesItems = ref(false);
let ShowDocumentsItems = ref(false);
let temp_for_save_Create_Note_Text_if_available_parallelly = ref([]);
// Recording
let recordedChunks = ref([]);
let recordAudioButton = ref();
let recordVideoButton = ref();
let Front_Back_Camera = ref(false);
let videoPreview = ref();
let overlayElement = ref();
let mediaRecorder = "";
let currentStream = ""; // Store the MediaStream object
let i = 0;
let j = 0;
let Max_Accumulated_Attachments_Size = ref(5 * 1024 * 1024);
let DoneMode_Loader_Element = ref([]);
let EditMode_Loader_Element = ref([]);
let NoteWriter_Form_Full_Screen = ref(false);
/////
let Done_Mode_Toggle_Video_Preview = ref(false);
let Edit_Mode_Toggle_Video_Preview = ref(false);
////
let Edit_Mode_Video_Preview_Element = ref();
let Done_Mode_Video_Preview_Element = ref();
let Remove_Loading_Screen = ref(true);
let View_Note_Page_UI = ref();
let Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination =
  ref([]);
let More_Notes_Are_Coming = ref(false);
let All_Notes_Loaded_Message_Container_Element = ref(false);
let Fetch_Notes_In_Parts = ref({ Start_From_Note: 1, Fetch_Till_Note: 5 });
let Toggle_Critical_Error = ref(false);
let Critical_Error_Message = ref();
let Save_The_Create_Notes_Max_Accu_Attachment_Capacity_While_Switching_To_Edit_Note =
  ref();
let controller = new AbortController(); //we pass controller as arg to fetch method and bakcned accept it as cancilation token parameter so useful when we reload or call conroller.abort then fetch will stop and throw error which will catched by catch block and http line will get closed and backend cancellation token will get expired and backend stop all operations where we setted that token.
let Media = ref({ Video_Stop_Duration: 21000, Audio_Stop_Duration: 180000 });
let Toggle_Reading_Form_Full_Screen = ref(false);
let Total_Storage_Capacity = ref(null);
let Used_Storage_Capacity = ref(null);
let Used_Storage_Capacity_Percentage = ref(null);
let Used_Storage_Capacity_Element = ref();
let sort_order = ref("desc");
const db = new Dexie("MyNotesDB");

let vLoader = {
  async mounted(el, binding) {
    console.log("mounted");
    // Initially hide the media element
    el.style.transform = "scale(0)";
    // Set the source from the binding value
    await new Promise((resolve) => setTimeout(resolve, 500));
    el.src = binding.value;

    // Determine the appropriate event
    let eventName = "load";
    if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
      eventName = "loadeddata";
    }

    // there is an issue with IMG elements that if it is cached in borowser then it means it already completed and load method wont get called so if it is completed then running the animation method and for not completed then attach event listner to it and other media's.
    if (el.tagName === "IMG" && el.complete) {
      runAnimation();
    } else {
      el.addEventListener(eventName, runAnimation, { once: true });
    }

    async function runAnimation() {
      console.log("calling animation method");
      await Lazy_Load_With_animation(el);
    }
  },
};

async function Lazy_Load_With_animation(el) {
  //console.log("entered in animaiton");
  //await new Promise((resolve) => setTimeout(resolve, 50));
  console.log(
    el.previousElementSibling &&
      el.previousElementSibling.classList.contains("Upload_Loader_active_media")
  );
  if (
    el.previousElementSibling &&
    el.previousElementSibling.classList.contains("Upload_Loader_active_media")
  ) {
    el.previousElementSibling.remove();
  }
  await new Promise((resolve) => setTimeout(resolve, 10));
  el.style.transition = "transform 0.3s ease";
  el.style.transform = "scale(1)";
}

db.version(1).stores({
  notes: "id, note, createdAt, updatedAt",
});
// .........................................All The Functions .....................................................

const refreshKey = ref(Date.now());

// Call this function whenever you open a note to force a re-render.
function updateRefreshKey() {
  refreshKey.value = Date.now();
}

const bg = ["#131313", "rgba(255, 165, 0)", "green", "#e2e2e2"];
const clr = ["#979797", "black", "white", "black"];

const colorIndex = ref(0);

const boxStyle = computed(() => ({
  backgroundColor: bg[colorIndex.value],
  color: clr[colorIndex.value] + "!important",
}));

const changeColor = () => {
  colorIndex.value = (colorIndex.value + 1) % bg.length;
  console.log(colorIndex, " --> ", clr[colorIndex.value]);
};

const buttonStyle = computed(() => ({
  borderColor: getBorderColor(),
}));

const getBorderColor = () => {
  const borderColor = new Array(4).fill("transparent");
  for (let i = 0; i <= colorIndex.value; i++) {
    borderColor[i] = "yellow";
  }
  return borderColor.join(" ");
};

function ShowManageItemButtons() {
  try {
    document.querySelector(".parent").classList.toggle("ShowBtns");
    document.querySelector(".itemDeletePanel button").style.transform =
      "scale(.9) translateX(.5vmin)";
  } catch (error) {
    console.log(error.message);
  }
}

function Toggle_Note_Form_Full_Screen() {
  setTimeout(() => {
    AdjustCameraScreenSize();
  }, 10);
  NoteWriter_Form_Full_Screen.value = !NoteWriter_Form_Full_Screen.value;
}

function Turn_Off_Loading_Screen() {
  if (Loading.value && Remove_Loading_Screen.value) {
    setTimeout(() => {
      Loading.value = false;
    }, 500);
    /////
    setTimeout(() => {
      Remove_Loading_Screen.value = false;
    }, 1000);
  }
}

function All_Notes_Loaded() {
  All_Notes_Loaded_Message_Container_Element.value = false;
  setTimeout(() => {
    More_Notes_Are_Coming.value = false;
    All_Notes_Loaded_Message_Container_Element.value = true;
  }, 1000);
  window.removeEventListener("scroll", debouncedScroll);
  return;
}

function limitLogSize(logEntry, maxSize = 200) {
  try {
    if (typeof logEntry === "string") {
      return logEntry.length > maxSize
        ? logEntry.substring(0, maxSize) + "..."
        : logEntry;
    } else if (typeof logEntry === "object") {
      const jsonString = JSON.stringify(logEntry, null, 2);
      return jsonString.length > maxSize
        ? jsonString.substring(0, maxSize) + "..."
        : jsonString;
    }
    return logEntry;
  } catch (error) {
    console.log(error.message);
  }
}

function Show_Critical_Error(message) {
  Toggle_Critical_Error.value = true;
  setTimeout(() => {
    Critical_Error_Message.value.textContent = message;
  }, 100);
}

function resetController() {
  controller = new AbortController();
}

function storage_capacity_checker() {
  navigator.storage.estimate().then((estimate) => {
    Used_Storage_Capacity.value = (estimate.usage / 1024 ** 3).toFixed(1); // Convert bytes to GB
    Total_Storage_Capacity.value = (estimate.quota / 1024 ** 3).toFixed(1); // Convert bytes to GB
    Used_Storage_Capacity_Percentage.value = (
      (estimate.usage / estimate.quota) *
      100
    ).toFixed(2); // Calculate percentage

    Used_Storage_Capacity_Element.value.style.width =
      Used_Storage_Capacity_Percentage.value + "%";

    console.log(`Used: ${Used_Storage_Capacity.value} GB`);
    console.log(`Total: ${Total_Storage_Capacity.value} GB`);
    console.log(`Used Capacity: ${Used_Storage_Capacity_Percentage.value}%`);
  });
}

function ShowErrors(error) {
  if (error.name === "QuotaExceededError") {
    // Inform the user that storage is full.
    Show_Critical_Error(
      "Storage quota exceeded. Please free up some space or try again later."
    );
  } else if (error.name === "ConstraintError") {
    // Handle duplicate key error.
    Show_Critical_Error("A note with this identifier already exists.");
  } else if (error.name === "AbortError") {
    // Handle a transaction abort.
    Show_Critical_Error("Operation aborted. Please try again.");
  } else {
    // General error handling.
    Show_Critical_Error("Notes Parse Failed! Reload The Page.");
  }
  controller.abort();
}

function Scroll_Reached_Bottom() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight; // More reliable

  if (windowHeight + scrollTop >= docHeight - 10) {
    // Add small buffer
    fetchAllNotes();
  }
}

let debounceTimeout;
function debouncedScroll() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(Scroll_Reached_Bottom, 150);
}

onMounted(() => {
  SeedNote_On_first_time_app_load();
  fetchAllNotes();
  storage_capacity_checker();
  window.addEventListener("scroll", debouncedScroll);
});

// --- Revised CreateWorker() ---
// This function now returns a promise that resolves when the worker has processed the note.
function CreateWorker(compressedNote) {
  return new Promise((resolve, reject) => {
    try {
      const newWorker = new Worker(
        new URL("./components/worker.js", import.meta.url),
        { type: "module" }
      );
      console.log("Main sending compressed note to worker:", compressedNote);
      newWorker.postMessage({ compressedNote });

      newWorker.onmessage = function (e) {
        if (e.data.error) {
          console.log("Worker sent error:", e.data.error);
          // Reject the promise if the worker encountered an error.
          reject(e.data.error);
          newWorker.terminate();
          // Optionally, abort processing if a critical error occurs.
          controller.abort();
          Show_Critical_Error("Notes Load Failed! Reload Page or Browser.");
          More_Notes_Are_Coming.value = false;
          Loading.value = false;
        } else if (e.data.note) {
          console.log("Worker processed data:", e.data.note);
          data.value.push(e.data.note);
          resolve(e.data.note);
          newWorker.terminate();
        }
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function SeedNote_On_first_time_app_load() {
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString();

  let Main_Sow_Case_Note = {
    title: "Demo Note",
    userWrote:
      "Hello There, Welcome To Simple Colorful Notes Making Web App. This App Allows You To Create, Edit, View (Tap On Note) And Delete Notes. You Can Also Attach Images, Videos, Audio Files And Documents To Your Notes. The App Supports Various Media Formats And Provides A User-Friendly Interface For Managing Your Notes. Below is a Empty Files Demo. Enjoy Using Notes!",
    NotesDate: formattedDate,
    isCardGoingDeleted: false,
    color: "rgba(17, 0, 255, 0.6)",
    id: 10102,
    CardTitleColor: "rgba(17, 0, 255, 1.0)",
    ImageFile: [],
    AudioFiles: [],
    VideoFiles: [],
    DocumentFiles: [],
    Attachment_Used_Size: Max_Accumulated_Attachments_Size.value,
    TimeStamp: new Date().toISOString(),
  };

  const demoSeeded = localStorage.getItem("demoNoteSeeded");

  // Count the current notes.
  const count = await db.notes.count();

  // Only seed if there are no notes AND we haven't seeded before.
  if (count === 0 && !demoSeeded) {
    await Post_Note(Main_Sow_Case_Note);
    console.log("Demo note seeded with id:", Main_Sow_Case_Note.id);
    localStorage.setItem("demoNoteSeeded", "true");
    data.value.push(Main_Sow_Case_Note);
  } else {
    return;
  }
}

onMounted(() => {
  sort_order.value = localStorage.getItem("sort_order") || "desc";
});

function sorting() {
  sort_order.value = sort_order.value === "asc" ? "desc" : "asc";
  localStorage.setItem("sort_order", sort_order.value);
  PersistSort();
}

function PersistSort() {
  data.value = [...data.value].sort((a, b) => {
    if (sort_order.value === "asc") {
      return new Date(a.TimeStamp) - new Date(b.TimeStamp);
    } else {
      return new Date(b.TimeStamp) - new Date(a.TimeStamp);
    }
  });
}

async function fetchAllNotes() {
  try {
    // Reset any existing controller state.
    resetController();

    // Build an array of excluded IDs if we are not on the very first batch.
    let excludedIds = [];
    if (
      Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination
        .value.length > 0
    ) {
      excludedIds =
        Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination.value;
    }

    // Determine the offset and limit for the query.
    // Here, we assume that:
    //   - Start_From_Note is 1-based (i.e. 1 for the first batch),
    //   - Fetch_Till_Note represents how many notes to fetch per batch.
    const startIndex =
      (Fetch_Notes_In_Parts.value.Start_From_Note - 1) *
      Fetch_Notes_In_Parts.value.Fetch_Till_Note;
    const limitCount = Fetch_Notes_In_Parts.value.Fetch_Till_Note;

    console.log("start index:", startIndex, "limit:", limitCount);
    console.log("excluded ids:", excludedIds);

    let query = db.notes.orderBy("createdAt").reverse();

    if (excludedIds.length > 0) {
      query = query.filter((note) => !excludedIds.includes(note.id));
    }

    const compressed_notes = await query
      .offset(startIndex)
      .limit(limitCount)
      .toArray();

    if (Fetch_Notes_In_Parts.value.Start_From_Note !== 1) {
      More_Notes_Are_Coming.value = true;
    }

    console.log("More notes Loading Icon:", More_Notes_Are_Coming.value);

    // If no notes are returned, then all notes are loaded.
    if (compressed_notes.length === 0) {
      if (Fetch_Notes_In_Parts.value.Start_From_Note !== 1) {
        All_Notes_Loaded();
      }
      Turn_Off_Loading_Screen();
      return;
    }

    Fetch_Notes_In_Parts.value.Start_From_Note++;

    const workerPromises = compressed_notes.map((compressed_note) => {
      console.log("Sending note to worker:", compressed_note.note);
      return CreateWorker(compressed_note.note);
    });

    // Wait until all workers have finished processing and pushed their results to the UI.
    await Promise.all(workerPromises);

    PersistSort();

    More_Notes_Are_Coming.value = false;

    if (Fetch_Notes_In_Parts.value.Start_From_Note == 2) {
      Turn_Off_Loading_Screen();
    }
  } catch (error) {
    console.error(error.message);
    ShowErrors(error);
    More_Notes_Are_Coming.value = false;
    Loading.value = false;
  }
}

async function DeleteNote(Delete_id) {
  try {
    resetController();
    await db.transaction("rw", db.notes, async () => {
      await db.notes.delete(Delete_id);
    });

    console.log("Notes Deleted Successfully Of Id: " + Delete_id);
    storage_capacity_checker();
  } catch (error) {
    console.log(error.message);
    ShowErrors(error);
  }
}

async function Post_Note(note) {
  try {
    resetController();
    console.log("[Frontend] Preparing to compress the note...");

    // Ensure the note is valid before proceeding
    console.log(note);

    if (!note) {
      console.error("[Frontend] Invalid note data.");
      return;
    }

    // Compress the note using the Web Worker
    const compressedNote = await compressNoteInWorker(note);
    console.log("[Frontend] Note compressed successfully.", compressedNote);

    const newNote = {
      id: note.id,
      note: compressedNote,
      createdAt: new Date(),
      updatedAt: null,
    };

    await db.transaction("rw", db.notes, async () => {
      await db.notes.add(newNote);
    });

    DoneMode_Loader_Element.value.forEach((card) =>
      card.classList.remove("Upload_Loader_active")
    );
    Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination.value.push(
      note.id
    );
    storage_capacity_checker();
  } catch (error) {
    console.error("[Frontend] Error in Post_And_Update_Notes:", error.message);
    // Optionally, display an error message to the user
    ShowErrors(error);
  }
}

async function Update_Note(note) {
  try {
    resetController();
    console.log("[Frontend] Preparing to compress the note...");

    // Ensure the note is valid before proceeding
    console.log(note);

    if (!note) {
      console.error("[Frontend] Invalid note data.");
      return;
    }

    // Compress the note using the Web Worker
    const compressedNote = await compressNoteInWorker(note);
    console.log("[Frontend] Note compressed successfully.", compressedNote);

    const updatedNote = {
      note: compressedNote,
      updatedAt: new Date(),
    };

    await db.transaction("rw", db.notes, async () => {
      await db.notes.update(note.id, updatedNote);
    });

    EditMode_Loader_Element.value.forEach((card) =>
      card.classList.remove("Upload_Loader_active")
    );
    storage_capacity_checker();
  } catch (error) {
    console.error("[Frontend] Error in Post_And_Update_Notes:", error.message);
    // Optionally, display an error message to the user
    ShowErrors(error);
  }
}

function compressNoteInWorker(note) {
  try {
    console.log("Sending note to worker ", note);

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("./components/compression.worker.js", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (event) => {
        if (event.data.error) {
          console.error(
            "[Frontend] Worker Compression Error:",
            event.data.error
          );
          reject(new Error(event.data.error));
        } else {
          console.log("Worker_finished Product ", event.data.compressedNote);

          resolve(event.data.compressedNote); // Compression successful
        }
        worker.terminate(); // Clean up worker after task completion
      };

      worker.onerror = (error) => {
        console.error("[Frontend] Error in Web Worker:", error.message);
        reject(new Error(error.message)); // Handle generic worker errors
      };

      // Send the note data to the worker for compression
      worker.postMessage({ noteString: JSON.stringify(note) });
    });
  } catch (error) {
    console.log(error.message);
  }
}

/* --------------------------- */
// Toggles camera options visibility
// Helper: Get a supported MIME type for the given recording type.
function getSupportedMimeType(type) {
  let mimeTypes = [];
  if (type === "audio") {
    mimeTypes = [
      "audio/webm; codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/wav",
    ];
  } else if (type === "video") {
    mimeTypes = [
      "video/webm; codecs=vp9",
      "video/webm; codecs=vp8",
      "video/webm",
      "video/mp4",
    ];
  }
  for (let mime of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return "";
}

function VideoRec() {
  if (recordVideoButton.value.textContent.trim() === "Video Rec") {
    Front_Back_Camera.value = !Front_Back_Camera.value;
    EditMode.value
      ? (Edit_Mode_Toggle_Video_Preview.value = false)
      : (Done_Mode_Toggle_Video_Preview.value = false);
  } else {
    stopRecording();
  }
}

// Camera option buttons
function FrontCamVideoRec() {
  startVideoRecording("user");
  Front_Back_Camera.value = !Front_Back_Camera.value;
}

function BackCamVideoRec() {
  startVideoRecording("environment");
  Front_Back_Camera.value = !Front_Back_Camera.value;
}

// Audio recording button
function AudioRec() {
  if (recordAudioButton.value.textContent.trim() === "Audio Rec") {
    Front_Back_Camera.value = false;
    EditMode.value
      ? (Edit_Mode_Toggle_Video_Preview.value = false)
      : (Done_Mode_Toggle_Video_Preview.value = false);
    startAudioRecording();
  } else {
    stopRecording();
  }
}

// Start video recording
async function startVideoRecording(facingMode) {
  if (currentStream) stopStream(currentStream);
  const constraints = {
    video: { facingMode },
    audio: true,
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoPreview.value.style.display = "block";
    AdjustCameraScreenSize();
    videoPreview.value.srcObject = currentStream;

    startMediaRecorder("video");
    recordVideoButton.value.textContent = "Stop Rec";
    recordAudioButton.value.disabled = true;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

// Start audio recording
async function startAudioRecording() {
  if (currentStream) stopStream(currentStream);

  const constraints = { audio: true };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    overlayElement.value.style.display = "flex";
    startMediaRecorder("audio");
    recordAudioButton.value.textContent = "Stop Rec";
    recordVideoButton.value.disabled = true;
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
}

// Start MediaRecorder with robust MIME type checking
function startMediaRecorder(type) {
  try {
    console.log(Max_Accumulated_Attachments_Size.value);

    if (
      Max_Accumulated_Attachments_Size.value > 0 &&
      Max_Accumulated_Attachments_Size.value <= 5242880
    ) {
      DisableDoneBtnElement.value.disabled = true;
      DisableDoneBtnElement.value.style.backgroundColor = "gray";

      // Get a supported MIME type based on the recording type.
      const supportedMime = getSupportedMimeType(type);
      if (!supportedMime) {
        console.error("No supported MIME type found for", type);
        NoInputError.value = `Recording failed: no supported MIME type for ${type}`;
        setTimeout(() => {
          NoInputError.value = "";
        }, 2000);
        return;
      }

      // Initialize MediaRecorder with the supported MIME type.
      mediaRecorder = new MediaRecorder(currentStream, {
        mimeType: supportedMime,
      });
      recordedChunks.value = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.value.push(event.data);
      };
      mediaRecorder.onstop = () => saveRecording(type);
      mediaRecorder.start();
      // Automatically stop recording after the time limit
      let timeLimit =
        type === "video"
          ? Media.value.Video_Stop_Duration
          : Media.value.Audio_Stop_Duration; // 20 sec for video, 5 min for audio
      console.log("--> recccc " + timeLimit);
      console.log("--> stateeee " + mediaRecorder.state);

      let timeOut = null;
      timeOut = setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          stopRecording(timeOut);
        }
      }, timeLimit);
    } else {
      NoInputError.value = `Failed, Clear Previous Attachments And Recordings!`;
      stopRecording();
      setTimeout(() => {
        NoInputError.value = "";
      }, 3000);
      return;
    }
    //////
  } catch (error) {
    console.log(error.message);
  }
}

// Stop recording
function stopRecording(timeOut) {
  try {
    clearTimeout(timeOut);
    if (mediaRecorder) mediaRecorder.stop();
    if (currentStream) stopStream(currentStream);
    recordVideoButton.value.textContent = "Video Rec";
    recordAudioButton.value.textContent = "Audio Rec";
    recordVideoButton.value.disabled = false;
    recordAudioButton.value.disabled = false;
    DisableDoneBtnElement.value.disabled = false;
    DisableDoneBtnElement.value.style.backgroundColor = "rgb(0, 123, 255)";
    overlayElement.value.style.display = "none";
  } catch (error) {
    console.log(error.message);
  }
}

// Stop stream tracks
function stopStream(stream) {
  try {
    stream.getTracks().forEach((track) => track.stop());
    currentStream = null;
    videoPreview.value.srcObject = null;
    videoPreview.value.style.display = "none";
  } catch (error) {
    console.log(error.message);
  }
}

// Save the recording
async function saveRecording(mediaType) {
  try {
    let AudioStorageRef = EditMode.value
      ? Edit_Mode_AudioStorage
      : AudioStorage;
    let VideoStorageRef = EditMode.value
      ? Edit_Mode_VideoStorage
      : VideoStorage;
    const MediaType =
      mediaType == "audio"
        ? "audio/webm; codecs=opus"
        : "video/webm; codecs=vp9";

    let blob = new Blob(recordedChunks.value, { type: MediaType });
    console.log("blob--> ", blob);

    // Convert the Blob to an ArrayBuffer for finalization
    const arrayBuffer = await blob.arrayBuffer();
    const finalizedBlob = new Blob([arrayBuffer], { type: MediaType });
    console.log("final blob--> ", finalizedBlob);

    const url = URL.createObjectURL(finalizedBlob);
    console.log("url: ", url);

    let base64 = await blobToBase64(finalizedBlob);
    console.log("base64--> ", base64);

    Start_Video_Audio_Preview(finalizedBlob, url);

    if (finalizedBlob.type.includes("audio")) {
      AudioStorageRef.value.push({
        name: `AudioRec_${++i}_Attached`,
        Data: base64,
        Size: finalizedBlob.size,
        timestamp: Date.now(),
      });
      CurrentlyWritingMessage.value += `\nAudioRec_${i}_Attached`;
      console.log("Audio recording saved.");
    } else if (finalizedBlob.type.includes("video")) {
      VideoStorageRef.value.push({
        name: `VideoRec_${++j}_Attached`,
        Data: base64,
        Size: finalizedBlob.size,
        timestamp: Date.now(),
      });
      CurrentlyWritingMessage.value += `\nVideoRec_${j}_Attached`;
      console.log("Video recording saved.");
    } else {
      console.error("Unknown media type:", finalizedBlob.type);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function blobToBase64(blob) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // reader.result is a data URL
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.log(error.message);
  }
}

function Start_Video_Audio_Preview(blob, url) {
  try {
    Max_Accumulated_Attachments_Size.value -= blob.size;

    if (EditMode.value) {
      Edit_Mode_Toggle_Video_Preview.value = true;
      setTimeout(() => {
        blob.type.includes("audio")
          ? Edit_Mode_Video_Preview_Element.value.parentElement.classList.add(
              "Video_To_Audio_Preview_Container_Reshape"
            )
          : Edit_Mode_Video_Preview_Element.value.previousSibling.classList.remove(
              "Video_To_Audio_Preview_Container_Reshape"
            );
        blob.type.includes("audio")
          ? Edit_Mode_Video_Preview_Element.value.previousSibling.classList.add(
              "Close_Video_Preview_To_Audio_Btn"
            )
          : Edit_Mode_Video_Preview_Element.value.previousSibling.classList.remove(
              "Close_Video_Preview_To_Audio_Btn"
            );
        Edit_Mode_Video_Preview_Element.value.parentElement.style.bottom =
          "24vmin";
        Edit_Mode_Video_Preview_Element.value.src = url;
      }, 5);
    } else {
      Done_Mode_Toggle_Video_Preview.value = true;
      setTimeout(() => {
        blob.type.includes("audio")
          ? Done_Mode_Video_Preview_Element.value.parentElement.classList.add(
              "Video_To_Audio_Preview_Container_Reshape"
            )
          : Done_Mode_Video_Preview_Element.value.previousSibling.classList.remove(
              "Video_To_Audio_Preview_Container_Reshape"
            );
        blob.type.includes("audio")
          ? Done_Mode_Video_Preview_Element.value.previousSibling.classList.add(
              "Close_Video_Preview_To_Audio_Btn"
            )
          : Done_Mode_Video_Preview_Element.value.previousSibling.classList.remove(
              "Close_Video_Preview_To_Audio_Btn"
            );
         window.innerWidth <= 500 ? Done_Mode_Video_Preview_Element.value.parentElement.style.bottom = "33vmin" : Done_Mode_Video_Preview_Element.value.parentElement.style.bottom = "31vmin";
        Done_Mode_Video_Preview_Element.value.src = url;
      }, 5);
    }
  } catch (error) {
    console.log(error.message);
  }
}

/* --------------------------- */

function Cleaning(name) {
  try {
    let pattern = new RegExp(name, "g");
    return CurrentlyWritingMessage.value.replace(pattern, "");
  } catch (error) {
    console.log(error.message);
  }
}

function DeleteAudioMedia(index, EM) {
  try {
    let name;
    if (EM) {
      name = Edit_Mode_AudioStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value +=
        Edit_Mode_AudioStorage.value[index]?.Size;
      data.value[CurrentIndex.value].Attachment_Used_Size +=
        Edit_Mode_AudioStorage.value[index]?.Size;
      Edit_Mode_AudioStorage.value.splice(index, 1);
    } else {
      name = AudioStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value += AudioStorage.value[index]?.Size;
      AudioStorage.value.splice(index, 1);
    }
    if (name) {
      CurrentlyWritingMessage.value = Cleaning(name);
    } else {
      throw new Error(`Audio at index ${index} not found.`);
    }
  } catch (error) {
    console.log(`DeleteAudioMedia error: ${error.message}`);
  }
}

function DeleteVideoMedia(index, EM) {
  try {
    let name;
    if (EM) {
      name = Edit_Mode_VideoStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value +=
        Edit_Mode_VideoStorage.value[index]?.Size;
      console.log("Size--> ", Edit_Mode_VideoStorage.value[index]?.Size);

      data.value[CurrentIndex.value].Attachment_Used_Size +=
        Edit_Mode_VideoStorage.value[index]?.Size;
      console.log("Size--> ", Edit_Mode_VideoStorage.value[index]?.Size);
      Edit_Mode_VideoStorage.value.splice(index, 1);
    } else {
      name = VideoStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value += VideoStorage.value[index]?.Size;
      console.log(VideoStorage.value[index]?.Size);
      VideoStorage.value.splice(index, 1);
    }
    if (name) {
      CurrentlyWritingMessage.value = Cleaning(name);
    } else {
      throw new Error(`Video at index ${index} not found.`);
    }
  } catch (error) {
    console.log(`DeleteVideoMedia error: ${error.message}`);
  }
}

function DeleteImageMedia(index, EM) {
  try {
    let name;
    if (EM) {
      name = Edit_Mode_images.value[index]?.name;
      Max_Accumulated_Attachments_Size.value +=
        Edit_Mode_images.value[index]?.Size;
      data.value[CurrentIndex.value].Attachment_Used_Size +=
        Edit_Mode_images.value[index]?.Size;
      Edit_Mode_images.value.splice(index, 1);
    } else {
      name = images.value[index]?.name;
      Max_Accumulated_Attachments_Size.value += images.value[index]?.Size;
      images.value.splice(index, 1);
    }
    if (name) {
      CurrentlyWritingMessage.value = Cleaning(name);
    } else {
      throw new Error(`Image at index ${index} not found.`);
    }
  } catch (error) {
    console.log(`DeleteImageMedia error: ${error.message}`);
  }
}

function DeleteDocumentMedia(index, EM) {
  try {
    let name;
    if (EM) {
      name = Edit_Mode_DocumentStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value +=
        Edit_Mode_DocumentStorage.value[index]?.Size;
      data.value[CurrentIndex.value].Attachment_Used_Size +=
        Edit_Mode_DocumentStorage.value[index]?.Size;
      Edit_Mode_DocumentStorage.value.splice(index, 1);
    } else {
      name = DocumentStorage.value[index]?.name;
      Max_Accumulated_Attachments_Size.value +=
        DocumentStorage.value[index]?.Size;
      DocumentStorage.value.splice(index, 1);
    }
    if (name) {
      CurrentlyWritingMessage.value = Cleaning(name);
    } else {
      throw new Error(`Document at index ${index} not found.`);
    }
  } catch (error) {
    console.log(`DeleteDocumentMedia error: ${error.message}`);
  }
}

function manageMedia(file) {
  try {
    const selectedFile = file.target.files[0];
    if (!selectedFile) return; // Exit if no file was selected

    // Check if file size exceeds allowed maximum
    if (selectedFile.size >= Max_Accumulated_Attachments_Size.value) {
      NoInputError.value =
        Max_Accumulated_Attachments_Size.value >= 5242880
          ? "Max Supported Size is 5MB!"
          : `${
              (Max_Accumulated_Attachments_Size.value / 1024 / 1024).toFixed(
                1
              ) > 0
                ? (
                    Max_Accumulated_Attachments_Size.value /
                    1024 /
                    1024
                  ).toFixed(1)
                : 0
            }MB Attachment Capacity Left!`;
      setTimeout(() => {
        NoInputError.value = "";
      }, 2000);
      file.target.value = ""; // Reset file input
      return;
    }

    // Check if the file type is supported
    if (!SupportedMedia.value.includes(selectedFile.type)) {
      NoInputError.value = "File Not Supported!";
      setTimeout(() => {
        NoInputError.value = "";
      }, 1500);
      file.target.value = ""; // Reset file input
      return;
    }

    // Determine which storage to use and the file category (text, image, video, audio, document)
    let storage = null;
    let storageType = "";

    if (SupportedText.value.includes(selectedFile.type)) {
      storageType = "text";
    } else if (selectedFile.type.startsWith("image/")) {
      storage = EditMode.value ? Edit_Mode_images : images;
      storageType = "image";
    } else if (selectedFile.type.startsWith("video/")) {
      storage = EditMode.value ? Edit_Mode_VideoStorage : VideoStorage;
      storageType = "video";
    } else if (SupportedAudios.value.includes(selectedFile.type)) {
      storage = EditMode.value ? Edit_Mode_AudioStorage : AudioStorage;
      storageType = "audio";
    } else if (
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(selectedFile.type)
    ) {
      storage = EditMode.value ? Edit_Mode_DocumentStorage : DocumentStorage;
      storageType = "document";
    }

    // If the file belongs to one of the storages, check for duplicates (same name & size)
    if (storage) {
      const alreadyAdded = storage.value.some(
        (item) =>
          item.name === selectedFile.name && item.Size === selectedFile.size
      );
      if (alreadyAdded) {
        console.log("File already added, skipping duplicate");
        file.target.value = ""; // Reset file input
        return;
      }
    }

    // Create a FileReader to read the file
    const rawfile = new FileReader();

    // Use different reading methods based on file type
    if (SupportedText.value.includes(selectedFile.type)) {
      rawfile.readAsText(selectedFile);
    } else {
      rawfile.readAsDataURL(selectedFile);
    }

    rawfile.onloadend = () => {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name;
      const fileSize = selectedFile.size;
      const fileData = rawfile.result;

      // If it's a text file, append its content to the writing message
      if (storageType === "text") {
        CurrentlyWritingMessage.value += fileData;
      }

      // For each supported type, push an object with file details into the proper storage
      if (storageType === "image") {
        storage.value.push({
          name: fileName,
          Data: fileData,
          Type: fileType,
          Size: fileSize,
        });
        CurrentlyWritingMessage.value += `\n${fileName}`;
      } else if (storageType === "video") {
        storage.value.push({
          name: fileName,
          Data: fileData,
          Type: fileType,
          Size: fileSize,
        });
        CurrentlyWritingMessage.value += `\n${fileName}`;
      } else if (storageType === "audio") {
        storage.value.push({
          name: fileName,
          Data: fileData,
          Type: fileType,
          Size: fileSize,
        });
        CurrentlyWritingMessage.value += `\n${fileName}`;
      } else if (storageType === "document") {
        storage.value.push({
          name: fileName,
          Data: fileData,
          Type: fileType,
          Size: fileSize,
        });
        CurrentlyWritingMessage.value += `\n${fileName}`;
      }

      // Deduct the size of the added file from the max attachments size
      Max_Accumulated_Attachments_Size.value -= fileSize;

      // Reset the file input to allow reselecting the same file in the future
      file.target.value = "";
    };
  } catch (error) {
    console.log(error.message);
  }
}

function showInput() {
  try {
    SearchBtnSound.play();
    searchinput.value = !searchinput.value;
    if (searchinput.value) {
      setTimeout(() => {
        document.querySelector(".searchinput").classList.add("showinput");
      }, 50);
    } else {
      document.querySelector(".searchinput").classList.remove("showinput");
    }
  } catch (error) {
    console.log(error.message);
  }
}

function generateRandomColor() {
  try {
    let letters = "0123456789ABCDEF";
    let minBrightness = 0; // Minimum brightness value (0-255) for RGB components
    let maxBrightness = 200; // Maximum brightness value (0-255) for RGB components
    let opacity = 0.6; // Opacity value (0-1)
    let color = "rgba(";
    for (let i = 0; i < 3; i++) {
      const component =
        Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) +
        minBrightness;
      color += component.toString() + ",";
    }
    color += opacity + ")";
    return color;
  } catch (error) {
    console.log(error.message);
  }
}

// ..... Generate same but deep color for card title this CardTitleColor also give color to card itself .......
function AddNoteBtn() {
  try {
    searchinput.value = false;
    inputData.value = "";
    document.querySelector(".model_h3").textContent = "Write Your Note Here!";
    AddBtnAudio.play();
    EditMode.value = false;
    isAddBtnPressed.value = true;
    document.querySelector(".dialog").appendChild(RemoveCloseBtnElement.value);
  } catch (error) {
    console.log(error.message);
  }
}

function RO_ViewNotePage(index) {
  try {
    ViewBtnSound.play();
    document.querySelector(".dialog").style.display = "none";
    updateRefreshKey();
    SendNoteForView.value = data.value[index].userWrote;
    SendImageForView.value = data.value[index].ImageFile;
    SendAudioForView.value = data.value[index].AudioFiles;
    SendVideoForView.value = data.value[index].VideoFiles;
    SendDocumentForView.value = data.value[index].DocumentFiles;
    isAddBtnPressed.value = true;
    IsRoViewNoteOpen.value = true;
    searchinput.value = false;
    inputData.value = "";
  } catch (error) {
    console.log(error.message);
  }
}

function EditBtn(index) {
  try {
    EditBtnSound.play();
    document.querySelector(".model_h3").textContent = "Edit Your Note Here!";
    searchinput.value = false;
    inputData.value = "";
    EditMode.value = true;
    isAddBtnPressed.value = true;
    RemoveCloseBtnElement.value.remove();
    /////
    Save_The_Create_Notes_Max_Accu_Attachment_Capacity_While_Switching_To_Edit_Note.value =
      Max_Accumulated_Attachments_Size.value;
    if (
      CurrentlyWritingMessage.value !== "" ||
      CurrentlyWritingMessage.value !== ""
    ) {
      temp_for_save_Create_Note_Text_if_available_parallelly.value[0] =
        CurrentlyWritingTitle.value;
      temp_for_save_Create_Note_Text_if_available_parallelly.value[1] =
        CurrentlyWritingMessage.value;
    }
    Max_Accumulated_Attachments_Size.value =
      data.value[index].Attachment_Used_Size;

    console.log("testing--> MAX ", Max_Accumulated_Attachments_Size.value);
    console.log(
      "testing--> Used Size ",
      data.value[index].Attachment_Used_Size
    );
    /////
    CurrentlyWritingMessage.value = data.value[index].userWrote;
    CurrentlyWritingTitle.value = data.value[index].title;
    CurrentIndex.value = index;
    /* Useful for edit mode like send all note data to array se delete buttons can acees it then modify & send it back to note*/
    if (EditMode.value) {
      ////////////
      data.value[CurrentIndex.value].ImageFile.forEach((element) => {
        Edit_Mode_images.value.push(element);
      });
      data.value[CurrentIndex.value].ImageFile.splice(
        0,
        data.value[CurrentIndex.value].ImageFile.length
      );
      ////////////
      data.value[CurrentIndex.value].AudioFiles.forEach((element) => {
        Edit_Mode_AudioStorage.value.push(element);
      });
      data.value[CurrentIndex.value].AudioFiles.splice(
        0,
        data.value[CurrentIndex.value].AudioFiles.length
      );
      ///////////
      data.value[CurrentIndex.value].VideoFiles.forEach((element) => {
        Edit_Mode_VideoStorage.value.push(element);
      });
      data.value[CurrentIndex.value].VideoFiles.splice(
        0,
        data.value[CurrentIndex.value].VideoFiles.length
      );
      ///////////
      data.value[CurrentIndex.value].DocumentFiles.forEach((element) => {
        Edit_Mode_DocumentStorage.value.push(element);
      });
      data.value[CurrentIndex.value].DocumentFiles.splice(
        0,
        data.value[CurrentIndex.value].DocumentFiles.length
      );
      /////////
    }
  } catch (error) {
    console.log(error.message);
  }
}

function DeleteCard(index) {
  try {
    DelBtnSound.play();
    data.value[index].isCardGoingDeleted = true;
    ///
    Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination.value =
      Newly_Created_Notes_Id_For_Backend_To_Avoid_Send_Them_During_pagination.value.filter(
        (item) => item !== data.value[index].id
      );
    ///
    setTimeout(() => {
      DeleteNote(data.value[index].id);
      data.value.splice(index, 1);
    }, 300);
  } catch (error) {
    console.log(error.message);
  }
}

function CloseBtn() {
  try {
    CloseBtnSound.play();
    IsRoViewNoteOpen.value = false;
    isAddBtnPressed.value = false;
    document.querySelector(".dialog").style.display = "flex";
    if (media.value) {
      media.value.forEach((x) => {
        if (!x.paused) {
          x.pause();
          x.currentTime = 0;
        }
      });
    }
    stopRecording();
  } catch (error) {
    console.log(error.message);
  }
}

// ........................ This Big function for save data when save or done buton pressed ..........................
function DoneBtn() {
  try {
    // ......................... function for save data when in editing mode ..............................
    if (EditMode.value) {
      Edit_Mode_Done_Btn();
    }
    // .................. function for save data when in new card creating mode ............................
    else {
      Create_Note_Done_Btn();
    }
  } catch (error) {
    console.log(error.message);
  }
}

function Edit_Mode_Done_Btn() {
  try {
    SaveBtnSound.play();
    data.value[CurrentIndex.value].userWrote = CurrentlyWritingMessage.value;
    data.value[CurrentIndex.value].title = CurrentlyWritingTitle.value;
    ////
    let currentDate = new Date();
    let formattedDate = currentDate.toLocaleDateString();
    data.value[CurrentIndex.value].NotesDate = formattedDate;
    ////;
    Edit_Mode_Toggle_Video_Preview.value = false;
    //////////
    let cards = document.querySelectorAll(".cards");
    let EditCard =
      cards[CurrentIndex.value].getElementsByClassName("Upload_Loader")[0];
    EditCard.classList.add("Upload_Loader_active");
    EditMode_Loader_Element.value.push(EditCard);
    ////////////
    Working_Along_Side_With_Done_Btn();
    isAddBtnPressed.value = false;
    CurrentlyWritingTitle.value =
      temp_for_save_Create_Note_Text_if_available_parallelly.value[0];
    CurrentlyWritingMessage.value =
      temp_for_save_Create_Note_Text_if_available_parallelly.value[1];

    data.value[CurrentIndex.value].Attachment_Used_Size =
      Max_Accumulated_Attachments_Size.value;

    Max_Accumulated_Attachments_Size.value =
      Save_The_Create_Notes_Max_Accu_Attachment_Capacity_While_Switching_To_Edit_Note.value;
    //Overwriting local storage with new data.
    setTimeout(async () => {
      await Update_Note(data.value[CurrentIndex.value]);
    }, 10);
    /* Pressing Add Note button will automatciall set EditMode to false when pressed until edit mode is oned */
  } catch (error) {
    console.log(error.message);
  }
}

function Create_Note_Done_Btn() {
  try {
    if (
      CurrentlyWritingMessage.value.trim() !== "" &&
      CurrentlyWritingTitle.value.trim() !== ""
    ) {
      SaveBtnSound.play();

      let currentDate = new Date();
      let formattedDate = currentDate.toLocaleDateString();
      let gettingColor = generateRandomColor();
      let result = gettingColor.slice(0, -4) + "1.0)";
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
        VideoFiles: [],
        DocumentFiles: [],
        Attachment_Used_Size: Max_Accumulated_Attachments_Size.value,
        TimeStamp: new Date().toISOString(),
      };
      Working_Along_Side_With_Done_Btn();

      //.............................................Here Pushing object To Array ................................
      CurrentlyWritingMessage.value = "";
      CurrentlyWritingTitle.value = "";
      Done_Mode_Toggle_Video_Preview.value = false;
      isAddBtnPressed.value = false;
      Max_Accumulated_Attachments_Size.value = 5 * 1024 * 1024;
      ///
      setTimeout(() => {
        let cards = document.querySelectorAll(".cards");
        let Done_Card =
          cards[data.value.length - 1].getElementsByClassName(
            "Upload_Loader"
          )[0];
        Done_Card.classList.add("Upload_Loader_active");
        DoneMode_Loader_Element.value.push(Done_Card);
      }, 15);
      ///
      setTimeout(async () => {
        await Post_Note(userinputdata);
      }, 30);
      //Overwriting local storage with new data.
    }
    //..............................Error If It Found Inputs Fields Are Empty .....................................
    else {
      NoInputError.value = "Please Fill Both Boxes.";
      setTimeout(() => {
        NoInputError.value = "";
      }, 2500);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function Working_Along_Side_With_Done_Btn() {
  try {
    const updateAndClearStorage = (source, target) => {
      source.forEach((item) => {
        console.log("Loop items ", item);
        target.push(item);
      });
      source.splice(0, source.length); // Clear the source after transfer
      console.log("Cleaning Arrays ", source);
    };

    if (EditMode.value) {
      console.log("Editmode Enter in Done Helper");

      // Edit Mode: Update existing note
      updateAndClearStorage(
        Edit_Mode_images.value,
        data.value[CurrentIndex.value].ImageFile
      );
      updateAndClearStorage(
        Edit_Mode_AudioStorage.value,
        data.value[CurrentIndex.value].AudioFiles
      );
      updateAndClearStorage(
        Edit_Mode_VideoStorage.value,
        data.value[CurrentIndex.value].VideoFiles
      );
      updateAndClearStorage(
        Edit_Mode_DocumentStorage.value,
        data.value[CurrentIndex.value].DocumentFiles
      );
    } else {
      console.log("Note Create Mode Enter in Done Helper");
      // Create Mode: Add new note
      updateAndClearStorage(images.value, userinputdata.ImageFile);
      updateAndClearStorage(AudioStorage.value, userinputdata.AudioFiles);
      updateAndClearStorage(VideoStorage.value, userinputdata.VideoFiles);
      updateAndClearStorage(DocumentStorage.value, userinputdata.DocumentFiles);

      data.value.push(userinputdata); // Add the new note to the main list
    }

    console.log("Operation successful:", data.value);
  } catch (error) {
    console.error(
      "An error occurred in Working_Along_Side_With_Done_Btn:",
      error.message
    );
  }
}

//.................................. A Function To Move Cursor, Enter to Save ...........................................
onMounted(() => {
  try {
    document
      .getElementsByClassName("dialog")[0]
      .addEventListener("keyup", (event) => {
        if (event.key === "Escape") {
          CloseBtn();
        }
      });

    document
      .getElementsByClassName("notepage")[0]
      .addEventListener("keyup", (event) => {
        if (event.key === "Escape") {
          CloseBtn();
        }
      });

    document.querySelector(".title").addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        document.querySelector(".model_note").focus(); // Shift focus to the note input box
      } else if (event.key == "Enter" && event.shiftKey) {
        DoneBtn();
      }
    });

    document.querySelector(".model_note").addEventListener("keyup", (event) => {
      if (event.key == "Enter" && event.shiftKey) {
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
      }, 350);
  } catch (error) {
    console.log(error.message);
  }
});

watch(searchinput, (newval) => {
  try {
    if (newval && document.querySelector(".searchinput"))
      setTimeout(() => {
        document.querySelector(".searchinput").focus();
      }, 200);
  } catch (error) {
    console.log(error.message);
  }
});

function SearchBtnLogic() {
  try {
    // Search input event listener
    document.querySelector(".searchinput").addEventListener("keyup", (e) => {
      let data = inputData.value.toLowerCase();
      let notesFound = false; // Flag to check if any notes match
      const noNotesMessage = document.querySelector(".no_notes_message"); // "No Notes Found" message element

      document.querySelectorAll(".cards").forEach((card) => {
        let title = card
          .querySelector(".Card_Title")
          .textContent.toLowerCase()
          .trim();
        let description = card
          .querySelector(".Card_Para")
          .textContent.toLowerCase()
          .trim();
        let datetime = card
          .querySelector(".extra h4")
          .textContent.toLowerCase()
          .trim();

        if (
          title.includes(data) ||
          description.includes(data) ||
          datetime.includes(data) ||
          inputData.value === ""
        ) {
          card.style.display = "flex";
          setTimeout(() => {
            card.classList.remove("searchItemSmoothlyHide");
          }, 100);
          notesFound = true; // At least one note matches
        } else {
          card.classList.add("searchItemSmoothlyHide");
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
        // Clear search input if 'Delete' key is pressed
        if (e.key === "Delete") {
          inputData.value = "";
        }
      });
      // Toggle "No Notes Found" message
      if (!notesFound) {
        noNotesMessage.style.display = "block";
      } else {
        noNotesMessage.style.display = "none";
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

function AdjustCameraScreenSize() {
  try {
    videoPreview.value.style.width = TextAreaElement.value.offsetWidth + "px"; // Append "px"
    videoPreview.value.style.height = TextAreaElement.value.offsetHeight + "px"; // Append "px"
    console.log(
      videoPreview.value.offsetWidth,
      "\n",
      TextAreaElement.value.offsetHeight
    );
  } catch (error) {
    console.log(error.message);
  }
}

function handleKeyDown(event) {
  try {
    if (View_Note_Page_UI.value) {
      if (event.key === "ArrowDown") {
        View_Note_Page_UI.value.scrollTop += 50; // Adjust the scroll amount as needed
      } else if (event.key === "ArrowUp") {
        View_Note_Page_UI.value.scrollTop -= 50; // Adjust the scroll amount as needed
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("DOMContentLoaded", SearchBtnLogic);
  window.removeEventListener("resize", AdjustCameraScreenSize);
});

document.addEventListener("DOMContentLoaded", SearchBtnLogic);
window.addEventListener("resize", AdjustCameraScreenSize);

// User Data.
let data = ref([]);
</script>