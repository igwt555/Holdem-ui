import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import * as echarts from 'echarts'
import Moralis from "moralis"
import { useNFTSaleInfo } from "../../hooks/useNFTSaleInfo"
import { Spin } from "antd"
import { hehEchartsTheme } from './echarts_theme'

export default function PriceChartDebug() {

  const { targetEms } = useNFTSaleInfo();

  const [ chartData, setChartData ] = useState(null);
  const [ lastBlock, setLastBlock ] = useState(0);
  const [ data, setData ] = useState([]);
  const [ ems, setEms ] = useState([]);
  const [ targetEmsData, setTargetEmsData ] = useState([]);
  const [ labels, setLabels ] = useState([]);

  const processChartData = async () => {
    const params = { lastBlock: lastBlock };
    const cd = await Moralis.Cloud.run("getPricePerBlockData", params);
    const tmpData = data
    const tmpEms = ems
    const tmpTargetEms = targetEmsData
    const tmpLabels = labels

    for(let i = 0; i < cd.length; i += 1) {
      tmpLabels.push(Number(cd[i].blockTimestampMillis))
      tmpData.push(cd[i].price)
      tmpEms.push(Number(cd[i].ems))
      tmpTargetEms.push(Number(targetEms.toString()))
      if(parseInt(cd[i].block, 10) > lastBlock) {
        setLastBlock(cd[i].block)
      }
    }
    setLabels(tmpLabels)
    setData(tmpData)
    setEms(tmpEms)
    setTargetEmsData(tmpTargetEms)
    const d = {
      labels,
      price: data,
      ems,
      targetEms: targetEmsData,
    }
    setChartData(d)
  }

  useEffect(() => {

    async function _procData() {
      await processChartData()
    }
    if (!chartData && targetEms) {
      _procData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, targetEms]);

  useEffect(() => {
    async function _procData() {
      await processChartData()
    }

    const timeout = setTimeout(() => {
      if(chartData && targetEms) {
        _procData()
      }
    }, 15000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, targetEms])

  if(!chartData) {
    return <Spin />
  }

  return (
    <>
      <Graph stats={chartData ? chartData : {labels: [], price: [], ems: [], targetEms: []}} />
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
          legend: {
            show: true,
          },
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
              name: 'ETH Price'
            },
            {
              type: 'value',
              position: 'right',
              name: 'EMS',
              axisLabel: {
                formatter: function (value, index) {
                  return (value / 1000000000000000000) + 'e18';
                }
              }
            }
          ],
          series: [
            {
              yAxisIndex: 0,
              data: stats.price,
              type: 'line',
              smooth: true,
              name: 'Price',
            },
            {
              yAxisIndex: 1,
              data: stats.ems,
              type: 'line',
              smooth: true,
              name: 'EMS',
            },
            {
              yAxisIndex: 1,
              data: stats.targetEms,
              type: 'line',
              smooth: true,
              name: 'Target EMS',
            }
          ]
        })
    }
  }, [chartInstance, stats])

  return (
    <div ref={chartRef} style={{ minWidth: '80vw', minHeight: '80vh' }} />
  )
}
