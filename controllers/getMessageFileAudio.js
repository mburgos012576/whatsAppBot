async function handleAudioMessage(client, message) {
    const mediaInfo = await client.decryptFile(message);
    console.log('mediainfo===>',mediaInfo);
  
    if (mediaInfo.mimetype.includes('audio')) {
      const audioPath = './audios/' + mediaInfo.filename;
  
      client.downloadFile(message, audioPath)
        .then(() => {
          console.log('Audio descargado:', audioPath);
          // Aquí puedes realizar cualquier acción adicional con el archivo de audio
        })
        .catch((error) => {
          console.log('Error al descargar el archivo de audio:', error);
        });
    } else {
      console.log('No se admite el formato de archivo de audio:', mediaInfo.mimetype);
    }
  }

  module.exports={handleAudioMessage};