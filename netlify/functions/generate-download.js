exports.handler = async (event) => {
    const { url } = JSON.parse(event.body);

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'URL is required.' })
        };
    }

    let userId;
    let canDownload = false;

    try {
        // Loop to keep generating userIds until the user can download
        while (!canDownload) {
            userId = Math.floor(Math.random() * 7453) + 1;

            // Check if the user can download (cache-busting using current timestamp)
            const checkResponse = await fetch(`https://tcb-premium-access.space/wp-json/custom/v1/check-download?user_id=${userId}&nocache=${new Date().getTime()}`);
            const checkData = await checkResponse.json();

            if (checkData.can_download) {
                canDownload = true;
            }
        }

        // Retry logic for generating download link
        const maxAttempts = 6;
        let attempts = 0;
        let result;
        let downloadId = uuidv4(); // Generate a unique download ID

        while (attempts < maxAttempts) {
            const response = await fetch('https://d2d5-117-222-210-138.ngrok-free.app/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, downloadId, userId })
            });

            result = await response.json();

            if (result.success) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        link: result.link
                    })
                };
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
        }

        // If maxAttempts exceeded
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Failed to generate the download link after multiple attempts.'
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: `Error: ${error.message}`
            })
        };
    }
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
