const Tesseract = require('tesseract.js')
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan')
const dotenv = require('dotenv');
// const {OpenAIApi, Configuration} = require('openai');
const fetch = require('node-fetch')
// import fetch from 'node-fetch';
const multer = require('multer');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
// enable file upload
app.use(fileUpload());
// Cors for cross origin allowance
app.use(cors());
app.use(morgan('dev'))

dotenv.config();

app.listen(7000, async ()=>{
    console.log("Listening.....")
})

let myData = {}

app.get('/', (req, res)=>{
    // res.sendFile(path.join(__dirname+'/public/index.html'))
    res.sendFile('index.html')
})

app.get('/summonkeys',async (req, res)=>{
    const api = process.env.OPENAI_API_KEY;
    const tresures = {
        success: true,
        api : api
    }
    const strApi = JSON.stringify(tresures);
    res.send(strApi);
})

app.post('/aibot', async (req, res)=>{
    myData.text = req.body.text;
    myData.prompt= req.body.prompt;
    res.send(myData);
    // const text = await req.body;
    // aiBot(req.body.text);
    
    // res.sendStatus(200);
})

app.get('/getdata', async (req, res)=>{
    try{
        //  const data = await generateResponse(req.body.prompt, req.body.text);
        const url = 'https://api.openai.com/v1/completions';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+process.env.OPENAI_API_KEY2
            },
            body: JSON.stringify({
                prompt: `${myData.prompt} ${myData.text}`,
                max_tokens: 60,
                temperature: 0.3,
                top_p: 0.3,
                n: 1,
                // frequency_penalty: 0.5,
                // presence_penalty: 0,
                model: 'text-davinci-002',
            })
        };
         // Make the API request
         fetch(url, options)
         .then(response => response.json())
         .then(data => {
             // Get the response text from the API response
            //  const responseText = data.choices[0].text.trim();
            //  console.log(data.choices[0].text);
            if(data){
             console.log(data);
            // myData = data;
             res.send(data);
            //// myData=data;
            //  return(data);
            }
            //  console.log(myData)
             // Display the response in the UI
         })
         .catch(error => console.error(error));


        //  res.send(myData).sendStatus(200);
    }catch(err){
        console.log(err)
    }
    // res.send(myData)
})


const upload = multer({ dest: 'uploads/' });

