import React, { useEffect, useState } from 'react'
import { fetchBenchmarkCassandra, fetchBenchmarkMySQL, fetchDataCassandra } from '../../utils/api'

const RenderModal = (props: any) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            {/* Main modal */}
            <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="overflow-scroll grid justify-items-center z-50 w-full p-4 max-h-full">
                <div className="relative w-full max-w-full max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Result
                            </h3>
                            <button onClick={() => {props.setShowModal(false)}} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        <div className="p-6 space-y-6 overflow-y-scroll">
                            <RenderResult data={props.data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const RenderResult = (data: any) => {
    const myData = data.data
    const [key, getKey] = useState(Object.keys(myData[0]))
    console.log(myData)
    return (
        <div>
            <table className='table-auto w-full text-sm border rounded-lg text-left text-gray-500 dark:text-gray-400'>
                <thead className="text-xs border text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {
                            key.map((item: any, index: number) => (
                                <th key={index} scope="col" className="px-6 py-3">{item}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        myData.map((item: any, index: number) => (
                            <tr key={index}>
                                {
                                    key.map((itemKey: any, indexKey: number) => (
                                        <td key={indexKey} className="px-6 py-4">{item[itemKey]}</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

const RenderBenchmark = (props: any) => {
    const [query, setQuery] = useState([
        {
            query: 'SELECT * FROM product',
            time: '10'
        },
        {
            query: 'SELECT * FROM product WHERE id = 1',
            time: '20'
        },
        {
            query: 'SELECT * FROM product WHERE id = 2',
            time: '30'
        },
        {
            query: 'SELECT * FROM product WHERE id = 3',
            time: '40'
        }
    ])
    const [input, setInput] = useState({
        query: '',
        time: ''
    })
    const [result, setResult] = useState('')
    const [data, setData] = useState([
        {
            id: '',
            name: '',
        }
    ])
    const [show, setShow] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [newQuery, setNewQuery] = useState({
        query: '',
        time: ''
    })

    const handleClicked = (e: any, index: number) => {
        e.preventDefault()
        // console.log(e.target.value)
        // const value = e.target.value.split(',')
        const value = query[index]
        setInput({ query: value.query, time: value.time })
    }

    const handleOnChange = (e: any) => {
        e.preventDefault()
        // console.log(e.target.value)
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleRun = (e: any) => {
        e.preventDefault()
        props.fetchBenchmark(input.query, input.time).then((res: any) => {
            // console.log(res)
            setResult(res.elapsed)
        })
        props.fetchData(input.query).then((res: any) => {
            // console.log(res)
            setData(res)
        })
    }

    const handleOnChangeNewQuery = (e: any) => {
        e.preventDefault()
        setNewQuery({ ...newQuery, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log(newQuery)
        setQuery([...query, newQuery])
        console.log(query)
        // setNewQuery({ query: '', time: '' })
    }

    const handleDelete = (e: any) => {
        e.preventDefault()
        const value = e.target.value.split(',')
        const newQuery = query.filter((item) => item.query !== value[0] && item.time !== value[1])
        setQuery(newQuery)
    }

    return (
        <div>
            <div className='col-span-1 flex flex-col gap-4 px-6 py-3'>
                <p>{props.title}</p>
                <div className='grid grid-cols-3 gap-3'>
                    <div className='col-span-2 flex flex-col gap-1'>
                        <label>Query</label>
                        <input name='query' type='text' placeholder='Enter query here...' className='border border-gray-300 rounded-lg px-2 py-2 text-sm' value={input.query} onChange={handleOnChange} />
                    </div>
                    <div className='col-span-1 flex flex-col gap-1'>
                        <label>Time</label>
                        <input name='time' type='text' placeholder='Enter time here...' className='border border-gray-300  rounded-lg px-2 py-2 text-sm' value={input.time} onChange={handleOnChange} />
                    </div>
                    <button className='mybtn' onClick={handleRun}>Run</button>
                </div>
                <div className='flex flex-col gap-1'>
                    <p>Our testcase</p>
                    <ul className='flex flex-row flex-wrap' >
                        {
                            query.map((item, index) => (
                                <li key={index} className='w-1/4 mb-3'>
                                    <button type='button' className='mybtn' onClick={(e) => {handleClicked(e, index)}}>
                                        Testcase {index + 1}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className='flex flex-col gap-3 border border-blue-200 px-3 py-3'>
                    <p>Create new testcase</p>
                    <button className='mybtn bg-white border border-blue-600 w-1/3' onClick={() => { setShow(!show) }}>Create new testcase</button>
                    {
                        show &&
                        <div className='grid grid-cols-3 gap-3'>
                            <div className='col-span-2 flex flex-col gap-1'>
                                <label>Query</label>
                                <input name='query' placeholder='Enter query here...' className='border rounded-lg px-2 py-2 text-sm' value={newQuery.query} onChange={handleOnChangeNewQuery} />
                            </div>
                            <div className='col-span-1 flex flex-col gap-1'>
                                <label>Time</label>
                                <input name='time' type='text' placeholder='Enter time here...' className='border rounded-lg px-2 py-2 text-sm' value={newQuery.time} onChange={handleOnChangeNewQuery} />
                            </div>
                            <button className='mybtn' onClick={handleSubmit}>Submit</button>
                        </div>
                    }
                </div>
            </div>
            <div className='flex flex-col col-span-2 gap-3 px-6 py-3'>
                <p>Result</p>
                <p>Time elapsed: {result}</p>
                <button className='mybtn' onClick={() => { setShowModal(true) }}>Details</button>
                {
                    showModal &&
                    <RenderModal data={data} setShowModal={setShowModal}/>
                }
            </div>
        </div>
    )
}

export default RenderBenchmark