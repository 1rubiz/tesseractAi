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
                        document.getElementById('output').innerHTML += ` ${i+1}:${text}</p>`;
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
                            const context = canvas.getContext('2d');
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