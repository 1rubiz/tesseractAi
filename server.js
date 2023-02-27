// const Tesseract = require('tesseract.js')
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
function generateResponse(prompt, text) {
    // Set up the API endpoint URL and options
    // const authorize = "Bearer "+key;
    const url = 'https://api.openai.com/v1/completions';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+process.env.OPENAI_API_KEY2
        },
        body: JSON.stringify({
            prompt: `${prompt} ${text}`,
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
        //  res.send(data)
        myData=data;
         return(data);
        }
        //  console.log(myData)
         // Display the response in the UI
     })
     .catch(error => console.error(error));
}
// loki(screen.png)
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