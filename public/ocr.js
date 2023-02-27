
        document.getElementById('file-input').addEventListener('change', async function(e) {
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