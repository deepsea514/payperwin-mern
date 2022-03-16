const onScrollStep = (intervalId) => {
    if (window.pageYOffset === 0) {
        clearInterval(intervalId);
    }
    window.scroll(0, window.pageYOffset - 30);
}

export const scrollToTop = () => {
    let intervalId = setInterval(() => onScrollStep(intervalId), 16.66);
}