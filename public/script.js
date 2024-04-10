

var loader = document.getElementById("lds-ellipsis");
// loader.style.display = "none"
function submitMe() {
    // form.submit();
    // console.log(form)
    loader.style.display = "inline-block"
    var prompting1 = document.getElementById("prompt1").value
    var prompting2 = document.getElementById("prompt2").value
    console.log(prompting1,prompting2)
    if(prompting1 !== "" && prompting2 !== ""){
        sendData(prompting1,prompting2)
    }

};


async function sendData(prompt1, prompt2) {
    
    const promptdata = { 
        "p1" : prompt1,
        "p2" : prompt2
     };
     
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptdata)
    };

    fetch('/api', options).then(response => {
        console.log(response)
        return response.text();
    })
     .then(data => {
         // console.log(data)
         const obj = JSON.parse(data)
         loader.style.display = "none"
         if(obj !== ""){
            console.log(obj.imagelink)
            let c_data = obj.imagelink.replace(/"/g, '');
            var aimg = document.getElementById("addimage");
            aimg.src = c_data
            document.getElementById('imagepush').appendChild(aimg);

            let cap_data = obj.caption.replace(/"/g, '');
            var acap = document.getElementById("addtext");
            acap.innerHTML = cap_data
            document.getElementById('imagepush').appendChild(acap);
        }
        // else {
        //     const t = document.createElement('p')
        //     t.innerHTML('loading...')
        // }
       
    //     //   return data;
    })
    .catch(ex => {
        console.error(ex);
    })

}


// sendData(prompting1,prompting2)

const audio = new Audio("/assets/audios/geminids for mother machines gb.mp3");

const btn = document.getElementById('playb')
btn.addEventListener("click", (event) => {
    /* the audio is now playable; play it if permissions allow */
    console.log("plays")
    audio.paused ? btn.innerHTML = "🔊" : btn.innerHTML = "🔇"
    return audio.paused ? audio.play() : audio.pause();

  });
  

