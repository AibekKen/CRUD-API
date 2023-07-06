import cluster, { Worker } from 'cluster';
import http from 'http';
import os from 'os';
import dotenv from 'dotenv'
dotenv.config()

import { handleRequest } from './controls/controls.ts';
import { Users } from './db/users.ts';
if (cluster.isPrimary) {
  const PORT = Number(process.env.LOAD_BALANCER_PORT)
  const workerCount = os.cpus().length - 1

  const handleFromWorker = (users: Users[]) => { 
    Object.values(cluster.workers!).forEach((worker) => {
      worker?.send(users)
  })
};

  for (let i = 0; i < workerCount; i++) {
    const worker = cluster.fork({ PORT: PORT + 1 + i, WORKERS_COUNT:  workerCount})
    worker.on('message', handleFromWorker.bind(this))
  }

  let currentWorkerNum = 1
  const server = http.createServer((req, res) => {
    const requestOptions = {
      hostname: 'localhost',
      port: PORT + currentWorkerNum,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };
    const proxyReq = http.request(requestOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode!, proxyRes.headers);
      proxyRes.pipe(res);
    });

    if (currentWorkerNum < workerCount) {
      currentWorkerNum++;
    } else {
      currentWorkerNum = 1;
    }

    req.pipe(proxyReq);
  });

  server.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  process.on('message', (message: Users[]) => {
    Users.setUsers(message)
  })
  const PORT = Number(process.env.PORT)
  const server = http.createServer(handleRequest)
  server.listen(PORT, () => {
    console.log( `server running on port ${PORT}`)
  }).on('error', (err) => console.log(err))
}








