import React,{useState} from 'react';
import ModalVideo from 'react-modal-video';
import video from "../../images/video/siteVideo.mp4"

const VideoPopup = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <React.Fragment>
		<ModalVideo channel='custom' autoplay isOpen={isOpen} url={video} onClose={() => setOpen(false)} />
    <button className="site-button white btn-icon popup-youtube video" onClick={()=> setOpen(true)}  >Watch Video<i className="fa fa-angle-double-right" ></i></button>

    </React.Fragment>
  )
}
export default VideoPopup;