import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

//eslint-disable-next-line
function PageView({ data }: { data: any }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPageView" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#f0f0f0"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="date" dy={10} />
          <YAxis axisLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pageView"
            stroke="#7c5bcf"
            fillOpacity={1}
            fill="url(#colorPageView)"
            strokeWidth={2} // Increase the stroke width
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PageView;
