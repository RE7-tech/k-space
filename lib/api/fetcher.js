import client from "./client"

const fetcher = (...args) => client(...args).then(res => res.data);

export default fetcher;