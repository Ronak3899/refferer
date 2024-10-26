exports.handler = async (event) => {
    const referrer = event.headers.referer;
    const allowedDomain = 'https://creatorwala.in/';
    const canAccess = referrer && referrer.includes(allowedDomain);

    const headers = {
        'Access-Control-Allow-Origin': '*', // Change to your domain for production
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (canAccess) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ canAccess }),
        };
    } else {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                canAccess,
                message: referrer ? "Access denied: Your referrer is not allowed." : "Access denied: No referrer detected.",
            }),
        };
    }
};
