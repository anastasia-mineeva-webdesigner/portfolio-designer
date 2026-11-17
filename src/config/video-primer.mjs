// A resolved play() promise can precede presentation of the first frame on Safari.
// Keep the decoder running until a frame arrives, and allow blocked attempts to retry.
export function createVideoPrimer(video,onReady){
 let primed=false,priming=false,disposed=false,frame=0,timer;
 const finish=()=>{
  if(disposed)return;
  if(video.readyState<2){priming=false;return}
  clearTimeout(timer);
  if(frame&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frame);
  frame=0;video.pause();primed=true;priming=false;onReady();
 };
 return {
  async prime(){
   if(disposed||primed||priming)return;
   priming=true;video.muted=true;video.defaultMuted=true;video.playsInline=true;
   try{
    await video.play();
    if(disposed){video.pause();return}
    timer=setTimeout(finish,300);
    if(video.requestVideoFrameCallback)frame=video.requestVideoFrameCallback(finish);
    else finish();
   }catch{priming=false}
  },
  dispose(){disposed=true;clearTimeout(timer);if(frame&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frame);video.pause()}
 };
}
