import fetch from "node-fetch";

const getCurrentDate = (currentDate: Date) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const getTodayEntires = async (date: string, apiKey: string, workspaceId: string, userId: string) => {

    const url = `https://global.api.clockify.me/workspaces/${workspaceId}/timeEntries/users/${userId}/in-range?start=${date}T00:00:00.000Z&end=${date}T23:59:59.999Z`

    return await (await fetch(url, {
        "headers": {
            "accept": "application/json",
            "accept-language": "en",
            "app-name": "WEB",
            "app-version": "1.0.0",
            "content-type": "application/json",
            "x-api-key": apiKey,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })).json() as []


}

const addTodayEntry = async (date: string, apiKey: string, workspaceId: string, userId: string) => {

    const body = {
        start: `${date}T07:00:00.000Z`,
        end: `${date}T15:00:00.000Z`,
        description: "Hibob",
        projectId: "602eb7ffa9972f2734c16620",
        taskId: "64c322cf89afca11f09ba8de",
        tagIds: [],
        customFields: []
    }

    const request = fetch(`https://global.api.clockify.me/v1/workspaces/${workspaceId}/user/${userId}/time-entries`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "en",
            "app-name": "WEB",
            "app-version": "1.0.0",
            "content-type": "application/json",
            "x-api-key": apiKey,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify(body),
        "method": "POST"
    });

    return await (await request).json()
}

const isWeekend = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 6 || dayOfWeek === 0;
}

export const index = async () => {
    const apiKey = process.env.CLOCKIFY_API_KEY as string;

    if (!apiKey) {
        console.log('-------! Please provide Clockify API key as CLOCKIFY_API_KEY env variable !-------');
        return;
    }

    const workspaceId = process.env.WORKSPACE_ID as string;

    if (!workspaceId) {
        console.log('-------! Please provide Clockify workspace ID as WORKSPACE_ID env variable !-------');
        return;
    }

    const userId = process.env.USER_ID as string;
    if (!userId) {
        console.log('-------! Please provide Clockify user ID as USER_ID env variable !-------');
        return;
    }

    const entryDescription = process.env.ENTRY_DESCRIPTION as string;
    if (!entryDescription) {
        console.log('-------! Please provide Clockify entry description as ENTRY_DESCRIPTION env variable !-------');
        return;
    }

    const currentDate = new Date();

    if (isWeekend(currentDate)) {
        console.log(`-------! It's weekend. No need to add entry. Have fun! !-------`);
        return;
    }

    const date = getCurrentDate(currentDate);
    const entries = await getTodayEntires(date, apiKey, workspaceId, userId);

    if (!Array.isArray(entries)) {
        console.log('-------! Something went wrong while getting entries. Please check your API key. !-------');
        return;
    }

    if (entries.length === 0) {
        console.log(`-------! No entries for ${date}. Add entry for today - ${date} !-------` );
        await addTodayEntry(date, apiKey, workspaceId, userId);
        console.log(`-------! Entry added for ${date} !-------`);
    } else {
        console.log(`-------! Entry already added for ${date} !-------`);
    }
}

index();
