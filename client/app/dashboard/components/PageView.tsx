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
          <CartesianGrid
            vertical={false}
            stroke="#f0f0f0"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="date" />
          <YAxis axisLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pageView"
            stroke="#7c5bcf"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PageView;
