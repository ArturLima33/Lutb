"use client";

export default function Midia({ url, style, onClick, isMain = false }) {
  if (!url) return null;

  const ehVideo = (link) =>
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(link);

  const ehYoutube = (link) =>
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(link);

  const getYoutubeId = (link) => {
    const match = link.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/
    );
    return match?.[1] || null;
  };

  const getThumbYoutube = (link) => {
    const id = getYoutubeId(link);
    return id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : null;
  };

  if (!isMain) {
    if (ehYoutube(url)) {
      const thumb = getThumbYoutube(url);

      return (
        <div
          onClick={onClick}
          style={{
            ...style,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: "10px",
            background: "#000",
          }}
        >
          {thumb && (
            <img
              src={thumb}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "12px",
              }}
            >
              ▶
            </div>
          </div>
        </div>
      );
    }

    if (ehVideo(url)) {
      return (
        <div
          onClick={onClick}
          style={{
            ...style,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: "10px",
            background: "#111",
          }}
        >
          <video
            src={url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
            preload="metadata"
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "12px",
              }}
            >
              ▶
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        style={{
          ...style,
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: "10px",
        }}
      >
        <img
          src={url}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  if (ehYoutube(url)) {
    const id = getYoutubeId(url);

    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=0&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  if (ehVideo(url)) {
    return (
      <video
        src={url}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
        }}
        controls
        playsInline
      />
    );
  }

  return (
    <img
      src={url}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}