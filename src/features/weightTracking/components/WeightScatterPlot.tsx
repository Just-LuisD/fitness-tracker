import { useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";

interface Props {
  data: any[];
  displayUnit: "lb" | "kg";
}

export function WeightScatterPlot({ data, displayUnit }: Props) {
  const font = useFont(require("@/src/assets/fonts/Inter_18pt-Medium.ttf"), 12);

  if (!font || data.length === 0) {
    return null;
  } else {
    return (
      <View style={{ height: 350 }}>
        <CartesianChart
          data={data}
          xKey="day"
          yKeys={["y"]}
          domainPadding={{ left: 12, right: 12, top: 12, bottom: 12 }}
          xAxis={{}}
          yAxis={[
            {
              font: font,
              formatYLabel: (v) => `${v} ${displayUnit}`,
              labelColor: "#555",
            },
          ]}
        >
          {({ points }) => (
            <>
              <Line points={points.y} color="#000" strokeWidth={2} />
              <Scatter points={points.y} color="black" radius={5} />
            </>
          )}
        </CartesianChart>
      </View>
    );
  }
}
