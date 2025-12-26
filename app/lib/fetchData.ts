
export default async function fetchData(path:string, type:string) {
    try {
        const res = await fetch(path);
        if (!res.ok) return null;
        if (type==="json") return res.json();
        else if (type==="text") return res.text();
        else return null;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}