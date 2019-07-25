var express = require('express');
var router = express.Router();
const { exec } = require('child_process');

let pathnames = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next){
   
    let name = req.query.name;
    let url = req.query.url;
    let delta = Number(req.query.delta);
    let user = req.query.user ?  req.query.user : 'admin';
    let pwd = req.query.pwd ?  req.query.pwd : '123456';

   res.send(`{"url":"rtmp://192.168.1.247:15070/live/${name}"}`);


   if( !pathnames[name] ){
    pathnames[name] = {count: 1, delta};
  }else{
    if(delta === 1) pathnames[name].count += 1;
    if(delta === -1) pathnames[name].count -= 1;
    if(pathnames[name].count === -1) delete pathnames[name];

    pathnames[name].delta = delta;
  }

  for(let name in pathnames){
    if(pathnames[name].count === 1 && pathnames[name].delta === 1){
      //转换流
      pathnames[name].active = true;
      let cmd = `ffmpeg -re  -rtsp_transport tcp -i "rtsp://${user}:${pwd}@${url}/h264/ch1/main/av_stream" -f flv -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv -s 1280x720 -q 10 "rtmp://192.168.1.247:15070/live/${name}"`
     
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行的错误: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      
    }

    if(pathnames[name].count === 0 && pathnames[name].active){
      //停掉当前流

      pathnames[name].active = false;
    }
  }
})
module.exports = router;
