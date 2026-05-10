import React, { useState } from "react";

export default function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [search, setSearch] = useState("");

  const getYoutubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const addSong = () => {
    const videoId = getYoutubeId(videoUrl);

    if (!videoId) {
      alert("Invalid YouTube Link 😭");
      return;
    }

    const newSong = {
      id: Date.now(),
      title: `YouTube Song ${songs.length + 1}`,
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      url: videoUrl,
    };

    setSongs([newSong, ...songs]);
    setVideoUrl("");
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
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "55px",
          marginBottom: "20px",
        }}
      >
        Personal YouTube Music 🎵
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
          placeholder="Paste YouTube song link..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "12px",
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
            borderRadius: "12px",
            padding: "15px 25px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Song
        </button>
      </div>

      <input
        type="text"
        placeholder="Search songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "12px",
          border: "none",
          marginBottom: "30px",
          fontSize: "16px",
        }}
      />

      {currentSong && (
        <div
          style={{
            background: "#111",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h2>Now Playing 🎶</h2>

          <img
            src={currentSong.thumbnail}
            alt="thumb"
            style={{
              width: "300px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          />

          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "20px" }}
          ></iframe>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            style={{
              background: "#111",
              borderRadius: "20px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <img
              src={song.thumbnail}
              alt="thumb"
              style={{
                width: "100%",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            />

            <h3>{song.title}</h3>

            <button
              onClick={() => setCurrentSong(song)}
              style={{
                background: "#1DB954",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Play ▶
            </button>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <h2>Add your first YouTube song 😄</h2>
          <p>Paste any YouTube music link above.</p>
        </div>
      )}
    </div>
  );
}