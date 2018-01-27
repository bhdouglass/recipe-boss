export default {
    imageUrl(url) {
        if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
            url = encodeURI(url).replace('http://', '').replace('https://', '');
            url = `https://images.weserv.nl/?url=${url}`;
        }

        return url;
    },
};
