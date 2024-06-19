import express, { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const port = parseInt(process.env.PORT || "3009");
let arduinoClient:any = null;

const wss = new WebSocketServer({
  port: parseInt(process.env.WS_PORT || "3100"),
});

wss.on("connection", function connection(ws:any, request:any, client:any) {
  console.log("SOMEONE CONNECTED!")
  arduinoClient = ws
})

app.get('/', (req: Request, res: Response) => {
  if (arduinoClient == null) {
    return res.status(500).send('Arduino not connected');
  }

  if (arduinoClient.readyState === WebSocket.OPEN) {
    return res.status(200).send('Arduino connected');
  }
})

// CHECK and RETURN PC's power state
app.get('/state', (req: Request, res: Response) => {
  if (!arduinoClient || arduinoClient.readyState !== WebSocket.OPEN) {
    return res.status(500).send('Arduino not connected');
  }

  const timeout = 5000;
  
  const sendMessageAndWaitForResponse = (messageToSend: string) => {
    return new Promise((resolve, reject) => {
      let responseSent = false;

      const handleMessage = (message: string) => {
        const parsedMessage = JSON.parse(message);
        responseSent = true;
        arduinoClient.off('message', handleMessage);
        resolve(parsedMessage.msg);
      };

      arduinoClient.on('message', handleMessage);
      arduinoClient.send(JSON.stringify({ msg: messageToSend }));

      setTimeout(() => {
        if (!responseSent) {
          arduinoClient.off('message', handleMessage);
          reject(new Error('Timeout waiting for client response'));
        }
      }, timeout);
    });
  };

  sendMessageAndWaitForResponse('CHECK STATE')
    .then(msg => res.send(msg))
    .catch(error => res.status(504).send(error.message));
})

// POWER ON PC
app.post('/on', (req: Request, res: Response) => {
  if (req.headers.authorization !== process.env.AUTHORIZATION_HEADER) {
    return res.status(401).send("Unauthorized")
  }

  if (!arduinoClient || arduinoClient.readyState !== WebSocket.OPEN) {
    return res.status(500).send('Arduino not connected');
  }

  arduinoClient.send(JSON.stringify({ msg: "ON" }));

  return res.status(200).send("OK")
})

// POWER OFF PC
app.post('/off', (req: Request, res: Response) => {
  if (req.headers.authorization !== process.env.AUTHORIZATION_HEADER) {
    return res.status(401).send("Unauthorized")
  }

  if (!arduinoClient || arduinoClient.readyState !== WebSocket.OPEN) {
    return res.status(500).send('Arduino not connected');
  }

  arduinoClient.send(JSON.stringify({ msg: "OFF" }));

  return res.status(200).send("OK")
})

app.listen(port, () => {
  console.log("Listening...")
})