app.post('/api/ocr', upload.single('image-file'), async (req, res) => {
    // const data = new FormData();
    // data.append("file", e.target.files[0], e.target.files[0].name);
    
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'X-RapidAPI-Key': '3f6ee1d352mshee38e7172feff63p1b6256jsn10d4452c3b45',
    //         'X-RapidAPI-Host': 'docwire-doctotext.p.rapidapi.com'
    //     },
    //     body: data
    // };
    
    // fetch('https://docwire-doctotext.p.rapidapi.com/extract_text', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


          try {
    const { path } = req.file;
    console.log(path);
//     const result = await Tesseract.recognize(path, 'eng', { logger: m => console.log(m) });
    // res.send(result.data);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});



// const Jimp = require('jimp');
// async function onRuntimeInitialized(){
//   // load local image file with jimp. It supports jpg, png, bmp, tiff and gif:
//   var jimpSrc = await Jimp.read('./lena.jpg');
//   // `jimpImage.bitmap` property has the decoded ImageData that we can use to create a cv:Mat
//   var src = cv.matFromImageData(jimpSrc.bitmap);
//   // following lines is copy&paste of opencv.js dilate tutorial:
//   let dst = new cv.Mat();
//   let M = cv.Mat.ones(5, 5, cv.CV_8U);
//   let anchor = new cv.Point(-1, -1);
//   cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
//   // Now that we are finish, we want to write `dst` to file `output.png`. For this we create a `Jimp`
//   // image which accepts the image data as a [`Buffer`](https://nodejs.org/docs/latest-v10.x/api/buffer.html).
//   // `write('output.png')` will write it to disk and Jimp infers the output format from given file name:
//   new Jimp({
//     width: dst.cols,
//     height: dst.rows,
//     data: Buffer.from(dst.data)
//   })
 
//   .write('output.png');
//   src.delete();
//   dst.delete();
// }
// // Finally, load the open.js as before. The function `onRuntimeInitialized` contains our program.
// Module = {
//   onRuntimeInitialized
// };
// cv = require('./node_modules/opencvjs');

// const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
// const { JSDOM } = require('jsdom');
// const { writeFileSync, existsSync, mkdirSync } = require("fs");
// // This is our program. This time we use JavaScript async / await and promises to handle asynchronicity.
// (async () => {
//   // before loading opencv.js we emulate a minimal HTML DOM. See the function declaration below.
//   installDOM();
//   await loadOpenCV();
//   // using node-canvas, we an image file to an object compatible with HTML DOM Image and therefore with cv.imread()
//   const image = await loadImage('./lena.jpg');
//   const src = cv.imread(image);
//   const dst = new cv.Mat();
//   const M = cv.Mat.ones(5, 5, cv.CV_8U);
//   const anchor = new cv.Point(-1, -1);
//   cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
//   // we create an object compatible HTMLCanvasElement
//   const canvas = createCanvas(300, 300);
//   cv.imshow(canvas, dst);
//   writeFileSync('output.jpg', canvas.toBuffer('image/jpeg'));
//   src.delete();
//   dst.delete();
// })();
// // Load opencv.js just like before but using Promise instead of callbacks:
// function loadOpenCV() {
//   return new Promise(resolve => {
//     global.Module = {
//       onRuntimeInitialized: resolve
//     };
//     global.cv = require('opencv4nodejs');
//   });
// }
// // Using jsdom and node-canvas we define some global variables to emulate HTML DOM.
// // Although a complete emulation can be archived, here we only define those globals used
// // by cv.imread() and cv.imshow().
// function installDOM() {
//   const dom = new JSDOM();
//   global.document = dom.window.document;
//   // The rest enables DOM image and canvas and is provided by node-canvas
//   global.Image = Image;
//   global.HTMLCanvasElement = Canvas;
//   global.ImageData = ImageData;
//   global.HTMLImageElement = Image;
// }

// const cv = require('opencv.js');

// // Load an image
// const img = cv.imread('./image.jpg');

// // Perform image processing operations
// // ...

// // Display the image
// cv.imshow('Image', img);
// cv.waitKey();


    const Jimp = require('jimp');
// const Tesseract = require('tesseract.js');
const jimpFunc= ()=>{

Jimp.read('demo.jpg')
  .then(image => {
    // Convert image to grayscale
    image.greyscale();

    // Get image buffer
    const buffer = image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      if (err) throw err;

      // Use Tesseract to detect the bounding box of each line of text
      Tesseract.recognize(buffer, {
        lang: 'eng',
        tessedit_create_box: true,
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      }).then(result => {
        if (!Array.isArray(result.lines)) {
          console.error('No lines of text found in image');
          return;
        }
        console.log(result.lines);
        // // Extract the bounding box coordinates for each line of text
        // const boxes = result.lines.map(line => line.bbox);

        // // Find the bounding box that encloses all the text
        // const { left, top, right, bottom } = boxes.reduce((prev, current) => {
        //   if (!prev) return current;
        //   return {
        //     left: Math.min(prev.left, current.left),
        //     top: Math.min(prev.top, current.top),
        //     right: Math.max(prev.right, current.right),
        //     bottom: Math.max(prev.bottom, current.bottom)
        //   };
        // }, null);

        // // Crop the image to the bounding box
        // const width = right - left;
        // const height = bottom - top;
        // image.crop(left, top, width, height);

        // // Save the cropped image
        // image.write('cropped-image.jpg');
      });
    });
  })
  .catch(err => {
    console.error(err);
  });

}

// jimpFunc();