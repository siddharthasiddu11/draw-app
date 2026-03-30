import { BACKEND_URL } from "../../config";
import axios from "axios";

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    console.log(response.data);
    return response.data.id;
}

export default async function ChatRoom({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = params.slug;
    const roomId = await getRoomId(slug);
    return <div></div>
}