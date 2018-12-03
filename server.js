const webdav = require('webdav-server').v2;
const fs = require('fs');

const server = new webdav.WebDAVServer({
  port: 3001
});

const rootFileSystem = server.rootFileSystem();

rootFileSystem.addSubTree(server.createExternalContext(), {
  subfolder: {
    'img1.jpg': fs.readFileSync('./server_sync_folder/subfolder/img1.jpg')
  },
  subfolder2: {
    'img3.jpg': fs.readFileSync('./server_sync_folder/subfolder2/img3.jpg')
  }
});

setTimeout(() => {
  rootFileSystem.addSubTree(server.createExternalContext(), {
    'img2.jpg': fs.readFileSync('./server_sync_folder/img2.jpg'),
    'img3.jpg': fs.readFileSync('./server_sync_folder/img2.jpg')
  });
}, 5000);

server.afterRequest((arg, next) => {
  // Display the method, the URI, the returned status code and the returned message
  console.log(
    '>>',
    arg.request.method,
    arg.requested.uri,
    '>',
    arg.response.statusCode,
    arg.response.statusMessage
  );
  // If available, display the body of the response
  console.log(arg.responseBody);
  next();
});

server.start(httpServer => {
  console.log(
    'Server started with success on the port : ' + httpServer.address().port
  );
});
