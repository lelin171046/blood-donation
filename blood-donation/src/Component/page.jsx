import React from 'react';

export default function LiveStream() {
  // if () return <p>No video available</p>;

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={`https://www.youtube.com/embed/Z4187zfClSU?autoplay=1&controls=0&modestbranding=1&rel=0`}
        title="YouTube Live Stream"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        onContextMenu={(e) => e.preventDefault()}
      ></iframe>
    </div>
  );
}
