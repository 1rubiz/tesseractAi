
function stopCamera() {
    // Get the video element
    const video = document.querySelector('#video');
  
    // Get the MediaStream object from the video element
    const mediaStream = video.srcObject;
  
    // If the MediaStream object is not null, stop the video feed
    if (mediaStream !== null) {
      // Stop the MediaStream tracks
      mediaStream.getTracks().forEach(track => track.stop());
  
      // Set the video element's source to null to stop the video feed
      video.srcObject = null;
    }
  }


  document.querySelector('#single').addEventListener('click', ()=>{
    document.querySelector("#dummy").style.display="none";
    document.querySelector("#single-input").style.display="block";
    document.querySelector("#file-input").style.display="none";
    document.querySelector('#single').style.color="green";
    document.querySelector('#multi_file').style.color="black";
})

document.querySelector('#multi_file').addEventListener('click', ()=>{
    document.querySelector("#dummy").style.display="none";
    document.querySelector("#single-input").style.display="none";
    document.querySelector("#file-input").style.display="block";
    document.querySelector('#multi_file').style.color="green";
    document.querySelector('#single').style.color="black";
})

// document.querySelector("#output").addEventListener('change',()=>{
//     const summarize_btn = document.querySelector('#summarize-btn');
//     if(summarize_btn.disabled === true){
//         summarize_btn.disabled = true;
//     }
// })

  document.querySelector('#close').addEventListener('click', ()=>{
    document.querySelector('#camScan').style.display="none";
    document.querySelector('#blurrer').style.display="none";
    stopCamera();
})
  
const cambtn = document.querySelector('#cam-btn');
const camScan = document.querySelector('#camScan');
const createScan = ()=>{
    if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
            // Create a video element
           const video = document.createElement('video');

          // Set video attributes
           video.setAttribute('autoplay', true);
           video.setAttribute('playsinline', true);
           video.setAttribute('muted', true);
           video.id ="video";

       // Append video element to div with id "camscan"
       const camscanDiv = document.getElementById('camScan');
       camscanDiv.appendChild(video);

       // Get the user's media stream
       navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
       // Set the video element's srcObject to the media stream
       video.srcObject = stream;
       })
     .catch(error => {
       console.error('Error accessing media devices.', error);
     });
    }
}

cambtn.addEventListener('click',async ()=>{
    camScan.style.display="block";
    document.querySelector('#blurrer').style.display="block";
    createScan();
    const video = document.querySelector('#video');
      const canvas = document.querySelector('#canvas');
      canvas.style.display= "block";
    //   canvas.id = "canva";
      const captureButton = document.querySelector('#capture');

      // Capture image when button is clicked
      captureButton.addEventListener('click', () => {
        // Draw current video frame onto canvas
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        // Get data URL of canvas image
        const dataURL = canvas.toDataURL();
        document.getElementById('camScan').removeChild(video);
        stopCamera();
        // Perform OCR on image using Tesseract.js
        Tesseract.recognize(dataURL, 'eng')
                    .then(({ data: { text } }) => {
                        console.log(text);
                        // append the recognized text to the output element for each image
                        document.getElementById('output').innerHTML = text;
                        document.getElementById('loader').style.display = "none";
                        canvas.style.display= "none";
                        document.querySelector('#blurrer').style.display="none";
                        stream.getTracks().forEach(track => track.stop());    
                    })
                    .catch((error) => {
                        console.error(error);
                        document.getElementById('loader').style.display = "none";
                    });
      });

})






const camBtn = document.querySelector('#camButton');

// add event listener to camBtn
// camBtn.addEventListener('click', ()=>{
//     // check if device has a camera
//     if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
//         // prompt user to select a camera for use
//         navigator.mediaDevices.getUserMedia({video:true})
//         .then((stream)=>{
//             // create a video lement to display stream
//             const video = document.createElement('video');
//             video.setAttribute('autoplay','');
//             video.setAttribute('muted','');
//             video.srcObject= stream;
//             document.body.appendChild(video);

