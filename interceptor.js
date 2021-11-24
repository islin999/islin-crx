window.addEventListener('message', (e) => {
    const data = e.data;
    if (data.type === 'getCov') {
        const cov = window.__coverage__ || {}
        e.source.postMessage({type:'giveCov',payload: cov},"*");
    }
});
