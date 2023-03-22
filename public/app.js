// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

const fileInput = document.querySelector('#input[type="file"]');

fileInput.addEventListener('change', (event) => {
    document.querySelector('#err-color').style.display = "none";
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        let imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(file);
        // imgElement.style = {"max-width":"200px", "max-height":"20px"};
        imgElement.style.width ="200px";
        imgElement.style.height= "200px";
        document.querySelector('.input-container').appendChild(imgElement);
      reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                document.getElementById('loader').style.display = "block";
                Tesseract.recognize(img, 'eng')
                .then(({ data: { text } }) => {
                   // append the recognized text to the output element for each image
                    document.getElementById('output').innerHTML += text;
                    document.getElementById('loader').style.display = "none";
                 })
                .catch((error) => {
                   console.error(error);
                   document.querySelector('#err-color').style.display = "block";
                   document.getElementById('loader').style.display = "none";
                 })
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
        console.log('Selected file is an image');
    } else if (file.type === 'application/pdf') {
        const files = event.target.files;
    if (!files) return;
    console.log(files);
    for (let i = 0; i < 3; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            if (file.type.includes('pdf')) {
                const loadingTask = pdfjsLib.getDocument(e.target.result);
                loadingTask.promise.then(function(pdf) {
                    const maxPages = pdf._pdfInfo.numPages;
                    for (let j = 1; j <= 3; j++) {
                        pdf.getPage(j).then(function(page) {
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
                        // console.log(text);
                        //   append the recognized text to the output element for each image
                           document.getElementById('output').innerHTML += text;
                           document.getElementById('loader').style.display = "none";
                        })
                       .catch((error) => {
                          console.error(error);
                          document.querySelector('#err-color').style.display = "block";
                          document.querySelector('#err').innerHTML = error;
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
        console.log('Selected file is a PDF');
    } else if (file.type === 'text/plain'){
        const reader = new FileReader();
        document.getElementById('loader').style.display = "block";
    reader.addEventListener('load', (event) => {
        const fileContents = event.target.result;
        // console.log(fileContents); // log the text contents of the file
        document.getElementById('output').innerHTML = fileContents;
        document.getElementById('loader').style.display = "none";
        // Perform text extraction and processing here
    });

  reader.readAsText(file);
  } else {
    document.querySelector('#err-color').style.display = "block";
    document.querySelector('#err').innerHTML = "Selected file is not a valid image or PDF or text file'";
    return;
  }

  // Perform other actions with the file here
});


document.getElementById('summarize-btn').addEventListener('click',async ()=>{
    document.getElementById('response').innerHTML = "Loading....";
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
        document.querySelector('#err-color').style.display = "block";
        document.querySelector('#err').innerHTML = err;
        console.log("error found "+err);
        document.getElementById('response').innerHTML = "";
    }
}

const returnData = async (url)=>{
    const data = await fetch(url);
    try{
        const res = await data.json();
        return(res);
    }catch(err){
        document.querySelector('#err-color').style.display = "block";
        document.querySelector('#err').innerHTML = err;
        document.getElementById('response').innerHTML = "";
        console.log(err)
    }
}
