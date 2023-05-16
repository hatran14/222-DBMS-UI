import React, { useEffect, useState } from 'react'
import { fetchBenchmarkCassandra, fetchBenchmarkMySQL, fetchDataCassandra, fetchDataMySQL } from '../../utils/api'
import RenderBenchmark from './benchmark'

const Benchmark = () => {
    return (
        <div className='grid grid-cols-2 divide-x'>
            <RenderBenchmark title={'MySQL'} fetchData={fetchDataMySQL} fetchBenchmark={fetchBenchmarkMySQL}/>
            <RenderBenchmark title={'Cassandra'} fetchData={fetchDataCassandra} fetchBenchmark={fetchBenchmarkCassandra}/>
        </div>
    )
}

export default Benchmark