import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

const fetchCryptos = async () => {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  return response.data.data;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: cryptos, isLoading, isError } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
  });

  const filteredCryptos = cryptos?.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching data</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Tracker</h1>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Market Cap (USD)</TableHead>
            <TableHead>24h Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCryptos?.map((crypto) => (
            <TableRow key={crypto.id}>
              <TableCell>{crypto.rank}</TableCell>
              <TableCell>{crypto.name}</TableCell>
              <TableCell>{crypto.symbol}</TableCell>
              <TableCell>${parseFloat(crypto.priceUsd).toFixed(2)}</TableCell>
              <TableCell>${parseFloat(crypto.marketCapUsd).toLocaleString()}</TableCell>
              <TableCell className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Index;
