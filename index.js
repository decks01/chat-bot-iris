const express = require('express')
const app = express()
 
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const mysql = require('mysql')

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: '',
  database: 'ficha_servicio'
});

const PORT = process.env.PORT ||  5000
app.get('/', function (req, res) {
  res.send('Hello Worldasd')
})
app.get('/hello', function (req, res) {
  res.send('envio de Hello')
})

app.post('/webhook', express.json(), function (req, res) {
  const agent = new WebhookClient({ request:req, response:res});
  // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function ProbandoWebhook(agent) {
    agent.add(`INtento ingresar a SELECT!`);
    const sql = 'SELECT name from usuarios where ID = 1'
      conexion.query(sql, (err, results) =>{
          if(err) throw err;
          if(results.length > 0){
              // res.json(results);
              agent.add(`Datos agregados! `);
          }  else {
              // res.send("No hay resultados")
              agent.add(`No hay nada`);

          }

      });
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  // function ProbandoWebhook(agent) {
  //   agent.add(`Estoy enviando desde el webHook`);
  // }

  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('ProbandoWebhook', ProbandoWebhook);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);

})


app.listen(PORT, () => {
    console.log('Established listening on', PORT);
})