import React, { useState, useEffect, useRef } from "react";

export default function MusicApp() {
  const songsData = [
    {
      id: 1,
      title: "Dreams",
      artist: "Chill Artist",
      category: "English",
      cover:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      title: "Night Ride",
      artist: "Lofi Beats",
      category: "Lofi",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: 3,
      title: "Hindi Vibes",
      artist: "Indian Mix",
      category: "Hindi",
      cover:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      id: 4,
      title: "Gym Energy",
      artist: "Workout Pro",
      category: "Gym",
      cover:
        "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
  ];

  const [songs] = useState(songsData);
  const [currentSong, setCurrentSong] = useState(songsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState([]);
  const [playCounts, setPlayCounts] = useState({});
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    setPlayCounts((prev) => ({
      ...prev,
      [song.id]: (prev[song.id] || 0) + 1,
    }));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);

    if (queue.length > 0) {
      const nextQueueSong = queue[0];
      setQueue(queue.slice(1));
      playSong(nextQueueSong);
      return;
    }

    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const addToQueue = (song) => {
    setQueue([...queue, song]);
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedSongs = filteredSongs.reduce((acc, song) => {
    if (!acc[song.category]) acc[song.category] = [];
    acc[song.category].push(song);
    return acc;
  }, {});

  const mostPlayed = [...songs].sort(
    (a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0)
  );

  return (
    <div style={{ background: "#111", color: "white", minHeight: "100vh", padding: "20px", fontFamily: "Arial" }}>
      <h1>My Music App 🎵</h1>

      <input
        type="text"
        placeholder="Search songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      />

      {Object.keys(groupedSongs).map((category) => (
        <div key={category}>
          <h2>{category}</h2>

          {groupedSongs[category].map((song) => (
            <div
              key={song.id}
              style={{
                background: "#222",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "10px",
              }}
            >
              <img
                src={song.cover}
                alt={song.title}
                width="120"
                style={{ borderRadius: "10px" }}
              />

              <h3>{song.title}</h3>
              <p>{song.artist}</p>

              <button onClick={() => playSong(song)}>Play</button>

              <button
                onClick={() => addToQueue(song)}
                style={{ marginLeft: "10px" }}
              >
                Queue
              </button>
            </div>
          ))}
        </div>
      ))}

      <hr />

      <h2>Now Playing</h2>

      <img
        src={currentSong.cover}
        alt={currentSong.title}
        width="200"
        style={{ borderRadius: "20px" }}
      />

      <h3>{currentSong.title}</h3>
      <p>{currentSong.artist}</p>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={nextSong}
        onTimeUpdate={() => {
          const current = audioRef.current.currentTime;
          const duration = audioRef.current.duration || 1;
          setProgress((current / duration) * 100);
        }}
      />

      <div
        style={{
          width: "100%",
          background: "#333",
          height: "10px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: "lime",
            height: "10px",
            borderRadius: "10px",
          }}
        />
      </div>

      <button onClick={prevSong}>⏮ Prev</button>

      <button
        onClick={togglePlay}
        style={{ marginLeft: "10px", marginRight: "10px" }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button onClick={nextSong}>Next ⏭</button>

      <hr />

      <h2>Queue</h2>

      {queue.length === 0 ? (
        <p>No songs in queue</p>
      ) : (
        queue.map((song, index) => (
          <div key={index}>
            {song.title}
          </div>
        ))
      )}

      <hr />

      <h2>Most Played</h2>

      {mostPlayed.map((song) => (
        <div key={song.id}>
          {song.title} - {playCounts[song.id] || 0} plays
        </div>
      ))}
    </div>
  );
}