import { BACKEND_URL } from "../../config";
import axios from "axios";

async function getRoom(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    console.log(response.data);
    return response.data.room.id;
}

export default async function({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = params.slug;
    return <div></div>
}