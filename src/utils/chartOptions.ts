export const ChartOptions = {
  chart: {
    foreColor: "#a19f9f",
    animations: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },

  stroke: {
    curve: "smooth",
  },

  colors: ["#FFFFFF", "#007D43", "#F83536"],

  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
  },

  dataLabels: {
    enabled: false,
  },

  legend: {
    position: "top",
    horizontalAlign: "left",
  },
};

export const FundReturnChartOptions = {
  ...ChartOptions,

  yaxis: {
    labels: {
      formatter: function(value: string) {
        return "$" + value;
      },
    },
  },
};
