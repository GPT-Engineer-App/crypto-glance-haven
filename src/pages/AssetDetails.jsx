import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const fetchAssetDetails = async (id) => {
  const [assetResponse, historyResponse] = await Promise.all([
    axios.get(`https://api.coincap.io/v2/assets/${id}`),
    axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=d1`)
  ]);
  return {
    asset: assetResponse.data.data,
    history: historyResponse.data.data
  };
};

const AssetDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['assetDetails', id],
    queryFn: () => fetchAssetDetails(id),
  });

  if (isLoading) return <div className="text-center mt-8 terminal-glow">Loading asset details...</div>;
  if (isError) return <div className="text-center mt-8 terminal-glow text-destructive">Error: Unable to fetch asset details</div>;

  const { asset, history } = data;

  const chartData = history.map(dataPoint => ({
    date: new Date(dataPoint.time),
    price: parseFloat(dataPoint.priceUsd)
  }));

  return (
    <div className="bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4 terminal-glow">{asset.name} ({asset.symbol})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <p><strong>Rank:</strong> {asset.rank}</p>
          <p><strong>Price:</strong> ${parseFloat(asset.priceUsd).toFixed(2)}</p>
          <p><strong>Market Cap:</strong> ${parseFloat(asset.marketCapUsd).toLocaleString()}</p>
          <p><strong>24h Change:</strong> <span className={parseFloat(asset.changePercent24Hr) >= 0 ? 'text-primary' : 'text-destructive'}>{parseFloat(asset.changePercent24Hr).toFixed(2)}%</span></p>
          <p><strong>Volume (24h):</strong> ${parseFloat(asset.volumeUsd24Hr).toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-sm">{asset.description || "No description available."}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Price History (Last 30 Days)</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, 'MMM dd')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(date, 'MMM dd, yyyy')}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDetails;
