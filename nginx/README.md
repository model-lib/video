
rtsp ת rtmp

ffmpeg -re  -rtsp_transport tcp -i "rtsp://admin:123456@192.168.1.152/h264/ch1/main/av_stream" -f flv -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv -s 1280x720 -q 10 "rtmp://192.168.1.247:15070/live/test2"