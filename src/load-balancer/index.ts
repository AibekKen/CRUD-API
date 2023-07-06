import { RequestListener, RequestOptions, request } from "http";

const PORT = Number(process.env.PORT);
let currentWorker = 1;
let distributeWorkerCount = Number(process.env.WORKERS_COUNT);

export const loadBalanceRequest: RequestListener = async (req, res) => {
    try {
      console.log('Request handled on load balancer')

      const options: RequestOptions = {
        host: 'localhost',
        port: PORT + currentWorker,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
  
      const requestDist = request(options, (response) => {
        console.log(`Request distributed to port ${PORT + currentWorker}`)
        let body = ''
        response.on('data', chunk => {
          body += chunk
        })
        response.on('end', () => {
          res.statusCode = response.statusCode!
          res.end(body)
        })
      })
      
      if(['POST', 'PUT'].includes(req.method!)) {
        let data = ''
        req.on('data', chunk => {
          data += chunk;
        })
        req.on('end', () => {
          requestDist.write(data)
          requestDist.end()
        })
      } else {
        requestDist.end()
      }
  
      currentWorker += 1;
      if (currentWorker >= distributeWorkerCount) {
        currentWorker = 1
      }
    } catch (error) {
      console.log(error)
    }
};
