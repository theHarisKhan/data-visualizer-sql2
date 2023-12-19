import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import Chart from "react-google-charts";
import { toast } from "react-toastify";

export default function Home() {
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    host: "",
    user: "",
    password: "",
    database: "",
    sqlquery: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios
        .post("/api/data", formData)
        .then((res) => {
          setData(res.data);
          toast.success("Data fetched successfully");
        })
        .catch((err) => toast.error(err?.response?.data?.error?.message));
    } catch (e) {
      console.log(e);
    }
  };

  /*  This function essentially transforms the provided data format 
      into a structure that is suitable for charting, excluding 
      the "timestamp" label and converting numerical values to numbers.
  */

  const generateChartData = () => {
    if (!data || data.length === 0) return [];

    // Assuming the first item in data represents the structure
    const structure = data[0];

    if (!structure || !structure[0]) return [];

    const labels = Object.keys(structure[0]);

    const chartData = structure.map((item) => {
      if (!item) return [];
      return labels.map((label) => parseFloat(item[label]));
    });

    const chartDataWithLabels = [labels, ...chartData];

    return chartDataWithLabels;
  };

  return (
    <>
      <Head>
        <title>Dynamic data visualisation web application</title>
        <meta
          name="description"
          content="Dynamic data visualisation web application"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>MySQL Data</legend>
            <div className="grid col-2">
              <input
                type="text"
                name="host"
                placeholder="MySQL Host"
                value={formData?.host}
                onChange={(e) =>
                  setFormData({ ...formData, host: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="database"
                placeholder="MySQL Database"
                value={formData?.database}
                onChange={(e) =>
                  setFormData({ ...formData, database: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="username"
                placeholder="MySQL Username"
                value={formData?.user}
                onChange={(e) =>
                  setFormData({ ...formData, user: e.target.value })
                }
                required
              />
              <input
                type="password"
                name="password"
                placeholder="MySQL Password"
                value={formData?.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>MySQL Query</legend>
            <div className="flex-col">
              <textarea
                name="query"
                cols="30"
                rows="10"
                value={formData?.sqlquery}
                onChange={(e) =>
                  setFormData({ ...formData, sqlquery: e.target.value })
                }
                required
              />

              <button type="submit">Search</button>
            </div>
          </fieldset>
        </form>

        <div className="chart-box">
          <div className="chart-labels">
            <h1>Table Labels:</h1>
            <ul>
              {generateChartData()[0]?.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          {data?.length > 0 ? (
            <Chart
              width={"500px"}
              height={"600px"}
              chartType="BarChart"
              loader={<div>Loading Chart...</div>}
              data={generateChartData()}
              options={{
                title: "Your Data Visualization",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "X-Axis Label",
                  minValue: 0,
                },
                vAxis: {
                  title: "Y-Axis Label",
                },
              }}
            />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </main>
    </>
  );
}
