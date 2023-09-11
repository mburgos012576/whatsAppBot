// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const uuid = require("uuid");
const mongoose = require("mongoose");
const venom = require('venom-bot');
const dialogflow = require("./dialogflow");
const chatModel = require("./src/models/chat.model");
const clienteModel = require('./src/models/cliente.model');
const { WebhookClient, Card } = require("dialogflow-fulfillment");
const {sendMessagesToWhatsapp,sendMessagesToWhatsappButtom,sendMessagesToWhatsappList, sendMessagesImage, sendMessagesPoll} = require("./controllers/send");
const express = require("express");
const app = express();
const cors = require("cors");
//const axios = require("axios");
//const { getUser } = require("./api/users.strapi");
// const { handleAudioMessage } = require("./controllers/getMessageFileAudio");
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { voiceToText } = require("./helpers/whisper");
const { convertOggMp3 } = require("./helpers/convertOggMp3");
const chatRutas = require("./src/routes/chat.route");
const usuarioRutas = require("./src/routes/usuario.route");
const clienteRutas = require("./src/routes/cliente.route");
const { responseAll } = require("./helpers/responsesTemplates");
const { param } = require("./src/routes/chat.route");

/*Conexion a la base de datos MongoDB*/
/* const user_mongo='mongo'; */
/* const password_mongo='WamK10eVkTacVUWoOyEG'; */
/* const uri_mongo=`mongodb://${user_mongo}:${password_mongo}@containers-us-west-164.railway.app:5994/whatsapp-bot`; */
mongoose.connect('mongodb://127.0.0.1:27017/whatsapp-bot')
    .then(() => {
        console.log("Conectados a la base de datos MongoDB");
    })
    .catch((error) => {
        console.log("Error al conectar MongoDB: ", error);
    });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/chats", chatRutas);
app.use("/api/usuarios", usuarioRutas);
app.use("/api/clientes", clienteRutas);

/**
 * Mostrar QR en WEB
 */
 app.use('/qr',express.static(__dirname + '/'));

/**
 * funcion obtener fecha
 * 
 */
const d_t = new Date();

let year = d_t.getFullYear();
let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
let day = ("0" + d_t.getDate()).slice(-2);
let hour = d_t.getHours();
let minute = d_t.getMinutes();
let seconds = d_t.getSeconds();
// prints date & time in YYYY-MM-DD HH:MM:SS format
let fecha = (year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds);

/**
 * Sessiones
 */
const sessionIds = new Map();

