function sendMessagesToWhatsapp(client, message, response) {
    console.log('Texto00000000000000', response.text.text[0]);
    console.log("frommmmmmmmmmm", message.from);
    return new Promise((resolve, reject) => {
        if (message.from != 'status@broadcast') {
            client
                .sendText(message.from, response.text.text[0])
                .then((result) => {
                    console.log('Result: ', result); //return object success
                    resolve(result);
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro);
                    reject(erro);
                });
            }});
}

function sendMessagesToWhatsappButtom(client, message) {
    //console.log('Texto00000000000000', response.text.text[0]);
    console.log("frommmmmmmmmmm", message.from);
    return new Promise((resolve, reject) => {
        if (message.from != 'status@broadcast') {
                                                                                                                 
                // Send Messages with Buttons Reply
                const buttons = [
                    {
                    "buttonId": 'id1'    ,
                    "buttonText": {
                        "displayText": "Acepto"
                        }
                    },
                    {
                    "buttonId": 'id2',
                    "buttonText": {
                        "displayText": "No acepto"
                        }
                    }
                    ]
                client.sendButtons(message.from, 'Allia ', buttons, 'Empresa dedicada a todo lo que es IA 🤖')
                    .then((result) => {
                    console.log('Resultado Boton: ', result); //return object success
                    resolve(result);
                    })
                    .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                    reject(erro);
                    });
                        }
                    });
}

function sendMessagesToWhatsappList(client, message) {
    //console.log('Texto00000000000000', response.text.text[0]);
    console.log("frommmmmmmmmmm", message.from);
    return new Promise((resolve, reject) => {
        if (message.from != 'status@broadcast') {
            // Send List menu
            const listaOpciones = [
              {
                title: "Bovina",
          rows: [
            { title: "Fraudinha", rowId: "carnes1" },
            { title: "Alcatra", rowId: "carnes2", description: "Carne boa" },
          ],
        },
        {
          title: "Suina",
          rows: [
            { title: "Costelinha", rowId: "carnes3" },
            {
              title: "Picanha Suina",
              rowId: "carnes4",
              description: "Carne boa",
            },
          ],
        },
               
            ];
          
            client.sendListMenu(message.from, 'Allia', 'Envío de Lista', 'Platos a la carta', 'Menu',listaOpciones)
              .then((result) => {
                console.log('Resultado Lista: ', result); //return object success
                resolve(result);
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                reject(erro);
              });
                    }
                });         
                          
}

function sendMessagesImage(client, toNumber,urlImagen) {
  return new Promise((resolve, reject) => {
      //if (message.from != 'status@broadcast') {
        client.sendImage(toNumber,urlImagen,'Allia','Allia EIRL')
        .then((result)=>{
            console.log('Resulto Imagen',result);
            resolve(result);
        })
        .catch((error)=>{
            console.log('Error imagen',error);
            reject(error);
        });

            // }
            });
}

function sendMessagesPoll(client, toNumber) {
  return new Promise((resolve, reject) => {
      //if (message.from != 'status@broadcast') {
        const poll = {
          name: 'new poll',
          options: [
            {
              name: 'option 1'
            },
            {
              name: 'option 2'
            }
          ],
          selectableOptionsCount: 1
        };
        client.sendPollCreation(toNumber, poll)
        .then((result) => {
            console.log('Resultado Pool: ', result); //return object success
            resolve(result)
        })
        .catch((erro) => {
            console.error('Error when sending Pool: ', erro); //return object error
            reject(result);
        });                                         
                   });
}

module.exports={sendMessagesToWhatsapp,sendMessagesToWhatsappButtom,sendMessagesToWhatsappList,sendMessagesImage,sendMessagesPoll};