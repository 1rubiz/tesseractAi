{/* <script src="https://cdn.jsdelivr.net/npm/jimp/browser/lib/jimp.min.js"></script> */}

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

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
    document.querySelector("#pdf-file-input").style.display="none";
    document.querySelector('#single').style.color="green";
    document.querySelector('#multi_file').style.color="black";
})

document.querySelector('#multi_file').addEventListener('click', ()=>{
    document.querySelector("#dummy").style.display="none";
    document.querySelector("#single-input").style.display="none";
    document.querySelector("#pdf-file-input").style.display="block";
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
    
    if(document.querySelector('#video')){
        stopCamera();
    }
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

       //const constraints = {
        //video: {
          //facingMode: "user"
        //}
      //};

       // Get the user's media stream
       navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
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
        document.querySelector('#singleImg').src = dataURL;
        document.querySelector('#blurrer').style.display="none";
        
        // document.getElementById('loader').style.display = "block";
        camScan.style.display="none";
        stopCamera();
        document.getElementById('camScan').removeChild(video);
        // Perform OCR on image using Tesseract.js
        // myCropper(dataURL);
        const crop = document.querySelector('#myCrop');
    crop.style.display = "block";
    crop.addEventListener('click',()=>{
        document.querySelector('#blurrer').style.display= "block";
        const img = document.getElementById('image');
        img.src = dataURL;
        document.querySelector('.display').style.display = "block";
        const cropper = new Cropper(img, {
        aspectRatio: 1,
        crop(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        });
        const button = document.getElementById('crop');
        button.addEventListener('click', async () => {
            document.querySelector('#myCrop').style.display = "none";
            document.querySelector('.display').style.display = "none";
            document.querySelector('#blurrer').style.display= "none";
            const canvas = cropper.getCroppedCanvas();
            const imgData = canvas.toDataURL('image/jpeg');
            let val = "image.jpg";
            jaid(imgData, val);
        });
        document.querySelector('#cancel').addEventListener('click',()=>{
            document.querySelector('.display').style.display = 'none';
            document.querySelector('#blurrer').style.display = 'none';
        })
    })
        // Tesseract.recognize(dataURL, 'eng')
        //             .then(({ data: { text } }) => {
        //                 console.log(text);
        //                 // append the recognized text to the output element for each image
        //                 document.getElementById('output').innerHTML = text;
        //                 document.getElementById('loader').style.display = "none";
        //                 canvas.style.display= "none";
        //                 document.querySelector('#blurrer').style.display="none";
        //                 if(document.querySelector('#video')){
        //                     let stream =document.querySelector('#video').srcObject;
        //                 stream.getTracks().forEach(track => track.stop()); 
        //                 }   
        //             })
        //             .catch((error) => {
        //                 console.error(error);
        //                 document.getElementById('loader').style.display = "none";
        //             });
      });

})


function jaid (imageUrl, val){
    Jimp.read(imageUrl, (err, image) => {
                if (err) throw err;
                    image.quality(100) // set the quality to 60%
                    // image.greyscale()
                    // image.gaussian(1)
                    // image.threshold({max:200})
                    image.getBase64(Jimp.MIME_JPEG, (err, src) => { // get the base64-encoded image data
                        if (err) throw err;
                       let img = document.querySelector('#singleImg');
                        img.src=src;
                        Tesseract.recognize(img, 'eng')
                        .then(({ data: { text } }) => {
                         console.log(text);
                           // append the recognized text to the output element for each image
                            document.getElementById('output').innerHTML = text;
                            document.getElementById('loader').style.display = "none";
                         })
                        .catch((error) => {
                           console.error(error);
                           document.getElementById('loader').style.display = "none";
                         });
                    });
    //                 let myimage = document.querySelector('#singleImg').src;
              });
}

