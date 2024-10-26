exports.handler = async (event) => {
    const referrer = event.queryStringParameters.referrer; // Get referrer from query params
    const allowedDomain = 'https://creatorwala.in/';
    const canAccess = referrer && referrer.includes(allowedDomain);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            canAccess,
        }),
    };
};
