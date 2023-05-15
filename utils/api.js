import axios from "axios";

// this is just for testing
export async function getUser() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    if (res.status === 200) {
        return res.data
    }
    else {
        console.log('Error')
    }
}

// our api call, use this
export async function fetchDataMySQL(query) {
    const res = await axios.get(`http://34.124.172.195:3001/mysql/query/${query}`)
    if (res.status === 200) {
        return res.data
    }
    else {
        return "Error"
    }
}

export async function fetchDataCassandra(query) {
    const res = await axios.get(`http://34.124.172.195:3001/mycassandra/query/${query}`)
    if (res.status === 200) {
        return res.data.rows
    }
    else {
        return "Error"
    }
}

export async function fetchBenchmarkMySQL(query, time) {
    const res = await axios.get(`http://34.124.172.195:3001/mysql/benchmark/${time}/${query}`)
    if (res.status === 200) {
        return res.data
    }
    else {
        return "Error"
    }
}

export async function fetchBenchmarkCassandra(query, time) {
    const res = await axios.get(`http://34.124.172.195:3001/mycassandra/benchmark/${time}/${query}`)
    if (res.status === 200) {
        return res.data
    }
    else {
        return "Error"
    }
}