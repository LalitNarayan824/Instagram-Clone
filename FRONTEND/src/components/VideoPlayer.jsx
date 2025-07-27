import React, { useRef, useState, useEffect } from 'react'
import { VscUnmute } from "react-icons/vsc"
import { IoVolumeMuteOutline } from "react-icons/io5"
import { FaPlay, FaPause } from "react-icons/fa6"

const VideoPlayer = ({ media }) => {
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  const handlePlayPause = () => {
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const handleMuteUnmute = () => {
    setMuted(!muted)
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      <video
        ref={videoRef}
        src={media}
        autoPlay
        loop
        muted={muted}
        className="w-full h-full object-cover"
      />

      {/* Mute/Unmute Button */}
      {muted ? (
        <IoVolumeMuteOutline
          onClick={handleMuteUnmute}
          className="text-white absolute bottom-3 right-3 z-10 text-2xl cursor-pointer"
        />
      ) : (
        <VscUnmute
          onClick={handleMuteUnmute}
          className="text-white absolute bottom-3 right-3 z-10 text-2xl cursor-pointer"
        />
      )}

      {/* Play/Pause Button */}
      {playing ? (
        <FaPause
          onClick={handlePlayPause}
          className="text-white absolute bottom-3 left-3 z-10 text-2xl cursor-pointer"
        />
      ) : (
        <FaPlay
          onClick={handlePlayPause}
          className="text-white absolute bottom-3 left-3 z-10 text-2xl cursor-pointer"
        />
      )}
    </div>
  )
}

export default VideoPlayer