//En esta sección recibimos del DialogFlow (Webhook)
app.post('/api/webhook', express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(res.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function tramitesCrear(agent) {
        let DNI = agent.parameters["DNI"];
        let Nombres = agent.parameters["Nombres"];

        //Obtener cliente de BD Mongo
        const result = await clienteModel.findOne({ "DocumentoIdentidad": DNI });
        if (result) {
            console.log("consulta cliente", result.NombreCliente);
            agent.add(`Estimado cliente ${result.NombreCliente} con DNI : ${result.DocumentoIdentidad}, gracias por comunicarse con nosotros, un asesor se pondrá en contacto con usted a la brevedad.`);
            agent.add(`su deuda es de ${result.deuda} ${result.moneda}`);
        } else {
            console.log("consulta cliente del whatsApp", Nombres);
            agent.add(`Estimado cliente ${Nombres} con DNI : ${DNI}, no lo tenemos registrado en nuestra Base de Datos.`);
            agent.add(new Card({
                title : 'Allia Card',
                imageUrl: 'https://www.cinepremiere.com.mx/wp-content/uploads/2022/06/Dragon-Ball-Super-Nuevo-Proyecto-V-Jump-2022-900x506.jpg',
                text: `Este es el bot de ANDRE ! 🤖🤖`,
                buttonText: 'This is a button',
                buttonUrl: 'http://allia.pe'
            }));
        }
    }

    function prestamosPersonales(agent) {
        agent.add(`Excelente elección. ¿Te gustaría saber más sobre nuestros préstamos personales a corto o largo plazo? Puedo proporcionarte detalles sobre tasas de interés, montos y plazos.`);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Tramites.crear', tramitesCrear);
    intentMap.set('Prestamos_Personales', prestamosPersonales);

    /*  intentMap.set('CanalesPago', CanalesPago); */
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});

/**Inicio Venon Bot */
venom
    .create({
        session: 'session-name', //name of session
        multidevice: true, // for version not multidevice use false.(default: true)
        catchQR : (base64Qr, asciiQR, attempts, urlCode) => {
            console.log(asciiQR); // Optional to log the QR in the terminal
            var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
              response = {};
      
            if (matches.length !== 3) {
              return new Error('Invalid input string');
            }
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');
      
            var imageBuffer = response;
            require('fs').writeFile(
              'bot.qr.png',
              imageBuffer['data'],
              'binary',
              function (err) {
                if (err != null) {
                  console.log(err);
                }
              }
            );
          }
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    client.onMessage(async (message) => {
        let fechayhora = new Date;
        let hours = fechayhora.getHours();
        console.log('Hora actual --->', hours);

        /* Prueba Axios */
        //let { data } = await axios.get('https://api-ae27h.strapidemo.com/api/restaurants').then(console.log(responses));
        //console.log('type---->', message.type);
        //console.log('body----->', message.body);
        console.log('fulfillment----->', message.fulfillmentMessages);
        console.log('mensajeeeeeeeeee', message);
        //if (hours < 8 || hours > 17) {
        if (message.type != 'ciphertext') {
            setSessionAndUser(message.from);
            let session = sessionIds.get(message.from);
            let payload = await dialogflow.sendToDialogFlow(message.body, session);
            //console.log("Payloaddddddddddddd",payload);
            let nombreIntentDialogFlow = payload  ? payload.intent.displayName : 'Default Fallback Intent';
           /*  console.log("Nombre de DiaJSONlogFlow ", JSON.stringify(payload.fulfillmentMessages[1].payload.fields.whatsapp.structValue.fields.elements.listValue.values[0].structValue.fields.buttonText.struc *///tValue.fields.displayText.stringValue, null, ' '));
           /*  const buttonDialogFlow = JSON.stringify(payload.fulfillmentMessages[1].payload.fields.whatsapp.structValue.fields.elements.listValue.values[0].structValue.fields, null, ' ') ; */
           /*  const buttonsProbar = [ */
           /*      { */
           /*      "buttonId": `${buttonDialogFlow.buttonId}` , */
           /*      "buttonText": { */
           /*          "displayText": `${buttonDialogFlow.buttonText.structValue.fields.displayText.stringValue}` */
           /*          } */
           /*      }, */
           /*      { */
           /*      "buttonId": 'id2', */
           /*      "buttonText": { */
           /*          "displayText": "No acepto" */
           /*          } */
           /*      } */
           /*      ] */




/*             //const nombreIntentDialogFlow = payload !== 'undefined' ? payload.intent.displayName : 'Default Fallback Intent';  "type": "buttons_response" */
/*             let responses = (message.type == 'chat' && message.body.length < 256 ) ? payload.fulfillmentMessages || message.body.length > 256 : [{ */
/*                 "text": { */
/*                     "text": [`!Hola! ${message.notifyName} te saluda Andrea👩🏻‍💼tu agente virtual de INTEGRA RETAIL */
/* Te comento que nuestro horario de atención es de: */
/* L - V  de 8:00 am 🕗 a 6:00 pm 🕕 */
/* Cuéntame ¿En qué puedo ayudarte ?  */
/* Sólo debes escribir el número de la opción que necesitas (*ejem: 1*) */
/* 1) *Estado de Cuenta* */
/* 2) *Actualizar Datos*                                                                                              */
/* 3) *Canales de pagos*                                                                                                */
/* 4) *Comunicarme con un asesor* */
/* 5) *Ya pagué*`] */
/*                 } */
/*             }]; //obtenemos yn arreglo esto lo obtenos viendo el log */


/**
 * Aca empieza los condicionales para ñas respuestas del BOT
 */
let responses ="";
            if (message.type == 'chat' && message.body.length < 256 && message.subtype !=="url") {
                responses = payload.fulfillmentMessages
            }else if(message.type == 'buttons_response' && message.body == 'No acepto') {
               responses = [{
                    "text":{
                        "text":
                        [`Seleccionaste *No acepto*`]
                    }
                }]
            }else if(message.type == 'buttons_response' && message.body == 'Acepto') {
                responses = [{
                     "text":{
                         "text":
                         [`Seleccionaste *Acepto*`]
                     }
                 }]
            }else if(message.type == 'list_response'){
                responses = [{
                    "text":{
                        "text":
                        [`Seleccionaste  de la lista 🤖🤖🤖!!! =====> ${message.body}`]
                    }
                }];           
            }else if(message.mimetype.includes('audio')) {
                                                       
                 //handleAudioMessage(client,message);  
                /**
                 * Descarga de Audio en Base64
                 */
                
                let desencriptar = await client.decryptFile(message);
                console.log("audiooooooo",Buffer.from(desencriptar) );
                const fileName = `./audios/${message.from}_${Date.now()}.${mime.extension(message.mimetype)}`;
                fs.writeFile(fileName, desencriptar, (err) => {
                       console.log('Error desencryp ', err);
                 });
                 
                 //Llamar function Whisper para traducir audo a texto
                if (mime.extension(message.mimetype) == 'oga' || mime.extension(message.mimetype)=='ogg') {
                    const pathTmpOgg = `${fileName}`;
                    const pathTmpMp3 = `./audios/${message.from}_${Date.now()}.mp3`;
                    //fs.writeFile(pathTmpOgg, buffer);
                    await convertOggMp3(pathTmpOgg, pathTmpMp3);
                    const text = await voiceToText(pathTmpMp3);

                    console.log(`🤖 Fin voz a texto....[TEXT]: ${text}`);
                    responses = [{
                        "text":{
                            "text":
                            [`Audio a Texto 🤖🤖🤖!!! =====> *${text}*`]
                        }
                    }];
                    } else {
                    const text = await voiceToText(fileName);
                    responses = [{
                        "text":{
                            "text":
                            [`Audio a Texto 🤖🤖🤖!!! =====> *${text}*`]
                        }
                    }];             
                }                                                                                                                                                          
                }else{
                /**Obtenemos respuesta de Template de Respuestas  de Helpers/responsesTemplates.js*/
                responses = responseAll(message.notifyName)
                }
            /*ingresar a BD mensajes chats*/
            //console.log('Responsessssss', JSON.stringify(responses));
            //console.log('Payloadddddd ' , JSON.stringify(payload.fulfillmentMessages));
            const dato = new chatModel();
            const arrayFrom = message.from.split("@");
            const arrayTo = message.to.split("@");
            console.log("Frommmmmmm=>>>>>", arrayFrom[0]);
            console.log("Tooooooooo=>>>>>", arrayTo[0]);
            //console.log("Mensaje body ", JSON.stringify(message.body,null,' '));

            /* //Obtener usuario de strapi */
            /* const user_strapi = await getUser('999999999'); */
            /* console.log('Resultado de Funcion con Axios y strapi ', user_strapi); */
            /* ////////////////////////////////////////////////////////////////////////// */

            dato.nombres = message.notifyName;
            dato.from = arrayFrom[0];
            dato.to = arrayTo[0];
            dato.chat = message.body !== "" ? message.body || message.body =="🥹"  : "Cliente adjunto imagen/video/file";
            //guardar mensaje en bd
            await dato.save();
            /*******************************/
            console.log("mensajeeeeeeeeeeeee", JSON.stringify(message,null,' ') );
            for (const response of responses) {
                try {
                    /*await client.startTyping(message.from);*/
                    await sendMessagesToWhatsapp(client, message, response);
                    //console.log("Responde obtenido .....", response);
                    await client.startTyping(message.from);
                    if (nombreIntentDialogFlow==="Default Welcome Intent") {
                         await sendMessagesToWhatsappButtom(client,message); 
                         await sendMessagesToWhatsappList(client,message); 
                         await sendMessagesImage(client,message.from,'https://www.cinepremiere.com.mx/wp-content/uploads/2022/06/Dragon-Ball-Super-Nuevo-Proyecto-V-Jump-2022-900x506.jpg');
                         await client.startTyping(message.from);
                         await sendMessagesPoll(client,message.from);
                        }
                    
                } catch (error) {
                    console.log("No manda data =====>" + error);
                }
                
            }
        }
        // }
    });
}

/**
 * 
 * Iniciar Sesion WhatsApp 
 */
async function setSessionAndUser(senderId) {
    try {
        if (!sessionIds.has(senderId)) {
            sessionIds.set(senderId, uuid.v4());
        }
    } catch (error) {
        let fechayhorasession = new Date;
        let hourssession = fechayhorasession.getHours();
        console.log(`Error de sesion a las ${hourssession} `, error);
        throw error;
    }
}

/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(process.env.PORT || 4003, () => {
    console.log('Server started on port 4003...');
});