async function myCropper(image, val){
    const crop = document.querySelector('#myCrop');
    crop.style.display = "block";
    crop.addEventListener('click',()=>{
        document.querySelector('#blurrer').style.display= "block";
        const img = document.getElementById('image');
        img.src = image.src;
        document.querySelector('.display').style.display = "block";
        const cropper = new Cropper(img, {
        aspectRatio: 1,
        crop(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        });
        const button = document.getElementById('crop');
        button.addEventListener('click', async () => {
            document.querySelector('#myCrop').style.display = "none";
            document.querySelector('.display').style.display = "none";
            document.querySelector('#blurrer').style.display= "none";
            const canvas = cropper.getCroppedCanvas();
            const imgData = canvas.toDataURL('image/jpeg');
            jaid(imgData, val);
        });
        document.querySelector('#cancel').addEventListener('click',()=>{
            document.querySelector('.display').style.display = 'none';
            document.querySelector('#blurrer').style.display = 'none';
        })
    })
}


document.querySelector('#single-input').addEventListener('change',async (e)=>{
    const file = e.target.files[0];
            if (!file) return;
            let imgElement = document.getElementById('singleImg');
            imgElement.src = URL.createObjectURL(e.target.files[0]);
            const reader = new FileReader();
          reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    document.querySelector('#extract_file').style.display = "block";
                    // document.getElementById('loader').style.display = "block";
                 myCropper(img, file.name);
                 document.querySelector('#extract_file').addEventListener('click',()=>{
                    // extract_text(file, file.name);
                    Tesseract.recognize(imgElement, 'eng')
                    .then(({ data: { text } }) => {
                       // append the recognized text to the output element for each image
                        document.getElementById('output').innerHTML += text;
                        document.getElementById('loader').style.display = "none";
                     })
                    .catch((error) => {
                       console.error(error);
                       document.getElementById('loader').style.display = "none";
                     });
                    document.querySelector('#extract_file').style.display = "none";
                 })
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        })

document.getElementById('pdf-file-input').addEventListener('change', async function(e) {
    const files = e.target.files;
    if (!files) return;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            if (file.type.includes('pdf')) {
                // handle PDF file
                const loadingTask = pdfjsLib.getDocument(e.target.result);
                loadingTask.promise.then(function(pdf) {
//                     console.log(pdf._pdfInfo.numPages);
                    const maxPages = pdf._pdfInfo.numPages;
                    for (let j = 1; j <= maxPages; j++) {
                        pdf.getPage(j).then(function(page) {
//                             console.log("at j", j);
                            if (j === 5){
                                return;
                            }
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
                                const imageContainer = document.getElementById('image-container');
                                       const imageElement = document.createElement('img');
                                       imageElement.src = img.src;
                                       imageElement.style.width = "100px";
                                       imageContainer.appendChild(imageElement);
                                       return imageElement
                            }).then((img)=>{
                          Tesseract.recognize(img, 'eng')
                       .then(({ data: { text } }) => {
                          // append the recognized text to the output element for each image
                           document.getElementById('output').innerHTML += text;
                           document.getElementById('loader').style.display = "none";
                        })
                       .catch((error) => {
                          console.error(error);
                          document.getElementById('loader').style.display = "none";
                        });
                            })
                        })
                        
                    }
                })
            } else {
                reader.readAsDataURL(file);
            }
        };
        reader.readAsDataURL(file);
    }
});

// let imageContainer = document.querySelector('#image-container');
// const pdfFileInput = document.querySelector('#pdf-file-input');
// const imgFileInput = document.querySelector('#single-input');
// let outputTextArea = document.querySelector('#output');
// const loader = document.querySelector('#loader');

// // Helper function to display loader
// function showLoader() {
//   loader.style.display = 'block';
// }

// // Helper function to hide loader
// function hideLoader() {
//   loader.style.display = 'none';
// }

// // Function to extract text from image using Tesseract.js
// async function extractImageText(imageUrl) {
//   showLoader();
//   console.log(`Extracting text from image: ${imageUrl}`);
//   const { data: { text } } = await Tesseract.recognize(imageUrl);
//   console.log(`Extracted text from image: ${text}`);
//   hideLoader();
//   return text;
// }

// // Function to extract text from PDF using pdf.js
// async function extractPdfText(pdfUrl) {
//   showLoader();
//   console.log(`Extracting text from PDF: ${pdfUrl}`);
//   const pdfDoc = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
//   const maxPages = pdfDoc.numPages;
//   let pageText = '';
//   for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
//     const pdfPage = await pdfDoc.getPage(pageNum);
//     const pageContent = await pdfPage.getTextContent();
//     const pageTextArr = pageContent.items.map(item => item.str);
//     const pageTextStr = pageTextArr.join(' ');
//     pageText += ` ${pageTextStr}`;
//   }
//   console.log(`Extracted text from PDF: ${pageText}`);
//   hideLoader();
//   return pageText;
// }

// // Function to handle image file input change
// async function handleImageFileInputChange(event) {
//   const files = event.target.files;
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const imageUrl = URL.createObjectURL(file);
//     const extractedText = await extractImageText(imageUrl);
//     outputTextArea.value += `${extractedText}\n\n`;
//   }
// }

// // Function to handle PDF file input change
// async function handlePdfFileInputChange(event) {
//   const files = event.target.files;
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const pdfUrl = URL.createObjectURL(file);
//     const extractedText = await extractPdfText(pdfUrl);
//     outputTextArea.value += `${extractedText}\n\n`;
//   }
// }

// Attach event listener to image file input
//imgFileInput.addEventListener('change', handleImageFileInputChange);

// Attach event listener to PDF file input
// pdfFileInput.addEventListener('change', handlePdfFileInputChange);


document.getElementById('summarize-btn').addEventListener('click',async ()=>{
            const text = document.getElementById('output').value
            const prompt = document.getElementById('prompt').value;
            let data= {
                text: text,
                prompt: prompt
            }
           await postData("/aibot", data);
              const val =await returnData("/getdata");
              const vals = val.choices[0].text.trim();
                document.getElementById('response').innerHTML = vals;
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
