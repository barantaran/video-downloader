import React, { useEffect, useState } from 'react';

function DownloadButton() {
  const [isVideoPage, setIsVideoPage] = useState(false);

  const checkUrl = () => {
    const videoPlatforms = ['youtube.com', 'tiktok.com', 'ok.ru', 'rutube.ru'];
    setIsVideoPage(videoPlatforms.some(platform => window.location.href.includes(platform)));
  };

  useEffect(() => {
    checkUrl(); // Проверить URL при монтировании

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

  if (!isVideoPage) return null; // Отображать кнопку только на страницах с видео

  return (
      <button
          id="downloadButton"
          className="button-30"
          onClick={handleClick}
      >
        <img
            src="https://raw.githubusercontent.com/barantaran/youtube-downloader/fix-button/src/img.png"
            alt="Download"
            style={{ width: '95%', height: 'auto' }}
        />
      </button>
  );
}

function App() {
  return <DownloadButton />;
}

export default App;
