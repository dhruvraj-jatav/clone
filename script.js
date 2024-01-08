console.log('Let\'s write JS');

let currentSong = new Audio();
let songs;
let currFolder;

function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    const response = await fetch(`/${folder}/`);
    const htmlContent = await response.text();
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const anchors = div.querySelectorAll("a");
    songs = Array.from(anchors)
        .filter(element => element.href.endsWith(".mp3.preview"))
        .map(element => element.href.split(`/${folder}/`)[1].replace(".preview", ""));
    
    // Rest of your code for displaying songs in the playlist...
}

function playMusic(track, pause = false) {
    currentSong.src = `/${currFolder}/` + track;
    
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    const response = await fetch("songs/");
    const htmlContent = await response.text();
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const anchors = div.querySelectorAll("a");
    const cardContainer = document.querySelector(".cardContainer");

    Array.from(anchors).forEach(async element => {
        if (element.href.includes("../songs")) {
            const folder = element.href.split("/").slice(-2)[0];

            try {
                const metadataResponse = await fetch(`../songs/${folder}/info.json`);
                if (metadataResponse.ok) {
                    const metadata = await metadataResponse.json();
                    console.log(metadata);

                    cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <!-- Your card content here -->
                    </div>`;
                } else {
                    console.error(`Error fetching JSON for folder ${folder}: ${metadataResponse.statusText}`);
                }
            } catch (error) {
                console.error(`Error parsing JSON for folder ${folder}: ${error}`);
            }
        }
    });

    // Rest of your code for loading playlist on card click...
}

async function main() {
    await getSongs("../songs/Animal");
    playMusic(songs[0], true);
    displayAlbums();

    // Rest of your code...
}

main();
