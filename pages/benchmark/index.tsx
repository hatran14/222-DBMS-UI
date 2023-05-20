import React, { useEffect, useState } from 'react'
import { fetchBenchmarkCassandra, fetchBenchmarkMySQL, fetchDataCassandra, fetchDataMySQL } from '../../utils/api'
import RenderBenchmark from './benchmark'

const Benchmark = () => {
    // const queryIndex = `CREATE INDEX IF NOT EXISTS idx_price_product ON product (price)`

    // useEffect(() => {
    //     fetchDataMySQL(queryIndex).then(res => {
    //         console.log('OK')
    //     })
    // })

    const [queryNotOptimize, setQueryNotOptimize] = useState<any[]>([
        {
            title: `Select product with price range`,
            query: `SELECT id, name, color, price FROM product
            IGNORE INDEX (idx_price_product, PRIMARY, idx_product_id_price, idx_product_id)
            WHERE price BETWEEN 50 AND 100`,
            time: 1
        },
        {
            title: `Select user with total subTotal`,
            query: `SELECT u.id, u.name, SUM(o.subTotal) AS total_subTotal
            FROM orders o
            IGNORE INDEX (idx_userId_orders, PRIMARY)
            JOIN user u IGNORE INDEX (PRIMARY)
            ON o.userId = u.id
            GROUP BY u.id, u.name;`,
            time: 1
        },
        {
            title: `Select category with total price`,
            query: `SELECT c.title, SUM(p.price) AS total_price
            FROM category c IGNORE INDEX (idx_category_id, PRIMARY)
            JOIN (product_category pc IGNORE INDEX (idx_product_category_categoryID, idx_product_category_productID, PRIMARY))  ON c.id = pc.categoryID
            JOIN (product p IGNORE INDEX (idx_price_product, PRIMARY, idx_product_id_price, idx_product_id)) ON pc.productID = p.id
            JOIN (orderItem oi IGNORE INDEX (idx_orderItem_productID, PRIMARY)) ON oi.productID = p.id
            GROUP BY c.title;`,
            time: 1
        },
        {
            title: `Select category with total orders`,
            query: `SELECT c.id, c.title, COUNT(o.id) AS total_orders
            FROM category c
            JOIN (product_category pc IGNORE INDEX (idx_product_category_categoryID, idx_product_category_productID, PRIMARY)) ON c.id = pc.categoryID
            JOIN (orderItem oi IGNORE INDEX (idx_orderItem_productID, PRIMARY)) ON oi.productID = pc.productID
            JOIN (orders o IGNORE INDEX (idx_userId_orders, PRIMARY)) ON o.id = oi.orderID
            GROUP BY c.id, c.title
            ORDER BY total_orders DESC;`,
            time: 1
        }
    ])

    const [queryOptimize, setQueryOptimize] = useState<any[]>([
        {
            title: `Select product with price range`,
            query: `SELECT id, name, color, price
            FROM product
            WHERE price
            BETWEEN 50 AND 100
            ORDER BY price ASC`,
            time: 1
        },
        {
            title: `Select user with total subTotal`,
            query: `SELECT u.id, u.name, t.total_subTotal
            FROM user u
            JOIN (
                SELECT o.userId, SUM(o.subTotal) AS total_subTotal
                FROM orders o
                GROUP BY o.userId
                HAVING COUNT(*) > 0
            ) t ON t.userId = u.id;`,
            time: 1
        },
        {
            title: `Select category with total price`,
            query: `SELECT c.title, SUM(p.price) AS total_price
            FROM (
                SELECT pc.categoryID, pc.productID
                FROM product_category pc
                INNER JOIN orderItem oi ON oi.productID = pc.productID
            ) sub
            JOIN category c ON c.id = sub.categoryID
            JOIN product p ON p.id = sub.productID
            GROUP BY c.title;`,
            time: 1
        },
        {
            title: `Select category with total orders`,
            query: `SELECT c.id, c.title, COALESCE(total_orders, 0) AS total_orders
            FROM category c
            LEFT JOIN (
                SELECT pc.categoryID, COUNT(DISTINCT oi.orderID) AS total_orders
                FROM product_category pc
                JOIN orderItem oi ON oi.productID = pc.productID
                GROUP BY pc.categoryID
            ) sub ON sub.categoryID = c.id
            ORDER BY total_orders DESC;`,
            time: 1
        }
    ])

    return (
        <div className='grid grid-cols-2 divide-x'>
            <RenderBenchmark title={'Not using optimization'} query={queryNotOptimize} fetchData={fetchDataMySQL} fetchBenchmark={fetchBenchmarkMySQL}/>
            <RenderBenchmark title={'Using optimization'} query={queryOptimize} fetchData={fetchDataMySQL} fetchBenchmark={fetchBenchmarkMySQL}/>
        </div>
    )
}

export default Benchmark