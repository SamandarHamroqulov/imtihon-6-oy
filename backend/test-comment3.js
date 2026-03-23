const http = require('http');

const data = JSON.stringify({
  email: 'admin@gmail.com', // Replace with a valid user credentials
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const result = JSON.parse(body);
      const token = result.accessToken || result.data?.accessToken;
      if (!token) return console.error('No token:', result);
      
      const commentData = JSON.stringify({ text: "Test", rating: 5 });
      const commentReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/comments/10',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': commentData.length,
          'Authorization': `Bearer ${token}`
        }
      }, (cRes) => {
        let cBody = '';
        cRes.on('data', d => cBody += d);
        cRes.on('end', () => {
          console.log('Status:', cRes.statusCode);
          console.log('Response:', cBody);
        });
      });
      commentReq.write(commentData);
      commentReq.end();
    } catch (e) {}
  });
});
req.write(data);
req.end();
