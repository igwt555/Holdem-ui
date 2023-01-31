import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import * as echarts from 'echarts'
import Moralis from "moralis"
import { Spin } from "antd"
import { hehEchartsTheme } from './echarts_theme'

export default function PriceEChart() {

  const [ chartData, setChartData ] = useState(null);
  const [ lastBlock, setLastBlock ] = useState(0);
  const [ data, setData ] = useState([]);
  const [ labels, setLabels ] = useState([]);

  const processChartData = async () => {
    const params = { lastBlock: lastBlock };
    const cd = await Moralis.Cloud.run("getPricePerBlockData", params);
    const tmpData = data
    const tmpLabels = labels

    for(let i = 0; i < cd.length; i += 1) {
      tmpLabels.push(Number(cd[i].blockTimestampMillis))
      tmpData.push(cd[i].price)
      if(parseInt(cd[i].block, 10) > lastBlock) {
        setLastBlock(cd[i].block)
      }
    }
    setLabels(tmpLabels)
    setData(tmpData)
    const d = {
      labels,
      price: data,
    }
    setChartData(d)
  }

  useEffect(() => {

    async function _procData() {
      await processChartData()
    }
    if (!chartData) {
      _procData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  useEffect(() => {
    async function _procData() {
      await processChartData()
    }

    const timeout = setTimeout(() => {
      if(chartData) {
        _procData()
      }
    }, 15000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData])

  if(!chartData) {
    return <Spin />
  }

  return (
    <>
      <Graph stats={chartData ? chartData : {labels: [], price: []}} />
    </>
  );
}

function Graph({ stats }) {
  const chartRef = useRef()
  const [chartInstance, setChartInstnce] = useState()

  useEffect(() => {
    echarts.registerTheme('heh', hehEchartsTheme)
    const chart = echarts
      .init(chartRef.current, 'heh')
    setChartInstnce(chart)
  }, [])

  useLayoutEffect(() => {
    window.addEventListener('resize', () => { chartInstance?.resize() })
  }, [chartInstance])

  useEffect(() => {
    if (chartInstance && stats) {
      chartInstance
        .setOption({
          xAxis: {
            type: 'category',
            data: stats.labels.map(item => new Date(item).toLocaleString()),
            name: 'Block Time',
            nameLocation: 'center',
            nameGap: 24,
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
              name: 'ETH Price per NFT'
            }
          ],
          series: [
            {
              yAxisIndex: 0,
              data: stats.price,
              type: 'line',
              smooth: true,
              name: 'Price',
            }
          ]
        })
    }
  }, [chartInstance, stats])

  return (
    <div ref={chartRef} style={{ minWidth: '80vw', minHeight: '80vh' }} />
  )
}
