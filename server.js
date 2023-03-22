const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan')
const dotenv = require('dotenv');
const fetch = require('node-fetch')

dotenv.config();

// const OPEN_API_KEY = process.env.OPENAI_API_KEY;
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

// home route setup
app.get('/', (req, res)=>{
    res.sendFile('index.html')
})

// post request from the user
app.post('/aibot', async (req, res)=>{
    myData.text = req.body.text;
    myData.prompt= req.body.prompt;
    res.send(myData);
})
// asunchronous get request to retrieve data back to the user
app.get('/getdata', async (req, res)=>{
    try{
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
        
        // Make the API request to Open Ai (gpt-3)
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