//             // create a canvas to capture camera image
//             const canvas = document.createElement('canvas');
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
            

//             // create button to capture image and stop camera feed
//             const captureBtn = document.createElement('button');
//             captureBtn.textContent = 'Capture';
//             captureBtn.addEventListener('click', ()=>{
//                 // draw the camera image onto the canvas
//                 const context = canvas.getContext('2d');
//                 context.drawImage(video, 0, 0, canvas.width, canvas.height);

//                 // stop the feed
//                 stream.getTracks().forEach(track => track.stop());

//                 // remove the video and capture button elements
//                 document.body.removeChild(video);
//                 document.body.removeChild(captureBtn);

//                 // get image data
//                 // let img = new Image();
//                 const img = canvas.toDataURL();
//                 // const myImg = new Image();
//                 // myImg.src = img;
//                 // document.body.appendChild(myImg);
//                 document.getElementById('loader').style.display = "block";
//             });
//             document.body.appendChild(captureBtn);
//         })
//         .catch((err)=> console.log('error assessing camera: ',err));
//     } else{
//         console.log('camera not available')
//     }
// });

document.querySelector('#single-input').addEventListener('change',async (e)=>{
    const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
          reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    document.getElementById('loader').style.display = "block";
                    Tesseract.recognize(img, 'eng')
                        .then(({ data: { text } }) => {
                            console.log(text);
                            document.getElementById('output').innerHTML = text; // display the final recognized text in the div element
                            document.getElementById('loader').style.display = "none";
                        })
                        .catch((error) => {
                            console.error(error);
                            document.getElementById('loader').style.display = "none";
                        });
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
})

document.getElementById('file-input').addEventListener('change', async function(e) {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                document.getElementById('loader').style.display = "block";
                Tesseract.recognize(img, 'eng')
                    .then(({ data: { text } }) => {
                        console.log(text);
                        // append the recognized text to the output element for each image
                        document.getElementById('output').innerHTML += `<p>Image ${i+1}:</p><p>${text}</p>`;
                        // display the image in a new div element before the extracted text
                        const imageContainer = document.getElementById('image-container');
                        const imageElement = document.createElement('img');
                        imageElement.src = img.src;
                        imageElement.style.width = "100px";
                        imageContainer.appendChild(imageElement);
                        document.getElementById('loader').style.display = "none";
                    })
                    .catch((error) => {
                        console.error(error);
                        document.getElementById('loader').style.display = "none";
                    });
            }
            if (file.type.includes('pdf')) {
                // handle PDF file
                const loadingTask = pdfjsLib.getDocument(e.target.result);
                loadingTask.promise.then(function(pdf) {
                    const maxPages = pdf.numPages;
                    for (let j = 1; j <= maxPages; j++) {
                        pdf.getPage(j).then(function(page) {
                            const scale = 1.5;
                            const viewport = page.getViewport({ scale: scale });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d', {willReadFrequently: true});
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            page.render(renderContext).promise.then(function() {
                                const imgSrc = canvas.toDataURL();
                                img.src = imgSrc;
                            });
                        });
                    }
                });
            } else {
                reader.readAsDataURL(file);
            }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('summarize-btn').addEventListener('click',async ()=>{
            const text = document.getElementById('output').value
            const prompt = document.getElementById('prompt').value;
            let data= {
                text: text,
                prompt: prompt
            }
           await postData("/aibot", data);
            // .then(()=>{
              const val =await returnData("/getdata");
              const vals = val.choices[0].text.trim();
            //   vals.forEach(items => {
                document.getElementById('response').innerHTML = vals;
            //   });
        });

    

        const postData = (url = "", data={})=>{
            try {
                fetch(url, {
                    method: "POST",
                credentials: "same-origin",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)})
        }
            catch(err){
                console.log("error found "+err)
            }
        }

        const returnData = async (url)=>{
            const data = await fetch(url);
            try{
                const res = await data.json();
                return(res);
            }catch(err){
                console.log(err)
            }
        }