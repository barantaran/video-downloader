import React, { useEffect, useState } from 'react';

function DownloadButton({ position }) {
  const [isVideoPage, setIsVideoPage] = useState(false);

  const checkUrl = () => {
    const videoPlatforms = ['youtube.com', 'vk.com', 'instagram.com', 'twitch.tv', 'reddit.com'];
    setIsVideoPage(videoPlatforms.some(platform => window.location.href.includes(platform)));
  };

  useEffect(() => {
    checkUrl(); // Check URL

    // Следим за изменениями URL в SPA
    const observer = new MutationObserver(checkUrl);
    observer.observe(document.body, { childList: true, subtree: true });

    // Очистка
    return () => observer.disconnect();
  }, []);

  const handleClick = async () => {
    const videoUrl = window.location.href;

    try {
      const response = await fetch('https://co.wuk.sh/api/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          url: encodeURI(videoUrl),
          vQuality: 'max',
          filenamePattern: 'basic',
          isAudioOnly: false,
          disableMetadata: true,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.url) {
          window.open(responseData.url, '_blank');
        } else {
          throw new Error('URL не найден');
        }
      } else {
        throw new Error('Сетевой ответ не был успешным.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Стилизация кнопки в зависимости от положения
  const buttonStyle = {
    position: 'fixed',
    width: '36px',
    height: '36px',
    padding: '0',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '18px',
    zIndex: '10000',
    ...position, // добавляем позицию кнопки из пропсов
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset',
    backgroundColor: '#FCFCFD',
    transition: 'transform 0.3s ease',
  };

  const imgStyle = {
    width: '95%',
    height: 'auto',
  };

  return (
    <button
      id="downloadButton"
      className="button-30"
      onClick={handleClick}
      style={buttonStyle}
    >
      <img
        src="https://raw.githubusercontent.com/barantaran/youtube-downloader/fix-button/src/img.png"
        alt="Download"
        style={imgStyle}
      />
    </button>
  );
}

function App() {
  // Установите разные позиции кнопки на разных страницах
  let position = { top: '100px', left: '100px' }; // позиция по умолчанию

  if (window.location.href.includes('youtube.com')) {
    position = { top: '17px', left: '180px' };
  } else if (window.location.href.includes('vk.com')) {
    position = { top: '650px', left: '440px' };
  } else if (window.location.href.includes('instagram.com')) {
    position = { top: '30px', left: '160px' };
  } else if (window.location.href.includes('twitch.tv')) {
    position = { top: '7px', left: '240px' };
  } else if (window.location.href.includes('reddit.com')) {
    position = { top: '10px', left: '180px' };
  }
  
  return <DownloadButton position={position} />;
}

export default App;
