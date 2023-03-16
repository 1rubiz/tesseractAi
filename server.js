// const Tesseract = require('tesseract.js')
const express = require('express');
// const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan')
const dotenv = require('dotenv');
// const {OpenAIApi, Configuration} = require('openai');
const fetch = require('node-fetch')

dotenv.config();

const OPEN_API_KEY = process.env.OPENAI_API_KEY;
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
// enable file upload
app.use(fileUpload());
// Cors for cross origin allowance
app.use(cors());
app.use(morgan('dev'))



app.listen(7000, async ()=>{
    console.log("Listening.....")
})

const OPEN_API_KEY = process.env.OPENAI_API_KEY2;

const inText = "in this document"
const restructure = "and restructure"
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
                'Authorization': `Bearer ${OPEN_API_KEY}`
            },
            body: JSON.stringify({

                prompt: `${myData.prompt } ${inText} ${restructure} ${myData.text}`,
                max_tokens: 1000,
                temperature: 0.8,
                // stop: [ "?", "!"],
                n: 1,
                frequency_penalty: 0.2,
                presence_penalty: 0.5,
                model: 'text-davinci-003',
                
                best_of: 3,
            })
        };
        
        // Make the API request
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data && data.choices && data.choices.length > 0) {
                    const responseText = data.choices[0].text.trim();
                    const orderedListRegex = /^\d+\.\s+/gm;
                    const hasOrderedList = orderedListRegex.test(responseText);
                    
                    if (hasOrderedList) {
                        const orderedList = responseText.split('\n');
                        const orderedListFormatted = orderedList.reduce((acc, item, index) => {
                          if (item) {
                            acc += ` ${item.replace(/\n/g, '')}<br>`;
                          }
                          return acc;
                        }, '');
                        data.choices[0].text = orderedListFormatted;
                      }
                    res.send(data);
                }
            })
            .catch(error => console.error(error));
    } catch(err){
        console.log(err)
    }
});


// const upload = multer({ dest: 'uploads/' });

// app.post('/api/ocr', upload.single('image-file'), async (req, res) => {
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


//           try {
//     const { path } = req.file;
//     console.log(path);
//     const result = await Tesseract.recognize(path, 'eng', { logger: m => console.log(m) });
    // res.send(result.data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });
