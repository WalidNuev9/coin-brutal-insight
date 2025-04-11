
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AssetHistory } from '../services/coinCapService';

interface AssetPriceChartProps {
  history: AssetHistory[];
  color?: string;
}

const AssetPriceChart: React.FC<AssetPriceChartProps> = ({ 
  history, 
  color = '#000000' 
}) => {
  const chartData = history.map(item => ({
    date: new Date(item.time).toLocaleDateString(),
    price: parseFloat(item.priceUsd)
  }));
  
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    if (value >= 1) {
      return `$${value.toFixed(0)}`;
    }
    return `$${value.toFixed(4)}`;
  };
  
  const formatToolTip = (value: number) => {
    return `$${value.toFixed(value < 1 ? 6 : 2)}`;
  };
  
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  
  // Add some padding to the min and max
  const yAxisDomain = [
    minPrice - (minPrice * 0.02), // 2% below min
    maxPrice + (maxPrice * 0.02)  // 2% above max
  ];

  return (
    <div className="brutal-card p-4 w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="date"
            tick={{ fontWeight: 'bold', fill: '#000' }}
            tickLine={{ stroke: '#000' }}
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            domain={yAxisDomain} 
            tick={{ fontWeight: 'bold', fill: '#000' }}
            tickLine={{ stroke: '#000' }}
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tickMargin={10}
            tickFormatter={formatYAxis}
          />
          <Tooltip 
            formatter={(value: number) => [formatToolTip(value), 'Price']}
            contentStyle={{ 
              borderRadius: 0, 
              border: '2px solid #000', 
              backgroundColor: '#fff',
              fontWeight: 'bold'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetPriceChart;
