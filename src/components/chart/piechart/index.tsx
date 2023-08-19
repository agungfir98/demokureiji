import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LegendItem,
} from 'chart.js'
import React from 'react'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  data: number[]
  labels: unknown[]
  className?: string
}

const PieChart: React.FC<Props> = ({ data, labels, ...props }) => {
  const datas: ChartData<'pie', number[], unknown> = {
    labels,
    datasets: [
      {
        label: '# of Votes',
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const option: ChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return <Pie className={props.className} data={datas} options={option} />
}
export default PieChart
