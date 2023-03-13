const imageContainer = document.querySelector('#image-container');
const pdfFileInput = document.querySelector('#pdf-file-input');
const imgFileInput = document.querySelector('#img-file-input');
const outputTextArea = document.querySelector('#output');
const loader = document.querySelector('#loader');

// Helper function to display loader
function showLoader() {
  loader.style.display = 'block';
}

// Helper function to hide loader
function hideLoader() {
  loader.style.display = 'none';
}

// Function to extract text from image using Tesseract.js
async function extractImageText(imageUrl) {
  showLoader();
  console.log(`Extracting text from image: ${imageUrl}`);
  const { data: { text } } = await Tesseract.recognize(imageUrl);
  console.log(`Extracted text from image: ${text}`);
  hideLoader();
  return text;
}

// Function to extract text from PDF using pdf.js
async function extractPdfText(pdfUrl) {
  showLoader();
  console.log(`Extracting text from PDF: ${pdfUrl}`);
  const pdfDoc = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
  const maxPages = pdfDoc.numPages;
  let pageText = '';
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const pdfPage = await pdfDoc.getPage(pageNum);
    const pageContent = await pdfPage.getTextContent();
    const pageTextArr = pageContent.items.map(item => item.str);
    const pageTextStr = pageTextArr.join(' ');
    pageText += ` ${pageTextStr}`;
  }
  console.log(`Extracted text from PDF: ${pageText}`);
  hideLoader();
  return pageText;
}

// Function to handle image file input change
async function handleImageFileInputChange(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageUrl = URL.createObjectURL(file);
    const extractedText = await extractImageText(imageUrl);
    outputTextArea.value += `${extractedText}\n\n`;
  }
}

// Function to handle PDF file input change
async function handlePdfFileInputChange(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pdfUrl = URL.createObjectURL(file);
    const extractedText = await extractPdfText(pdfUrl);
    outputTextArea.value += `${extractedText}\n\n`;
  }
}

// Attach event listener to image file input
imgFileInput.addEventListener('change', handleImageFileInputChange);

// Attach event listener to PDF file input
pdfFileInput.addEventListener('change', handlePdfFileInputChange);

  
  

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