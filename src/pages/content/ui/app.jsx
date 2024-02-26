import React, { useEffect, useState } from 'react';

function DownloadButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [buttonClass, setButtonClass] = useState('');

    const checkPageForVideo = () => {
        const url = window.location.href;
        let site = '';

        if (url.includes('youtube.com/watch') || url.includes('youtube.com/shorts')) {
            site = 'youtube';
            setButtonClass('button-youtube');
        } else if (url.includes('tiktok.com/@')) {
            site = 'tiktok';
            setButtonClass('button-tiktok');
        } else if (url.includes('ok.ru/video/')) {
            site = 'ok';
            setButtonClass('button-ok');

        } else if (url.includes('rutube.ru/video/')) {
            site = 'rutube';
            setButtonClass('button-rutube');

        }

        // else if (url.includes('vk.com/video')) { // Условие для ВКонтакте
        //     site = 'vk';
        //     setButtonClass('button-rutube'); // Класс для стилизации кнопки ВКонтакте
        // }

        // else if (url.includes('twitch.tv/')) {
        //     site = 'twitch';
        //     setButtonClass('button-rutube');
        // }

        // else if (url.includes('instagram.com/')) {
        //     site = 'instagram';
        //     setButtonClass('button-rutube');
        // }

        const isVideoPage = site !== '';
        const hasVideoElements = document.querySelectorAll('video').length > 0;
        setIsVisible(isVideoPage && hasVideoElements);
    };

    useEffect(() => {
        checkPageForVideo();

        const observer = new MutationObserver(checkPageForVideo);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('popstate', checkPageForVideo);
        window.addEventListener('pushState', checkPageForVideo);
        window.addEventListener('replaceState', checkPageForVideo);

        return () => {
            observer.disconnect();
            window.removeEventListener('popstate', checkPageForVideo);
            window.removeEventListener('pushState', checkPageForVideo);
            window.removeEventListener('replaceState', checkPageForVideo);
        };
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

    if (!isVisible) return null;

    return (
        <button
            id="downloadButton"
            className={`button-30 ${buttonClass}`}
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