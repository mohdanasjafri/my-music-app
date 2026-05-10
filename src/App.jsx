import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [volume, setVolume] = useState(50);

  const getYoutubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const addSong = () => {
    const id = getYoutubeId(videoUrl);

    if (!id) {
      alert("Invalid YouTube link 😭");
      return;
    }

    const song = {
      id: Date.now(),
      videoId: id,
      title: `Song ${songs.length + 1}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };

    setSongs((prev) => [...prev, song]);
    setVideoUrl("");
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "400",
        width: "100%",
        videoId: songs[0]?.videoId || "",
        playerVars: {
          autoplay: 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              nextSong();
            }
          },
        },
      });
    };
  }, []);

  useEffect(() => {
    if (songs.length > 0 && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(songs[currentIndex].videoId);

      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentIndex, songs]);

  const playSong = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);

    if (playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(songs[index].videoId);
      playerRef.current.playVideo();
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }

    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (songs.length === 0) return;

    const next = (currentIndex + 1) % songs.length;
    playSong(next);
  };

  const prevSong = () => {
    if (songs.length === 0) return;

    const prev = (currentIndex - 1 + songs.length) % songs.length;
    playSong(prev);
  };

  const removeSong = (index) => {
    const updated = songs.filter((_, i) => i !== index);
    setSongs(updated);

    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  const changeVolume = (value) => {
    setVolume(value);

    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(value);
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#050505",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "50px",
          marginBottom: "25px",
        }}
      >
        YouTube Music Clone 🎵
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Paste YouTube song link"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        />

        <button
          onClick={addSong}
          style={{
            background: "#1DB954",
            color: "white",
            border: "none",
            padding: "15px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add
        </button>
      </div>

      <input
        type="text"
        placeholder="Search songs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "25px",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          ref={containerRef}
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button onClick={prevSong}>⏮ Prev</button>

          <button onClick={togglePlay}>
            {isPlaying ? "Pause ⏸" : "Play ▶"}
          </button>

          <button onClick={nextSong}>Next ⏭</button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <p>Volume 🔊</p>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => changeVolume(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {filteredSongs.map((song, index) => (
          <div
            key={song.id}
            style={{
              background: "#111",
              borderRadius: "20px",
              padding: "15px",
            }}
          >
            <img
              src={song.thumbnail}
              alt="thumbnail"
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            />

            <h3>{song.title}</h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => playSong(index)}
                style={{
                  background: "#1DB954",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Play
              </button>

              <button
                onClick={() => removeSong(index)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}