console.log("Script is Working");

// All Globle Variables
let currentSong = new Audio();
let songs;
let currFolder;
// let e;

// function to convert MicroSeconds to Seconds
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainigSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainigSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// To Get All the songs as an array
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }



  // Show All the songs in PLaylist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="/img/music (1).svg" alt="" />
                <div class="info">
                  <div>   ${song.replaceAll("%20", " ")}</div>
                </div>
                <img class="invert" src="/img/play.svg" alt="">
                </div></li>`;
  }

  //   Attach an Event Listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
     return songs;
}

// function to play the music
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

// function to Display all Albums on Screen
async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];

      // Get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card ">

            <img class="round" src="/songs/${folder}/cover2.jpg" alt="">
            <h2 class="f-16 center">${response.title}</h2>
            </div>`;
          }
        }
        // To Show the Discription of Song Folder
  // <p>${response.description}</p>






  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching Songs");
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}


// Backend Await Task & Event Listeners
async function main() {
  // Getting the List of All Songs
  await getSongs("songs/backgroundmusic");
  playMusic(songs[0], true);

  //  Dispaly the all albums on screen
  await  displayAlbums();

  //    Attch a Event listener to Play , Next & Previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });


  //    Listene for TimeUpdate Event.
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //    Add an Event Listener for Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an Event Listener for Hamburger
  // Code to Open Hamburger.
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Code to Close Hamburger.
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-190%";
  });

  // Add an Event Listener for Previous Button
  previous.addEventListener("click", () => {
    console.log("Previous Clicked!");
    console.log(currentSong);

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 > 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an Event Listener for Next Button
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}

// Intigrated Main function Execution
main();


// 4:55:55